import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { z } from "zod";

export async function GET(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

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

const createTaskSchema = z.object({
  agent_id: z.string(),
  task_type: z.string(),
  input: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("as_agent_tasks")
    .insert({
      agent_id: parsed.data.agent_id,
      task_type: parsed.data.task_type,
      input: parsed.data.input ?? {},
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

const updateTaskSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "running", "completed", "failed", "cancelled"]),
  output: z.record(z.string(), z.unknown()).optional(),
  error: z.string().optional(),
});

export async function PATCH(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const updates: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.output) updates.output = parsed.data.output;
  if (parsed.data.error) updates.error = parsed.data.error;
  if (parsed.data.status === "running") updates.started_at = new Date().toISOString();
  if (parsed.data.status === "completed" || parsed.data.status === "failed") {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("as_agent_tasks")
    .update(updates)
    .eq("id", parsed.data.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
