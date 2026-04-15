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
 * Creates a Stripe Checkout Session for a product purchase.
 * Body: { product_id?: string, quantity?: number }
 * If no product_id, defaults to the main Berberine product.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "https://afterslim.com";
  try {
    const body = await request.json().catch(() => ({}));
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));

    const supabase = getAdminClient();
    const stripe = getStripe();

    // Fetch product (default: first active product)
    const { data: product, error: productError } = body.product_id
      ? await supabase
          .from("products")
          .select("id, name, price_cents, images, slug")
          .eq("id", body.product_id)
          .single()
      : await supabase
          .from("products")
          .select("id, name, price_cents, images, slug")
          .eq("is_active", true)
          .order("created_at", { ascending: true })
          .limit(1)
          .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const images = product.images as string[] | null;

    // Create Stripe Checkout Session (embedded mode)
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: product.price_cents,
            product_data: {
              name: product.name,
              images: images?.length ? [images[0]] : [],
            },
          },
          quantity,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      metadata: {
        product_id: product.id,
        product_slug: product.slug,
        quantity: String(quantity),
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
