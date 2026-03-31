import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin", "support"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = await request.json();
  const supabase = createServerClient();

  // Get current task
  const { data: current } = await supabase
    .from("support_tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Support can only update their own tasks
  if (apiUser.role === "support" && current.admin_user_id !== apiUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.is_completed !== undefined) {
    updateData.is_completed = body.is_completed;
    updateData.completed_at = body.is_completed ? new Date().toISOString() : null;
  }
  if (body.description !== undefined) {
    updateData.description = body.description;
  }

  const { data, error } = await supabase
    .from("support_tasks")
    .update(updateData)
    .eq("id", id)
    .select("*, admin_user:admin_users!admin_user_id(display_name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    userId: apiUser.id,
    userName: apiUser.display_name,
    userRole: apiUser.role,
    action: body.is_completed !== undefined ? "support_task.toggle" : "support_task.update",
    entityType: "support_task",
    entityId: id,
    oldValue: { is_completed: current.is_completed, description: current.description },
    newValue: updateData,
  });

  return NextResponse.json(data);
}
