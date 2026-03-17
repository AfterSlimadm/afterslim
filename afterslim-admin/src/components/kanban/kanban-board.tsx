"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { NewCardDialog } from "./new-card-dialog";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  IdeaPriority,
} from "@/lib/types";


// ─── Props ────────────────────────────────────────────────────
interface KanbanBoardProps {
  initialColumns?: KanbanColumnType[];
  initialCards?: KanbanCardType[];
}

// ─── Component ───────────────────────────────────────────────
export function KanbanBoard({
  initialColumns,
  initialCards,
}: KanbanBoardProps = {}) {
  const [columns] = useState<KanbanColumnType[]>(initialColumns ?? []);
  const [cards, setCards] = useState<KanbanCardType[]>(initialCards ?? []);
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogColumnId, setDialogColumnId] = useState<string | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Get cards for a specific column, sorted by position
  const getColumnCards = useCallback(
    (columnId: string) =>
      cards
        .filter((c) => c.column_id === columnId)
        .sort((a, b) => a.position - b.position),
    [cards]
  );

  // Find which column a card belongs to
  const findColumnForCard = (cardId: string): string | undefined => {
    const card = cards.find((c) => c.id === cardId);
    return card?.column_id;
  };

  // Find which column or card the given id belongs to
  const findContainerId = (id: string): string | undefined => {
    // Check if the id is a column
    if (columns.some((col) => col.id === id)) {
      return id;
    }
    // Otherwise find the card's column
    return findColumnForCard(id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainerId(activeId);
    const overContainer = findContainerId(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Moving to a different column
    setCards((prev) => {
      const activeCards = prev.filter((c) => c.column_id === activeContainer);
      const overCards = prev.filter((c) => c.column_id === overContainer);

      const activeIndex = activeCards.findIndex((c) => c.id === activeId);
      const overIndex = overCards.findIndex((c) => c.id === overId);

      let newIndex: number;
      if (columns.some((col) => col.id === overId)) {
        // Dropping on the column itself (empty area)
        newIndex = overCards.length;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overCards.length;
      }

      return prev.map((card) => {
        if (card.id === activeId) {
          return {
            ...card,
            column_id: overContainer,
            position: newIndex,
          };
        }
        return card;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainerId(activeId);
    const overContainer = findContainerId(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reordering within the same column
      const columnCards = getColumnCards(activeContainer);
      const oldIndex = columnCards.findIndex((c) => c.id === activeId);
      const newIndex = columnCards.findIndex((c) => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnCards, oldIndex, newIndex);
        setCards((prev) => {
          const otherCards = prev.filter((c) => c.column_id !== activeContainer);
          const updatedCards = reordered.map((card, idx) => ({
            ...card,
            position: idx,
          }));
          return [...otherCards, ...updatedCards];
        });
      }
    } else {
      // Already handled in onDragOver - just re-normalize positions
      setCards((prev) => {
        const result = [...prev];

        // Normalize positions for both columns
        [activeContainer, overContainer].forEach((colId) => {
          const colCards = result
            .filter((c) => c.column_id === colId)
            .sort((a, b) => a.position - b.position);

          colCards.forEach((card, idx) => {
            const globalIdx = result.findIndex((c) => c.id === card.id);
            if (globalIdx !== -1) {
              result[globalIdx] = { ...result[globalIdx], position: idx };
            }
          });
        });

        return result;
      });
    }
  };

  const handleAddCard = (columnId: string) => {
    setDialogColumnId(columnId);
    setDialogOpen(true);
  };

  const handleCreateCard = (data: {
    title: string;
    description: string;
    priority: IdeaPriority;
    assignee: string;
    dueDate: string;
    labels: string[];
    columnId: string;
  }) => {
    const columnCards = getColumnCards(data.columnId);
    const newCard: KanbanCardType = {
      id: `card-${Date.now()}`,
      column_id: data.columnId,
      title: data.title,
      description: data.description || null,
      position: columnCards.length,
      priority: data.priority,
      assignee: data.assignee || null,
      due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      labels: data.labels,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCards((prev) => [...prev, newCard]);
  };

  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Nenhuma coluna criada</p>
        <p className="text-sm mt-1">
          Crie colunas no banco de dados para comecar a usar o quadro Kanban.
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={getColumnCards(column.id)}
              onAddCard={handleAddCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="w-[280px] opacity-90 rotate-2">
              <KanbanCard card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <NewCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        columns={columns}
        defaultColumnId={dialogColumnId}
        onCreateCard={handleCreateCard}
      />
    </>
  );
}
