export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getFinancialGoals } from "@/lib/queries/finance";
import GoalsContent from "./goals-content";

export default async function GoalsPage() {
  await requireAuth("/finance");
  const goals = await getFinancialGoals();

  return <GoalsContent goalRows={goals} />;
}
