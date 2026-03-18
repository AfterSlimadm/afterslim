"use client";

import { cn, formatCurrency, safeNumber } from "@/lib/utils";
import type { FinancialGoal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* -- Helpers ---------------------------------------------------- */

function getGoalStatus(percentage: number, daysRemaining: number, totalDays: number) {
  const timeElapsedRatio = 1 - daysRemaining / totalDays;
  const progressRatio = percentage / 100;

  // If progress is ahead of time elapsed, on track
  if (progressRatio >= timeElapsedRatio * 0.85) {
    return { label: "No Caminho", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" };
  }
  // If progress is somewhat behind
  if (progressRatio >= timeElapsedRatio * 0.6) {
    return { label: "Atrasado", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
  }
  // Significantly behind
  return { label: "Em Risco", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
}

function getDaysRemaining(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTotalDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const PERIOD_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual",
};

/* -- Component -------------------------------------------------- */

interface GoalCardProps {
  goal: FinancialGoal;
  className?: string;
}

export function GoalCard({ goal, className }: GoalCardProps) {
  const currentAmount = safeNumber(goal.current_amount);
  const targetAmount = safeNumber(goal.target_amount);
  const percentage = targetAmount > 0
    ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
    : 0;
  const daysRemaining = getDaysRemaining(goal.end_date);
  const totalDays = getTotalDays(goal.start_date, goal.end_date);
  const status = getGoalStatus(percentage, daysRemaining, totalDays);

  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-3 pt-5">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            {goal.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {PERIOD_LABELS[goal.period] ?? goal.period}
            </Badge>
            <Badge className={cn("text-xs border-0", status.color)}>
              {status.label}
            </Badge>
          </div>
        </div>
        <span className="text-2xl font-bold tabular-nums">
          {percentage}%
        </span>
      </CardHeader>
      <CardContent className="pb-5 space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                percentage >= 75
                  ? "bg-emerald-500"
                  : percentage >= 50
                  ? "bg-blue-500"
                  : percentage >= 25
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(currentAmount)}
            </span>
            <span className="font-medium">
              {formatCurrency(targetAmount)}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Restante: {formatCurrency(Math.max(0, targetAmount - currentAmount))}
          </span>
          <span suppressHydrationWarning>
            {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"} restantes
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
