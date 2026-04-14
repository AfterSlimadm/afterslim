/**
 * CartRover (Extensiv Integration Manager) API Client
 * Docs: https://developers.cartrover.com/
 *
 * Uses Cart API level for sending orders and receiving tracking.
 * Auth: Basic Auth (base64 of api_user:api_key)
 * Endpoint: /v1/cart/...
 */

const BASE_URL = "https://api.cartrover.com/v1/cart";

function getAuthHeader(): string {
  const user = process.env.CARTROVER_API_USER;
  const key = process.env.CARTROVER_API_KEY;
  if (!user || !key) throw new Error("[cartrover] Missing API credentials");
  return "Basic " + Buffer.from(`${user}:${key}`).toString("base64");
}

async function cartRoverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Authorization: getAuthHeader(),
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  let lastError: Error | null = null;

  // 1 retry on network error
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();

      if (!res.ok || data.success_code === false) {
        const msg = data.message || data.error_code || `HTTP ${res.status}`;
        console.error(`[cartrover] API error (${path}):`, msg);
        throw new Error(`[cartrover] ${msg}`);
      }

      return data as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === 0 && !lastError.message.includes("[cartrover]")) {
        console.warn(`[cartrover] Retrying ${path} after error:`, lastError.message);
        continue;
      }
      break;
    }
  }

  throw lastError!;
}

// ─── Types ────────────────────────────────────────────────────

export interface CartRoverOrderItem {
  item: string; // SKU/item identifier (required by CartRover)
  sku?: string;
  quantity: number;
  price: number; // unit price in dollars
  extended_amount: number; // price * quantity
  description?: string;
}

export interface CartRoverOrder {
  cart_order_id: string; // our order_number
  cust_ref: string; // customer reference (required)
  cust_email: string;
  cust_first_name: string;
  cust_last_name: string;
  ship_first_name: string;
  ship_last_name: string;
  ship_address_1: string;
  ship_address_2?: string;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_country: string;
  ship_phone?: string;
  ship_code?: string; // shipping method code
  sub_total: number;
  grand_total: number;
  shipping_handling?: number;
  sales_tax?: number;
  order_discount?: number;
  items: CartRoverOrderItem[];
}

export interface CartRoverSubmitResponse {
  success_code: boolean;
  cust_ref: string;
  order_number: string;
}

export interface CartRoverShipment {
  tracking_number?: string;
  carrier?: string;
  ship_date?: string;
}

export interface CartRoverOrderResponse {
  success_code: boolean;
  response: {
    cust_ref: string;
    carrier?: string;
    ship_code?: string;
    regional_ship_date?: string;
    shipments: CartRoverShipment[];
    items: { item: string; quantity: number }[];
  };
}

// ─── API Methods ──────────────────────────────────────────────

/**
 * Submit a new order to CartRover for fulfillment.
 * POST /v1/cart/orders/new
 */
export async function submitOrder(
  order: CartRoverOrder
): Promise<CartRoverSubmitResponse> {
  console.log("[cartrover] Submitting order:", order.cart_order_id);

  const response = await cartRoverFetch<CartRoverSubmitResponse>(
    "/orders/new",
    {
      method: "POST",
      body: JSON.stringify(order),
    }
  );

  console.log("[cartrover] Order submitted:", order.cart_order_id, "ref:", response.order_number);
  return response;
}

/**
 * Get order status and tracking from CartRover.
 * GET /v1/cart/orders/{cust_ref}
 * cust_ref = our order UUID (order.id)
 */
export async function getOrderStatus(
  custRef: string
): Promise<CartRoverOrderResponse> {
  console.log("[cartrover] Getting status for:", custRef);

  const response = await cartRoverFetch<CartRoverOrderResponse>(
    `/orders/${encodeURIComponent(custRef)}`
  );

  return response;
}
