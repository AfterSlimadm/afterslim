"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  KanbanSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IDEA_STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Idea, IdeaPriority } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea;
  onClick?: (idea: Idea) => void;
}

const PRIORITY_ICONS: Record<IdeaPriority, React.ReactNode> = {
  low: <ArrowDown className="h-3 w-3" />,
  medium: <ArrowRight className="h-3 w-3" />,
  high: <ArrowUp className="h-3 w-3" />,
  critical: <AlertTriangle className="h-3 w-3" />,
};

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  manual: { label: "Manual", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  after: { label: "After", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  agent: { label: "Agent", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
};

function ScoreIndicator({ score }: { score: number | null }) {
  if (score === null) return null;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (s >= 60) return "text-blue-600 dark:text-blue-400";
    if (s >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
    if (s >= 60) return "bg-blue-100 dark:bg-blue-900/30";
    if (s >= 40) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        getScoreBg(score),
        getScoreColor(score)
      )}
    >
      <Zap className="h-3 w-3" />
      {score}
    </div>
  );
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const statusConfig = IDEA_STATUS_CONFIG[idea.status];
  const priorityConfig = PRIORITY_CONFIG[idea.priority];
  const sourceConfig = idea.source ? SOURCE_CONFIG[idea.source] : null;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
      onClick={() => onClick?.(idea)}
    >
      <CardHeader className="pb-3">
        {/* Top row: status + priority */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={cn("text-[10px] font-medium", statusConfig.color)}
          >
            {statusConfig.label}
          </Badge>
          <Badge
            variant="secondary"
            className={cn("text-[10px] font-medium gap-1", priorityConfig.color)}
          >
            {PRIORITY_ICONS[idea.priority]}
            {priorityConfig.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-1 mt-1">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {idea.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Category */}
        <div>
          <Badge variant="outline" className="text-[10px]">
            {idea.category}
          </Badge>
        </div>

        {/* Financial estimates */}
        {(idea.estimated_cost !== null || idea.estimated_revenue !== null) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {idea.estimated_cost !== null && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-3 w-3 text-red-500" />
                <span>Cost: {formatCurrency(idea.estimated_cost)}</span>
              </div>
            )}
            {idea.estimated_revenue !== null && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span>Rev: {formatCurrency(idea.estimated_revenue)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom row: score, source, date */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t">
          <div className="flex items-center gap-2">
            <ScoreIndicator score={idea.score} />
            {sourceConfig && (
              <Badge
                variant="secondary"
                className={cn("text-[10px]", sourceConfig.color)}
              >
                {sourceConfig.label}
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(idea.created_at)}
          </span>
        </div>

        {/* Create Task action */}
        <Button
          variant="outline"
          size="xs"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // In a real app, this would open a dialog to create a kanban card from this idea
            alert(`Task created from: "${idea.title}"`);
          }}
        >
          <KanbanSquare className="h-3 w-3" />
          Create Task
        </Button>
      </CardContent>
    </Card>
  );
}
