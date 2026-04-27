import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";

const ALLOWED_ORIGINS = [
  "https://afterslim.com",
  "https://www.afterslim.com",
  "http://localhost:3000",
];

// Price ID to amount mapping (cents) for one-time payments
const PRICE_AMOUNTS: Record<string, { cents: number; label: string }> = {
  "price_1TC4qvAy7m7ndbNOmzhrCfLv": { cents: 3799, label: "AfterSlim - 1 Bottle" },
  "price_1TMbxdAy7m7ndbNOYi3z5QoA": { cents: 5799, label: "AfterSlim - 2 Bottles" },
  "price_1TMc1AAy7m7ndbNO7vOXSCU6": { cents: 6799, label: "AfterSlim - 3 Bottles" },
};

// Subscription Price IDs
const SUBSCRIPTION_PRICE_IDS: Record<string, string> = {
  "price_1TMbv8Ay7m7ndbNOKKiA3vxk": "AfterSlim - 1 Bottle Monthly",
  "price_1TMbzPAy7m7ndbNO1zsXcJ6e": "AfterSlim - 2 Bottles Monthly",
  "price_1TMc2MAy7m7ndbNOh5oPM3MF": "AfterSlim - 3 Bottles Monthly",
};

const ALL_VALID = new Set([
  ...Object.keys(PRICE_AMOUNTS),
  ...Object.keys(SUBSCRIPTION_PRICE_IDS),
]);

function corsHeaders(origin: string | null) {
  const allowed = ALLOWED_ORIGINS.includes(origin ?? "")
    ? origin!
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/**
 * POST /api/checkout
 * Creates a Stripe PaymentIntent (one-time) or Subscription (recurring).
 * Body: { price_id: string, customer_email?: string, customer_name?: string,
 *         shipping?: { address, city, state, zip, country },
 *         payment_method_type?: string }
 *
 * Webhook (/api/checkout/webhook) consumes the metadata fields populated here
 * (product_id, quantity, is_subscription) to decrement stock, create order_items,
 * upsert customer, and ship via CartRover. Always include them.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "https://afterslim.com";
  try {
    const body = await request.json().catch(() => ({}));
    const priceId: string = body.price_id;

    if (!priceId || !ALL_VALID.has(priceId)) {
      return NextResponse.json(
        { error: "Invalid price_id" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Look up product/quantity mapping for this price_id (defense in depth + admin source of truth)
    const supabase = getAdminClient();
    const { data: priceRow } = await supabase
      .from("stripe_prices")
      .select("product_id, quantity, is_subscription, interval")
      .eq("price_id", priceId)
      .eq("is_active", true)
      .maybeSingle();

    const productId = priceRow?.product_id ?? null;
    const lineQuantity = priceRow?.quantity ?? 1;
    const lineInterval = priceRow?.interval ?? null;

    const stripe = getStripe();
    const isSubscription = priceId in SUBSCRIPTION_PRICE_IDS;

    const baseMetadata: Record<string, string> = {
      price_id: priceId,
      ...(productId ? { product_id: productId } : {}),
      quantity: String(lineQuantity),
      is_subscription: String(isSubscription),
      ...(lineInterval ? { interval: lineInterval } : {}),
    };

    if (isSubscription) {
      const customer = await stripe.customers.create({
        email: body.customer_email || undefined,
        name: body.customer_name || undefined,
        shipping: body.shipping
          ? {
              name: body.customer_name || "",
              address: {
                line1: body.shipping.address,
                city: body.shipping.city,
                state: body.shipping.state,
                postal_code: body.shipping.zip,
                country: body.shipping.country || "US",
              },
            }
          : undefined,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: baseMetadata,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = subscription.latest_invoice as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentIntent = invoice?.payment_intent as any;

      // Propagate metadata onto the PaymentIntent so the webhook
      // (payment_intent.succeeded) has product_id/quantity available.
      if (paymentIntent?.id) {
        await stripe.paymentIntents.update(paymentIntent.id, {
          metadata: {
            ...baseMetadata,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customer.id,
          },
        });
      }

      return NextResponse.json(
        {
          clientSecret: paymentIntent?.client_secret,
          type: "subscription",
          subscriptionId: subscription.id,
        },
        { headers: corsHeaders(origin) }
      );
    }

    // One-time payment: create PaymentIntent
    const priceInfo = PRICE_AMOUNTS[priceId];
    const pmTypes: string[] =
      body.payment_method_type === "afterpay_clearpay"
        ? ["afterpay_clearpay"]
        : ["card"];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInfo.cents,
      currency: "usd",
      payment_method_types: pmTypes,
      description: priceInfo.label,
      metadata: baseMetadata,
      receipt_email: body.customer_email || undefined,
      shipping: body.shipping
        ? {
            name: body.customer_name || "",
            address: {
              line1: body.shipping.address,
              city: body.shipping.city,
              state: body.shipping.state,
              postal_code: body.shipping.zip,
              country: body.shipping.country || "US",
            },
          }
        : undefined,
    });

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        type: "payment",
      },
      { headers: corsHeaders(origin) }
    );
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
