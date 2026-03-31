import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getApiUser, requireRole } from "@/lib/api-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = await request.json();
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("costs")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update linked transaction amount if amount changed
  if (body.amount !== undefined) {
    await supabase
      .from("transactions")
      .update({
        amount: body.amount,
        description: body.description || data.description,
        date: body.date || data.date,
      })
      .eq("reference_id", id)
      .eq("reference_type", "cost");
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const supabase = getAdminClient();

  // Delete linked transaction first
  await supabase
    .from("transactions")
    .delete()
    .eq("reference_id", id)
    .eq("reference_type", "cost");

  const { error } = await supabase
    .from("costs")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
