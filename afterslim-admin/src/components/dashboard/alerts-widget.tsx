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
  type LucideIcon,
} from "lucide-react";
import type { DashboardAlert, AlertLevel } from "@/lib/queries/dashboard-charts";

/* ── Style mappings ─────────────────────────────────────── */

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
};

const ICON_MAP: Record<DashboardAlert["icon"], LucideIcon> = {
  package: Package,
  trophy: Trophy,
  bot: Bot,
};

/* ── Props ───────────────────────────────────────────────── */

interface AlertsWidgetProps {
  alerts: DashboardAlert[];
}

/* ── Component ──────────────────────────────────────────── */

export function AlertsWidget({ alerts }: AlertsWidgetProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas e Notificações</CardTitle>
          <CardDescription>Eventos recentes que precisam de atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            Nenhum alerta no momento
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas e Notificações</CardTitle>
        <CardDescription>Eventos recentes que precisam de atenção</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {alerts.map((alert) => {
            const style = LEVEL_STYLES[alert.level];
            const Icon = ICON_MAP[alert.icon];

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
