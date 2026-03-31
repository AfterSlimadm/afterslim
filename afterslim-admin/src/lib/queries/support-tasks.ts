import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fetch all support tasks with joined admin_user name.
 */
export async function getSupportTasks(filters?: {
  orderId?: string;
  customerId?: string;
  isCompleted?: boolean;
  adminUserId?: string;
}) {
  const supabase = getAdminClient();

  let query = supabase
    .from("support_tasks")
    .select("*, admin_user:admin_users!admin_user_id(display_name)")
    .order("created_at", { ascending: false });

  if (filters?.orderId) {
    query = query.eq("order_id", filters.orderId);
  }
  if (filters?.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }
  if (filters?.isCompleted !== undefined) {
    query = query.eq("is_completed", filters.isCompleted);
  }
  if (filters?.adminUserId) {
    query = query.eq("admin_user_id", filters.adminUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getSupportTasks]", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Fetch support tasks for a specific order.
 */
export async function getSupportTasksByOrder(orderId: string) {
  return getSupportTasks({ orderId });
}
