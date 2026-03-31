import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

export async function GET(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin", "support"]);
  if (forbidden) return forbidden;

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");
  const customerId = searchParams.get("customer_id");
  const completed = searchParams.get("completed");

  const supabase = createServerClient();

  let query = supabase
    .from("support_tasks")
    .select("*, admin_user:admin_users!admin_user_id(display_name)")
    .order("created_at", { ascending: false });

  // Support users only see their own tasks
  if (apiUser.role === "support") {
    query = query.eq("admin_user_id", apiUser.id);
  }

  if (orderId) query = query.eq("order_id", orderId);
  if (customerId) query = query.eq("customer_id", customerId);
  if (completed === "true") query = query.eq("is_completed", true);
  if (completed === "false") query = query.eq("is_completed", false);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin", "support"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const { order_id, customer_id, task_type, description } = body;

  if (!task_type) {
    return NextResponse.json({ error: "task_type is required" }, { status: 400 });
  }
  if (!order_id && !customer_id) {
    return NextResponse.json({ error: "order_id or customer_id is required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("support_tasks")
    .insert({
      order_id: order_id || null,
      customer_id: customer_id || null,
      admin_user_id: apiUser.id,
      task_type,
      description: description || null,
    })
    .select("*, admin_user:admin_users!admin_user_id(display_name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    userId: apiUser.id,
    userName: apiUser.display_name,
    userRole: apiUser.role,
    action: "support_task.create",
    entityType: "support_task",
    entityId: data.id,
    newValue: { task_type, order_id, customer_id, description },
  });

  return NextResponse.json(data, { status: 201 });
}
