import { redirect } from "next/navigation";
import { getAuthenticatedAdmin, getDefaultRoute } from "@/lib/auth";

export default async function RootDashboardPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/login");
  redirect(getDefaultRoute(admin.role));
}
