import { getAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

/* ── Types ──────────────────────────────────────────────────── */

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
}

export type AlertLevel = "warning" | "success" | "info";

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
  icon: "package" | "trophy" | "bot";
  time: string;
}

/* ── Revenue by day ─────────────────────────────────────────── */

export async function getRevenueByDay(
  days: number = 30
): Promise<RevenueDataPoint[]> {
  const supabase = getAdminClient();

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("date, amount")
    .eq("type", "income")
    .gte("date", sinceISO.slice(0, 10));

  if (error) {
    console.error("[getRevenueByDay]", error.message);
    return [];
  }

  // Group by date and sum amounts
  const byDate = new Map<string, number>();

  // Pre-fill all days so the chart has no gaps
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    byDate.set(key, 0);
  }

  for (const tx of transactions ?? []) {
    const key = typeof tx.date === "string" ? tx.date.slice(0, 10) : "";
    if (key && byDate.has(key)) {
      byDate.set(key, (byDate.get(key) ?? 0) + Number(tx.amount));
    }
  }

  // Convert to array with formatted date labels
  return Array.from(byDate.entries()).map(([dateStr, revenue]) => {
    const d = new Date(dateStr + "T12:00:00Z");
    return {
      date: d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      revenue: Math.round(revenue * 100) / 100,
    };
  });
}

/* ── Recent orders ──────────────────────────────────────────── */

export async function getRecentOrders(
  limit: number = 5
): Promise<RecentOrder[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_cents, created_at, profile:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentOrders]", error.message);
    return [];
  }

  return (data ?? []).map((order) => {
    const raw = order.profile as unknown;
    let customerName = "Unknown";
    if (Array.isArray(raw) && raw.length > 0 && raw[0]?.full_name) {
      customerName = raw[0].full_name;
    } else if (raw && typeof raw === "object" && !Array.isArray(raw) && (raw as Record<string, unknown>).full_name) {
      customerName = (raw as Record<string, string>).full_name;
    }

    return {
      id: order.id,
      orderNumber: order.order_number ?? `AS-${order.id.slice(-4)}`,
      customer: customerName,
      total: Number(order.total_cents ?? 0) / 100,
      status: order.status as OrderStatus,
      date: order.created_at,
    };
  });
}

/* ── Generate real alerts ───────────────────────────────────── */

export async function generateAlerts(): Promise<DashboardAlert[]> {
  const supabase = getAdminClient();
  const alerts: DashboardAlert[] = [];
  let alertId = 0;

  // 1. Low stock alerts from products_inventory
  const { data: inventory } = await supabase
    .from("products_inventory")
    .select("product_name, stock_qty, reorder_point");

  for (const item of inventory ?? []) {
    if (item.stock_qty <= item.reorder_point) {
      alertId++;
      alerts.push({
        id: String(alertId),
        title: "Low Stock Warning",
        description: `${item.product_name} is at ${item.stock_qty} units (reorder point: ${item.reorder_point})`,
        level: "warning",
        icon: "package",
        time: "Now",
      });
    }
  }

  // 2. Goals achieved from financial_goals
  const { data: goals } = await supabase
    .from("financial_goals")
    .select("name, target_amount, current_amount")
    .eq("is_active", true);

  for (const goal of goals ?? []) {
    if (goal.current_amount >= goal.target_amount) {
      alertId++;
      alerts.push({
        id: String(alertId),
        title: "Goal Reached!",
        description: `${goal.name} target achieved`,
        level: "success",
        icon: "trophy",
        time: "Recently",
      });
    }
  }

  // 3. Recent agent insights from as_agent_memory (last 24h)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const { data: memories } = await supabase
    .from("as_agent_memory")
    .select("content, created_at")
    .in("kind", ["insight", "alert"])
    .gte("created_at", yesterday.toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  for (const mem of memories ?? []) {
    alertId++;
    const createdAt = new Date(mem.created_at);
    const hoursAgo = Math.round(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
    );
    const timeLabel =
      hoursAgo < 1 ? "Just now" : `${hoursAgo}h ago`;

    alerts.push({
      id: String(alertId),
      title: "Agent Insight",
      description:
        mem.content.length > 100
          ? mem.content.slice(0, 100) + "..."
          : mem.content,
      level: "info",
      icon: "bot",
      time: timeLabel,
    });
  }

  return alerts;
}
