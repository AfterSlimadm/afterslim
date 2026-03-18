import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("costs")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const costSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  category: z
    .enum(["supplier", "ads", "platform", "shipping", "tools", "legal", "other"])
    .default("other"),
  paid_by: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().optional(),
  receipt_url: z.string().url().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = costSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("costs")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
