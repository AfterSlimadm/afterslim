"use client";

import { cn, formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
  TableFooter,
} from "@/components/ui/table";
import {
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

/* -- Mock tax records by state ---------------------------------- */

interface StateTaxRecord {
  id: string;
  state: string;
  stateCode: string;
  taxRate: number;
  taxableAmount: number;
  taxCollected: number;
  status: "filed" | "pending" | "due_soon";
  nexus: boolean;
  filedDate: string | null;
}

const MOCK_TAX_RECORDS: StateTaxRecord[] = [
  { id: "tax-001", state: "Florida", stateCode: "FL", taxRate: 6.0, taxableAmount: 9850.25, taxCollected: 591.02, status: "filed", nexus: true, filedDate: "2026-02-15" },
  { id: "tax-002", state: "California", stateCode: "CA", taxRate: 7.25, taxableAmount: 7420.80, taxCollected: 538.01, status: "filed", nexus: true, filedDate: "2026-02-12" },
  { id: "tax-003", state: "Texas", stateCode: "TX", taxRate: 6.25, taxableAmount: 5230.50, taxCollected: 326.91, status: "pending", nexus: true, filedDate: null },
  { id: "tax-004", state: "New York", stateCode: "NY", taxRate: 8.0, taxableAmount: 3890.00, taxCollected: 311.20, status: "pending", nexus: true, filedDate: null },
  { id: "tax-005", state: "Illinois", stateCode: "IL", taxRate: 6.25, taxableAmount: 2145.75, taxCollected: 134.11, status: "due_soon", nexus: true, filedDate: null },
  { id: "tax-006", state: "Pennsylvania", stateCode: "PA", taxRate: 6.0, taxableAmount: 1890.30, taxCollected: 113.42, status: "filed", nexus: false, filedDate: "2026-02-10" },
  { id: "tax-007", state: "Ohio", stateCode: "OH", taxRate: 5.75, taxableAmount: 1520.00, taxCollected: 87.40, status: "pending", nexus: false, filedDate: null },
  { id: "tax-008", state: "Georgia", stateCode: "GA", taxRate: 4.0, taxableAmount: 1340.60, taxCollected: 53.62, status: "filed", nexus: false, filedDate: "2026-02-14" },
  { id: "tax-009", state: "North Carolina", stateCode: "NC", taxRate: 4.75, taxableAmount: 980.45, taxCollected: 46.57, status: "pending", nexus: false, filedDate: null },
  { id: "tax-010", state: "Arizona", stateCode: "AZ", taxRate: 5.6, taxableAmount: 745.20, taxCollected: 41.73, status: "filed", nexus: false, filedDate: "2026-02-13" },
];

/* -- Status config ---------------------------------------------- */

const STATUS_CONFIG = {
  filed: {
    label: "Filed",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  due_soon: {
    label: "Due Soon",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertTriangle,
  },
};

/* -- Page component --------------------------------------------- */

export default function TaxPage() {
  const totalTaxCollected = MOCK_TAX_RECORDS.reduce(
    (sum, r) => sum + r.taxCollected,
    0
  );
  const totalFiled = MOCK_TAX_RECORDS.filter((r) => r.status === "filed").reduce(
    (sum, r) => sum + r.taxCollected,
    0
  );
  const totalPending = MOCK_TAX_RECORDS.filter(
    (r) => r.status === "pending" || r.status === "due_soon"
  ).reduce((sum, r) => sum + r.taxCollected, 0);

  const nexusStates = MOCK_TAX_RECORDS.filter((r) => r.nexus);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tax Records</h1>
        <p className="text-muted-foreground">
          Track sales tax collection and filing status across all states.
        </p>
      </div>

      {/* Summary KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tax Collected
            </CardTitle>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Receipt className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(totalTaxCollected)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              From {MOCK_TAX_RECORDS.length} states this period
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Filed
            </CardTitle>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(totalFiled)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {MOCK_TAX_RECORDS.filter((r) => r.status === "filed").length} states
              filed
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Pending
            </CardTitle>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-4 w-4 text-yellow-700 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(totalPending)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                MOCK_TAX_RECORDS.filter(
                  (r) => r.status === "pending" || r.status === "due_soon"
                ).length
              }{" "}
              states pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tax records table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Tax by State</CardTitle>
          <CardDescription>
            Tax collection and filing status for the current period (February
            2026)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Tax Rate</TableHead>
                <TableHead className="text-right">Taxable Amount</TableHead>
                <TableHead className="text-right">Tax Collected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nexus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TAX_RECORDS.map((record, index) => {
                const statusConfig = STATUS_CONFIG[record.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <TableRow
                    key={record.id}
                    className={cn(index % 2 === 0 && "bg-muted/30")}
                  >
                    <TableCell className="font-medium">
                      {record.state}{" "}
                      <span className="text-muted-foreground">
                        ({record.stateCode})
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {record.taxRate.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(record.taxableAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(record.taxCollected)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "gap-1 border-0",
                          statusConfig.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.nexus ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          Nexus
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          &mdash;
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell />
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(
                    MOCK_TAX_RECORDS.reduce(
                      (sum, r) => sum + r.taxableAmount,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  {formatCurrency(totalTaxCollected)}
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Nexus states note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Nexus States
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AfterSlim currently has sales tax nexus in{" "}
            <span className="font-medium text-foreground">
              {nexusStates.length} states
            </span>
            :{" "}
            {nexusStates
              .map((r) => `${r.state} (${r.stateCode})`)
              .join(", ")}
            . Nexus is established based on physical presence or economic nexus
            thresholds (typically $100,000 in sales or 200 transactions per
            year). As your business grows, monitor additional states for
            potential nexus obligations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
