import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = createServerClient();

  let query = supabase
    .from("reminders")
    .select("*")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const reminderSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  created_by: z.string().optional(),
  source: z.enum(["manual", "whatsapp", "agent"]).default("manual"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reminderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("reminders")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      due_date: parsed.data.due_date ?? null,
      assigned_to: parsed.data.assigned_to ?? null,
      priority: parsed.data.priority,
      created_by: parsed.data.created_by ?? null,
      source: parsed.data.source,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
