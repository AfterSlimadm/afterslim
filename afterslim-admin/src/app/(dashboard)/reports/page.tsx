"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

type ReportPeriod = "7d" | "30d" | "90d" | "ytd";

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  ytd: "Year to Date",
};

interface SalesRow {
  product: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  costOfGoods: number;
  profit: number;
}

const MOCK_SALES: SalesRow[] = [
  { product: "AfterSlim Burn", sku: "AS-BURN-60", unitsSold: 87, revenue: 434913, costOfGoods: 108750, profit: 326163 },
  { product: "AfterSlim Cleanse", sku: "AS-CLNS-30", unitsSold: 63, revenue: 251937, costOfGoods: 61425, profit: 190512 },
  { product: "AfterSlim Probiotics+", sku: "AS-PROB-60", unitsSold: 52, revenue: 181948, costOfGoods: 44200, profit: 137748 },
  { product: "AfterSlim Collagen Peptides", sku: "AS-COLL-30", unitsSold: 41, revenue: 184459, costOfGoods: 57400, profit: 127059 },
  { product: "AfterSlim Sleep Formula", sku: "AS-SLEEP-60", unitsSold: 38, revenue: 125362, costOfGoods: 30400, profit: 94962 },
  { product: "AfterSlim Omega-3 Ultra", sku: "AS-OMG3-90", unitsSold: 35, revenue: 104965, costOfGoods: 25375, profit: 79590 },
  { product: "AfterSlim Immunity Shield", sku: "AS-IMMUN-90", unitsSold: 29, revenue: 81171, costOfGoods: 19575, profit: 61596 },
  { product: "AfterSlim Vitamin D3+K2", sku: "AS-VDK2-60", unitsSold: 22, revenue: 54978, costOfGoods: 12100, profit: 42878 },
];

const AVAILABLE_REPORTS = [
  { name: "Sales Summary", description: "Revenue, units sold, and profitability by product", icon: DollarSign, ready: true },
  { name: "Inventory Report", description: "Current stock levels, reorder alerts, and turnover rates", icon: Package, ready: true },
  { name: "Customer Analytics", description: "New vs returning, LTV, acquisition channels", icon: Users, ready: false },
  { name: "Creator Performance", description: "Campaign ROI, engagement, and conversion by creator", icon: TrendingUp, ready: false },
  { name: "Financial Statement", description: "P&L, cash flow summary, and tax liabilities", icon: BarChart3, ready: false },
  { name: "Marketing ROI", description: "Ad spend efficiency, ROAS, and channel performance", icon: TrendingUp, ready: false },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("30d");

  const totalRevenue = MOCK_SALES.reduce((s, r) => s + r.revenue, 0);
  const totalProfit = MOCK_SALES.reduce((s, r) => s + r.profit, 0);
  const totalUnits = MOCK_SALES.reduce((s, r) => s + r.unitsSold, 0);
  const avgOrderValue = totalRevenue / 267; // 267 mock orders in period

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view business reports, sales analytics, and performance summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="size-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(PERIOD_LABELS) as [ReportPeriod, string][]).map(
                ([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.info("Export coming soon")}>
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue / 100)}</p>
            <p className="text-xs text-muted-foreground">+18.2% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gross Profit
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalProfit / 100)}</p>
            <p className="text-xs text-muted-foreground">
              {((totalProfit / totalRevenue) * 100).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Units Sold
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUnits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Across {MOCK_SALES.length} products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(avgOrderValue / 100)}</p>
            <p className="text-xs text-muted-foreground">267 orders in period</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Product</CardTitle>
          <CardDescription>
            Revenue and profitability breakdown for {PERIOD_LABELS[period].toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">COGS</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right pr-6">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SALES.map((row) => {
                const margin = ((row.profit / row.revenue) * 100).toFixed(0);
                return (
                  <TableRow key={row.sku}>
                    <TableCell className="pl-6 font-medium">{row.product}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.sku}
                    </TableCell>
                    <TableCell className="text-right font-mono">{row.unitsSold}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(row.revenue / 100)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCurrency(row.costOfGoods / 100)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-600">
                      {formatCurrency(row.profit / 100)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          Number(margin) >= 70
                            ? "border-green-200 text-green-700"
                            : "border-yellow-200 text-yellow-700"
                        )}
                      >
                        {margin}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="pl-6">Total</TableCell>
                <TableCell />
                <TableCell className="text-right font-mono">{totalUnits}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totalRevenue / 100)}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {formatCurrency((totalRevenue - totalProfit) / 100)}
                </TableCell>
                <TableCell className="text-right font-mono text-green-600">
                  {formatCurrency(totalProfit / 100)}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                    {((totalProfit / totalRevenue) * 100).toFixed(0)}%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Available Reports Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Available Reports</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.name} className={cn(!report.ready && "opacity-60")}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium">{report.name}</h3>
                        {!report.ready && (
                          <Badge variant="secondary" className="text-[10px]">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.description}
                      </p>
                      {report.ready && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 text-xs"
                          onClick={() => toast.info(`Generating ${report.name}...`)}
                        >
                          <FileText className="size-3.5" />
                          Generate Report
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
