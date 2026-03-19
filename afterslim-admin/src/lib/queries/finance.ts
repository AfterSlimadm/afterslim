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
  attachment_url: string | null;
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
  target: number | null;
  current: number | null;
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

// ─── Cash Flow by Week ──────────────────────────────────────

export interface CashFlowWeek {
  week: string;
  income: number;
  expense: number;
}

/**
 * Get cash flow data grouped by week for the last N weeks.
 */
export async function getCashFlowByWeek(
  weeks: number = 8
): Promise<CashFlowWeek[]> {
  const supabase = getAdminClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount, date")
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    console.error("[getCashFlowByWeek]", error.message);
    return [];
  }

  // Group transactions by ISO week
  const weekMap = new Map<string, { income: number; expense: number }>();

  for (const tx of data ?? []) {
    const txDate = new Date(tx.date);
    // Get the Monday of the week
    const day = txDate.getDay();
    const monday = new Date(txDate);
    monday.setDate(txDate.getDate() - ((day + 6) % 7));
    const weekLabel = monday.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

    if (!weekMap.has(weekLabel)) {
      weekMap.set(weekLabel, { income: 0, expense: 0 });
    }

    const bucket = weekMap.get(weekLabel)!;
    const amount = Number(tx.amount);

    if (tx.type === "income") {
      bucket.income += amount;
    } else {
      bucket.expense += amount;
    }
  }

  return Array.from(weekMap.entries()).map(([week, values]) => ({
    week,
    income: Math.round(values.income * 100) / 100,
    expense: Math.round(values.expense * 100) / 100,
  }));
}

// ─── Revenue Trend by Day ───────────────────────────────────

export interface RevenueTrendDay {
  date: string;
  revenue: number;
}

/**
 * Get daily revenue (income transactions) for the last N days.
 */
export async function getRevenueTrend(
  days: number = 30
): Promise<RevenueTrendDay[]> {
  const supabase = getAdminClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, date")
    .eq("type", "income")
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    console.error("[getRevenueTrend]", error.message);
    return [];
  }

  // Group by date
  const dayMap = new Map<string, number>();

  for (const tx of data ?? []) {
    const dateStr = new Date(tx.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

    dayMap.set(dateStr, (dayMap.get(dateStr) ?? 0) + Number(tx.amount));
  }

  return Array.from(dayMap.entries()).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue * 100) / 100,
  }));
}

// ─── Top Products by Revenue ────────────────────────────────

export interface TopProduct {
  name: string;
  revenue: number;
  units: number;
  avgPrice: number;
}

/**
 * Get top-selling products by revenue from order_items (last 30 days).
 */
export async function getTopProducts(
  limit: number = 5
): Promise<TopProduct[]> {
  const supabase = getAdminClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data, error } = await supabase
    .from("order_items")
    .select("product_name, quantity, unit_price, total_price, created_at")
    .gte("created_at", startDate.toISOString());

  if (error) {
    console.error("[getTopProducts]", error.message);
    return [];
  }

  // Group by product_name
  const productMap = new Map<
    string,
    { revenue: number; units: number }
  >();

  for (const item of data ?? []) {
    const name = item.product_name;
    if (!productMap.has(name)) {
      productMap.set(name, { revenue: 0, units: 0 });
    }
    const bucket = productMap.get(name)!;
    bucket.revenue += Number(item.total_price);
    bucket.units += Number(item.quantity);
  }

  return Array.from(productMap.entries())
    .map(([name, { revenue, units }]) => ({
      name,
      revenue: Math.round(revenue * 100) / 100,
      units,
      avgPrice: units > 0 ? Math.round((revenue / units) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
