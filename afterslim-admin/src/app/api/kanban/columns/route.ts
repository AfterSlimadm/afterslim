import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getApiUser, requireRole } from "@/lib/api-auth";

export async function GET() {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("kanban_columns")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
