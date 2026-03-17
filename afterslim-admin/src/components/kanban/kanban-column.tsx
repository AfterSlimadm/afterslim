"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KanbanCard } from "./kanban-card";
import { cn } from "@/lib/utils";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
} from "@/lib/types";

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  onAddCard?: (columnId: string) => void;
}

export function KanbanColumn({ column, cards, onAddCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const isOverLimit =
    column.wip_limit !== null && cards.length > column.wip_limit;
  const isAtLimit =
    column.wip_limit !== null && cards.length === column.wip_limit;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-muted/50 border min-w-[300px] w-[300px] shrink-0",
        isOver && "ring-2 ring-primary/30 bg-primary/5"
      )}
    >
      {/* Color bar */}
      <div
        className="h-1 rounded-t-lg"
        style={{ backgroundColor: column.color }}
      />

      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] px-1.5 py-0",
              isOverLimit &&
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {cards.length}
            {column.wip_limit !== null && `/${column.wip_limit}`}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onAddCard?.(column.id)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* WIP limit warning */}
      {isOverLimit && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-b">
          <AlertCircle className="h-3 w-3 shrink-0" />
          Limite WIP excedido ({cards.length}/{column.wip_limit})
        </div>
      )}

      {/* Cards Area */}
      <div ref={setNodeRef} className="flex-1 min-h-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2 p-2">
              {cards.map((card) => (
                <KanbanCard key={card.id} card={card} />
              ))}

              {cards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    Nenhum card ainda
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Arraste cards aqui ou adicione um novo
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>

      {/* Bottom Add Card */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground justify-start gap-1.5"
          onClick={() => onAddCard?.(column.id)}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Card
        </Button>
      </div>
    </div>
  );
}
