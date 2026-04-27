import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import { postBuyerLead, postAbandonLead } from "@/lib/listflex";
import { submitOrder } from "@/lib/cartrover";
import type Stripe from "stripe";

/**
 * POST /api/checkout/webhook
 * Stripe webhook handler.
 * - payment_intent.succeeded           -> create order (one-time AND first subscription payment)
 * - checkout.session.completed         -> legacy Embedded Checkout path (still supported)
 * - checkout.session.expired           -> abandon lead + Listflex abandon
 * - invoice.paid (subscription_cycle)  -> renewal: create order + decrement_stock + CartRover (month 2+)
 * - customer.subscription.created      -> tag subscription status on order metadata
 * - customer.subscription.updated      -> sync status / period
 * - customer.subscription.deleted      -> mark cancelled
 */
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.expired":
      await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
      break;
    case "invoice.paid":
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    default:
      // Other events ignored
      break;
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractShippingAddress(session: any) {
  const details = session.shipping_details;
  if (!details?.address) return null;
  return {
    line1: details.address.line1,
    line2: details.address.line2,
    city: details.address.city,
    state: details.address.state,
    postal_code: details.address.postal_code,
    country: details.address.country,
    name: details.name,
  };
}

function splitName(fullName?: string | null): { fname: string; lname: string } {
  if (!fullName) return { fname: "", lname: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    fname: parts[0] ?? "",
    lname: parts.slice(1).join(" ") || "",
  };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminClient();

  // Idempotency: check if order already exists
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (existing) {
    console.log("[webhook] order already exists for session:", session.id);
    return;
  }

  const metadata = session.metadata ?? {};
  const totalCents = session.amount_total ?? 0;
  const email = session.customer_details?.email ?? session.customer_email;

  // Resolve product/quantity. Prefer metadata (set by /api/checkout); fallback to stripe_prices lookup.
  let productId: string | null = metadata.product_id ?? null;
  let qty: number = Number(metadata.quantity) || 0;
  let isSubscription: boolean = metadata.is_subscription === "true";
  let interval: string | null = null;

  if ((!productId || !qty) && metadata.price_id) {
    const { data: priceRow } = await supabase
      .from("stripe_prices")
      .select("product_id, quantity, is_subscription, interval")
      .eq("price_id", metadata.price_id)
      .single();
    if (priceRow) {
      productId = productId ?? priceRow.product_id;
      qty = qty || priceRow.quantity;
      isSubscription = isSubscription || priceRow.is_subscription;
      interval = priceRow.interval;
    }
  }

  if (!qty) qty = 1;

  // Fetch product info (name, price, sku) for order_item + CartRover
  let product: { name: string; price_cents: number; sku: string | null } | null = null;
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("name, price_cents, sku")
      .eq("id", productId)
      .single();
    product = data;
  }

  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  const customerNameForOrder = session.customer_details?.name ?? "";
  const namePartsForOrder = splitName(customerNameForOrder);

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      status: "paid",
      subtotal_cents: totalCents,
      total_cents: totalCents,
      shipping_address: extractShippingAddress(session),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      metadata: {
        product_id: productId,
        price_id: metadata.price_id,
        quantity: qty,
        is_subscription: isSubscription,
        ...(stripeSubscriptionId
          ? {
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              subscription_first_name: namePartsForOrder.fname,
              subscription_last_name: namePartsForOrder.lname,
              subscription_phone: session.customer_details?.phone ?? null,
            }
          : {}),
      },
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[webhook] failed to create order:", orderError?.message);
    return;
  }
  const orderNumber = order.order_number;

  // Create order item
  if (productId && product) {
    const { error: itemErr } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      product_name: product.name,
      quantity: qty,
      unit_price_cents: Math.round(totalCents / qty),
      is_subscription: isSubscription,
      subscription_interval: isSubscription ? interval ?? "month" : null,
    });
    if (itemErr) console.error("[webhook] order_item insert failed:", itemErr.message);

    // Decrement stock
    const { error: stockErr } = await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity: qty,
    });
    if (stockErr) console.error("[webhook] decrement_stock failed:", stockErr.message);
  } else {
    console.error("[webhook] no product resolved for session", session.id, "metadata:", metadata);
  }

  // Income transaction
  const totalDollars = totalCents / 100;
  await supabase.from("transactions").insert({
    type: "income",
    category: "sale",
    description: `Order ${orderNumber}`,
    amount: totalDollars,
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    reference_id: order.id,
    reference_type: "order",
    created_by: "webhook",
  });

  // Upsert customer record (denormalized view for admin dashboard)
  const customerName = session.customer_details?.name;
  const { fname, lname } = splitName(customerName);
  const shippingAddr = extractShippingAddress(session);
  if (email) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_orders, total_spent")
      .eq("email", email)
      .single();

    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          first_name: fname || undefined,
          last_name: lname || undefined,
          phone: session.customer_details?.phone ?? undefined,
          default_address: shippingAddr,
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + totalCents,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabase.from("customers").insert({
        email,
        first_name: fname,
        last_name: lname,
        phone: session.customer_details?.phone ?? null,
        default_address: shippingAddr,
        total_orders: 1,
        total_spent: totalCents,
      });
    }
  }

  // Forward buyer lead to Listflex
  postBuyerLead({
    email: email ?? undefined,
    fname,
    lname,
    phone: session.customer_details?.phone ?? undefined,
    offer: "https://afterslim.com",
    comments: `Order ${orderNumber} - $${totalDollars} - qty ${qty}${isSubscription ? " (subscription)" : ""}`,
  }).catch((err) => console.error("[listflex] buyer post failed:", err));

  // Forward order to CartRover
  if (shippingAddr && email && product) {
    try {
      const unitPrice = totalDollars / qty;
      const sku = product.sku ?? "GP0363";
      const crResponse = await submitOrder({
        cart_order_id: orderNumber,
        cust_ref: order.id,
        cust_email: email,
        cust_first_name: fname,
        cust_last_name: lname,
        ship_first_name: fname,
        ship_last_name: lname,
        ship_address_1: shippingAddr.line1 || "",
        ship_address_2: shippingAddr.line2 || undefined,
        ship_city: shippingAddr.city || "",
        ship_state: shippingAddr.state || "",
        ship_zip: shippingAddr.postal_code || "",
        ship_country: shippingAddr.country || "US",
        sub_total: totalDollars,
        grand_total: totalDollars,
        shipping_handling: 0,
        sales_tax: 0,
        order_discount: 0,
        items: [
          {
            item: sku,
            sku,
            quantity: qty,
            price: unitPrice,
            extended_amount: unitPrice * qty,
            description: product.name,
          },
        ],
      });

      await supabase
        .from("orders")
        .update({
          status: "processing",
          metadata: {
            product_id: productId,
            price_id: metadata.price_id,
            quantity: qty,
            is_subscription: isSubscription,
            cartrover_ref: crResponse.order_number,
          },
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        event_type: "status_changed",
        old_value: "paid",
        new_value: "processing",
        actor: "cartrover",
      });

      console.log("[webhook] order sent to CartRover:", orderNumber);
    } catch (err) {
      console.error("[webhook] CartRover submission failed (non-blocking):", err);
    }
  }

  console.log("[webhook] order created:", orderNumber, "id:", order.id, "qty:", qty);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.customer_email;

  if (!email) {
    console.log("[webhook] expired session without email, skipping abandon");
    return;
  }

  // Save abandon lead to DB
  const supabase = getAdminClient();
  await supabase.from("leads").insert({
    email,
    source: "checkout_abandon",
    utm_source: session.metadata?.utm_source ?? null,
    utm_medium: session.metadata?.utm_medium ?? null,
    utm_campaign: session.metadata?.utm_campaign ?? null,
    consent_marketing: false,
    metadata: {
      stripe_session_id: session.id,
      amount_total: session.amount_total,
    },
  });

  // Forward abandon lead to Listflex
  const customerName = session.customer_details?.name;
  const { fname, lname } = splitName(customerName);
  postAbandonLead({
    email,
    fname,
    lname,
    offer: "https://afterslim.com",
    comments: "Checkout abandoned",
  }).catch((err) => console.error("[listflex] abandon post failed:", err));

  console.log("[webhook] abandon lead saved:", email);
}

