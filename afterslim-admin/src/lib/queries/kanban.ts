import { getAdminClient } from "@/lib/supabase/admin";
import type { KanbanColumn, KanbanCard } from "@/lib/types";

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
 * Maps DB fields (tags, deadline) to front-end fields (labels, due_date).
 */
export async function getKanbanCards(): Promise<KanbanCard[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("kanban_cards")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getKanbanCards]", error.message);
    return [];
  }

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    column_id: row.column_id,
    title: row.title,
    description: row.description ?? null,
    position: row.position ?? 0,
    priority: row.priority ?? "medium",
    assignee: row.assignee ?? null,
    due_date: row.deadline ?? null,
    labels: row.tags ?? [],
    board_type: row.board_type ?? "task",
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}
