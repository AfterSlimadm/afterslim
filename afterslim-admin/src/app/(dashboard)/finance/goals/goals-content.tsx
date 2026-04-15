"use client";

import { useState, useMemo } from "react";
import type { FinancialGoal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Target } from "lucide-react";
import { GoalCard } from "@/components/finance/goal-card";
import { safeNumber } from "@/lib/utils";
import type { FinancialGoalRow } from "@/lib/queries/finance";

/* -- Map DB row to front-end FinancialGoal type --------------- */

/**
 * Derive a sensible default end_date when the DB value is null.
 * Uses the goal's period to project forward from start_date (or created_at).
 */
function deriveEndDate(row: FinancialGoalRow): string {
  if (row.end_date) return row.end_date;

  const base = row.start_date ?? row.created_at;
  const d = new Date(base);

  switch (row.period) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "monthly":
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }

  return d.toISOString();
}

function mapRowToGoal(row: FinancialGoalRow): FinancialGoal {
  // Use safeNumber to guarantee finite values (handles null, undefined, NaN).
  // Also check for target_amount / current_amount in case DB columns differ.
  const raw = row as unknown as Record<string, unknown>;
  const target = safeNumber(raw.target ?? raw.target_amount);
  const current = safeNumber(raw.current ?? raw.current_amount);

  return {
    id: row.id,
    name: row.name,
    target_amount: target,
    current_amount: current,
    period: (row.period as FinancialGoal["period"]) || "monthly",
    start_date: row.start_date ?? row.created_at,
    end_date: deriveEndDate(row),
    is_active: row.active,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

/* -- Props ------------------------------------------------------ */

interface GoalsContentProps {
  goalRows: FinancialGoalRow[];
}

/* -- Component -------------------------------------------------- */

export default function GoalsContent({ goalRows }: GoalsContentProps) {
  const goals = useMemo(() => goalRows.map(mapRowToGoal), [goalRows]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeGoals = goals.filter((g) => g.is_active);

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="page-header">
          <h1 className="page-title">
            Metas Financeiras
          </h1>
          <p className="page-description">
            Defina metas e acompanhe o progresso de receita, despesas e
            métricas-chave.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Criar Meta Financeira</DialogTitle>
              <DialogDescription>
                Defina uma nova meta para suas métricas de negócio.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Nome da Meta</Label>
                <Input
                  id="goal-name"
                  placeholder="Ex: Meta de Receita Mensal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-target">Valor da Meta</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="goal-period">Período</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="goal-period">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-start">Data Início</Label>
                  <Input id="goal-start" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="goal-end">Data Fim</Label>
                  <Input id="goal-end" type="date" />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => setDialogOpen(false)}
              >
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="icon-box bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Visão Geral das Metas</CardTitle>
            <CardDescription>
              {activeGoals.length} metas ativas &ndash;{" "}
              {activeGoals.filter((g) => {
                const pct = g.target_amount > 0
                  ? (g.current_amount / g.target_amount) * 100
                  : 0;
                return pct >= 70;
              }).length}{" "}
              no caminho
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Goals grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {activeGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {activeGoals.length === 0 && (
        <div className="empty-state">
          <Target />
          <p className="font-medium">Nenhuma meta ativa</p>
          <p className="text-sm">
            Crie uma meta para começar a acompanhar seus objetivos financeiros.
          </p>
        </div>
      )}
    </div>
  );
}
