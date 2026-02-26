"use client";

import { useState, useMemo } from "react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TRANSACTION_CATEGORY_CONFIG } from "@/lib/constants";
import type { Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  ShoppingCart,
  Truck,
  RotateCcw,
  Megaphone,
  Users,
  Factory,
  CreditCard,
  Receipt,
  Wrench,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

/* -- Icon map --------------------------------------------------- */

const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart,
  Truck,
  RotateCcw,
  Megaphone,
  Users,
  Factory,
  CreditCard,
  Receipt,
  Wrench,
  MoreHorizontal,
};

/* -- Types ------------------------------------------------------ */

type SortField = "date" | "amount" | "category" | "type";
type SortOrder = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  showFooter?: boolean;
}

/* -- Component -------------------------------------------------- */

export function TransactionTable({
  transactions,
  showFooter = true,
}: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [transactions, sortField, sortOrder]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  }

  function SortButton({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortButton field="date">Date</SortButton>
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead>
            <SortButton field="category">Category</SortButton>
          </TableHead>
          <TableHead>
            <SortButton field="type">Type</SortButton>
          </TableHead>
          <TableHead className="text-right">
            <SortButton field="amount">Amount</SortButton>
          </TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((tx, index) => {
          const catConfig = TRANSACTION_CATEGORY_CONFIG[tx.category];
          const IconComponent = ICON_MAP[catConfig.icon] ?? MoreHorizontal;
          const isIncome = tx.type === "income";

          return (
            <TableRow
              key={tx.id}
              className={cn(index % 2 === 0 && "bg-muted/30")}
            >
              <TableCell className="text-muted-foreground">
                {formatDate(tx.date)}
              </TableCell>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{catConfig.label}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={isIncome ? "default" : "destructive"}
                  className={cn(
                    "capitalize",
                    isIncome &&
                      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  )}
                >
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono font-medium",
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {tx.reference_id ?? "\u2014"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {showFooter && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">
              Totals
            </TableCell>
            <TableCell className="text-right">
              <div className="space-y-1">
                <div className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(totalIncome)}
                </div>
                <div className="font-mono font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(totalExpense)}
                </div>
                <div className="border-t pt-1 font-mono font-semibold">
                  {formatCurrency(totalIncome - totalExpense)}
                </div>
              </div>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
