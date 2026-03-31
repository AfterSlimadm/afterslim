export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getTransactions } from "@/lib/queries/finance";
import TransactionsContent from "./transactions-content";

export default async function TransactionsPage() {
  await requireAuth("/finance");
  const transactions = await getTransactions();

  return <TransactionsContent transactionRows={transactions} />;
}
