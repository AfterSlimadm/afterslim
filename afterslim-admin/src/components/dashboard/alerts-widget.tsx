"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Trophy,
  Bot,
  Package,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ── Alert type definitions ─────────────────────────────── */

type AlertLevel = "warning" | "success" | "info" | "neutral";

interface Alert {
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
  icon: LucideIcon;
  time: string;
}

const LEVEL_STYLES: Record<AlertLevel, { dot: string; iconClass: string }> = {
  warning: {
    dot: "bg-amber-500",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  success: {
    dot: "bg-emerald-500",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  info: {
    dot: "bg-blue-500",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  neutral: {
    dot: "bg-gray-400",
    iconClass: "text-gray-500 dark:text-gray-400",
  },
};

/* ── Mock alerts ────────────────────────────────────────── */

const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    title: "Low Stock Warning",
    description: "AfterSlim 30-Day Supply is below 15 units",
    level: "warning",
    icon: Package,
    time: "12 min ago",
  },
  {
    id: "2",
    title: "Monthly Goal Reached",
    description: "February revenue target of $25,000 achieved!",
    level: "success",
    icon: Trophy,
    time: "2 hours ago",
  },
  {
    id: "3",
    title: "New Idea from After",
    description: "Customer feedback suggests a sleep supplement line",
    level: "info",
    icon: Bot,
    time: "4 hours ago",
  },
  {
    id: "4",
    title: "Inventory Restocked",
    description: "60 units of Detox Bundle received from supplier",
    level: "neutral",
    icon: Package,
    time: "6 hours ago",
  },
  {
    id: "5",
    title: "Sales Spike Detected",
    description: "Orders up 45% in the last 2 hours from Instagram ad",
    level: "success",
    icon: TrendingUp,
    time: "8 hours ago",
  },
  {
    id: "6",
    title: "Shipping Delay",
    description: "Carrier reports 1-2 day delays in the Southeast region",
    level: "warning",
    icon: AlertTriangle,
    time: "Yesterday",
  },
];

/* ── Component ──────────────────────────────────────────── */

export function AlertsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
        <CardDescription>Recent events requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {MOCK_ALERTS.map((alert) => {
            const style = LEVEL_STYLES[alert.level];
            const Icon = alert.icon;

            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                {/* Icon */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                  <Icon className={cn("h-4 w-4", style.iconClass)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)}
                    />
                    <p className="text-sm font-medium leading-none">
                      {alert.title}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {alert.time}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
