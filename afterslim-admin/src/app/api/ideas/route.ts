import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const priority = searchParams.get("priority");

  const supabase = createServerClient();

  let query = supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (category && category !== "all") query = query.eq("category", category);
  if (priority && priority !== "all") query = query.eq("priority", priority);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const ideaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  tags: z.array(z.string()).default([]),
  source: z.enum(["manual", "after", "agent"]).default("manual"),
  author: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ideaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("ideas")
    .insert({ ...parsed.data, status: "new" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
