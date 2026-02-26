import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const supabase = createServerClient();

  let query = supabase
    .from("as_message_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (channel) query = query.eq("source_channel", channel);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
