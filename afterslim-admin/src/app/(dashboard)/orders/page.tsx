export const dynamic = "force-dynamic";

import { getOrders } from "@/lib/queries/orders";
import OrdersContent from "./orders-content";
import type { Order } from "@/lib/types";

export default async function OrdersPage() {
  let orders: Order[] = [];

  try {
    const rawOrders = await getOrders();

    // Map Supabase rows to the Order type expected by the UI.
    // The query returns flat order rows with order_items(count).
    orders = rawOrders.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      status: row.status,
      payment_status: row.payment_status,
      payment_method: row.payment_method ?? "other",
      subtotal: Number(row.subtotal ?? 0),
      discount: Number(row.discount ?? 0),
      shipping_cost: Number(row.shipping_cost ?? 0),
      total: Number(row.total ?? 0),
      tracking_code: row.tracking_code ?? null,
      shipping_address: row.shipping_address ?? {
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        zip_code: "",
      },
      notes: row.notes ?? null,
      created_at: row.created_at,
      updated_at: row.updated_at,
      customer: row.customer ?? undefined,
      items: row.items ?? undefined,
    })) as Order[];
  } catch (error) {
    console.error("[OrdersPage] Failed to fetch orders:", error);
  }

  return <OrdersContent orders={orders} />;
}
