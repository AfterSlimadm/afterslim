import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import { postBuyerLead, postAbandonLead } from "@/lib/listflex";
import { submitOrder } from "@/lib/cartrover";
import type Stripe from "stripe";

/**
 * POST /api/checkout/webhook
 * Stripe webhook handler.
 * - checkout.session.completed  -> create order + income transaction + Listflex buyer
 * - checkout.session.expired    -> Listflex abandon lead
 */
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutExpired(session);
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractShippingAddress(session: any) {
  const details = session.shipping_details;
  if (!details?.address) return null;
  return {
    line1: details.address.line1,
    line2: details.address.line2,
    city: details.address.city,
    state: details.address.state,
    postal_code: details.address.postal_code,
    country: details.address.country,
    name: details.name,
  };
}

function splitName(fullName?: string | null): { fname: string; lname: string } {
  if (!fullName) return { fname: "", lname: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    fname: parts[0] ?? "",
    lname: parts.slice(1).join(" ") || "",
  };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminClient();

  // Idempotency: check if order already exists
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (existing) {
    console.log("[webhook] order already exists for session:", session.id);
    return;
  }

  const metadata = session.metadata ?? {};
  const totalCents = session.amount_total ?? 0;
  const qty = Number(metadata.quantity) || 1;
  const email = session.customer_details?.email ?? session.customer_email;

  // Generate order number
  const orderNumber = `AS-${Date.now().toString().slice(-6)}`;

  // Create order and get the UUID back
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      email,
      status: "paid",
      subtotal_cents: totalCents,
      total_cents: totalCents,
      shipping_cents: 0,
      discount_cents: 0,
      tax_cents: 0,
      shipping_address: extractShippingAddress(session),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      sales_channel: "website",
      metadata: {
        product_id: metadata.product_id,
        quantity: qty,
      },
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[webhook] failed to create order:", orderError?.message);
    return;
  }

  // Create order item using order UUID (not order_number)
  if (metadata.product_id) {
    const { data: product } = await supabase
      .from("products")
      .select("name, price_cents")
      .eq("id", metadata.product_id)
      .single();

    if (product) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: metadata.product_id,
        product_name: product.name,
        quantity: qty,
        unit_price_cents: product.price_cents,
      });
    }
  }

  // Update inventory
  if (metadata.product_id) {
    await supabase.rpc("decrement_stock", {
      p_product_id: metadata.product_id,
      p_quantity: qty,
    });
  }

  // Create income transaction so finance dashboard works
  const totalDollars = totalCents / 100;
  await supabase.from("transactions").insert({
    type: "income",
    category: "sale",
    description: `Pedido ${orderNumber}`,
    amount: totalDollars,
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    reference_id: order.id,
    reference_type: "order",
    created_by: "webhook",
  });

  // Forward buyer lead to Listflex
  const customerName = session.customer_details?.name;
  const { fname, lname } = splitName(customerName);
  postBuyerLead({
    email: email ?? undefined,
    fname,
    lname,
    phone: session.customer_details?.phone ?? undefined,
    offer: "https://afterslim.com",
    comments: `Order ${orderNumber} - $${totalDollars}`,
  }).catch((err) => console.error("[listflex] buyer post failed:", err));

  // Forward order to CartRover (FullStack Fulfillment)
  const shipping = extractShippingAddress(session);
  if (shipping && email) {
    try {
      const unitPrice = totalDollars / qty;
      const crResponse = await submitOrder({
        cart_order_id: orderNumber,
        cust_ref: order.id,
        cust_email: email,
        cust_first_name: fname,
        cust_last_name: lname,
        ship_first_name: fname,
        ship_last_name: lname,
        ship_address_1: shipping.line1 || "",
        ship_address_2: shipping.line2 || undefined,
        ship_city: shipping.city || "",
        ship_state: shipping.state || "",
        ship_zip: shipping.postal_code || "",
        ship_country: shipping.country || "US",
        sub_total: totalDollars,
        grand_total: totalDollars,
        shipping_handling: 0,
        sales_tax: 0,
        order_discount: 0,
        items: [
          {
            item: "GP0363", // GLP-1 Support - confirmed with FullStack
            sku: "GP0363",
            quantity: qty,
            price: unitPrice,
            extended_amount: unitPrice * qty,
            description: "GLP-1 Support - 30 Capsules",
          },
        ],
      });

      // Save CartRover ref and update status
      await supabase
        .from("orders")
        .update({
          status: "processing",
          metadata: {
            product_id: metadata.product_id,
            quantity: qty,
            cartrover_ref: crResponse.order_number,
          },
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        event_type: "status_changed",
        old_value: "paid",
        new_value: "processing",
        actor: "cartrover",
      });

      console.log("[webhook] order sent to CartRover:", orderNumber);
    } catch (err) {
      // Don't block the webhook if CartRover fails - order is saved, can retry later
      console.error("[webhook] CartRover submission failed (non-blocking):", err);
    }
  }

  console.log("[webhook] order created:", orderNumber, "id:", order.id);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.customer_email;

  if (!email) {
    console.log("[webhook] expired session without email, skipping abandon");
    return;
  }

  // Save abandon lead to DB
  const supabase = getAdminClient();
  await supabase.from("leads").insert({
    email,
    source: "checkout_abandon",
    utm_source: session.metadata?.utm_source ?? null,
    utm_medium: session.metadata?.utm_medium ?? null,
    utm_campaign: session.metadata?.utm_campaign ?? null,
    consent_marketing: false,
    metadata: {
      stripe_session_id: session.id,
      amount_total: session.amount_total,
    },
  });

  // Forward abandon lead to Listflex
  const customerName = session.customer_details?.name;
  const { fname, lname } = splitName(customerName);
  postAbandonLead({
    email,
    fname,
    lname,
    offer: "https://afterslim.com",
    comments: "Checkout abandoned",
  }).catch((err) => console.error("[listflex] abandon post failed:", err));

  console.log("[webhook] abandon lead saved:", email);
}
