import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
