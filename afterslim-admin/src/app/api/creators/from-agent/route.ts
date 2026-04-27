import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const creatorFromAgentSchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1),
  platform: z.enum(["instagram", "tiktok", "youtube", "twitter"]),
  followers: z.number().int().optional(),
  engagement_rate: z.number().optional(),
  niche: z.string().optional(),
  contact_email: z.string().email().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/creators/from-agent
 * Endpoint for AI agents to submit new creators.
 * Checks for duplicates by handle before inserting.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = creatorFromAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Check for duplicate by handle
    const { data: existing } = await supabase
      .from("creators")
      .select("id, name")
      .eq("handle", parsed.data.handle)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Creator already exists", existing_id: existing.id, existing_name: existing.name },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("creators")
      .insert({
        ...parsed.data,
        status: "prospect",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar requisicao" },
      { status: 500 }
    );
  }
}
