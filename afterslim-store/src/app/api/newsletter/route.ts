import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("leads")
    .upsert(
      {
        email: parsed.data.email,
        source: "footer",
        consent_marketing: true,
      },
      { onConflict: "email" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