/**
 * invoice.paid (billing_reason='subscription_cycle') — subscription renewal.
 * The first invoice (billing_reason='subscription_create') is ignored because the
 * checkout.session.completed handler already created the first order.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== "subscription_cycle") return;

  // Stripe SDK v20 moved/deprecated `subscription` and `payment_intent` from Invoice.
  // Cast to access legacy fields that are still present in webhook payloads.
  const inv = invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null;
    payment_intent?: string | Stripe.PaymentIntent | null;
  };

  const supabase = getAdminClient();
  const stripeSubId =
    typeof inv.subscription === "string"
      ? inv.subscription
      : inv.subscription?.id;
  if (!stripeSubId) return;

  // Idempotency: skip if we already processed this invoice
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("metadata->>stripe_invoice_id", invoice.id)
    .maybeSingle();
  if (existing) {
    console.log("[webhook] invoice.paid already processed:", invoice.id);
    return;
  }

  // Find the original order to inherit shipping/customer info
  const { data: originalOrder } = await supabase
    .from("orders")
    .select("email, shipping_address, metadata")
    .eq("metadata->>stripe_subscription_id", stripeSubId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!originalOrder) {
    console.error("[webhook] invoice.paid: no original order for subscription", stripeSubId);
    return;
  }

  const origMeta = (originalOrder.metadata ?? {}) as Record<string, unknown>;
  const productId = (origMeta.product_id as string) ?? null;
  const qty = Number(origMeta.quantity) || 1;
  const priceId = (origMeta.price_id as string) ?? null;
  const fname = (origMeta.subscription_first_name as string) ?? "";
  const lname = (origMeta.subscription_last_name as string) ?? "";
  const totalCents = invoice.amount_paid ?? 0;
  const email = invoice.customer_email ?? originalOrder.email;
  const shippingAddr = originalOrder.shipping_address as ShippingAddress | null;

  let product: { name: string; sku: string | null } | null = null;
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("name, sku")
      .eq("id", productId)
      .single();
    product = data;
  }

  // Create renewal order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      status: "paid",
      subtotal_cents: totalCents,
      total_cents: totalCents,
      shipping_address: shippingAddr,
      stripe_payment_intent_id:
        typeof inv.payment_intent === "string" ? inv.payment_intent : null,
      metadata: {
        product_id: productId,
        price_id: priceId,
        quantity: qty,
        is_subscription: true,
        billing_reason: "subscription_cycle",
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: stripeSubId,
        subscription_first_name: fname,
        subscription_last_name: lname,
      },
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[webhook] invoice.paid order insert failed:", orderError?.message);
    return;
  }

  if (productId && product) {
    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      product_name: product.name,
      quantity: qty,
      unit_price_cents: Math.round(totalCents / qty),
      is_subscription: true,
      subscription_interval: "month",
    });

    await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity: qty,
    });
  }

  const totalDollars = totalCents / 100;
  await supabase.from("transactions").insert({
    type: "income",
    category: "subscription",
    description: `Renewal ${order.order_number}`,
    amount: totalDollars,
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    reference_id: order.id,
    reference_type: "order",
    created_by: "webhook",
  });

  // Update customer aggregates
  if (email) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_orders, total_spent")
      .eq("email", email)
      .single();
    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + totalCents,
        })
        .eq("id", existingCustomer.id);
    }
  }

  // CartRover for the renewal shipment
  if (shippingAddr && email && product) {
    try {
      const sku = product.sku ?? "GP0363";
      const unitPrice = totalDollars / qty;
      const crResponse = await submitOrder({
        cart_order_id: order.order_number,
        cust_ref: order.id,
        cust_email: email,
        cust_first_name: fname,
        cust_last_name: lname,
        ship_first_name: fname,
        ship_last_name: lname,
        ship_address_1: shippingAddr.line1 || "",
        ship_address_2: shippingAddr.line2 || undefined,
        ship_city: shippingAddr.city || "",
        ship_state: shippingAddr.state || "",
        ship_zip: shippingAddr.postal_code || "",
        ship_country: shippingAddr.country || "US",
        sub_total: totalDollars,
        grand_total: totalDollars,
        shipping_handling: 0,
        sales_tax: 0,
        order_discount: 0,
        items: [
          {
            item: sku,
            sku,
            quantity: qty,
            price: unitPrice,
            extended_amount: unitPrice * qty,
            description: product.name,
          },
        ],
      });

      await supabase
        .from("orders")
        .update({
          status: "processing",
          metadata: {
            product_id: productId,
            price_id: priceId,
            quantity: qty,
            is_subscription: true,
            billing_reason: "subscription_cycle",
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: stripeSubId,
            subscription_first_name: fname,
            subscription_last_name: lname,
            cartrover_ref: crResponse.order_number,
          },
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        event_type: "status_changed",
        old_value: "paid",
        new_value: "processing",
        actor: "cartrover",
      });
    } catch (err) {
      console.error("[webhook] invoice.paid CartRover failed (non-blocking):", err);
    }
  }

  console.log("[webhook] subscription renewal order created:", order.order_number);
}

/**
 * customer.subscription.created / .updated
 * Tag the subscription's most recent order with current Stripe status.
 * Useful for the admin dashboard to filter "active subscribers".
 */
