import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agent_id");
  const status = searchParams.get("status");

  const supabase = createServerClient();

  let query = supabase
    .from("as_agent_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (agentId) query = query.eq("agent_id", agentId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
