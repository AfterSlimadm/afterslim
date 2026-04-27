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
  const email = session.customer_details?.email ?? session.customer_email;

  // Resolve product/quantity. Prefer metadata (set by /api/checkout); fallback to stripe_prices lookup.
  let productId: string | null = metadata.product_id ?? null;
  let qty: number = Number(metadata.quantity) || 0;
  let isSubscription: boolean = metadata.is_subscription === "true";
  let interval: string | null = null;

  if ((!productId || !qty) && metadata.price_id) {
    const { data: priceRow } = await supabase
      .from("stripe_prices")
      .select("product_id, quantity, is_subscription, interval")
      .eq("price_id", metadata.price_id)
      .single();
    if (priceRow) {
      productId = productId ?? priceRow.product_id;
      qty = qty || priceRow.quantity;
      isSubscription = isSubscription || priceRow.is_subscription;
      interval = priceRow.interval;
    }
  }

  if (!qty) qty = 1;

  // Fetch product info (name, price, sku) for order_item + CartRover
  let product: { name: string; price_cents: number; sku: string | null } | null = null;
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("name, price_cents, sku")
      .eq("id", productId)
      .single();
    product = data;
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      status: "paid",
      subtotal_cents: totalCents,
      total_cents: totalCents,
      shipping_address: extractShippingAddress(session),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      metadata: {
        product_id: productId,
        price_id: metadata.price_id,
        quantity: qty,
        is_subscription: isSubscription,
      },
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[webhook] failed to create order:", orderError?.message);
    return;
  }
  const orderNumber = order.order_number;

  // Create order item
  if (productId && product) {
    const { error: itemErr } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      product_name: product.name,
      quantity: qty,
      unit_price_cents: Math.round(totalCents / qty),
      is_subscription: isSubscription,
      subscription_interval: isSubscription ? interval ?? "month" : null,
    });
    if (itemErr) console.error("[webhook] order_item insert failed:", itemErr.message);

    // Decrement stock
    const { error: stockErr } = await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity: qty,
    });
    if (stockErr) console.error("[webhook] decrement_stock failed:", stockErr.message);
  } else {
    console.error("[webhook] no product resolved for session", session.id, "metadata:", metadata);
  }

  // Income transaction
  const totalDollars = totalCents / 100;
  await supabase.from("transactions").insert({
    type: "income",
    category: "sale",
    description: `Order ${orderNumber}`,
    amount: totalDollars,
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    reference_id: order.id,
    reference_type: "order",
    created_by: "webhook",
  });

  // Upsert customer record (denormalized view for admin dashboard)
  const customerName = session.customer_details?.name;
  const { fname, lname } = splitName(customerName);
  const shippingAddr = extractShippingAddress(session);
  if (email) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_orders, total_spent")
      .eq("email", email)
      .single();

    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          first_name: fname || undefined,
          last_name: lname || undefined,
          phone: session.customer_details?.phone ?? undefined,
          default_address: shippingAddr,
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + totalCents,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabase.from("customers").insert({
        email,
        first_name: fname,
        last_name: lname,
        phone: session.customer_details?.phone ?? null,
        default_address: shippingAddr,
        total_orders: 1,
        total_spent: totalCents,
      });
    }
  }

  // Forward buyer lead to Listflex
  postBuyerLead({
    email: email ?? undefined,
    fname,
    lname,
    phone: session.customer_details?.phone ?? undefined,
    offer: "https://afterslim.com",
    comments: `Order ${orderNumber} - $${totalDollars} - qty ${qty}${isSubscription ? " (subscription)" : ""}`,
  }).catch((err) => console.error("[listflex] buyer post failed:", err));

  // Forward order to CartRover
  if (shippingAddr && email && product) {
    try {
      const unitPrice = totalDollars / qty;
      const sku = product.sku ?? "GP0363";
      const crResponse = await submitOrder({
        cart_order_id: orderNumber,
        cust_ref: order.id,
        cust_email: email,
        cust_first_name: fname,
        cust_last_name: lname,
        ship_first_name: fname,
        ship_last_name: lname,
        ship_address_1: shippingAddr.line1 || "",
        ship_address_2: shippingAddr.line2 || undefined,
        ship_city: shippingAddr.city || "",
        ship_state: shippingAddr.state || "",
        ship_zip: shippingAddr.postal_code || "",
        ship_country: shippingAddr.country || "US",
        sub_total: totalDollars,
        grand_total: totalDollars,
        shipping_handling: 0,
        sales_tax: 0,
        order_discount: 0,
        items: [
          {
            item: sku,
            sku,
            quantity: qty,
            price: unitPrice,
            extended_amount: unitPrice * qty,
            description: product.name,
          },
        ],
      });

      await supabase
        .from("orders")
        .update({
          status: "processing",
          metadata: {
            product_id: productId,
            price_id: metadata.price_id,
            quantity: qty,
            is_subscription: isSubscription,
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
      console.error("[webhook] CartRover submission failed (non-blocking):", err);
    }
  }

  console.log("[webhook] order created:", orderNumber, "id:", order.id, "qty:", qty);
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
