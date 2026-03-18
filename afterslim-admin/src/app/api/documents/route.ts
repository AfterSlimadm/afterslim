import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const docSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["contract", "invoice", "receipt", "legal", "other"]).default("contract"),
  file_name: z.string().min(1),
  file_url: z.string().url(),
  file_path: z.string().min(1),
  file_type: z.string().optional(),
  file_size: z.number().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = docSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("documents")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
