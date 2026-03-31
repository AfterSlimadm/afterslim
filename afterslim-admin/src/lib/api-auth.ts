import { createSupabaseServerWithCookies } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { AdminRole, AdminUser } from "./auth";

/**
 * Fetch the authenticated admin user from cookies (for API routes).
 */
export async function getApiUser(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerWithCookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!adminUser || !adminUser.is_active) return null;
  return adminUser as AdminUser;
}

/**
 * Returns a 403 Response if the user's role is not in the allowed list.
 * Returns null if access is granted.
 */
export function requireRole(
  userRole: string,
  allowed: AdminRole[]
): NextResponse | null {
  if (!allowed.includes(userRole as AdminRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
