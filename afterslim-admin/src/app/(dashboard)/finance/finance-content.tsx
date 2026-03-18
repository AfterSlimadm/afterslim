"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
  ArrowRight,
  Receipt,
  Target,
  FileText,
  Package,
} from "lucide-react";
import { CashFlowChart } from "@/components/finance/cash-flow-chart";
import { RevenueTrendChart } from "@/components/finance/revenue-trend-chart";
import type {
  FinanceSummary,
  CashFlowWeek,
  RevenueTrendDay,
  TopProduct,
} from "@/lib/queries/finance";

/* -- Quick link config ------------------------------------------ */

const QUICK_LINKS = [
  {
    title: "Transações",
    description: "Visualize receitas e despesas",
    href: "/finance/transactions",
    icon: Receipt,
  },
  {
    title: "Metas Financeiras",
    description: "Acompanhe metas de receita e gastos",
    href: "/finance/goals",
    icon: Target,
  },
  {
    title: "Registros Fiscais",
    description: "Impostos coletados por estado",
    href: "/finance/tax",
    icon: FileText,
  },
];

/* -- KPI Card sub-component ------------------------------------- */

function FinanceKpiCard({
  title,
  value,
  trend,
  icon: Icon,
  bgClass,
  iconClass,
  isCurrency = true,
  isPercent = false,
}: {
  title: string;
  value: number;
  trend: number;
  icon: React.ElementType;
  bgClass: string;
  iconClass: string;
  isCurrency?: boolean;
  isPercent?: boolean;
}) {
  const isPositive = trend >= 0;

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`icon-box-sm ${bgClass}`}>
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </CardHeader>
      <CardContent className="pb-5 px-5">
        <div className="text-2xl font-bold tracking-tight">
          {isCurrency
            ? formatCurrency(value)
            : isPercent
            ? `${value.toFixed(1)}%`
            : value.toLocaleString()}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 trend-positive" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 trend-negative" />
          )}
          <span
            className={
              isPositive
                ? "font-medium trend-positive"
                : "font-medium trend-negative"
            }
          >
            {isPositive ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs últimos 30 dias</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* -- Props ------------------------------------------------------ */

interface FinanceContentProps {
  summary: FinanceSummary | null;
  cashFlow: CashFlowWeek[];
  revenueTrend: RevenueTrendDay[];
  topProducts: TopProduct[];
}

/* -- Page component --------------------------------------------- */

export default function FinanceContent({
  summary,
  cashFlow,
  revenueTrend,
  topProducts,
}: FinanceContentProps) {
  const totalRevenue = summary?.totalIncome ?? 0;
  const totalExpenses = summary?.totalExpense ?? 0;
  const netProfit = summary?.netProfit ?? 0;
  const profitMargin =
    totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Trends need historical comparison, currently 0 (future improvement)
  const revenueTrendPct = 0;
  const expensesTrend = 0;
  const profitTrend = 0;
  const marginTrend = 0;

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Financeiro</h1>
        <p className="page-description">
          Acompanhe receitas, despesas, margens de lucro e metas financeiras.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <FinanceKpiCard
          title="Receita Total"
          value={totalRevenue}
          trend={revenueTrendPct}
          icon={DollarSign}
          bgClass="bg-emerald-100 dark:bg-emerald-900/30"
          iconClass="text-emerald-700 dark:text-emerald-400"
        />
        <FinanceKpiCard
          title="Despesas Totais"
          value={totalExpenses}
          trend={expensesTrend}
          icon={TrendingDown}
          bgClass="bg-red-100 dark:bg-red-900/30"
          iconClass="text-red-700 dark:text-red-400"
        />
        <FinanceKpiCard
          title="Lucro Líquido"
          value={netProfit}
          trend={profitTrend}
          icon={TrendingUp}
          bgClass="bg-blue-100 dark:bg-blue-900/30"
          iconClass="text-blue-700 dark:text-blue-400"
        />
        <FinanceKpiCard
          title="Margem de Lucro"
          value={profitMargin}
          trend={marginTrend}
          icon={Percent}
          bgClass="bg-amber-100 dark:bg-amber-900/30"
          iconClass="text-amber-700 dark:text-amber-400"
          isCurrency={false}
          isPercent
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CashFlowChart data={cashFlow} />
        <RevenueTrendChart data={revenueTrend} />
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos por Receita</CardTitle>
          <CardDescription>
            Produtos mais vendidos nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <Package className="h-10 w-10" />
              <p className="text-sm">Nenhum dado de vendas ainda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Produto</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                  <TableHead className="text-right">Preço Médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.units.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.avgPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Card key={link.href} className="transition-colors hover:bg-muted/50">
            <Link href={link.href} className="block">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="icon-box bg-primary/10">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{link.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {link.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex justify-end pb-4">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <span>
                    Ver <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
