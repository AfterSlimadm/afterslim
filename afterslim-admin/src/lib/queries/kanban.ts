import { getAdminClient } from "@/lib/supabase/admin";
import type { KanbanColumn } from "@/lib/types";

/**
 * Raw row shape from the kanban_columns table.
 * The DB uses "name" but the front-end type expects "title".
 */
interface KanbanColumnRow {
  id: string;
  name?: string;
  title?: string;
  position: number;
  color: string;
  wip_limit: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch kanban columns ordered by position.
 * Maps DB `name` field to front-end `title` when needed.
 */
export async function getKanbanColumns(): Promise<KanbanColumn[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("kanban_columns")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getKanbanColumns]", error.message);
    return [];
  }

  if (!data) return [];

  // Map DB rows: use `title` if present, fall back to `name`
  return (data as KanbanColumnRow[]).map((row) => ({
    id: row.id,
    title: row.title ?? row.name ?? "Untitled",
    position: row.position,
    color: row.color ?? "#6b7280",
    wip_limit: row.wip_limit ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
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
