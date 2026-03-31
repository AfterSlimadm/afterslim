import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { getApiUser, requireRole } from "@/lib/api-auth";

export async function GET() {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products_inventory")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const { sku, addQty } = body;

  if (!sku || !addQty || addQty <= 0) {
    return NextResponse.json(
      { error: "sku and addQty (positive) required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Get current stock
  const { data: current, error: fetchError } = await supabase
    .from("products_inventory")
    .select("id, stock_qty, product_id")
    .eq("sku", sku)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const newQty = current.stock_qty + addQty;

  // Update inventory
  const { data, error } = await supabase
    .from("products_inventory")
    .update({ stock_qty: newQty, updated_at: new Date().toISOString() })
    .eq("id", current.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync products table
  if (current.product_id) {
    await supabase
      .from("products")
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq("id", current.product_id);
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request: Request) {
  const apiUser = await getApiUser();
  if (!apiUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forbidden = requireRole(apiUser.role, ["owner", "admin"]);
  if (forbidden) return forbidden;

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products_inventory")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync products table if stock_qty changed
  if (updates.stock_qty !== undefined && data.product_id) {
    await supabase
      .from("products")
      .update({
        stock_quantity: updates.stock_qty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.product_id);
  }

  return NextResponse.json(data);
}
