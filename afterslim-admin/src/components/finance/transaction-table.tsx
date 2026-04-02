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
  Paperclip,
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
            <SortButton field="date">Data</SortButton>
          </TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>
            <SortButton field="category">Categoria</SortButton>
          </TableHead>
          <TableHead>
            <SortButton field="type">Tipo</SortButton>
          </TableHead>
          <TableHead className="text-right">
            <SortButton field="amount">Valor</SortButton>
          </TableHead>
          <TableHead>Referência</TableHead>
          <TableHead className="w-[50px]">Anexo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((tx, index) => {
          const catConfig = TRANSACTION_CATEGORY_CONFIG[tx.category] ?? { label: tx.category, icon: "MoreHorizontal" };
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
                  className={isIncome ? "badge-success" : "badge-error"}
                >
                  {isIncome ? "Receita" : "Despesa"}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono font-medium",
                  isIncome ? "trend-positive" : "trend-negative"
                )}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {tx.reference_id ?? "\u2014"}
              </TableCell>
              <TableCell>
                {tx.attachment_url ? (
                  <a
                    href={tx.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver anexo"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Paperclip className="h-4 w-4" />
                  </a>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {showFooter && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">
              Totais
            </TableCell>
            <TableCell className="text-right">
              <div className="space-y-1">
                <div className="font-mono font-medium trend-positive">
                  +{formatCurrency(totalIncome)}
                </div>
                <div className="font-mono font-medium trend-negative">
                  -{formatCurrency(totalExpense)}
                </div>
                <div className="border-t pt-1 font-mono font-semibold">
                  {formatCurrency(totalIncome - totalExpense)}
                </div>
              </div>
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
