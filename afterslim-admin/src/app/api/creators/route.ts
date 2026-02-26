import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier");
  const status = searchParams.get("status");

  const supabase = createServerClient();

  let query = supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  if (tier && tier !== "all") query = query.eq("tier", tier);
  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const creatorSchema = z.object({
  name: z.string().min(2),
  handle: z.string().min(2),
  platform: z.enum(["instagram", "tiktok", "youtube"]),
  followers: z.number().int().positive(),
  engagement_rate: z.number().positive(),
  niche: z.string(),
  contact_email: z.string().email().optional(),
  tier: z.enum(["nano", "micro", "macro", "mega"]),
  status: z.enum(["prospect", "contacted", "negotiating", "active", "paused", "ended"]).default("prospect"),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = creatorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("creators")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
