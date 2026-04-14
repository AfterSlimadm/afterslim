"use client";

import { useMemo } from "react";
import type { ChannelMetrics } from "@/lib/queries/sales-channels";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

/* -- Channel config ------------------------------------------- */

const CHANNEL_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  website: { label: "Website", icon: Globe, color: "badge-success" },
  amazon: { label: "Amazon", icon: ShoppingBag, color: "badge-warning" },
  other: { label: "Outro", icon: Globe, color: "badge-neutral" },
};

function getChannelConfig(channel: string) {
  return CHANNEL_CONFIG[channel] ?? CHANNEL_CONFIG.other;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/* -- Props ---------------------------------------------------- */

interface SalesChannelsContentProps {
  metrics: ChannelMetrics[];
}

/* -- Component ------------------------------------------------ */

export default function SalesChannelsContent({
  metrics,
}: SalesChannelsContentProps) {
  const totals = useMemo(() => {
    const totalOrders = metrics.reduce((s, m) => s + m.orders, 0);
    const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalOrders, totalRevenue, avgOrder };
  }, [metrics]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Canais de Venda</h1>
        <p className="page-description">
          Métricas de receita e pedidos por canal. Website e Amazon.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">
              {formatCurrency(totals.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Todos os canais
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pedidos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{totals.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.length} canais ativos
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">
              {formatCurrency(totals.avgOrder)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel breakdown */}
      {metrics.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag />
          <p className="font-medium">Nenhum pedido registrado ainda</p>
          <p className="text-sm">
            Quando os pedidos comecarem a entrar, as metricas por canal aparecem aqui.
          </p>
        </div>
      ) : (
        <>
          {/* Channel cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics
              .sort((a, b) => b.revenue - a.revenue)
              .map((m) => {
                const config = getChannelConfig(m.channel);
                const Icon = config.icon;
                const pct =
                  totals.totalRevenue > 0
                    ? ((m.revenue / totals.totalRevenue) * 100).toFixed(1)
                    : "0";

                return (
                  <Card key={m.channel}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {config.label}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${config.color}`}
                          >
                            {pct}% da receita
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold">
                            {formatCurrency(m.revenue)}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            Receita
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{m.orders}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            Pedidos
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">
                            {formatCurrency(m.avg_order)}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            Ticket
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Detailed table */}
          <Card>
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-sm font-medium">
                Detalhamento por Canal
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CANAL</TableHead>
                    <TableHead className="text-right">PEDIDOS</TableHead>
                    <TableHead className="text-right">RECEITA</TableHead>
                    <TableHead className="text-right">TICKET MEDIO</TableHead>
                    <TableHead className="text-right">% RECEITA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((m) => {
                      const config = getChannelConfig(m.channel);
                      const pct =
                        totals.totalRevenue > 0
                          ? ((m.revenue / totals.totalRevenue) * 100).toFixed(1)
                          : "0";

                      return (
                        <TableRow key={m.channel}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`text-[10px] ${config.color}`}
                              >
                                {config.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {m.orders}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(m.revenue)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(m.avg_order)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {pct}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
