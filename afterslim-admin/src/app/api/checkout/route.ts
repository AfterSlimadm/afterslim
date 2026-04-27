import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";

const ALLOWED_ORIGINS = [
  "https://afterslim.com",
  "https://www.afterslim.com",
  "http://localhost:3000",
];

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
 * Creates a Stripe Checkout Session using a pre-configured Price ID.
 * Validates price_id against `stripe_prices` table (source of truth).
 * Body: { price_id: string, customer_email?: string, customer_name?: string }
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "https://afterslim.com";
  try {
    const body = await request.json().catch(() => ({}));
    const priceId = body.price_id;

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json(
        { error: "Missing price_id" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const supabase = getAdminClient();
    const { data: priceRow, error: priceErr } = await supabase
      .from("stripe_prices")
      .select("price_id, product_id, quantity, is_subscription, interval, unit_amount_cents, is_active")
      .eq("price_id", priceId)
      .eq("is_active", true)
      .single();

    if (priceErr || !priceRow) {
      console.error("[checkout] unknown or inactive price_id:", priceId, priceErr?.message);
      return NextResponse.json(
        { error: "Invalid price_id" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: priceRow.is_subscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      metadata: {
        price_id: priceId,
        product_id: priceRow.product_id,
        quantity: String(priceRow.quantity),
        is_subscription: String(priceRow.is_subscription),
      },
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json(
      { clientSecret: session.client_secret },
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
