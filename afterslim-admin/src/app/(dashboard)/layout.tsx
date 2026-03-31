import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { AuthProvider } from "@/components/auth-provider";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <AuthProvider user={admin}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
