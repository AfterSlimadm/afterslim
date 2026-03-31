import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getApiUser, requireRole } from "@/lib/api-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin", "support"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const supabase = createServerClient();

  const [orderRes, itemsRes, eventsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("order_events").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);

  if (orderRes.error) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: orderRes.data,
    items: itemsRes.data ?? [],
    events: eventsRes.data ?? [],
  });
}

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

  // Support cannot change order status
  if (apiUser.role === "support" && body.status) {
    return NextResponse.json({ error: "Support users cannot change order status" }, { status: 403 });
  }

  const supabase = createServerClient();

  // Get current order
  const { data: current } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Update order
  const { data, error } = await supabase
    .from("orders")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log event if status changed
  if (body.status && body.status !== current.status) {
    await supabase.from("order_events").insert({
      order_id: id,
      event_type: "status_changed",
      old_value: current.status,
      new_value: body.status,
      actor: apiUser.display_name,
    });
  }

  return NextResponse.json(data);
}
