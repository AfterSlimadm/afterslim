export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getOrders } from "@/lib/queries/orders";
import OrdersContent from "./orders-content";
import type { Order } from "@/lib/types";

export default async function OrdersPage() {
  await requireAuth("/orders");
  let orders: Order[] = [];

  try {
    const rawOrders = await getOrders();

    // Map Supabase rows to the Order type expected by the UI.
    // DB stores monetary values in cents (total_cents, subtotal_cents, etc.)
    orders = rawOrders.map((row: Record<string, unknown>) => {
      // Extract customer name: try profile join first, then shipping_address.name, then email
      const rawProfile = row.profile as unknown;
      const shippingAddr = row.shipping_address as Record<string, string> | null;
      let customerName = "Unknown";
      if (Array.isArray(rawProfile) && rawProfile.length > 0 && (rawProfile[0] as Record<string,string>)?.full_name) {
        customerName = (rawProfile[0] as Record<string,string>).full_name;
      } else if (rawProfile && typeof rawProfile === "object" && !Array.isArray(rawProfile) && (rawProfile as Record<string, string>).full_name) {
        customerName = (rawProfile as Record<string, string>).full_name;
      } else if (shippingAddr?.name) {
        customerName = shippingAddr.name;
      } else if (row.email) {
        customerName = row.email as string;
      }

      // Extract item count from order_items(count)
      const rawItems = row.order_items as unknown;
      let itemCount = 0;
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        itemCount = (rawItems[0] as Record<string, number>)?.count ?? 0;
      }

      return {
        id: row.id as string,
        order_number: (row.order_number as string) ?? undefined,
        customer_id: row.customer_id as string,
        status: row.status as string,
        payment_status: row.payment_status as string,
        payment_method: (row.payment_method as string) ?? "other",
        subtotal: Number(row.subtotal_cents ?? 0) / 100,
        discount: Number(row.discount_cents ?? 0) / 100,
        shipping_cost: Number(row.shipping_cents ?? 0) / 100,
        total: Number(row.total_cents ?? 0) / 100,
        tracking_code: (row.tracking_code as string) ?? null,
        shipping_address: (row.shipping_address as Record<string, string>) ?? {
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          zip_code: "",
        },
        notes: (row.notes as string) ?? null,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
        customer: { name: customerName } as Record<string, unknown>,
        items: itemCount > 0 ? Array(itemCount).fill({ id: "placeholder" }) : undefined,
      };
    }) as unknown as Order[];
  } catch (error) {
    console.error("[OrdersPage] Failed to fetch orders:", error);
  }

  return <OrdersContent orders={orders} />;
}
