"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { CountUp } from "@/components/ui/count-up";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  FinanceSummary,
  CashFlowWeek,
  RevenueTrendDay,
  TopProduct,
} from "@/lib/queries/finance";

/* ── USD currency formatter ────────────────────────────────── */

function formatBRL(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/* ── Period selector config ─────────────────────────────────── */

const PERIODS = [
  { key: "today", label: "Hoje" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
] as const;

/* ── Mock transaction data (until real endpoint) ────────────── */

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    date: "01/04/2026",
    description: "Venda Shopify #4521",
    type: "VENDA" as const,
    valor: 297.0,
    status: "APROVADO" as const,
  },
  {
    id: "2",
    date: "01/04/2026",
    description: "Taxa Gateway - Stripe",
    type: "TAXA" as const,
    valor: -8.91,
    status: "PROCESSANDO" as const,
  },
  {
    id: "3",
    date: "31/03/2026",
    description: "Venda Hotmart #1187",
    type: "VENDA" as const,
    valor: 197.0,
    status: "CONCLUIDO" as const,
  },
  {
    id: "4",
    date: "31/03/2026",
    description: "Reembolso Pedido #4480",
    type: "REEMBOLSO" as const,
    valor: -297.0,
    status: "ANALISE" as const,
  },
  {
    id: "5",
    date: "30/03/2026",
    description: "Venda Direta - Site",
    type: "VENDA" as const,
    valor: 594.0,
    status: "APROVADO" as const,
  },
];

/* ── Channel data ───────────────────────────────────────────── */

const CHANNELS = [
  { name: "Shopify", pct: 65, color: "#00628c" },
  { name: "Hotmart", pct: 20, color: "#0091CC" },
  { name: "Direto", pct: 15, color: "#7dd3fc" },
];

/* ── Type & status badge maps ───────────────────────────────── */

const TYPE_STYLES: Record<string, string> = {
  VENDA: "bg-emerald-50 text-emerald-700",
  TAXA: "bg-amber-50 text-amber-700",
  REEMBOLSO: "bg-red-50 text-red-700",
};

const STATUS_STYLES: Record<string, string> = {
  APROVADO: "bg-emerald-50 text-emerald-700",
  PROCESSANDO: "bg-amber-50 text-amber-700",
  CONCLUIDO: "bg-sky-50 text-sky-700",
  ANALISE: "bg-yellow-50 text-yellow-700",
};

/* ── Props ───────────────────────────────────────────────────── */

interface FinanceContentProps {
  summary: FinanceSummary | null;
  cashFlow: CashFlowWeek[];
  revenueTrend: RevenueTrendDay[];
  topProducts: TopProduct[];
}

/* ── Page component ─────────────────────────────────────────── */

export default function FinanceContent({
  summary,
  revenueTrend,
}: FinanceContentProps) {
  const [period, setPeriod] = useState<string>("30d");

  const totalRevenue = summary?.totalIncome ?? 0;
  const totalExpenses = summary?.totalExpense ?? 0;
  const netRevenue = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netRevenue / totalRevenue) * 100 : 0;

  /* Filter chart data by selected period */
  const periodDays = period === "today" ? 1 : period === "7d" ? 7 : period === "90d" ? 90 : 30;

  const chartData = useMemo(() => {
    if (revenueTrend.length === 0) return [];
    const sliced = revenueTrend.slice(-periodDays);
    return sliced;
  }, [revenueTrend, periodDays]);

  return (
    <div className="page-container">
      {/* ── Page Header ──────────────────────────────────────── */}
      <BlurFade delay={0}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[2.25rem] font-bold tracking-tight text-foreground leading-none">
              Financeiro
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Relatorio detalhado de performance e saude financeira.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center rounded-lg bg-muted/50 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    period === p.key
                      ? "bg-white text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Relatorio
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-[#00628c] hover:bg-[#00496a] text-white"
            >
              <FileText className="h-4 w-4" />
              Ver Faturas
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* ── KPI Grid ─────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* RECEITA BRUTA */}
        <BlurFade delay={0.08}>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Receita Bruta
                </span>
              </div>
              <CountUp
                value={totalRevenue}
                format={(n) => formatBRL(n)}
                className="text-[2.25rem] font-bold tracking-tight leading-none text-foreground"
                delay={0.3}
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* RECEITA LIQUIDA */}
        <BlurFade delay={0.16}>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                  <TrendingUp className="h-4 w-4 text-sky-600" />
                </div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Receita Liquida
                </span>
              </div>
              <CountUp
                value={netRevenue}
                format={(n) => formatBRL(n)}
                className="text-[2.25rem] font-bold tracking-tight leading-none text-foreground"
                delay={0.4}
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <ArrowUpRight className="h-3 w-3" />
                  +8.2%
                </span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* CUSTOS */}
        <BlurFade delay={0.24}>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Custos
                </span>
              </div>
              <CountUp
                value={totalExpenses}
                format={(n) => formatBRL(n)}
                className="text-[2.25rem] font-bold tracking-tight leading-none text-foreground"
                delay={0.5}
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                  <ArrowDownRight className="h-3 w-3" />
                  -3.1%
                </span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* MARGEM */}
        <BlurFade delay={0.32}>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <Percent className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Margem
                </span>
              </div>
              <CountUp
                value={margin}
                format={(n) => `${n.toFixed(1)}%`}
                className="text-[2.25rem] font-bold tracking-tight leading-none text-foreground"
                delay={0.6}
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <ArrowUpRight className="h-3 w-3" />
                  +2.3pp
                </span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </div>

      {/* ── Charts Row (60/40) ───────────────────────────────── */}
      <BlurFade delay={0.4}>
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Area Chart - 60% */}
          <Card className="lg:col-span-3 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Desempenho de Receita ({period === "today" ? "Hoje" : period})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0091CC"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#0091CC"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) =>
                        `$${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        fontSize: 13,
                      }}
                      formatter={(value: number) => [
                        formatBRL(value),
                        "Receita",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0091CC"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Channel Breakdown - 40% */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Resumo por Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-5">
                {CHANNELS.map((ch) => (
                  <div key={ch.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {ch.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {ch.pct}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${ch.pct}%`,
                          backgroundColor: ch.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs uppercase tracking-wider font-semibold"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Config. Gateway
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* ── Transactions Table ───────────────────────────────── */}
      <BlurFade delay={0.5}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              Ultimas Transacoes
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="text-[#00628c] text-xs font-semibold p-0 h-auto"
            >
              Ver tudo
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/60">
                  <TableHead className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground">
                    Data
                  </TableHead>
                  <TableHead className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground">
                    Descricao
                  </TableHead>
                  <TableHead className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground">
                    Tipo
                  </TableHead>
                  <TableHead className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                    Valor
                  </TableHead>
                  <TableHead className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id} className="border-muted/40">
                    <TableCell className="text-sm text-muted-foreground">
                      {tx.date}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {tx.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold",
                          TYPE_STYLES[tx.type] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-sm font-mono font-medium",
                        tx.valor >= 0 ? "text-foreground" : "text-red-600"
                      )}
                    >
                      {formatBRL(Math.abs(tx.valor))}
                      {tx.valor < 0 && (
                        <span className="text-red-400 ml-0.5">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold",
                          STATUS_STYLES[tx.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {tx.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