async function handleSubscriptionUpsert(sub: Stripe.Subscription) {
  const supabase = getAdminClient();
  const status = sub.status;
  // Stripe SDK v20 moved `current_period_end` from the Subscription root to items[0].
  const periodEndUnix =
    sub.items?.data?.[0]?.current_period_end ??
    (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  const periodEnd = periodEndUnix
    ? new Date(periodEndUnix * 1000).toISOString()
    : null;

  // Find the most recent order linked to this subscription, append status
  const { data: orders } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("metadata->>stripe_subscription_id", sub.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!orders || orders.length === 0) return;
  const last = orders[0];
  const meta = (last.metadata ?? {}) as Record<string, unknown>;

  await supabase
    .from("orders")
    .update({
      metadata: {
        ...meta,
        subscription_status: status,
        subscription_current_period_end: periodEnd,
      },
    })
    .eq("id", last.id);

  console.log("[webhook] subscription", sub.id, "status:", status);
}

/**
 * customer.subscription.deleted
 * Mark the linked orders' metadata with status='cancelled'.
 */
async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const supabase = getAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("metadata->>stripe_subscription_id", sub.id);

  if (!orders) return;
  for (const o of orders) {
    const meta = (o.metadata ?? {}) as Record<string, unknown>;
    await supabase
      .from("orders")
      .update({
        metadata: {
          ...meta,
          subscription_status: "canceled",
          subscription_canceled_at: new Date().toISOString(),
        },
      })
      .eq("id", o.id);
  }

  console.log("[webhook] subscription cancelled:", sub.id, "orders updated:", orders.length);
}

