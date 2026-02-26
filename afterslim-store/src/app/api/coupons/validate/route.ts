import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1),
  subtotal_cents: z.number().int().positive(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { code, subtotal_cents } = parsed.data;
  const supabase = getAdminClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  }

  // Check expiration
  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return NextResponse.json({ error: "Coupon not yet active" }, { status: 400 });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
  }

  // Check usage
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }

  // Check minimum order
  if (coupon.min_order_cents && subtotal_cents < coupon.min_order_cents) {
    return NextResponse.json(
      { error: `Minimum order of $${(coupon.min_order_cents / 100).toFixed(2)} required` },
      { status: 400 }
    );
  }

  // Calculate discount
  let discount_cents = 0;
  if (coupon.discount_type === "percentage") {
    discount_cents = Math.round(subtotal_cents * (coupon.discount_value / 100));
  } else if (coupon.discount_type === "fixed_amount") {
    discount_cents = coupon.discount_value;
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_cents,
      description: coupon.description,
    },
  });
}
