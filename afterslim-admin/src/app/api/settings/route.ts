import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { logAudit } from "@/lib/audit";

/**
 * GET /api/settings
 * Fetch all store_settings rows as a key-value object.
 */
export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("store_settings")
    .select("key, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json(settings);
}

/**
 * POST /api/settings
 * Upsert a setting and log to audit_log.
 * Body: { key: string, value: unknown }
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { key, value } = body;

  if (!key) {
    return NextResponse.json(
      { error: "Campo 'key' obrigatorio" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Fetch old value for audit
  const { data: existing } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", key)
    .single();

  const { error } = await supabase
    .from("store_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log to audit
  await logAudit({
    action: "settings.update",
    entityType: "store_settings",
    entityId: key,
    oldValue: existing ? { value: existing.value } : undefined,
    newValue: { value },
    userName: "Admin", // TODO: pegar do session/auth
  });

  return NextResponse.json({ success: true });
}
