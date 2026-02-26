"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  type LucideIcon,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────── */

export type KpiVariant = "revenue" | "orders" | "avgOrder" | "pending";

interface KpiCardProps {
  variant: KpiVariant;
  title: string;
  value: string;
  trend: number; // percentage change vs previous period (positive = up)
  trendLabel?: string;
  className?: string;
}

/* ── Variant config ─────────────────────────────────────── */

const VARIANT_CONFIG: Record<
  KpiVariant,
  { icon: LucideIcon; bgClass: string; iconClass: string }
> = {
  revenue: {
    icon: DollarSign,
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
  orders: {
    icon: ShoppingCart,
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-700 dark:text-blue-400",
  },
  avgOrder: {
    icon: TrendingUp,
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    iconClass: "text-amber-700 dark:text-amber-400",
  },
  pending: {
    icon: Clock,
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-700 dark:text-purple-400",
  },
};

/* ── Component ──────────────────────────────────────────── */

export function KpiCard({
  variant,
  title,
  value,
  trend,
  trendLabel = "vs last 30 days",
  className,
}: KpiCardProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const isPositive = trend >= 0;

  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            config.bgClass
          )}
        >
          <Icon className={cn("h-4 w-4", config.iconClass)} />
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          )}
          <span
            className={cn(
              "font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
