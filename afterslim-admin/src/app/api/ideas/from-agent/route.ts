import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { logAudit } from "@/lib/audit";

/**
 * POST /api/ideas/from-agent
 *
 * Endpoint para o bot WhatsApp (After) ou outros agentes
 * submeterem ideias programaticamente.
 *
 * Auth: header x-api-key deve corresponder a API_SECRET.
 */
export async function POST(request: Request) {
  // --- Auth ---
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_SECRET) {
    return NextResponse.json(
      { error: "Nao autorizado" },
      { status: 401 }
    );
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido" },
      { status: 400 }
    );
  }

  const {
    title,
    description,
    source,
    agent_id,
    tags,
    category,
    priority,
  } = body as {
    title?: string;
    description?: string;
    source?: string;
    agent_id?: string;
    tags?: string[];
    category?: string;
    priority?: string;
  };

  // --- Validation ---
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Campo 'title' e obrigatorio" },
      { status: 400 }
    );
  }

  if (!source || typeof source !== "string") {
    return NextResponse.json(
      { error: "Campo 'source' e obrigatorio (whatsapp | agent)" },
      { status: 400 }
    );
  }

  // --- Insert ---
  const supabase = createServerClient();

  const insertPayload = {
    title: title.trim(),
    description: description?.trim() ?? "",
    source,
    author: agent_id ?? null,
    tags: Array.isArray(tags) ? tags : [],
    category: category ?? "Tecnologia",
    priority: priority ?? "medium",
    status: "new",
    votes: 0,
    metadata: { agent_id: agent_id ?? null },
  };

  const { data, error } = await supabase
    .from("ideas")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("[from-agent] Insert failed:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // --- Audit ---
  await logAudit({
    action: "idea.created_by_agent",
    entityType: "idea",
    entityId: data.id,
    userName: agent_id ?? source,
    newValue: insertPayload as unknown as Record<string, unknown>,
    metadata: { source, agent_id },
  });

  return NextResponse.json(data, { status: 201 });
}
