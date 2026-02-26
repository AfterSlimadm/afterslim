import { getAdminClient } from "@/lib/supabase/admin";

// ─── Transactions ────────────────────────────────────────────

export interface TransactionRow {
  id: string;
  type: string;
  category: string | null;
  description: string | null;
  amount: number;
  currency: string;
  reference_id: string | null;
  reference_type: string | null;
  date: string;
  tags: string[];
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface GetTransactionsOptions {
  type?: "income" | "expense";
  category?: string;
  limit?: number;
}

/**
 * Fetch transactions with optional filters.
 */
export async function getTransactions(
  options?: GetTransactionsOptions
): Promise<TransactionRow[]> {
  const supabase = getAdminClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getTransactions]", error.message);
    return [];
  }

  return (data ?? []) as TransactionRow[];
}

// ─── Financial Goals ─────────────────────────────────────────

export interface FinancialGoalRow {
  id: string;
  name: string;
  metric: string;
  target: number;
  current: number;
  period: string;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  created_at: string;
}

/**
 * Fetch all financial goals.
 */
export async function getFinancialGoals(): Promise<FinancialGoalRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("financial_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getFinancialGoals]", error.message);
    return [];
  }

  return (data ?? []) as FinancialGoalRow[];
}

// ─── Finance Summary ─────────────────────────────────────────

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactionCount: number;
}

/**
 * Compute aggregate income/expense totals from all transactions.
 */
export async function getFinanceSummary(): Promise<FinanceSummary> {
  const transactions = await getTransactions();

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    if (tx.type === "income") {
      totalIncome += Number(tx.amount);
    } else {
      totalExpense += Number(tx.amount);
    }
  }

  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}
