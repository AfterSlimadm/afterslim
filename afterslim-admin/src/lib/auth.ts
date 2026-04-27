import { createSupabaseServerWithCookies } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* =============================================================
   AfterSlim Admin — Role-Based Access Control
   ============================================================= */

export type AdminRole = "owner" | "admin" | "support" | "viewer";

export interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
}

/**
 * Route permission map: which roles can access which path prefixes.
 * If a route is not listed, only owner/admin can access it.
 */
const ROUTE_PERMISSIONS: Record<string, AdminRole[]> = {
  "/orders":             ["owner", "admin", "support"],
  "/support-dashboard":  ["owner", "admin", "support"],
};

const ADMIN_ONLY_ROUTES = [
  "/dashboard",
  "/finance",
  "/transactions",
  "/sales-channels",
  "/inventory",
  "/documents",
  "/ideas",
  "/kanban",
  "/creators",
  "/agents",
  "/settings",
  "/reminders",
];

/**
 * Fetch the currently authenticated admin user (server-side).
 * Returns null if unauthenticated or not an active admin_user.
 */
export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
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
 * Check whether a role can access a given pathname.
 */
export function canAccessRoute(role: AdminRole, pathname: string): boolean {
  // Check explicit permissions first
  for (const route of Object.keys(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return ROUTE_PERMISSIONS[route].includes(role);
    }
  }

  // Admin-only routes
  for (const route of ADMIN_ONLY_ROUTES) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return role === "owner" || role === "admin";
    }
  }

  // Default: owner/admin only
  return role === "owner" || role === "admin";
}

/**
 * Landing page per role.
 */
export function getDefaultRoute(role: AdminRole): string {
  return role === "support" ? "/support-dashboard" : "/dashboard";
}

/**
 * Server-side guard for page.tsx files.
 * Redirects to login or default route if unauthorized.
 */
export async function requireAuth(pathname: string): Promise<AdminUser> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/login");
  if (!canAccessRoute(admin.role, pathname)) {
    redirect(getDefaultRoute(admin.role));
  }
  return admin;
}
