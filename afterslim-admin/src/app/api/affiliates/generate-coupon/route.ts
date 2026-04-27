import { NextRequest, NextResponse } from "next/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const generateCouponSchema = z.object({
  creator_id: z.string().uuid(),
  commission_percent: z.number().min(1).max(100).optional(),
});

function generateCode(handle: string | null): string {
  const base = handle
    ? handle.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10)
    : "CREATOR";
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AFF-${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiUser = await getApiUser();
    if (!apiUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
    if (forbidden) return forbidden;

    const body = await req.json();
    const parsed = generateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { creator_id, commission_percent } = parsed.data;
    const supabase = createServerClient();

    // Check creator exists
    const { data: creator, error: crErr } = await supabase
      .from("creators")
      .select("id, name, handle, coupon_id")
      .eq("id", creator_id)
      .maybeSingle();

    if (crErr || !creator) {
      return NextResponse.json(
        { error: "Criador não encontrado" },
        { status: 404 }
      );
    }

    // Check if creator already has an affiliate coupon
    if (creator.coupon_id) {
      const { data: existingCoupon } = await supabase
        .from("coupons")
        .select("id, code, affiliate_creator_id")
        .eq("id", creator.coupon_id)
        .maybeSingle();

      if (existingCoupon?.affiliate_creator_id) {
        return NextResponse.json(
          { error: "Criador já possui cupom de afiliado", coupon: existingCoupon },
          { status: 409 }
        );
      }
    }

    // Get default commission from settings
    let effectiveCommission = commission_percent;
    if (!effectiveCommission) {
      const { data: setting } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "affiliate_commission_percent")
        .maybeSingle();
      effectiveCommission = Number(setting?.value ?? 10);
    }

    // Generate unique coupon code
    const code = generateCode(creator.handle);

    // Create the coupon
    const { data: coupon, error: couponErr } = await supabase
      .from("coupons")
      .insert({
        code,
        description: `Cupom de afiliado - ${creator.name}`,
        discount_type: "percentage",
        discount_value: 10,
        max_uses: null,
        used_count: 0,
        max_uses_per_customer: 1,
        applies_to: "all",
        is_active: true,
        affiliate_creator_id: creator_id,
        commission_percent: effectiveCommission,
      })
      .select("id, code, commission_percent")
      .single();

    if (couponErr) {
      console.error("[POST /api/affiliates/generate-coupon]", couponErr.message);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    // Link coupon to creator
    const { error: linkErr } = await supabase
      .from("creators")
      .update({ coupon_id: coupon.id })
      .eq("id", creator_id);

    if (linkErr) {
      console.error("[POST /api/affiliates/generate-coupon] link:", linkErr.message);
    }

    // Initialize affiliate balance if not exists
    await supabase
      .from("affiliate_balances")
      .upsert(
        { creator_id, balance_cents: 0, total_earned_cents: 0 },
        { onConflict: "creator_id", ignoreDuplicates: true }
      );

    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("[POST /api/affiliates/generate-coupon]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
