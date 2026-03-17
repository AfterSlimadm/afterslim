export const dynamic = "force-dynamic";

import { getDashboardStats } from "@/lib/queries/dashboard";
import {
  getRevenueByDay,
  getRecentOrders,
  generateAlerts,
} from "@/lib/queries/dashboard-charts";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  let stats = null;
  let revenueData: Awaited<ReturnType<typeof getRevenueByDay>> = [];
  let recentOrders: Awaited<ReturnType<typeof getRecentOrders>> = [];
  let alerts: Awaited<ReturnType<typeof generateAlerts>> = [];

  try {
    [stats, revenueData, recentOrders, alerts] = await Promise.all([
      getDashboardStats(),
      getRevenueByDay(30),
      getRecentOrders(5),
      generateAlerts(),
    ]);
  } catch (error) {
    console.error("[DashboardPage] Failed to fetch dashboard data:", error);
  }

  return (
    <DashboardContent
      stats={stats}
      revenueData={revenueData}
      recentOrders={recentOrders}
      alerts={alerts}
    />
  );
}
