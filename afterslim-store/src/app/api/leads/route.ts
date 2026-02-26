import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.enum(["popup", "footer", "blog", "checkout_abandon"]).default("popup"),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  consent_marketing: z.boolean().default(true),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("leads")
    .upsert(parsed.data, { onConflict: "email" })
    .select("id, email")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, lead: data });
}
