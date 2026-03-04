export const dynamic = "force-dynamic";

import { getKanbanColumns, getKanbanCards } from "@/lib/queries/kanban";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import type { KanbanColumn, KanbanCard } from "@/lib/types";

export default async function KanbanPage() {
  let columns: KanbanColumn[] = [];
  let cards: KanbanCard[] = [];

  try {
    const [rawColumns, rawCards] = await Promise.all([
      getKanbanColumns(),
      getKanbanCards(),
    ]);

    columns = rawColumns;
    cards = rawCards as KanbanCard[];
  } catch (error) {
    console.error("[KanbanPage] Failed to fetch kanban data:", error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-muted-foreground">
          Visual task management board with drag-and-drop columns for organizing
          work across the team.
        </p>
      </div>

      {/* Board */}
      <KanbanBoard initialColumns={columns} initialCards={cards} />
    </div>
  );
}
