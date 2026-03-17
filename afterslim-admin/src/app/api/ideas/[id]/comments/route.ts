import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

/**
 * GET /api/ideas/[id]/comments
 * Busca comentarios de uma ideia.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("idea_comments")
    .select("*")
    .eq("idea_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/ideas/[id]/comments
 * Adiciona um comentario a uma ideia.
 * Body: { content, userId?, agentId? }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { content, userId, agentId } = body as {
    content?: string;
    userId?: string;
    agentId?: string;
  };

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Campo 'content' e obrigatorio" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("idea_comments")
    .insert({
      idea_id: id,
      content: content.trim(),
      user_id: userId ?? null,
      agent_id: agentId ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