interface ShippingAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  name?: string | null;
}

/**
 * payment_intent.succeeded
 * Fires for both one-time payments and the FIRST subscription payment.
 * (Renewal cycles fire `invoice.paid` with billing_reason='subscription_cycle' instead.)
 *
 * The PaymentIntent metadata is populated by /api/checkout with:
 *   { price_id, product_id, quantity, is_subscription, interval?,
 *     stripe_subscription_id?, stripe_customer_id? }
 */
async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  const supabase = getAdminClient();

  // Idempotency
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", pi.id)
    .maybeSingle();
  if (existing) {
    console.log("[webhook] payment_intent already processed:", pi.id);
    return;
  }

  const meta = pi.metadata ?? {};
  const productId = meta.product_id || null;
  const qty = Number(meta.quantity) || 1;
  const priceId = meta.price_id || null;
  const isSubscription = meta.is_subscription === "true";
  const interval = meta.interval || null;
  const stripeSubscriptionId = meta.stripe_subscription_id || null;
  const stripeCustomerId = meta.stripe_customer_id || null;

  const totalCents = pi.amount_received ?? pi.amount ?? 0;
  const email = pi.receipt_email ?? null;
  const shipping = pi.shipping;
  const customerName = shipping?.name ?? "";
  const phone = shipping?.phone ?? null;
  const { fname, lname } = splitName(customerName);
  const shippingAddr: ShippingAddress | null = shipping?.address
    ? {
        line1: shipping.address.line1,
        line2: shipping.address.line2,
        city: shipping.address.city,
        state: shipping.address.state,
        postal_code: shipping.address.postal_code,
        country: shipping.address.country,
        name: customerName,
      }
    : null;

  // Fetch product info
  let product: { name: string; price_cents: number; sku: string | null } | null = null;
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("name, price_cents, sku")
      .eq("id", productId)
      .single();
    product = data;
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email,
      status: "paid",
      subtotal_cents: totalCents,
      total_cents: totalCents,
      shipping_address: shippingAddr,
      stripe_payment_intent_id: pi.id,
      metadata: {
        product_id: productId,
        price_id: priceId,
        quantity: qty,
        is_subscription: isSubscription,
        ...(stripeSubscriptionId
          ? {
              stripe_subscription_id: stripeSubscriptionId,
              stripe_customer_id: stripeCustomerId,
              subscription_first_name: fname,
              subscription_last_name: lname,
            }
          : {}),
      },
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[webhook] payment_intent: order insert failed:", orderError?.message);
    return;
  }
  const orderNumber = order.order_number;

  // Order item
  if (productId && product) {
    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      product_name: product.name,
      quantity: qty,
      unit_price_cents: Math.round(totalCents / qty),
      is_subscription: isSubscription,
      subscription_interval: isSubscription ? interval ?? "month" : null,
    });

    await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity: qty,
    });
  } else {
    console.error("[webhook] payment_intent: no product resolved", pi.id, "meta:", meta);
  }

  // Income transaction
  const totalDollars = totalCents / 100;
  await supabase.from("transactions").insert({
    type: "income",
    category: isSubscription ? "subscription" : "sale",
    description: `Order ${orderNumber}`,
    amount: totalDollars,
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    reference_id: order.id,
    reference_type: "order",
    created_by: "webhook",
  });

  // Upsert customer
  if (email) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, total_orders, total_spent")
      .eq("email", email)
      .single();
    if (existingCustomer) {
      await supabase
        .from("customers")
        .update({
          first_name: fname || undefined,
          last_name: lname || undefined,
          phone: phone ?? undefined,
          default_address: shippingAddr,
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + totalCents,
        })
        .eq("id", existingCustomer.id);
    } else {
      await supabase.from("customers").insert({
        email,
        first_name: fname,
        last_name: lname,
        phone,
        default_address: shippingAddr,
        total_orders: 1,
        total_spent: totalCents,
      });
    }
  }

  // Listflex BUYERS
  postBuyerLead({
    email: email ?? undefined,
    fname,
    lname,
    phone: phone ?? undefined,
    offer: "https://afterslim.com",
    comments: `Order ${orderNumber} - $${totalDollars} - qty ${qty}${isSubscription ? " (subscription)" : ""}`,
  }).catch((err) => console.error("[listflex] buyer post failed:", err));

  // CartRover
  if (shippingAddr && email && product) {
    try {
      const sku = product.sku ?? "GP0363";
      const unitPrice = totalDollars / qty;
      const crResponse = await submitOrder({
        cart_order_id: orderNumber,
        cust_ref: order.id,
        cust_email: email,
        cust_first_name: fname,
        cust_last_name: lname,
        ship_first_name: fname,
        ship_last_name: lname,
        ship_address_1: shippingAddr.line1 || "",
        ship_address_2: shippingAddr.line2 || undefined,
        ship_city: shippingAddr.city || "",
        ship_state: shippingAddr.state || "",
        ship_zip: shippingAddr.postal_code || "",
        ship_country: shippingAddr.country || "US",
        sub_total: totalDollars,
        grand_total: totalDollars,
        shipping_handling: 0,
        sales_tax: 0,
        order_discount: 0,
        items: [
          {
            item: sku,
            sku,
            quantity: qty,
            price: unitPrice,
            extended_amount: unitPrice * qty,
            description: product.name,
          },
        ],
      });

      await supabase
        .from("orders")
        .update({
          status: "processing",
          metadata: {
            product_id: productId,
            price_id: priceId,
            quantity: qty,
            is_subscription: isSubscription,
            ...(stripeSubscriptionId
              ? {
                  stripe_subscription_id: stripeSubscriptionId,
                  stripe_customer_id: stripeCustomerId,
                  subscription_first_name: fname,
                  subscription_last_name: lname,
                }
              : {}),
            cartrover_ref: crResponse.order_number,
          },
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        event_type: "status_changed",
        old_value: "paid",
        new_value: "processing",
        actor: "cartrover",
      });
    } catch (err) {
      console.error("[webhook] payment_intent CartRover failed (non-blocking):", err);
    }
  }

  console.log("[webhook] payment_intent order created:", orderNumber, "id:", order.id, "qty:", qty);
}
