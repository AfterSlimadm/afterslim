import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const cartItemSchema = z.object({
  id: z.string(),
  type: z.enum(["product", "kit"]),
  name: z.string(),
  slug: z.string(),
  price_cents: z.number(),
  quantity: z.number().int().positive(),
  image: z.string().nullable(),
});

const syncSchema = z.object({
  items: z.array(cartItemSchema),
  coupon_code: z.string().nullable().optional(),
});

/**
 * POST /api/cart/sync
 * Merges the client-side cookie cart with the user's DB cart.
 * Returns the merged cart so the client can update its local state.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = syncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items: cookieItems, coupon_code } = parsed.data;

  // 1. Find or create the user's active cart
  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .single();

  if (!cart) {
    const { data: newCart, error: createErr } = await supabase
      .from("carts")
      .insert({
        profile_id: user.id,
        status: "active",
        coupon_code: coupon_code ?? null,
      })
      .select("id")
      .single();

    if (createErr || !newCart) {
      return NextResponse.json(
        { error: "Failed to create cart" },
        { status: 500 }
      );
    }
    cart = newCart;
  } else if (coupon_code !== undefined) {
    await supabase
      .from("carts")
      .update({ coupon_code: coupon_code ?? null })
      .eq("id", cart.id);
  }

  // 2. Fetch existing DB cart items
  const { data: dbItems } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity, is_subscription, price_at_add_cents")
    .eq("cart_id", cart.id);

  const existingMap = new Map(
    (dbItems ?? []).map((i) => [i.product_id, i])
  );

  // 3. Merge: cookie items take priority (they are the most recent user intent)
  const upserts = cookieItems.map((item) => ({
    cart_id: cart!.id,
    product_id: item.id,
    quantity: item.quantity,
    is_subscription: false,
    price_at_add_cents: item.price_cents,
  }));

  if (upserts.length > 0) {
    // Clear old items and replace with merged set
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    await supabase.from("cart_items").insert(upserts);
  } else if ((dbItems ?? []).length === 0) {
    // Both empty, nothing to do
  }

  // 4. Return the merged cart for the client
  return NextResponse.json({ synced: true, cart_id: cart.id });
}

/**
 * GET /api/cart/sync
 * Fetches the user's DB cart and returns items in the client CartItem format.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id, coupon_code")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .single();

  if (!cart) {
    return NextResponse.json({ items: [], coupon_code: null });
  }

  const { data: dbItems } = await supabase
    .from("cart_items")
    .select(
      `
      product_id,
      quantity,
      price_at_add_cents,
      products:product_id (id, slug, name, product_type, images, price_cents)
    `
    )
    .eq("cart_id", cart.id);

  const items = (dbItems ?? []).map((item: Record<string, unknown>) => {
    const product = item.products as Record<string, unknown> | null;
    return {
      id: item.product_id as string,
      type: (product?.product_type as string) === "kit" ? "kit" : "product",
      name: (product?.name as string) ?? "Unknown",
      slug: (product?.slug as string) ?? "",
      price_cents:
        (item.price_at_add_cents as number) ??
        (product?.price_cents as number) ??
        0,
      quantity: item.quantity as number,
      image:
        Array.isArray(product?.images) && (product.images as string[]).length > 0
          ? (product.images as string[])[0]
          : null,
    };
  });

  return NextResponse.json({
    items,
    coupon_code: cart.coupon_code ?? null,
  });
}
