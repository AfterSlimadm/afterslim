import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fetch all orders with optional joined order_items count.
 */
export async function getOrders() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(count), profile:profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getOrders]", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Fetch a single order by ID with order_items and order_events.
 */
export async function getOrderById(id: string) {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), order_events(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getOrderById]", error.message);
    return null;
  }

  return data;
}

/**
 * Get order counts grouped by status.
 */
export async function getOrderStats(): Promise<Record<string, number>> {
  const orders = await getOrders();
  const stats: Record<string, number> = {};

  for (const order of orders) {
    const status = (order as { status: string }).status;
    stats[status] = (stats[status] ?? 0) + 1;
  }

  return stats;
}
