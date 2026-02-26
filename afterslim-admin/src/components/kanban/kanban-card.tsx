"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  Calendar,
  GripVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type { KanbanCard as KanbanCardType, IdeaPriority } from "@/lib/types";

interface KanbanCardProps {
  card: KanbanCardType;
}

const PRIORITY_ICONS: Record<IdeaPriority, React.ReactNode> = {
  low: <ArrowDown className="h-3 w-3" />,
  medium: <ArrowRight className="h-3 w-3" />,
  high: <ArrowUp className="h-3 w-3" />,
  critical: <AlertTriangle className="h-3 w-3" />,
};

const LABEL_COLORS: Record<string, string> = {
  marketing: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  design: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  development: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  compliance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  content: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ops: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = PRIORITY_CONFIG[card.priority];
  const overdue = card.due_date ? isOverdue(card.due_date) : false;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-3 pb-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-2">
            {card.title}
          </h4>
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-1 space-y-2">
        {/* Description */}
        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.labels.map((label) => (
              <span
                key={label}
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
                  LABEL_COLORS[label.toLowerCase()] ??
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: priority, assignee, due date */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Badge
            variant="secondary"
            className={cn("text-[10px] gap-0.5 px-1.5 py-0", priorityConfig.color)}
          >
            {PRIORITY_ICONS[card.priority]}
            {priorityConfig.label}
          </Badge>

          <div className="flex items-center gap-2">
            {/* Due date */}
            {card.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1 text-[10px]",
                  overdue
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(card.due_date, { month: "short", day: "numeric" })}
              </span>
            )}

            {/* Assignee */}
            {card.assignee && (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {getInitials(card.assignee)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
