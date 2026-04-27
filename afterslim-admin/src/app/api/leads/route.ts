import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { postAbandonLead } from "@/lib/listflex";

const ALLOWED_ORIGINS = [
  "https://afterslim.com",
  "https://www.afterslim.com",
  "http://localhost:3000",
];

const VALID_SOURCES = new Set(["popup", "footer", "blog", "checkout_abandon"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string | null) {
  const allowed = ALLOWED_ORIGINS.includes(origin ?? "")
    ? origin!
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/**
 * POST /api/leads
 * Captures pre-checkout lead emails (popup, footer newsletter, etc).
 * Body: {
 *   email: string,
 *   source?: 'popup' | 'footer' | 'blog' | 'checkout_abandon' (default 'popup'),
 *   first_name?: string,
 *   utm_source?: string, utm_medium?: string, utm_campaign?: string,
 *   consent_marketing?: boolean
 * }
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const source = VALID_SOURCES.has(body.source) ? body.source : "popup";
    const firstName = typeof body.first_name === "string" ? body.first_name.trim().slice(0, 80) : "";
    const utmSource = typeof body.utm_source === "string" ? body.utm_source.slice(0, 80) : null;
    const utmMedium = typeof body.utm_medium === "string" ? body.utm_medium.slice(0, 80) : null;
    const utmCampaign = typeof body.utm_campaign === "string" ? body.utm_campaign.slice(0, 80) : null;
    const consent = body.consent_marketing === true;

    const supabase = getAdminClient();

    // Upsert by email — unique partial index idx_leads_email_unique
    const { data: existing } = await supabase
      .from("leads")
      .select("id, source, consent_marketing")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Already on the list. Update consent if newly granted; keep first source.
      if (consent && !existing.consent_marketing) {
        await supabase
          .from("leads")
          .update({ consent_marketing: true })
          .eq("id", existing.id);
      }
      return NextResponse.json(
        { ok: true, status: "already_subscribed" },
        { headers: corsHeaders(origin) }
      );
    }

    const { error: insertErr } = await supabase.from("leads").insert({
      email,
      source,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      consent_marketing: consent,
      metadata: { first_name: firstName || null },
    });

    if (insertErr) {
      console.error("[leads] insert failed:", insertErr.message);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    // Forward to Listflex ABANDONS list (non-blocking)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    postAbandonLead({
      email,
      fname: firstName || undefined,
      ip,
      offer: "https://afterslim.com",
      comments: `Source: ${source}${utmCampaign ? ` | utm: ${utmCampaign}` : ""}`,
    }).catch((err) => console.error("[listflex] lead post failed:", err));

    return NextResponse.json(
      { ok: true, status: "subscribed" },
      { headers: corsHeaders(origin) }
    );
  } catch (err) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
