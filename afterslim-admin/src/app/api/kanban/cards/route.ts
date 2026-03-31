import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { z } from "zod";

export async function GET() {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("kanban_cards")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const cardSchema = z.object({
  column_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  deadline: z.string().optional(),
  tags: z.array(z.string()).default([]),
  idea_id: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = cardSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Get max position in column
  const { data: maxPos } = await supabase
    .from("kanban_cards")
    .select("position")
    .eq("column_id", parsed.data.column_id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("kanban_cards")
    .insert({
      ...parsed.data,
      position: (maxPos?.position ?? -1) + 1,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
