"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Package,
  BarChart3,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import type { DashboardStats } from "@/lib/queries/dashboard";
import type {
  RevenueDataPoint,
  RecentOrder,
  DashboardAlert,
} from "@/lib/queries/dashboard-charts";

interface DashboardContentProps {
  stats: DashboardStats | null;
  revenueData: RevenueDataPoint[];
  recentOrders: RecentOrder[];
  alerts: DashboardAlert[];
}

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

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateRange = `${startOfMonth.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} - ${today.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="page-container">
      {/* Page header */}
      <BlurFade delay={0}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="page-header">
            <h1 className="text-[1.75rem] font-semibold tracking-tight text-[#141d24]">
              Dashboard
            </h1>
            <p className="text-sm text-[#40484e]">
              Visao geral do seu negocio AfterSlim
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#ecf5ff] px-3 py-1.5 text-sm text-[#40484e]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span className="font-medium">{dateRange}</span>
          </div>
        </div>
      </BlurFade>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <BlurFade delay={0.1}>
          <KpiCard
            variant="revenue"
            title="Receita Total"
            value={formatCurrency(revenue)}
            numericValue={revenue}
            trend={12.5}
            trendLabel="vs mes anterior"
          />
        </BlurFade>
        <BlurFade delay={0.15}>
          <KpiCard
            variant="orders"
            title="Total de Pedidos"
            value={ordersCount.toLocaleString("pt-BR")}
            numericValue={ordersCount}
            trend={8.2}
            trendLabel="vs mes anterior"
          />
        </BlurFade>
        <BlurFade delay={0.2}>
          <KpiCard
            variant="avgOrder"
            title="Ticket Medio"
            value={formatCurrency(avgOrder)}
            numericValue={avgOrder}
            trend={-1.5}
            trendLabel="vs mes anterior"
          />
        </BlurFade>
        <BlurFade delay={0.25}>
          <KpiCard
            variant="pending"
            title="Estoque Baixo"
            value={lowStock.toString()}
            numericValue={lowStock}
            trend={0}
            highlight={lowStock > 0}
          />
        </BlurFade>
      </div>

      {/* Revenue chart + Alerts (60/40 split like Stitch) */}
      <BlurFade delay={0.3}>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart data={revenueData} />
          </div>
          <div className="lg:col-span-2">
            <AlertsWidget alerts={alerts} />
          </div>
        </div>
      </BlurFade>

      {/* Recent Orders */}
      <BlurFade delay={0.4}>
        <RecentOrders orders={recentOrders} />
      </BlurFade>

      {/* Quick action footer links (match Stitch) */}
      <BlurFade delay={0.5}>
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#c0c7cf26] pt-6">
          <Button variant="ghost" size="sm" className="gap-2 text-[#40484e]" asChild>
            <Link href="/orders">
              <FileText className="h-4 w-4" />
              Ver Todos os Pedidos
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-[#40484e]" asChild>
            <Link href="/inventory">
              <Package className="h-4 w-4" />
              Gerenciar Estoque
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-[#40484e]" asChild>
            <Link href="/finance">
              <BarChart3 className="h-4 w-4" />
              Relatorio Financeiro
            </Link>
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}
