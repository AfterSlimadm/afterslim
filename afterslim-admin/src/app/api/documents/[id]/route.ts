import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getApiUser, requireRole } from "@/lib/api-auth";

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

  // Get doc to find file_path for storage cleanup
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return NextResponse.json(
      { error: "Documento não encontrado" },
      { status: 404 }
    );
  }

  // Delete file from storage
  if (doc.file_path) {
    await supabase.storage.from("attachments").remove([doc.file_path]);
  }

  // Delete record
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
