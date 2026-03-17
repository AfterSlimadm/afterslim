import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fetch all store settings as a key-value object.
 */
export async function getSettings(): Promise<Record<string, unknown>> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("store_settings")
    .select("key, value");

  if (error) {
    console.error("[settings] Failed to fetch settings:", error);
    return {};
  }

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return settings;
}

/**
 * Fetch last N audit log entries ordered by most recent first.
 */
export interface AuditLogEntry {
  id: string;
  user_name: string | null;
  action: string;
  entity_type: string | null;
  created_at: string;
}

export async function getRecentAuditLog(
  limit = 20
): Promise<AuditLogEntry[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("audit_log")
    .select("id, user_name, action, entity_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[settings] Failed to fetch audit log:", error);
    return [];
  }

  return data ?? [];
}
