import { createServerClient } from "./supabase-server";

interface AuditEntry {
  userId?: string;
  userName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Log an action to the audit_log table.
 * Call from API routes / server actions only.
 */
export async function logAudit(entry: AuditEntry) {
  try {
    const supabase = createServerClient();
    await supabase.from("audit_log").insert({
      user_id: entry.userId,
      user_name: entry.userName,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      old_value: entry.oldValue,
      new_value: entry.newValue,
      metadata: entry.metadata || {},
      ip_address: entry.ipAddress,
    });
  } catch (error) {
    console.error("[audit] Failed to log:", error);
  }
}

/**
 * Update last_login_at for an admin user.
 */
export async function updateLastLogin(userId: string) {
  try {
    const supabase = createServerClient();
    await supabase
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", userId);
  } catch (error) {
    console.error("[audit] Failed to update last login:", error);
  }
}
