export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import SupportDashboardContent from "./support-dashboard-content";

async function getSupportDashboardData(userId: string) {
  const supabase = getAdminClient();

  const [ordersRes, pendingTasksRes, recentOrdersRes] = await Promise.all([
    // Order counts by status
    supabase.from("orders").select("status"),
    // Pending support tasks (filtered by current user)
    supabase
      .from("support_tasks")
      .select("*, admin_user:admin_users!admin_user_id(display_name), order:orders!order_id(order_number)")
      .eq("is_completed", false)
      .eq("admin_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    // Recent orders for the table
    supabase
      .from("orders")
      .select("id, order_number, status, total_cents, created_at, email, shipping_address, profile:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const orders = ordersRes.data ?? [];
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const toShipToday = orders.filter(
    (o) => o.status === "confirmed" || o.status === "processing"
  ).length;

  return {
    kpis: {
      pendingOrders,
      toShipToday,
      openTasks: pendingTasksRes.data?.length ?? 0,
    },
    recentOrders: (recentOrdersRes.data ?? []).map((o) => {
      const raw = o.profile as unknown;
      const addr = o.shipping_address as Record<string, string> | null;
      let customerName = "Unknown";
      if (Array.isArray(raw) && raw.length > 0 && (raw[0] as Record<string,string>)?.full_name) {
        customerName = (raw[0] as Record<string,string>).full_name;
      } else if (raw && typeof raw === "object" && !Array.isArray(raw) && (raw as Record<string, string>).full_name) {
        customerName = (raw as Record<string, string>).full_name;
      } else if (addr?.name) {
        customerName = addr.name;
      } else if (o.email) {
        customerName = o.email as string;
      }
      return {
        id: o.id,
        order_number: o.order_number ?? undefined,
        status: o.status,
        total: Number(o.total_cents ?? 0) / 100,
        created_at: o.created_at,
        customer_name: customerName,
      };
    }),
    pendingTasks: (pendingTasksRes.data ?? []).map((t) => {
      const orderRaw = t.order as Record<string, string> | null;
      const orderNumber = orderRaw?.order_number ?? null;
      return {
        id: t.id,
        task_type: t.task_type,
        description: t.description,
        order_id: t.order_id,
        order_number: orderNumber,
        created_at: t.created_at,
        is_completed: t.is_completed,
      };
    }),
  };
}

export default async function SupportDashboardPage() {
  const admin = await requireAuth("/support-dashboard");
  const data = await getSupportDashboardData(admin.id);

  return (
    <SupportDashboardContent
      displayName={admin.display_name}
      kpis={data.kpis}
      recentOrders={data.recentOrders}
      pendingTasks={data.pendingTasks}
    />
  );
}
