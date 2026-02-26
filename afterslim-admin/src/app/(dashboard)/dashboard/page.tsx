import { getDashboardStats } from "@/lib/queries/dashboard";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  let stats = null;

  try {
    stats = await getDashboardStats();
  } catch (error) {
    console.error("[DashboardPage] Failed to fetch stats:", error);
  }

  return <DashboardContent stats={stats} />;
}
