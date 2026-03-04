"use client";

import { formatCurrency } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import type { DashboardStats } from "@/lib/queries/dashboard";

/* ── Fallback mock KPI data ────────────────────────────────── */

const MOCK_KPI_DATA = {
  revenue: { value: 32847.5, trend: 12.5 },
  orders: { value: 284, trend: 8.3 },
  avgOrder: { value: 115.66, trend: 3.8 },
  pending: { value: 12, trend: -15.2 },
};

/* ── Props ─────────────────────────────────────────────────── */

interface DashboardContentProps {
  stats: DashboardStats | null;
}

/* ── Component ─────────────────────────────────────────────── */

export default function DashboardContent({ stats }: DashboardContentProps) {
  // When stats were fetched successfully, always use real data (even if zero).
  // Only fall back to mock when the fetch failed entirely (stats === null).
  const hasRealData = stats != null;

  const revenue = hasRealData ? stats.totalRevenue : MOCK_KPI_DATA.revenue.value;
  const ordersCount = hasRealData ? stats.ordersCount : MOCK_KPI_DATA.orders.value;
  const avgOrder =
    hasRealData && stats.ordersCount > 0
      ? stats.totalRevenue / stats.ordersCount
      : hasRealData
        ? 0
        : MOCK_KPI_DATA.avgOrder.value;
  const lowStock = hasRealData ? stats.lowStockCount : MOCK_KPI_DATA.pending.value;

  // Trends are not available from the query (would need historical comparison),
  // so we use a placeholder 0 when real data is present, mock values otherwise.
  const revenueTrend = hasRealData ? 0 : MOCK_KPI_DATA.revenue.trend;
  const ordersTrend = hasRealData ? 0 : MOCK_KPI_DATA.orders.trend;
  const avgOrderTrend = hasRealData ? 0 : MOCK_KPI_DATA.avgOrder.trend;
  const lowStockTrend = hasRealData ? 0 : MOCK_KPI_DATA.pending.trend;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your AfterSlim business.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          variant="revenue"
          title="Total Revenue"
          value={formatCurrency(revenue)}
          trend={revenueTrend}
        />
        <KpiCard
          variant="orders"
          title="Total Orders"
          value={ordersCount.toLocaleString()}
          trend={ordersTrend}
        />
        <KpiCard
          variant="avgOrder"
          title="Avg. Order Value"
          value={formatCurrency(avgOrder)}
          trend={avgOrderTrend}
        />
        <KpiCard
          variant="pending"
          title="Low Stock Items"
          value={lowStock.toString()}
          trend={lowStockTrend}
        />
      </div>

      {/* Revenue chart + Alerts side by side */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <AlertsWidget />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
