import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fetch kanban columns ordered by position.
 */
export async function getKanbanColumns() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("kanban_columns")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getKanbanColumns]", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Fetch all kanban cards with their column_id.
 */
export async function getKanbanCards() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("kanban_cards")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getKanbanCards]", error.message);
    return [];
  }

  return data ?? [];
}
