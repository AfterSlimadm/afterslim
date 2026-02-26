export const dynamic = "force-dynamic";

import { getFinanceSummary } from "@/lib/queries/finance";
import FinanceContent from "./finance-content";

export default async function FinancePage() {
  let summary = null;

  try {
    summary = await getFinanceSummary();
  } catch (error) {
    console.error("[FinancePage] Failed to fetch finance summary:", error);
  }

  return <FinanceContent summary={summary} />;
}
