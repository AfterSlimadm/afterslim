"use client";

import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { Sparkline } from "@/components/ui/sparkline";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────── */

export type KpiVariant = "revenue" | "orders" | "avgOrder" | "pending";

interface KpiCardProps {
  variant: KpiVariant;
  title: string;
  value: string;
  numericValue?: number;
  trend: number;
  trendLabel?: string;
  sparkData?: number[];
  /** Show animated border beam on this card */
  highlight?: boolean;
  className?: string;
}

/* ── Variant config ─────────────────────────────────────── */

const VARIANT_CONFIG: Record<
  KpiVariant,
  {
    icon: LucideIcon;
    bgClass: string;
    iconClass: string;
    sparkColor: string;
    gradientColor: string;
  }
> = {
  revenue: {
    icon: DollarSign,
    bgClass: "bg-emerald-100",
    iconClass: "text-emerald-700",
    sparkColor: "#059669",
    gradientColor: "#059669",
  },
  orders: {
    icon: ShoppingCart,
    bgClass: "bg-[#c8e6ff]/40",
    iconClass: "text-[#00628c]",
    sparkColor: "#0091CC",
    gradientColor: "#0091CC",
  },
  avgOrder: {
    icon: TrendingUp,
    bgClass: "bg-amber-100",
    iconClass: "text-amber-700",
    sparkColor: "#d97706",
    gradientColor: "#d97706",
  },
  pending: {
    icon: AlertTriangle,
    bgClass: "bg-red-100",
    iconClass: "text-red-700",
    sparkColor: "#dc2626",
    gradientColor: "#dc2626",
  },
};

/* ── Sample spark data per variant ──────────────────────── */

const DEFAULT_SPARK: Record<KpiVariant, number[]> = {
  revenue: [12, 18, 15, 22, 28, 25, 32, 30, 35, 38, 42, 40],
  orders: [5, 8, 6, 10, 12, 9, 14, 11, 15, 13, 16, 18],
  avgOrder: [35, 38, 36, 40, 42, 39, 44, 41, 38, 43, 45, 42],
  pending: [8, 6, 7, 5, 4, 6, 3, 5, 4, 3, 5, 4],
};

/* ── Component ──────────────────────────────────────────── */

export function KpiCard({
  variant,
  title,
  value,
  numericValue,
  trend,
  trendLabel = "vs 30 dias",
  sparkData,
  highlight = false,
  className,
}: KpiCardProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const isPositive = trend >= 0;
  const data = sparkData ?? DEFAULT_SPARK[variant];

  return (
    <MagicCard
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/40 bg-card p-0",
        className
      )}
      gradientColor={`${config.gradientColor}08`}
      gradientSize={250}
    >
      {/* Accent line at top */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, ${config.gradientColor}20, transparent)`,
        }}
      />

      <div className="p-5">
        {/* Header: icon + title */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("icon-box-sm", config.bgClass)}>
            <Icon className={cn("h-4 w-4", config.iconClass)} />
          </div>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
            {title}
          </span>
        </div>

        {/* Value + Sparkline */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {numericValue !== undefined ? (
              <NumberTicker
                value={numericValue}
                className="text-2xl font-bold tracking-tight text-foreground"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tight">
                {value}
              </span>
            )}

            {/* Trend */}
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 trend-positive" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 trend-negative" />
              )}
              <span
                className={cn(
                  "font-semibold",
                  isPositive ? "trend-positive" : "trend-negative"
                )}
              >
                {isPositive ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground/70">{trendLabel}</span>
            </div>
          </div>

          {/* Sparkline */}
          <Sparkline
            data={data}
            color={config.sparkColor}
            height={36}
            width={100}
          />
        </div>
      </div>

      {/* Border beam for highlighted cards */}
      {highlight && (
        <BorderBeam
          size={120}
          duration={6}
          colorFrom={config.gradientColor}
          colorTo={`${config.gradientColor}40`}
        />
      )}
    </MagicCard>
  );
}
