import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { logAudit } from "@/lib/audit";

/**
 * GET /api/team
 * Fetch all admin_users.
 */
export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, last_login_at, is_active, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/team
 * Invite a new team member.
 * Body: { email: string, displayName: string, role: string }
 *
 * TODO: Criar usuario Supabase Auth via service role
 * (supabase.auth.admin.createUser) e vincular o user_id.
 * Por enquanto, apenas insere na tabela admin_users.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { email, displayName, role } = body;

  if (!email || !role) {
    return NextResponse.json(
      { error: "Campos 'email' e 'role' obrigatorios" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email,
      display_name: displayName || null,
      role,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    action: "team.invite",
    entityType: "admin_users",
    entityId: data.id,
    newValue: { email, displayName, role },
    userName: "Admin", // TODO: pegar do session/auth
  });

  return NextResponse.json(data);
}
