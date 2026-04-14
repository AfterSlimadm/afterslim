import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/cartrover/webhook
 * Receives shipment/tracking updates from CartRover (FullStack Fulfillment).
 * CartRover sends this when the warehouse dispatches an order.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      cart_order_id,
      tracking_number,
      carrier,
      ship_date,
    } = body;

    if (!cart_order_id) {
      return NextResponse.json(
        { error: "Missing cart_order_id" },
        { status: 400 }
      );
    }

    console.log("[cartrover-webhook] Received tracking for:", cart_order_id);

    const supabase = getAdminClient();

    // Find the order by order_number
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("order_number", cart_order_id)
      .single();

    if (findError || !order) {
      console.error("[cartrover-webhook] Order not found:", cart_order_id);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order with tracking info
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (tracking_number) {
      updates.tracking_code = tracking_number;
      updates.status = "shipped";
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", order.id);

    if (updateError) {
      console.error("[cartrover-webhook] Failed to update order:", updateError.message);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Log event
    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "shipped",
      old_value: order.status,
      new_value: "shipped",
      actor: "cartrover",
      metadata: {
        tracking_number,
        carrier,
        ship_date,
      },
    });

    console.log(
      "[cartrover-webhook] Order updated:",
      cart_order_id,
      "tracking:",
      tracking_number
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[cartrover-webhook] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
