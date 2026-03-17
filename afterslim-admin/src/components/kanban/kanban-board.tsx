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

// ─── Mock Data ───────────────────────────────────────────────
const INITIAL_COLUMNS: KanbanColumnType[] = [
  {
    id: "col-todo",
    title: "To Do",
    position: 0,
    color: "#3b82f6",
    wip_limit: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "col-progress",
    title: "Em Progresso",
    position: 1,
    color: "#eab308",
    wip_limit: 5,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "col-review",
    title: "Revisao",
    position: 2,
    color: "#8b5cf6",
    wip_limit: 3,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "col-done",
    title: "Concluido",
    position: 3,
    color: "#22c55e",
    wip_limit: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const INITIAL_CARDS: KanbanCardType[] = [
  // To Do (4 cards)
  {
    id: "card-001",
    column_id: "col-todo",
    title: "Design new product labels",
    description:
      "Create label designs for the Kids Multivitamin Line including front, back, and nutritional info panels. Must comply with FDA labeling requirements.",
    position: 0,
    priority: "high",
    assignee: "Sarah Chen",
    due_date: "2026-03-10T00:00:00Z",
    labels: ["Design", "Compliance"],
    created_at: "2026-02-20T10:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "card-002",
    column_id: "col-todo",
    title: "Set up Meta Ads campaign",
    description:
      "Create and configure Facebook/Instagram ad sets for the Spring Wellness promotion. Target: women 25-45 interested in health supplements.",
    position: 1,
    priority: "high",
    assignee: "Marcus Lee",
    due_date: "2026-03-01T00:00:00Z",
    labels: ["Marketing"],
    created_at: "2026-02-18T14:00:00Z",
    updated_at: "2026-02-18T14:00:00Z",
  },
  {
    id: "card-003",
    column_id: "col-todo",
    title: "Source algae oil supplier quotes",
    description:
      "Contact at least 3 suppliers for algal oil (DHA/EPA) for the Vegan Omega-3 product. Compare pricing, MOQ, and lead times.",
    position: 2,
    priority: "medium",
    assignee: "James Wilson",
    due_date: "2026-03-15T00:00:00Z",
    labels: ["Ops"],
    created_at: "2026-02-22T09:00:00Z",
    updated_at: "2026-02-22T09:00:00Z",
  },
  {
    id: "card-004",
    column_id: "col-todo",
    title: "Write blog post: Top 5 Supplements for 2026",
    description:
      "SEO-optimized blog post for the website featuring our top-selling supplements and their science-backed benefits.",
    position: 3,
    priority: "low",
    assignee: "Emily Park",
    due_date: "2026-03-20T00:00:00Z",
    labels: ["Content", "Marketing"],
    created_at: "2026-02-21T11:00:00Z",
    updated_at: "2026-02-21T11:00:00Z",
  },

  // In Progress (3 cards)
  {
    id: "card-005",
    column_id: "col-progress",
    title: "Update FDA compliance docs",
    description:
      "Review and update all supplement fact panels and health claims to comply with the latest FDA guidelines for dietary supplements.",
    position: 0,
    priority: "critical",
    assignee: "David Chen",
    due_date: "2026-02-28T00:00:00Z",
    labels: ["Compliance", "Urgent"],
    created_at: "2026-02-10T08:00:00Z",
    updated_at: "2026-02-24T16:00:00Z",
  },
  {
    id: "card-006",
    column_id: "col-progress",
    title: "Negotiate creator partnership terms",
    description:
      "Finalize contract terms with 5 micro-influencers for the Q1 UGC campaign. Budget: $2,000 per creator.",
    position: 1,
    priority: "medium",
    assignee: "Lisa Johnson",
    due_date: "2026-03-05T00:00:00Z",
    labels: ["Marketing"],
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-02-23T14:00:00Z",
  },
  {
    id: "card-007",
    column_id: "col-progress",
    title: "Build subscription management UI",
    description:
      "Implement the customer-facing subscription management page: pause, resume, skip, and cancel subscription functionality.",
    position: 2,
    priority: "high",
    assignee: "Alex Rivera",
    due_date: "2026-03-08T00:00:00Z",
    labels: ["Development"],
    created_at: "2026-02-12T09:00:00Z",
    updated_at: "2026-02-25T11:00:00Z",
  },

  // Review (2 cards)
  {
    id: "card-008",
    column_id: "col-review",
    title: "Review Q1 financial report",
    description:
      "Review and approve the Q1 2026 financial report including revenue, expenses, ad spend ROI, and margin analysis.",
    position: 0,
    priority: "high",
    assignee: "Michael Torres",
    due_date: "2026-03-02T00:00:00Z",
    labels: ["Finance"],
    created_at: "2026-02-20T08:00:00Z",
    updated_at: "2026-02-25T10:00:00Z",
  },
  {
    id: "card-009",
    column_id: "col-review",
    title: "Approve new product photography",
    description:
      "Review the product photography shoot results for the Joint Support Formula 2.0 and Organic Protein Powder. Select final images for website and ads.",
    position: 1,
    priority: "medium",
    assignee: "Sarah Chen",
    due_date: "2026-03-03T00:00:00Z",
    labels: ["Design", "Marketing"],
    created_at: "2026-02-19T13:00:00Z",
    updated_at: "2026-02-24T15:00:00Z",
  },

  // Done (5 cards)
  {
    id: "card-010",
    column_id: "col-done",
    title: "Launch Organic Protein Powder listing",
    description:
      "Published the product listing on the main website and Amazon with all SEO-optimized content, images, and pricing.",
    position: 0,
    priority: "high",
    assignee: "Marcus Lee",
    due_date: "2026-01-30T00:00:00Z",
    labels: ["Marketing", "Ops"],
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-30T14:00:00Z",
  },
  {
    id: "card-011",
    column_id: "col-done",
    title: "Set up Stripe subscription billing",
    description:
      "Integrated Stripe subscription billing with monthly and quarterly plan options. Tested webhook handlers for subscription lifecycle events.",
    position: 1,
    priority: "critical",
    assignee: "Alex Rivera",
    due_date: "2026-02-15T00:00:00Z",
    labels: ["Development", "Finance"],
    created_at: "2026-01-20T09:00:00Z",
    updated_at: "2026-02-14T16:00:00Z",
  },
  {
    id: "card-012",
    column_id: "col-done",
    title: "Complete brand guidelines v2",
    description:
      "Updated brand guidelines document with new typography, color palette, packaging standards, and social media templates.",
    position: 2,
    priority: "medium",
    assignee: "Sarah Chen",
    due_date: "2026-02-10T00:00:00Z",
    labels: ["Design"],
    created_at: "2026-01-25T11:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "card-013",
    column_id: "col-done",
    title: "Migrate email platform to Klaviyo",
    description:
      "Successfully migrated all email lists, automations, and templates from Mailchimp to Klaviyo. All flows tested and live.",
    position: 3,
    priority: "medium",
    assignee: "Emily Park",
    due_date: "2026-02-20T00:00:00Z",
    labels: ["Marketing", "Development"],
    created_at: "2026-02-01T08:00:00Z",
    updated_at: "2026-02-19T15:00:00Z",
  },
  {
    id: "card-014",
    column_id: "col-done",
    title: "Inventory audit - January",
    description:
      "Completed physical inventory audit for all SKUs. Updated inventory management system with accurate stock counts. No major discrepancies found.",
    position: 4,
    priority: "low",
    assignee: "James Wilson",
    due_date: "2026-02-05T00:00:00Z",
    labels: ["Ops"],
    created_at: "2026-01-28T10:00:00Z",
    updated_at: "2026-02-04T17:00:00Z",
  },
];

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
  // Use Supabase data when available and non-empty, otherwise fall back to mock
  const [columns] = useState<KanbanColumnType[]>(
    initialColumns && initialColumns.length > 0 ? initialColumns : INITIAL_COLUMNS
  );
  const [cards, setCards] = useState<KanbanCardType[]>(
    initialCards && initialCards.length > 0 ? initialCards : INITIAL_CARDS
  );
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
