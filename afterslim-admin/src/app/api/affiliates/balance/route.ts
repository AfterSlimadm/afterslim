import { NextRequest, NextResponse } from "next/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const apiUser = await getApiUser();
    if (!apiUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
    if (forbidden) return forbidden;

    const creatorId = req.nextUrl.searchParams.get("creator_id");
    if (!creatorId) {
      return NextResponse.json(
        { error: "creator_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("affiliate_balances")
      .select("id, creator_id, balance_cents, total_earned_cents, updated_at")
      .eq("creator_id", creatorId)
      .maybeSingle();

    if (error) {
      console.error("[GET /api/affiliates/balance]", error.message);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    // Return zero balance if no row exists yet
    const balance = data ?? {
      creator_id: creatorId,
      balance_cents: 0,
      total_earned_cents: 0,
    };

    return NextResponse.json(balance);
  } catch (err) {
    console.error("[GET /api/affiliates/balance]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
