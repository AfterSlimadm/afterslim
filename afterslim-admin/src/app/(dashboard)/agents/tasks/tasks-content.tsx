"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AGENTS, AGENT_TASK_STATUS_CONFIG } from "@/lib/constants";
import { formatDateTime, cn } from "@/lib/utils";
import type { AgentTaskStatus } from "@/lib/types";
import type { AgentTaskRow } from "@/lib/queries/agents";

function getAgentName(agentId: string): string {
  return AGENTS.find((a) => a.id === agentId)?.name ?? agentId;
}

interface TasksContentProps {
  tasks: AgentTaskRow[];
}

export default function TasksContent({ tasks }: TasksContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Tasks</h1>
          <p className="text-muted-foreground">
            Monitor task queue and execution history.
          </p>
        </div>
      </div>

      <div className="relative sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tasks..." className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Agent</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const statusKey = task.status as AgentTaskStatus;
                const statusCfg = AGENT_TASK_STATUS_CONFIG[statusKey] ??
                  AGENT_TASK_STATUS_CONFIG.pending;
                // Derive a description from input JSON if available
                const description = task.input
                  ? Object.values(task.input).join(" - ")
                  : task.task_type ?? "-";
                return (
                  <TableRow key={task.id}>
                    <TableCell className="pl-6 text-sm font-medium">
                      {getAgentName(task.agent_id)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {task.task_type ?? "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-none text-xs", statusCfg.color)}
                      >
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {formatDateTime(task.created_at)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {task.completed_at ? formatDateTime(task.completed_at) : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
