import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

/**
 * POST /api/checkout/webhook
 * Stripe webhook handler. Creates order in Supabase when payment succeeds.
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminClient();

  // Check if order already exists (idempotency)
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

  // Generate order number
  const orderNumber = `AS-${Date.now().toString().slice(-6)}`;

  // Create order
  const { error: orderError } = await supabase.from("orders").insert({
    order_number: orderNumber,
    email: session.customer_details?.email ?? session.customer_email,
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
      quantity: Number(metadata.quantity) || 1,
    },
  });

  if (orderError) {
    console.error("[webhook] failed to create order:", orderError.message);
    return;
  }

  // Create order item
  if (metadata.product_id) {
    const { data: product } = await supabase
      .from("products")
      .select("name, price_cents")
      .eq("id", metadata.product_id)
      .single();

    if (product) {
      const qty = Number(metadata.quantity) || 1;
      await supabase.from("order_items").insert({
        order_id: orderNumber,
        product_id: metadata.product_id,
        product_name: product.name,
        quantity: qty,
        unit_price_cents: product.price_cents,
        total_price_cents: product.price_cents * qty,
      });
    }
  }

  // Update inventory
  if (metadata.product_id) {
    const qty = Number(metadata.quantity) || 1;
    await supabase.rpc("decrement_stock", {
      p_product_id: metadata.product_id,
      p_quantity: qty,
    });
  }

  console.log("[webhook] order created:", orderNumber);
}
