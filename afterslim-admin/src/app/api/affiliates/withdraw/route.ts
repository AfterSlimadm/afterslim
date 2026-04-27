import { NextRequest, NextResponse } from "next/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const withdrawSchema = z.object({
  creator_id: z.string().uuid(),
  amount_cents: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const apiUser = await getApiUser();
    if (!apiUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
    if (forbidden) return forbidden;

    const body = await req.json();
    const parsed = withdrawSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { creator_id, amount_cents } = parsed.data;
    const supabase = createServerClient();

    // Get minimum withdrawal setting
    const { data: minSetting } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "affiliate_min_withdrawal_cents")
      .maybeSingle();

    const minWithdrawal = Number(minSetting?.value ?? 5000);

    if (amount_cents < minWithdrawal) {
      return NextResponse.json(
        {
          error: `Valor mínimo para saque: $${(minWithdrawal / 100).toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    // Get current balance
    const { data: balance, error: balErr } = await supabase
      .from("affiliate_balances")
      .select("balance_cents")
      .eq("creator_id", creator_id)
      .maybeSingle();

    if (balErr) {
      console.error("[POST /api/affiliates/withdraw]", balErr.message);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    const currentBalance = balance?.balance_cents ?? 0;

    if (amount_cents > currentBalance) {
      return NextResponse.json(
        { error: "Saldo insuficiente" },
        { status: 400 }
      );
    }

    // Insert withdrawal request
    const { data: withdrawal, error: wErr } = await supabase
      .from("affiliate_withdrawals")
      .insert({
        creator_id,
        amount_cents,
        status: "pending",
      })
      .select("id, creator_id, amount_cents, status, requested_at")
      .single();

    if (wErr) {
      console.error("[POST /api/affiliates/withdraw]", wErr.message);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    // Debit balance
    const { error: updateErr } = await supabase
      .from("affiliate_balances")
      .update({
        balance_cents: currentBalance - amount_cents,
        updated_at: new Date().toISOString(),
      })
      .eq("creator_id", creator_id);

    if (updateErr) {
      console.error("[POST /api/affiliates/withdraw] balance update:", updateErr.message);
      // Withdrawal was created but balance not debited — log for manual fix
    }

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("[POST /api/affiliates/withdraw]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
