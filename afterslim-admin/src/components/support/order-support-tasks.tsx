"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SUPPORT_TASK_TYPE_CONFIG } from "@/lib/constants";
import { SupportTaskItem } from "./support-task-item";
import type { SupportTask, SupportTaskType } from "@/lib/types";
import { type Locale, getSupportTaskTypeLabel, t } from "@/lib/i18n";

interface OrderSupportTasksProps {
  orderId: string;
  locale?: Locale;
}

export function OrderSupportTasks({ orderId, locale = "pt" }: OrderSupportTasksProps) {
  const [tasks, setTasks] = useState<SupportTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTaskType, setNewTaskType] = useState<string>("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`/api/support-tasks?order_id=${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTasks(data);
      } catch {
        console.error("[OrderSupportTasks] fetch failed");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [orderId]);

  async function handleAdd() {
    if (!newTaskType) {
      toast.error(t("orderSupport.selectType", locale));
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/support-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          task_type: newTaskType,
          description: newDescription || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
      setNewTaskType("");
      setNewDescription("");
      setShowForm(false);
      toast.success(t("orderSupport.taskAdded", locale));
    } catch {
      toast.error(t("orderSupport.createError", locale));
    } finally {
      setAdding(false);
    }
  }

  function handleTaskUpdate(updated: SupportTask) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          {t("orderSupport.title", locale)}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("orderSupport.add", locale)}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick add form */}
        {showForm && (
          <div className="space-y-2 rounded-lg border p-3">
            <Select value={newTaskType} onValueChange={setNewTaskType}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={t("orderSupport.taskTypePlaceholder", locale)} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORT_TASK_TYPE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {getSupportTaskTypeLabel(key, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={t("orderSupport.notePlaceholder", locale)}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="h-8 text-xs"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs flex-1"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  t("orderSupport.save", locale)
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowForm(false)}
              >
                {t("orderSupport.cancel", locale)}
              </Button>
            </div>
          </div>
        )}

        {/* Tasks list */}
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">
            {t("orderSupport.noTasks", locale)}
          </p>
        ) : (
          <div className="-mx-4 divide-y">
            {tasks.map((task) => (
              <SupportTaskItem
                key={task.id}
                task={task}
                onUpdate={handleTaskUpdate}
                compact
                locale={locale}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
