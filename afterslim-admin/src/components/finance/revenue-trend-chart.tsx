"use client";

import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

/* -- Chart config ----------------------------------------------- */

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

/* -- Props ------------------------------------------------------ */

interface RevenueTrendChartProps {
  data: { date: string; revenue: number }[];
}

/* -- Component -------------------------------------------------- */

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Receita</CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <TrendingUp className="h-10 w-10" />
            <p className="text-sm">Nenhum dado de receita ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Receita</CardTitle>
        <CardDescription>
          Últimos {data.length} dias &mdash; Total:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(totalRevenue)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="fillRevenueTrend" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `R$${(value / 1000).toFixed(1)}k`
              }
              width={48}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-revenue)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => {
                    const numValue =
                      typeof value === "number" ? value : Number(value);
                    return (
                      <span className="font-mono font-medium">
                        {formatCurrency(numValue)}
                      </span>
                    );
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="url(#fillRevenueTrend)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
