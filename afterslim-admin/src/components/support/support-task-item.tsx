"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Circle, User, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDateTime } from "@/lib/utils";
import { SUPPORT_TASK_TYPE_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { SupportTask } from "@/lib/types";
import { type Locale, getSupportTaskTypeLabel, t } from "@/lib/i18n";

interface SupportTaskItemProps {
  task: SupportTask;
  onUpdate: (task: SupportTask) => void;
  compact?: boolean;
  locale?: Locale;
}

export function SupportTaskItem({ task, onUpdate, compact, locale = "pt" }: SupportTaskItemProps) {
  const [loading, setLoading] = useState(false);
  const typeConfig = SUPPORT_TASK_TYPE_CONFIG[task.task_type] ?? {
    label: task.task_type,
    color: "badge-neutral",
  };

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/support-tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      onUpdate(updated);
      toast.success(
        updated.is_completed ? t("taskItem.completed", locale) : t("taskItem.reopened", locale)
      );
    } catch {
      toast.error(t("taskItem.updateError", locale));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        task.is_completed && "opacity-60"
      )}
    >
      {/* Toggle */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
      >
        {task.is_completed ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn("text-xs border-none", typeConfig.color)}
          >
            {getSupportTaskTypeLabel(task.task_type, locale)}
          </Badge>
          {task.order_id && !compact && (
            <Link
              href={`/orders/${task.order_id}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {t("taskItem.order", locale)}
            </Link>
          )}
        </div>
        {task.description && (
          <p
            className={cn(
              "text-sm mt-1",
              task.is_completed && "line-through"
            )}
          >
            {task.description}
          </p>
        )}
        {!compact && (
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {task.admin_user?.display_name ?? "Unknown"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(task.created_at)}
            </span>
            {task.completed_at && (
              <span className="text-green-600">
                {t("taskItem.completedAt", locale)} {formatDateTime(task.completed_at)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
