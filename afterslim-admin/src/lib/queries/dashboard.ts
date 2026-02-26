import { getAdminClient } from "@/lib/supabase/admin";

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
}

/**
 * Aggregate KPIs for the dashboard: revenue, orders, inventory alerts, etc.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getAdminClient();

  // Fetch transactions for revenue/expenses
  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount");

  let totalRevenue = 0;
  let totalExpenses = 0;

  for (const tx of transactions ?? []) {
    if (tx.type === "income") {
      totalRevenue += Number(tx.amount);
    } else {
      totalExpenses += Number(tx.amount);
    }
  }

  // Orders count
  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Products count
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Low stock count from inventory
  const { data: inventory } = await supabase
    .from("products_inventory")
    .select("stock_qty, reorder_point");

  const lowStockCount =
    inventory?.filter((item) => item.stock_qty <= item.reorder_point).length ??
    0;

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    ordersCount: ordersCount ?? 0,
    productsCount: productsCount ?? 0,
    lowStockCount,
  };
}
