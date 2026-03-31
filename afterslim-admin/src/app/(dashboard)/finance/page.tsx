export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import {
  getFinanceSummary,
  getCashFlowByWeek,
  getRevenueTrend,
  getTopProducts,
} from "@/lib/queries/finance";
import FinanceContent from "./finance-content";

export default async function FinancePage() {
  await requireAuth("/finance");
  let summary = null;
  let cashFlow: Awaited<ReturnType<typeof getCashFlowByWeek>> = [];
  let revenueTrend: Awaited<ReturnType<typeof getRevenueTrend>> = [];
  let topProducts: Awaited<ReturnType<typeof getTopProducts>> = [];

  try {
    [summary, cashFlow, revenueTrend, topProducts] = await Promise.all([
      getFinanceSummary(),
      getCashFlowByWeek(8),
      getRevenueTrend(30),
      getTopProducts(5),
    ]);
  } catch (error) {
    console.error("[FinancePage] Failed to fetch finance data:", error);
  }

  return (
    <FinanceContent
      summary={summary}
      cashFlow={cashFlow}
      revenueTrend={revenueTrend}
      topProducts={topProducts}
    />
  );
}
