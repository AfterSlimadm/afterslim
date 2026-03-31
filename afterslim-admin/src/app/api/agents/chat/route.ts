import { NextResponse } from "next/server";
import { getApiUser, requireRole } from "@/lib/api-auth";
import { z } from "zod";

// Vercel Hobby allows up to 60s for serverless functions
export const maxDuration = 60;

const VPS_GATEWAY_URL =
  process.env.VPS_GATEWAY_URL ?? "http://217.216.89.234:18832";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "";

const chatSchema = z.object({
  agent_id: z.string(),
  message: z.string().min(1),
  conversation_id: z.string().optional(),
});

/**
 * Agent Chat endpoint — All requests go through OpenClaw on VPS.
 * No direct LLM fallback. OpenClaw handles model routing internally.
 */
export async function POST(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { agent_id, message, conversation_id } = parsed.data;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (GATEWAY_TOKEN) {
    headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
  }

  try {
    const res = await fetch(`${VPS_GATEWAY_URL}/agents/${agent_id}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        conversation_id,
      }),
      signal: AbortSignal.timeout(55000), // 55s (within Vercel 60s limit)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[openclaw] ${agent_id}: ${res.status} — ${errText.slice(0, 200)}`);
      return NextResponse.json({
        content: `[${agent_id}] O gateway OpenClaw retornou status ${res.status}. Verifique a conexão com a VPS.`,
        source: "error",
        agent_id,
        conversation_id: conversation_id ?? crypto.randomUUID(),
      });
    }

    const data = await res.json();
    return NextResponse.json({
      content: data.content ?? data.response ?? JSON.stringify(data),
      source: "openclaw",
      agent_id,
      conversation_id: data.conversation_id ?? conversation_id ?? crypto.randomUUID(),
    });
  } catch (err) {
    console.error(`[openclaw] ${agent_id}: unreachable — ${err}`);
    return NextResponse.json({
      content: `[${agent_id}] Não foi possível conectar ao OpenClaw (${VPS_GATEWAY_URL}). Verifique se o servidor está rodando.`,
      source: "error",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }
}
