import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

const ALLOWED_ORIGINS = [
  "https://afterslim.com",
  "https://www.afterslim.com",
  "http://localhost:3000",
];

// Allowed Stripe Price IDs — only these can be used in checkout
const VALID_PRICE_IDS = new Set([
  "price_1TC4qvAy7m7ndbNOmzhrCfLv", // 1 Bottle one-time $37.99
  "price_1TMbv8Ay7m7ndbNOKKiA3vxk",  // 1 Bottle subscription $27.99/mo
  "price_1TMbxdAy7m7ndbNOYi3z5QoA", // 2 Bottles one-time $57.99
  "price_1TMbzPAy7m7ndbNO1zsXcJ6e",  // 2 Bottles subscription $47.99/mo
  "price_1TMc1AAy7m7ndbNO7vOXSCU6", // 3 Bottles one-time $67.99
  "price_1TMc2MAy7m7ndbNOh5oPM3MF",  // 3 Bottles subscription $57.99/mo
]);

// Recurring Price IDs (subscriptions)
const RECURRING_PRICE_IDS = new Set([
  "price_1TMbv8Ay7m7ndbNOKKiA3vxk",
  "price_1TMbzPAy7m7ndbNO1zsXcJ6e",
  "price_1TMc2MAy7m7ndbNOh5oPM3MF",
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
 * Creates a Stripe Checkout Session using a pre-configured Price ID.
 * Body: { price_id: string }
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "https://afterslim.com";
  try {
    const body = await request.json().catch(() => ({}));
    const priceId = body.price_id;

    if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json(
        { error: "Invalid price_id" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const stripe = getStripe();
    const isSubscription = RECURRING_PRICE_IDS.has(priceId);

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      metadata: {
        price_id: priceId,
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
      { error: "Erro ao criar sessao de checkout" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
