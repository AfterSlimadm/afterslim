import { getAdminClient } from "@/lib/supabase/admin";

export interface AffiliateRow {
  creator_id: string;
  creator_name: string;
  creator_handle: string | null;
  coupon_code: string | null;
  coupon_id: string | null;
  commission_percent: number;
  balance_cents: number;
  total_earned_cents: number;
  total_sales: number;
  pending_withdrawals: number;
}

/**
 * Fetch all affiliates (creators with affiliate coupons) with their balances.
 */
export async function getAffiliates(): Promise<AffiliateRow[]> {
  const supabase = getAdminClient();

  // Get coupons that are affiliate-linked
  const { data: coupons, error: cErr } = await supabase
    .from("coupons")
    .select("id, code, affiliate_creator_id, commission_percent")
    .not("affiliate_creator_id", "is", null);

  if (cErr) {
    console.error("[getAffiliates] coupons query failed:", cErr.message);
    return [];
  }

  if (!coupons?.length) return [];

  const creatorIds = coupons.map(
    (c) => c.affiliate_creator_id as string
  );

  // Parallel fetches
  const [creatorsRes, balancesRes, withdrawalsRes] = await Promise.all([
    supabase
      .from("creators")
      .select("id, name, handle, total_sales, total_revenue_cents")
      .in("id", creatorIds),
    supabase
      .from("affiliate_balances")
      .select("creator_id, balance_cents, total_earned_cents")
      .in("creator_id", creatorIds),
    supabase
      .from("affiliate_withdrawals")
      .select("creator_id")
      .in("creator_id", creatorIds)
      .eq("status", "pending"),
  ]);

  if (creatorsRes.error) {
    console.error("[getAffiliates] creators query failed:", creatorsRes.error.message);
    return [];
  }

  const balanceMap = new Map(
    (balancesRes.data ?? []).map((b) => [b.creator_id, b])
  );
  const couponMap = new Map(
    coupons.map((c) => [c.affiliate_creator_id as string, c])
  );
  const withdrawalCount = new Map<string, number>();
  (withdrawalsRes.data ?? []).forEach((w) => {
    withdrawalCount.set(
      w.creator_id,
      (withdrawalCount.get(w.creator_id) ?? 0) + 1
    );
  });

  return (creatorsRes.data ?? []).map((cr) => {
    const coupon = couponMap.get(cr.id);
    const balance = balanceMap.get(cr.id);
    return {
      creator_id: cr.id,
      creator_name: cr.name,
      creator_handle: cr.handle,
      coupon_code: coupon?.code ?? null,
      coupon_id: coupon?.id ?? null,
      commission_percent: Number(coupon?.commission_percent ?? 10),
      balance_cents: balance?.balance_cents ?? 0,
      total_earned_cents: balance?.total_earned_cents ?? 0,
      total_sales: cr.total_sales ?? 0,
      pending_withdrawals: withdrawalCount.get(cr.id) ?? 0,
    };
  });
}

/**
 * Fetch withdrawal history, optionally filtered by creator.
 */
export async function getAffiliateWithdrawals(creatorId?: string) {
  const supabase = getAdminClient();
  let query = supabase
    .from("affiliate_withdrawals")
    .select("id, creator_id, amount_cents, status, requested_at, paid_at")
    .order("requested_at", { ascending: false });

  if (creatorId) query = query.eq("creator_id", creatorId);

  const { data, error } = await query;
  if (error) {
    console.error("[getAffiliateWithdrawals]", error.message);
    return [];
  }
  return data ?? [];
}
