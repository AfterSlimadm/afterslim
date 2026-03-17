import { getAdminClient } from "@/lib/supabase/admin";

export interface TeamMember {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  last_login_at: string | null;
  is_active: boolean;
  created_at: string;
}

/**
 * Fetch all admin users with their details.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, last_login_at, is_active, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[team] Failed to fetch team members:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Invite a new team member by inserting into admin_users.
 *
 * TODO: Create actual Supabase auth user via service role
 * (supabase.auth.admin.createUser) and link the user_id.
 * For now, just inserts the record.
 */
export async function inviteTeamMember(
  email: string,
  displayName: string,
  role: string,
  invitedBy?: string
): Promise<{ data: TeamMember | null; error: string | null }> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email,
      display_name: displayName,
      role,
      is_active: true,
      invited_by: invitedBy ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[team] Failed to invite member:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
