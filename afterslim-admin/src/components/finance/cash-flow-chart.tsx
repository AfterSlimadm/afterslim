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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

/* -- Mock data generator ---------------------------------------- */

function generateCashFlowData() {
  const data: { week: string; income: number; expense: number }[] = [];
  const today = new Date();
  // Use a seed based on today's date so server and client produce the same data
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const random = createSeededRandom(seed + 13); // offset from other chart seeds

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - i * 7);

    const weekLabel = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // ~$7,500/week revenue with variance, expenses ~40-55% of revenue
    const baseIncome = 7500 + Math.sin(i * 0.5) * 1500;
    const incomeNoise = (random() - 0.5) * 2000;
    const income = Math.max(4000, Math.round(baseIncome + incomeNoise));

    const expenseRatio = 0.4 + random() * 0.15;
    const expense = Math.round(income * expenseRatio);

    data.push({ week: weekLabel, income, expense });
  }

  return data;
}

/* -- Chart config ----------------------------------------------- */

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--color-chart-1)",
  },
  expense: {
    label: "Expenses",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig;

/* -- Component -------------------------------------------------- */

export function CashFlowChart() {
  const data = useMemo(() => generateCashFlowData(), []);

  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>
          Last 8 weeks &mdash; Net:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(totalIncome - totalExpense)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              width={48}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
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
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
