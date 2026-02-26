import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// Vercel Hobby allows up to 60s for serverless functions
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET ?? "";
const VPS_GATEWAY_URL =
  process.env.VPS_GATEWAY_URL ?? "http://217.216.89.234:18832";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "";
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY ?? "";
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID ?? "325148";

// ── OpenClaw chat helper ────────────────────────────────────────────────────
async function chatAgent(agentId: string, message: string): Promise<string | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (GATEWAY_TOKEN) {
    headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
  }

  try {
    const res = await fetch(`${VPS_GATEWAY_URL}/agents/${agentId}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(50000), // 50s per agent (within 60s limit)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[cron] ${agentId}: ${res.status} — ${errText.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data.content ?? data.response ?? JSON.stringify(data);
  } catch (err) {
    console.error(`[cron] ${agentId}: unreachable — ${err}`);
    return null;
  }
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

// ── Agent cron tasks (all via OpenClaw) ─────────────────────────────────────

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
  const message = `Generate a DAILY EXECUTIVE SUMMARY for ${ctx.today}.

RECENT ORDERS:
${ctx.recentOrders || "No orders in last 24h"}

IDEAS:
${ctx.recentIdeas || "No recent ideas"}

KANBAN:
${ctx.kanbanActivity || "No activity"}

FINANCES:
${ctx.financialSummary || "No data"}

Respond with JSON only: { "status": "...", "priority": "...", "alert": "..." }`;

  const reply = await chatAgent("as-management", message);
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
  const message = `Based on today's activity (${ctx.today}), suggest ONE marketing action.

ORDERS:
${ctx.recentOrders || "No recent orders"}

KANBAN:
${ctx.kanbanActivity || "No activity"}

POSTHOG:
${ctx.posthogSummary}

Respond with JSON only: { "type": "ad|email|social|campaign", "title": "...", "description": "..." }`;

  const reply = await chatAgent("as-marketing", message);
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
  const message = `Review recent business activity (${ctx.today}) for compliance risks.

ORDERS:
${ctx.recentOrders || "No orders"}

IDEAS:
${ctx.recentIdeas || "No ideas"}

KANBAN:
${ctx.kanbanActivity || "No activity"}

Respond with JSON only: { "risk_level": "none|low|medium|high", "findings": "..." }`;

  const reply = await chatAgent("as-legal", message);
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
  const message = `Analyze today's performance data (${ctx.today}).

ORDERS:
${ctx.recentOrders || "No orders"}

POSTHOG EVENTS:
${ctx.posthogSummary}

FINANCES:
${ctx.financialSummary || "No data"}

Respond with JSON only: { "highlights": ["...", "..."], "recommendation": "..." }`;

  const reply = await chatAgent("as-analytics", message);
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
  const message = `Suggest ONE Instagram post idea for today (${ctx.today}).

KANBAN:
${ctx.kanbanActivity || "No activity"}

IDEAS:
${ctx.recentIdeas || "No ideas"}

Respond with JSON only: { "format": "reel|carousel|story|post", "pillar": "...", "caption_hook": "...", "description": "..." }`;

  const reply = await chatAgent("as-content", message);
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

  // Run agents sequentially through OpenClaw (to respect gateway concurrency limits)
  const agentTasks = [
    { name: "as-management", fn: () => runManagement(ctx, supabase) },
    { name: "as-marketing", fn: () => runMarketing(ctx, supabase) },
    { name: "as-legal", fn: () => runLegal(ctx, supabase) },
    { name: "as-analytics", fn: () => runAnalytics(ctx, supabase) },
    { name: "as-content", fn: () => runContent(ctx, supabase) },
  ];

  const summary: { agent: string; status: string }[] = [];

  for (const task of agentTasks) {
    try {
      await task.fn();
      summary.push({ agent: task.name, status: "fulfilled" });
    } catch (err) {
      console.error(`[cron] ${task.name} failed:`, err);
      summary.push({ agent: task.name, status: "rejected" });
    }
  }

  return NextResponse.json({
    ok: true,
    date: today,
    agents: summary,
    ordersAnalyzed: ordersResult.data?.length ?? 0,
    ideasAnalyzed: ideasResult.data?.length ?? 0,
  });
}
