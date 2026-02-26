import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const featured = searchParams.get("featured");
  const slug = searchParams.get("slug");

  const supabase = getAdminClient();

  // Single product by slug
  if (slug) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // List products with filters
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (category) query = query.eq("category", category);
  if (tag) query = query.contains("tags", [tag]);
  if (featured === "true") query = query.eq("is_featured", true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
