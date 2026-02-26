import { NextResponse } from "next/server";
import { z } from "zod";

const VPS_GATEWAY_URL = process.env.VPS_GATEWAY_URL ?? "http://217.216.89.234:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "";

const chatSchema = z.object({
  agent_id: z.string(),
  message: z.string().min(1),
  conversation_id: z.string().optional(),
});

/**
 * Agent Chat endpoint
 * Sends a message to a specific OpenClaw agent and returns the response.
 */
export async function POST(request: Request) {
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
    const response = await fetch(`${VPS_GATEWAY_URL}/agents/${agent_id}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        conversation_id,
      }),
    });

    if (!response.ok) {
      // Fallback: return a placeholder response when VPS is unreachable
      return NextResponse.json({
        agent_id,
        response: `[Agent ${agent_id} is currently offline. The VPS gateway returned status ${response.status}. Please check the connection settings.]`,
        conversation_id: conversation_id ?? crypto.randomUUID(),
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Fallback for when VPS is completely unreachable
    return NextResponse.json({
      agent_id,
      response: `[Agent ${agent_id} is currently offline. Unable to reach the VPS gateway at ${VPS_GATEWAY_URL}. Please verify the server is running.]`,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }
}
