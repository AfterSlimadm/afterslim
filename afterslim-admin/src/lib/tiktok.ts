/**
 * TikTok Events API (server-side) — purchase forwarding helper.
 *
 * Sends server-side conversion events to TikTok to complement the browser
 * pixel. Browser + server ("dual instrumentation") maximizes matched events
 * and survives ad-blockers / iOS / cookie loss.
 *
 * Deduplication: the browser pixel and this server call MUST share the same
 * `event_id`. We derive it deterministically from the Stripe identifier that
 * both sides see — the PaymentIntent id (one-time / first subscription) or the
 * invoice id (renewals). See buildPurchaseEventId().
 *
 * Required env (set in Vercel, never commit):
 *   - TIKTOK_PIXEL_ID      e.g. "C9XXXXXXXXXXXXXXXXXX" (same id used in the LP pixel)
 *   - TIKTOK_ACCESS_TOKEN  generated in Events Manager > the pixel > Settings > Generate access token
 *
 * If either env is missing the helper no-ops (same defensive pattern as listflex).
 */

import crypto from "crypto";

const TIKTOK_API_URL =
  "https://business-api.tiktok.com/open_api/v1.3/event/track/";

/** Deterministic dedup key shared with the browser CompletePayment event. */
export function buildPurchaseEventId(stripeId: string): string {
  return `tt_purchase_${stripeId}`;
}

/** SHA-256 hex over a normalized string. Returns "" for empty input. */
function sha256(input: string | null | undefined): string {
  if (!input) return "";
  const normalized = String(input).trim().toLowerCase();
  if (!normalized) return "";
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/** Normalize phone to E.164 (digits + leading +, default US) before hashing. */
function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  let digits = String(phone).replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.charAt(0) !== "+") digits = "+1" + digits.replace(/^\+/, "");
  return digits;
}

export interface TikTokContent {
  content_id: string;
  content_type?: string; // "product"
  content_name?: string;
  quantity?: number;
  price?: number; // unit price, major units (USD)
}

export interface TikTokPurchaseInput {
  /** Stripe id used to build the dedup event_id (PaymentIntent id or invoice id). */
  stripeId: string;
  /** Order total in major units (USD), e.g. 57.99 */
  value: number;
  currency?: string; // default "USD"
  email?: string | null;
  phone?: string | null;
  contents?: TikTokContent[];
  /** TikTok click id captured at checkout and passed through Stripe metadata. */
  ttclid?: string | null;
  /** _ttp cookie value captured at checkout and passed through Stripe metadata. */
  ttp?: string | null;
  /** Page where the conversion completed (defaults to the success page). */
  pageUrl?: string;
}

/**
 * Send a CompletePayment event to the TikTok Events API.
 * Non-blocking by contract: never throws, returns a result object instead.
 */
export async function trackTikTokPurchase(
  input: TikTokPurchaseInput
): Promise<{ success: boolean; response?: string }> {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("[tiktok] missing TIKTOK_PIXEL_ID or TIKTOK_ACCESS_TOKEN");
    return { success: false, response: "missing config" };
  }

  const hashedEmail = sha256(input.email);
  const hashedPhone = sha256(normalizePhone(input.phone));
  // external_id: stable hashed identifier. Email is the best available anchor.
  const externalId = hashedEmail;

  // TikTok requires at least one identifier. Without any, the event is useless.
  if (!hashedEmail && !hashedPhone && !input.ttclid && !input.ttp) {
    console.warn("[tiktok] no identifiers for purchase, skipping", input.stripeId);
    return { success: false, response: "no identifiers" };
  }

  const user: Record<string, string> = {};
  if (hashedEmail) user.email = hashedEmail;
  if (hashedPhone) user.phone = hashedPhone;
  if (externalId) user.external_id = externalId;
  if (input.ttclid) user.ttclid = input.ttclid;
  if (input.ttp) user.ttp = input.ttp;

  const payload = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: "CompletePayment",
        event_time: Math.floor(Date.now() / 1000),
        event_id: buildPurchaseEventId(input.stripeId),
        user,
        properties: {
          currency: input.currency ?? "USD",
          value: input.value,
          ...(input.contents && input.contents.length
            ? {
                contents: input.contents.map((c) => ({
                  content_id: c.content_id,
                  content_type: c.content_type ?? "product",
                  ...(c.content_name ? { content_name: c.content_name } : {}),
                  ...(c.quantity ? { quantity: c.quantity } : {}),
                  ...(c.price != null ? { price: c.price } : {}),
                })),
              }
            : {}),
        },
        page: {
          url: input.pageUrl ?? "https://www.afterslim.com/checkout/success",
        },
      },
    ],
  };

  try {
    const res = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    // TikTok responds 200 with { code: 0, message: "OK", ... } on success.
    let success = false;
    try {
      const json = JSON.parse(text);
      success = json.code === 0;
      if (!success) console.warn("[tiktok] non-zero code:", text);
    } catch {
      console.warn("[tiktok] unparseable response:", text);
    }
    return { success, response: text };
  } catch (err) {
    console.error("[tiktok] failed to send purchase event:", err);
    return { success: false, response: String(err) };
  }
}
