"use client";

import { formatCurrency } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import type { DashboardStats } from "@/lib/queries/dashboard";
import type {
  RevenueDataPoint,
  RecentOrder,
  DashboardAlert,
} from "@/lib/queries/dashboard-charts";

/* ── Props ─────────────────────────────────────────────────── */

interface DashboardContentProps {
  stats: DashboardStats | null;
  revenueData: RevenueDataPoint[];
  recentOrders: RecentOrder[];
  alerts: DashboardAlert[];
}

/* ── Component ─────────────────────────────────────────────── */

export default function DashboardContent({
  stats,
  revenueData,
  recentOrders,
  alerts,
}: DashboardContentProps) {
  const revenue = stats?.totalRevenue ?? 0;
  const ordersCount = stats?.ordersCount ?? 0;
  const avgOrder = ordersCount > 0 ? revenue / ordersCount : 0;
  const lowStock = stats?.lowStockCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio AfterSlim.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          variant="revenue"
          title="Receita Total"
          value={formatCurrency(revenue)}
          trend={0}
        />
        <KpiCard
          variant="orders"
          title="Total de Pedidos"
          value={ordersCount.toLocaleString()}
          trend={0}
        />
        <KpiCard
          variant="avgOrder"
          title="Ticket Médio"
          value={formatCurrency(avgOrder)}
          trend={0}
        />
        <KpiCard
          variant="pending"
          title="Estoque Baixo"
          value={lowStock.toString()}
          trend={0}
        />
      </div>

      {/* Revenue chart + Alerts side by side */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-2">
          <AlertsWidget alerts={alerts} />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
