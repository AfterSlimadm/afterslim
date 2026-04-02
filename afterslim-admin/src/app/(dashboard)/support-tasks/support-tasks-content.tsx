"use client";

import { useState, useMemo } from "react";
import { ClipboardCheck, CheckCircle, Clock, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORT_TASK_TYPE_CONFIG } from "@/lib/constants";
import { SupportTaskItem } from "@/components/support/support-task-item";
import type { SupportTask, SupportTaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { getLocaleFromRole, getSupportTaskTypeLabel, t } from "@/lib/i18n";

interface SupportTasksContentProps {
  tasks: SupportTask[];
}

export default function SupportTasksContent({ tasks: initialTasks }: SupportTasksContentProps) {
  const { role } = useAuth();
  const locale = getLocaleFromRole(role);
  const [tasks, setTasks] = useState<SupportTask[]>(initialTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === "pending") result = result.filter((t) => !t.is_completed);
    if (filter === "completed") result = result.filter((t) => t.is_completed);
    if (typeFilter !== "all") result = result.filter((t) => t.task_type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.admin_user?.display_name.toLowerCase().includes(q) ||
          t.order_id?.includes(q)
      );
    }

    return result;
  }, [tasks, filter, typeFilter, search]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((t) => !t.is_completed).length,
    completed: tasks.filter((t) => t.is_completed).length,
  }), [tasks]);

  function handleTaskUpdate(updated: SupportTask) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t("tasks.title", locale)}</h1>
        <p className="page-description">
          {t("tasks.description", locale)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          className={cn("cursor-pointer transition-colors", filter === "all" && "ring-2 ring-primary")}
          onClick={() => setFilter("all")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">{t("tasks.total", locale)}</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn("cursor-pointer transition-colors", filter === "pending" && "ring-2 ring-primary")}
          onClick={() => setFilter("pending")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">{t("tasks.pending", locale)}</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn("cursor-pointer transition-colors", filter === "completed" && "ring-2 ring-primary")}
          onClick={() => setFilter("completed")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">{t("tasks.completed", locale)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={t("tasks.searchPlaceholder", locale)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("tasks.taskType", locale)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("tasks.allTypes", locale)}</SelectItem>
            {Object.entries(SUPPORT_TASK_TYPE_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {getSupportTaskTypeLabel(key, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <Card>
        <CardContent className="p-0">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardCheck className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">{t("tasks.noTasks", locale)}</p>
              <p className="text-xs mt-1">
                {filter !== "all" || typeFilter !== "all"
                  ? t("tasks.adjustFilters", locale)
                  : t("tasks.willAppear", locale)}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTasks.map((task) => (
                <SupportTaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleTaskUpdate}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
