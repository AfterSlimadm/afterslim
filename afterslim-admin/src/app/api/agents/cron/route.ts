import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// Vercel Hobby allows up to 60s for serverless functions
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET ?? "";
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY ?? "";
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID ?? "325148";

const FREE_MODELS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// ── LLM call helper (NVIDIA → OpenRouter fallback) ─────────────────────────
async function callLLM(system: string, user: string): Promise<string | null> {
  // 1. NVIDIA Kimi K2.5 (20s timeout)
  if (NVIDIA_API_KEY) {
    try {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2.5",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          max_tokens: 500,
          temperature: 0.4,
          top_p: 0.9,
          stream: false,
          chat_template_kwargs: { thinking: false },
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) {
        const d = await res.json();
        const content = d.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch {
      /* fall through */
    }
  }

  // 2. OpenRouter free models
  if (!OPENROUTER_API_KEY) return null;
  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://admin.afterslim.com",
          "X-Title": "AfterSlim Cron",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          max_tokens: 500,
          temperature: 0.4,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429) continue;
      if (!res.ok) continue;
      const d = await res.json();
      const content = d.choices?.[0]?.message?.content;
      if (content) return content;
    } catch {
      continue;
    }
  }
  return null;
}

// ── PostHog data fetch ──────────────────────────────────────────────────────
async function getPostHogSummary(): Promise<string> {
  if (!POSTHOG_API_KEY) return "PostHog not configured.";
  try {
    const res = await fetch(
      `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?limit=20&orderBy=-timestamp`,
      {
        headers: { Authorization: `Bearer ${POSTHOG_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return "PostHog API error.";
    const d = await res.json();
    const events = d.results ?? [];
    if (events.length === 0) return "No PostHog events in the last 24h.";

    const summary = events
      .slice(0, 10)
      .map(
        (e: { event: string; timestamp: string; properties?: { $current_url?: string } }) =>
          `- ${e.event} at ${new Date(e.timestamp).toLocaleString("en-US")}${e.properties?.$current_url ? ` (${e.properties.$current_url})` : ""}`
      )
      .join("\n");
    return `Recent store events:\n${summary}`;
  } catch {
    return "PostHog unreachable.";
  }
}

// ── Context builder ─────────────────────────────────────────────────────────
interface CronContext {
  recentOrders: string;
  recentIdeas: string;
  kanbanActivity: string;
  financialSummary: string;
  posthogSummary: string;
  today: string;
}

// ── Agent cron tasks ────────────────────────────────────────────────────────

function parseJsonReply(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
  } catch {
    return null;
  }
}

// MANAGEMENT: Executive daily summary
async function runManagement(
  ctx: CronContext,
  supabase: ReturnType<typeof createServerClient>
): Promise<void> {
  const system = `You are the MANAGEMENT agent for AfterSlim (US supplement brand). Generate a DAILY EXECUTIVE SUMMARY.
Analyze orders, ideas, kanban, and finances. Output:
1. STATUS: One sentence about business state
2. PRIORITY: Most urgent item for today
3. ALERT: Something needing attention (or "none")
Format: JSON { "status": "...", "priority": "...", "alert": "..." }
Respond ONLY with JSON, no markdown.`;

  const user = `DATE: ${ctx.today}\n\nRECENT ORDERS:\n${ctx.recentOrders || "No orders in last 24h"}\n\nIDEAS:\n${ctx.recentIdeas || "No recent ideas"}\n\nKANBAN:\n${ctx.kanbanActivity || "No activity"}\n\nFINANCES:\n${ctx.financialSummary || "No data"}`;

  const reply = await callLLM(system, user);
  if (!reply) return;

  const parsed = parseJsonReply(reply);
  const content = parsed
    ? `Status: ${parsed.status}. Priority: ${parsed.priority}. Alert: ${parsed.alert}`
    : reply.slice(0, 500);

  await supabase.from("as_agent_memory").insert({
    agent_id: "as-management",
    kind: "summary",
    content,
    metadata: { type: "daily_summary", date: ctx.today },
  });
}

// MARKETING: Campaign/content suggestion
async function runMarketing(
  ctx: CronContext,
  supabase: ReturnType<typeof createServerClient>
): Promise<void> {
  const system = `You are the MARKETING agent for AfterSlim (US D2C supplement brand, 8 SKUs).
Based on recent activity, suggest ONE marketing action for today.
Format: JSON { "type": "ad|email|social|campaign", "title": "...", "description": "..." }
Respond ONLY with JSON, no markdown.`;

  const user = `DATE: ${ctx.today}\n\nORDERS:\n${ctx.recentOrders || "No recent orders"}\n\nKANBAN:\n${ctx.kanbanActivity || "No activity"}\n\nPOSTHOG:\n${ctx.posthogSummary}`;

  const reply = await callLLM(system, user);
  if (!reply) return;

  const parsed = parseJsonReply(reply);
  const content = parsed
    ? `Suggestion (${parsed.type}): "${parsed.title}" — ${parsed.description}`
    : reply.slice(0, 500);

  await supabase.from("as_agent_memory").insert({
    agent_id: "as-marketing",
    kind: "action",
    content,
    metadata: { type: "daily_suggestion", date: ctx.today },
  });
}

// LEGAL: Compliance check
async function runLegal(
  ctx: CronContext,
  supabase: ReturnType<typeof createServerClient>
): Promise<void> {
  const system = `You are the LEGAL agent for AfterSlim (US dietary supplement brand).
Review recent business activity for compliance risks. Check:
- Any health claims that might violate FDA rules (structure/function only, no disease claims)
- Any FTC issues with marketing content
- Any shipping/tax compliance flags
Format: JSON { "risk_level": "none|low|medium|high", "findings": "..." }
Respond ONLY with JSON, no markdown.`;

  const user = `DATE: ${ctx.today}\n\nORDERS:\n${ctx.recentOrders || "No orders"}\n\nIDEAS:\n${ctx.recentIdeas || "No ideas"}\n\nKANBAN:\n${ctx.kanbanActivity || "No activity"}`;

  const reply = await callLLM(system, user);
  if (!reply) return;

  const parsed = parseJsonReply(reply);
  const content = parsed
    ? `Risk: ${parsed.risk_level}. ${parsed.findings}`
    : reply.slice(0, 500);

  await supabase.from("as_agent_memory").insert({
    agent_id: "as-legal",
    kind: parsed?.risk_level === "high" ? "alert" : "insight",
    content,
    metadata: { type: "compliance_check", date: ctx.today },
  });
}

// ANALYTICS: Performance metrics
async function runAnalytics(
  ctx: CronContext,
  supabase: ReturnType<typeof createServerClient>
): Promise<void> {
  const system = `You are the ANALYTICS agent for AfterSlim (US supplement e-commerce).
Analyze available data and provide a performance summary.
Format: JSON { "highlights": ["...", "..."], "recommendation": "..." }
Respond ONLY with JSON, no markdown.`;

  const user = `DATE: ${ctx.today}\n\nORDERS:\n${ctx.recentOrders || "No orders"}\n\nPOSTHOG EVENTS:\n${ctx.posthogSummary}\n\nFINANCES:\n${ctx.financialSummary || "No data"}`;

  const reply = await callLLM(system, user);
  if (!reply) return;

  const parsed = parseJsonReply(reply);
  const content = parsed
    ? `Highlights: ${(parsed.highlights as string[])?.join("; ") ?? "N/A"}. Recommendation: ${parsed.recommendation}`
    : reply.slice(0, 500);

  await supabase.from("as_agent_memory").insert({
    agent_id: "as-analytics",
    kind: "summary",
    content,
    metadata: { type: "daily_metrics", date: ctx.today },
  });
}

// CONTENT: Instagram content suggestion
async function runContent(
  ctx: CronContext,
  supabase: ReturnType<typeof createServerClient>
): Promise<void> {
  const system = `You are the CONTENT agent for AfterSlim's Instagram (US supplement brand).
Based on recent activity, suggest ONE Instagram post idea.
Content pillars: "Did you know?" | "Morning/Night routine" | "Myth vs. Fact" | "What I take and why" | "Behind the brand"
Format: JSON { "format": "reel|carousel|story|post", "pillar": "...", "caption_hook": "...", "description": "..." }
Respond ONLY with JSON, no markdown.`;

  const user = `DATE: ${ctx.today}\n\nKANBAN:\n${ctx.kanbanActivity || "No activity"}\n\nIDEAS:\n${ctx.recentIdeas || "No ideas"}`;

  const reply = await callLLM(system, user);
  if (!reply) return;

  const parsed = parseJsonReply(reply);
  const content = parsed
    ? `${parsed.format} (${parsed.pillar}): "${parsed.caption_hook}" — ${parsed.description}`
    : reply.slice(0, 500);

  await supabase.from("as_agent_memory").insert({
    agent_id: "as-content",
    kind: "action",
    content,
    metadata: { type: "content_suggestion", date: ctx.today },
  });
}

// ── Main handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const today = new Date().toLocaleDateString("en-US");
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Fetch context data in parallel
  const [ordersResult, ideasResult, kanbanResult, transactionsResult, posthogSummary] =
    await Promise.all([
      supabase
        .from("orders")
        .select("order_number, status, total_amount, created_at")
        .gte("created_at", oneDayAgo)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("ideas")
        .select("title, status, priority, category, created_at")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("kanban_cards")
        .select("title, status, priority, created_at")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("transactions")
        .select("type, category, amount, created_at")
        .gte("created_at", oneDayAgo)
        .order("created_at", { ascending: false })
        .limit(20),
      getPostHogSummary(),
    ]);

  const recentOrders = (ordersResult.data ?? [])
    .map((o) => `- ${o.order_number}: ${o.status} ($${(o.total_amount / 100).toFixed(2)})`)
    .join("\n");

  const recentIdeas = (ideasResult.data ?? [])
    .map((i) => `- [${i.status}] (${i.category}) ${i.title} — ${i.priority}`)
    .join("\n");

  const kanbanActivity = (kanbanResult.data ?? [])
    .map((k) => `- [${k.status}] ${k.title} (${k.priority})`)
    .join("\n");

  const financialSummary = (() => {
    const txns = transactionsResult.data ?? [];
    if (txns.length === 0) return "";
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return `Income: $${(income / 100).toFixed(2)}, Expenses: $${(expense / 100).toFixed(2)}, Net: $${((income - expense) / 100).toFixed(2)} (${txns.length} transactions)`;
  })();

  const ctx: CronContext = {
    recentOrders,
    recentIdeas,
    kanbanActivity,
    financialSummary,
    posthogSummary,
    today,
  };

  // Run agents in parallel (each is independent)
  const results = await Promise.allSettled([
    runManagement(ctx, supabase),
    runMarketing(ctx, supabase),
    runLegal(ctx, supabase),
    runAnalytics(ctx, supabase),
    runContent(ctx, supabase),
  ]);

  const agentNames = ["as-management", "as-marketing", "as-legal", "as-analytics", "as-content"];
  const summary = results.map((r, i) => ({
    agent: agentNames[i],
    status: r.status,
  }));

  return NextResponse.json({
    ok: true,
    date: today,
    agents: summary,
    ordersAnalyzed: ordersResult.data?.length ?? 0,
    ideasAnalyzed: ideasResult.data?.length ?? 0,
  });
}
