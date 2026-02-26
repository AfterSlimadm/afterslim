import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");

  if (!productId) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  // Require authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Check if user already reviewed this product
  const admin = getAdminClient();
  const { data: existing } = await admin
    .from("reviews")
    .select("id")
    .eq("product_id", parsed.data.product_id)
    .eq("profile_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You already reviewed this product" }, { status: 409 });
  }

  // Get user profile for author name
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: review, error } = await admin
    .from("reviews")
    .insert({
      ...parsed.data,
      profile_id: user.id,
      author_name: profile?.full_name ?? "Customer",
      is_verified_purchase: false, // TODO: check order history
      is_approved: false, // Requires admin approval
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, review_id: review.id }, { status: 201 });
}
