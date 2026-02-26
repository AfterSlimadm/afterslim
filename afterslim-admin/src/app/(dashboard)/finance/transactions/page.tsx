import { getTransactions } from "@/lib/queries/finance";
import TransactionsContent from "./transactions-content";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return <TransactionsContent transactionRows={transactions} />;
}
