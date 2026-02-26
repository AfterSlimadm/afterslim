/**
 * Server-side PostHog client for querying analytics data.
 * Used by the as-analytics agent to fetch store metrics.
 */

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY ?? "";
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID ?? "325148";
const POSTHOG_HOST = "https://us.posthog.com";

interface PostHogEvent {
  event: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

/**
 * Fetch recent events from PostHog.
 */
export async function getRecentEvents(limit = 20): Promise<PostHogEvent[]> {
  if (!POSTHOG_API_KEY) return [];

  try {
    const res = await fetch(
      `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/events/?limit=${limit}&orderBy=-timestamp`,
      {
        headers: { Authorization: `Bearer ${POSTHOG_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as PostHogEvent[];
  } catch {
    return [];
  }
}

/**
 * Get a formatted summary of recent PostHog events for agent context.
 */
export async function getPostHogSummary(): Promise<string> {
  const events = await getRecentEvents(10);
  if (events.length === 0) return "No PostHog analytics data available.";

  const lines = events.map((e) => {
    const time = new Date(e.timestamp).toLocaleString("en-US");
    const url = (e.properties?.$current_url as string) ?? "";
    return `- ${e.event} at ${time}${url ? ` (${url})` : ""}`;
  });

  return `Recent store events (PostHog):\n${lines.join("\n")}`;
}
