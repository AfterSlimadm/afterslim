import { getAdminClient } from "@/lib/supabase/admin";

export interface IdeaRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  tags: string[];
  source: string;
  source_message_id: string | null;
  author: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  votes: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all ideas ordered by newest first.
 */
export async function getIdeas(): Promise<IdeaRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getIdeas]", error.message);
    return [];
  }

  return (data ?? []) as IdeaRow[];
}

/**
 * Get idea counts grouped by status.
 */
export async function getIdeaStats(): Promise<Record<string, number>> {
  const ideas = await getIdeas();
  const stats: Record<string, number> = {};

  for (const idea of ideas) {
    stats[idea.status] = (stats[idea.status] ?? 0) + 1;
  }

  return stats;
}
