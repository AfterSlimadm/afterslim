import { getAdminClient } from "@/lib/supabase/admin";

export interface ChannelMetrics {
  channel: string;
  orders: number;
  revenue: number;
  avg_order: number;
}

export async function getSalesChannelMetrics(): Promise<ChannelMetrics[]> {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("sales_channel, total_cents, status");

    if (error) {
      console.error("[sales-channels] query error:", error.message);
      return [];
    }

    // Group by channel
    const map: Record<string, { orders: number; revenue: number }> = {};

    for (const row of data ?? []) {
      const ch = row.sales_channel ?? "website";
      if (!map[ch]) map[ch] = { orders: 0, revenue: 0 };
      // Only count paid/completed orders
      if (!["cancelled", "refunded"].includes(row.status ?? "")) {
        map[ch].orders += 1;
        map[ch].revenue += Number(row.total_cents ?? 0);
      }
    }

    return Object.entries(map).map(([channel, stats]) => ({
      channel,
      orders: stats.orders,
      revenue: stats.revenue / 100,
      avg_order: stats.orders > 0 ? stats.revenue / 100 / stats.orders : 0,
    }));
  } catch (err) {
    console.error("[sales-channels] unexpected error:", err);
    return [];
  }
}
