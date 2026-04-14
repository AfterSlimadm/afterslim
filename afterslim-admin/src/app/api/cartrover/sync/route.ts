import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { getOrderStatus } from "@/lib/cartrover";

/**
 * GET /api/cartrover/sync
 * Polls CartRover for tracking updates on orders stuck in "processing".
 * Call via Vercel Cron or manually.
 * Respects CartRover rate limit (100 calls bucket, 1 refill per 0.6s).
 */
export async function GET() {
  const supabase = getAdminClient();

  // Find orders sent to CartRover but without tracking
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, metadata")
    .eq("status", "processing")
    .order("created_at", { ascending: true })
    .limit(50); // Stay well within rate limits

  if (error) {
    console.error("[cartrover-sync] Failed to fetch orders:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ synced: 0, message: "No orders to sync" });
  }

  let synced = 0;
  let errors = 0;

  for (const order of orders) {
    // Only sync orders that have a cartrover_ref
    const meta = order.metadata as Record<string, unknown> | null;
    if (!meta?.cartrover_ref) continue;

    try {
      // cust_ref = order.id (our Supabase UUID)
      const result = await getOrderStatus(order.id);
      const shipments = result.response?.shipments ?? [];
      const firstShipment = shipments[0];

      if (firstShipment?.tracking_number) {
        await supabase
          .from("orders")
          .update({
            tracking_code: firstShipment.tracking_number,
            status: "shipped",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        await supabase.from("order_events").insert({
          order_id: order.id,
          event_type: "shipped",
          old_value: "processing",
          new_value: "shipped",
          actor: "cartrover-sync",
          metadata: {
            tracking_number: firstShipment.tracking_number,
            carrier: firstShipment.carrier ?? result.response?.carrier,
            ship_date: firstShipment.ship_date,
          },
        });

        synced++;
        console.log("[cartrover-sync] Updated:", order.order_number, "tracking:", firstShipment.tracking_number);
      }

      // Small delay to respect rate limits (600ms between calls)
      await new Promise((r) => setTimeout(r, 650));
    } catch (err) {
      errors++;
      console.error("[cartrover-sync] Failed for", order.order_number, ":", err);
    }
  }

  console.log(`[cartrover-sync] Done. Synced: ${synced}, Errors: ${errors}, Total checked: ${orders.length}`);

  return NextResponse.json({
    synced,
    errors,
    total_checked: orders.length,
  });
}
