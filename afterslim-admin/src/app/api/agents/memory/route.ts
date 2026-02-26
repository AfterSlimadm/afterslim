import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agent_id");
  const kind = searchParams.get("kind");

  const supabase = createServerClient();

  let query = supabase
    .from("as_agent_memory")
    .select("*")
    .order("created_at", { ascending: false });

  if (agentId) query = query.eq("agent_id", agentId);
  if (kind) query = query.eq("kind", kind);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const memorySchema = z.object({
  agent_id: z.string(),
  kind: z.enum(["insight", "action", "summary", "alert", "classification"]),
  content: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = memorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("as_agent_memory")
    .insert({
      agent_id: parsed.data.agent_id,
      kind: parsed.data.kind,
      content: parsed.data.content,
      metadata: parsed.data.metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
