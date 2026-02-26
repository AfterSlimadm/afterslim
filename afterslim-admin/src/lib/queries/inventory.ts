import { getAdminClient } from "@/lib/supabase/admin";

export interface InventoryRow {
  id: string;
  product_id: string | null;
  sku: string;
  name: string;
  unit_cost: number;
  selling_price: number;
  stock_qty: number;
  reorder_point: number;
  supplier: string | null;
  category: string | null;
  updated_at: string;
}

/**
 * Fetch all rows from `products_inventory`.
 */
export async function getInventory(): Promise<InventoryRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("products_inventory")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[getInventory]", error.message);
    return [];
  }

  return (data ?? []) as InventoryRow[];
}
