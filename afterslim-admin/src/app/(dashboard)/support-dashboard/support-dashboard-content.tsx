"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_CONFIG, SUPPORT_TASK_TYPE_CONFIG } from "@/lib/constants";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { GlowingCard } from "@/components/ui/glowing-card";
import {
  Clock,
  Truck,
  ClipboardCheck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { OrderStatus, SupportTaskType } from "@/lib/types";

/* ── Types ─────────────────────────────────────────────── */

interface SupportDashboardContentProps {
  displayName: string;
  kpis: {
    pendingOrders: number;
    toShipToday: number;
    openTasks: number;
  };
  recentOrders: {
    id: string;
    order_number?: string;
    status: string;
    total: number;
    created_at: string;
    customer_name: string;
  }[];
  pendingTasks: {
    id: string;
    task_type: string;
    description: string | null;
    order_id: string | null;
    order_number: string | null;
    created_at: string;
    is_completed: boolean;
  }[];
}

/* ── Helpers ───────────────────────────────────────────── */

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Component ─────────────────────────────────────────── */

export default function SupportDashboardContent({
  displayName,
  kpis,
  recentOrders,
  pendingTasks: initialTasks,
}: SupportDashboardContentProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleCompleteTask(taskId: string) {
    try {
      const res = await fetch(`/api/support-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: true }),
      });
      if (!res.ok) throw new Error("Failed");
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task completed");
    } catch {
      toast.error("Failed to complete task");
    }
  }

  return (
    <div className="space-y-0">
      {/* ── Greeting Section ──────────────────────────── */}
      <section className="relative px-8 lg:px-12 py-10 -mx-5 -mt-5 lg:-mx-8 lg:-mt-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E2E]/[0.04] to-[#0091CC]/[0.03]" />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary mb-2">
              Support Overview
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {displayName}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </section>

      {/* ── KPI Cards ─────────────────────────────────── */}
      <section className="px-0 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KpiCard
            label="Pending Orders"
            value={kpis.pendingOrders}
            icon={<Clock className="h-6 w-6" />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            glowColor="rgba(217, 119, 6, 0.1)"
          />
          <KpiCard
            label="To Ship Today"
            value={kpis.toShipToday}
            icon={<Truck className="h-6 w-6" />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            glowColor="rgba(0, 145, 204, 0.12)"
          />
          <KpiCard
            label="Open Support Tasks"
            value={tasks.length}
            icon={<ClipboardCheck className="h-6 w-6" />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            glowColor="rgba(234, 88, 12, 0.1)"
          />
        </div>
      </section>

      {/* ── Main Grid: Orders + Tasks ─────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* LEFT: Recent Orders (7/12) */}
        <div className="lg:col-span-7 rounded-xl bg-card p-6 lg:p-8 shadow-[0_10px_30px_-10px_rgba(25,28,29,0.06)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-semibold tracking-tight">
              Recent Orders
            </h2>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-6 lg:-mx-8 px-6 lg:px-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-muted/60">
                  <th className="pb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                    Order
                  </th>
                  <th className="pb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                    Customer
                  </th>
                  <th className="pb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground hidden sm:table-cell">
                    Date
                  </th>
                  <th className="pb-3 text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="group border-b border-transparent hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          #{order.order_number ?? `AS-${order.id.slice(-4)}`}
                        </Link>
                      </td>
                      <td className="py-4">{order.customer_name}</td>
                      <td className="py-4">
                        <OrderStatusBadge status={order.status as OrderStatus} />
                      </td>
                      <td className="py-4 text-muted-foreground hidden sm:table-cell">
                        {formatShortDate(order.created_at)}
                      </td>
                      <td className="py-4 text-right font-semibold tabular-nums">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Support Tasks (5/12) */}
        <div className="lg:col-span-5 rounded-xl bg-card p-6 lg:p-8 shadow-[0_10px_30px_-10px_rgba(25,28,29,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold tracking-tight">
              My Support Tasks
            </h2>
            {tasks.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[0.6875rem] font-bold text-primary-foreground">
                {tasks.length} Active
              </span>
            )}
          </div>

          <div className="space-y-1">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">All caught up</p>
                <p className="text-xs mt-1">No pending tasks right now.</p>
              </div>
            ) : (
              tasks.map((task) => {
                const config = SUPPORT_TASK_TYPE_CONFIG[task.task_type as SupportTaskType];
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/40 transition-all group"
                  >
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-muted-foreground/30 text-transparent hover:border-primary hover:text-primary transition-colors"
                      title="Mark as complete"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold truncate">
                          {config?.label ?? task.task_type}
                        </p>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <p className="text-[0.6875rem] font-bold text-muted-foreground/60 mt-1.5 uppercase tracking-tight">
                        {formatRelativeTime(task.created_at)}
                        {task.order_id && (
                          <span>
                            {" "}
                            &middot;{" "}
                            <Link
                              href={`/orders/${task.order_id}`}
                              className="text-primary hover:underline"
                            >
                              Order #{task.order_number ?? task.order_id?.slice(-4) ?? ""}
                            </Link>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {tasks.length > 0 && (
            <Link
              href="/support-tasks"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/40 transition-colors"
            >
              View All Tasks
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="flex justify-center pt-12 pb-4">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">
          Powered by AfterSlim
        </p>
      </footer>
    </div>
  );
}

/* ── KPI Card ──────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  glowColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  glowColor?: string;
}) {
  return (
    <GlowingCard
      className="bg-card shadow-[0_10px_30px_-10px_rgba(25,28,29,0.06)]"
      glowColor={glowColor}
    >
      <div className="flex items-center justify-between p-7">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-muted-foreground mb-1">
            {label}
          </p>
          <AnimatedNumber
            value={value}
            className="text-[2.5rem] font-medium leading-none tracking-tight tabular-nums"
            stiffness={80}
            damping={25}
          />
        </div>
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </GlowingCard>
  );
}
