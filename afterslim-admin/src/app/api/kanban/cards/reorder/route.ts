import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const schema = z.object({
  card_id: z.string().uuid(),
  column_id: z.string().uuid(),
  position: z.number().int().min(0),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("kanban_cards")
    .update({
      column_id: parsed.data.column_id,
      position: parsed.data.position,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.card_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
