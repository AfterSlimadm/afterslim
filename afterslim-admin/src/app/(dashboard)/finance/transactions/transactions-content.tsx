"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TRANSACTION_CATEGORY_CONFIG } from "@/lib/constants";
import type { Transaction, TransactionType, TransactionCategory } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TransactionTable } from "@/components/finance/transaction-table";
import type { TransactionRow } from "@/lib/queries/finance";

/* -- Map DB rows to front-end Transaction type ---------------- */

function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    category: (row.category ?? "other") as TransactionCategory,
    description: row.description ?? "",
    amount: Number(row.amount),
    reference_id: row.reference_id,
    reference_type: row.reference_type,
    date: row.date,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

/* -- Constants -------------------------------------------------- */

const ITEMS_PER_PAGE = 10;

const CATEGORY_OPTIONS = Object.entries(TRANSACTION_CATEGORY_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

/* -- Props ------------------------------------------------------ */

interface TransactionsContentProps {
  transactionRows: TransactionRow[];
}

/* -- Component -------------------------------------------------- */

export default function TransactionsContent({
  transactionRows,
}: TransactionsContentProps) {
  const allTransactions = useMemo(
    () => transactionRows.map(mapRowToTransaction),
    [transactionRows]
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TransactionCategory>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  /* -- Filtering ------------------------------------------------ */

  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          tx.description.toLowerCase().includes(q) ||
          (tx.reference_id?.toLowerCase().includes(q) ?? false);
        if (!matchesSearch) return false;
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
      return true;
    });
  }, [allTransactions, search, typeFilter, categoryFilter]);

  /* -- Pagination ----------------------------------------------- */

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all income and expense transactions.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tx-type">Type</Label>
                <Select defaultValue="income">
                  <SelectTrigger id="tx-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-category">Category</Label>
                <Select defaultValue="order_revenue">
                  <SelectTrigger id="tx-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-amount">Amount (USD)</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-description">Description</Label>
                <Textarea
                  id="tx-description"
                  placeholder="Enter transaction details..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-date">Date</Label>
                <Input id="tx-date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-reference">Reference ID (optional)</Label>
                <Input id="tx-reference" placeholder="e.g., ORD-1234" />
              </div>
              <Button
                className="w-full"
                onClick={() => setDialogOpen(false)}
              >
                Save Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-md border">
                {(["all", "income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setPage(1);
                    }}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md",
                      typeFilter === t
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
                  </button>
                ))}
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v as "all" | TransactionCategory);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {paginated.length} of {filtered.length} transactions
        </span>
        <div className="flex gap-3">
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            {filtered.filter((t) => t.type === "income").length} income
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            {filtered.filter((t) => t.type === "expense").length} expenses
          </Badge>
        </div>
      </div>

      {/* Transactions table */}
      <Card>
        <CardContent className="p-0">
          <TransactionTable transactions={paginated} showFooter />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
