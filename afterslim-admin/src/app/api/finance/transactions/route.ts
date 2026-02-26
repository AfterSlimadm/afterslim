import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const offset = (page - 1) * limit;

  const supabase = createServerClient();

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type && type !== "all") query = query.eq("type", type);
  if (category && category !== "all") query = query.eq("category", category);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transactions: data, total: count, page, limit });
}

const txSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string(),
  description: z.string().min(3),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  reference_type: z.enum(["order", "refund", "manual"]).default("manual"),
  reference_id: z.string().optional(),
  date: z.string(),
  notes: z.string().optional(),
  created_by: z.string().default("admin"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = txSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
