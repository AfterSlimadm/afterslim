"use client";

import { useMemo } from "react";
import { formatCurrency, createSeededRandom } from "@/lib/utils";
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

/* -- Mock data generator ---------------------------------------- */

function generateRevenueTrendData() {
  const data: { date: string; revenue: number }[] = [];
  const today = new Date();
  // Use a seed based on today's date so server and client produce the same data
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const random = createSeededRandom(seed + 7); // offset from dashboard chart seed

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // ~$1,000/day base revenue for a ~$30k/month supplement business
    const baseRevenue = 1000 + Math.sin(i * 0.3) * 300;
    const dayOfWeek = date.getDay();
    // Weekends have slightly higher sales
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 250 : 0;
    const noise = (random() - 0.5) * 400;
    const revenue = Math.max(300, Math.round(baseRevenue + weekendBoost + noise));

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue,
    });
  }

  return data;
}

/* -- Chart config ----------------------------------------------- */

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

/* -- Component -------------------------------------------------- */

export function RevenueTrendChart() {
  const data = useMemo(() => generateRevenueTrendData(), []);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          Last 30 days &mdash; Total:{" "}
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
                `$${(value / 1000).toFixed(1)}k`
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
