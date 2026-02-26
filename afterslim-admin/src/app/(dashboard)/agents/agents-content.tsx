"use client";

import Link from "next/link";
import {
  Bot,
  MessageSquare,
  ListTodo,
  Brain,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AGENTS, type AgentInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ── Types ── */

export interface AgentStatus {
  agentId: string;
  status: "online" | "idle" | "offline";
  lastActive: string;
  tasksCompleted: number;
  tasksPending: number;
  memoriesCount: number;
  messagesLast24h: number;
}

const STATUS_CONFIG = {
  online: { label: "Online", color: "bg-green-500", textColor: "text-green-700" },
  idle: { label: "Idle", color: "bg-yellow-500", textColor: "text-yellow-700" },
  offline: { label: "Offline", color: "bg-gray-400", textColor: "text-gray-500" },
};

/* ── Agent Card ── */

function AgentCard({
  agent,
  agentStatuses,
}: {
  agent: AgentInfo;
  agentStatuses: AgentStatus[];
}) {
  const status = agentStatuses.find((s) => s.agentId === agent.id) ?? {
    agentId: agent.id,
    status: "offline" as const,
    lastActive: "Sem atividade",
    tasksCompleted: 0,
    tasksPending: 0,
    memoriesCount: 0,
    messagesLast24h: 0,
  };
  const statusConfig = STATUS_CONFIG[status.status];

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                {agent.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block size-2 rounded-full",
                    statusConfig.color
                  )}
                />
                <span
                  className={cn("text-xs font-medium", statusConfig.textColor)}
                >
                  {statusConfig.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {status.lastActive}
                </span>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2 text-xs">
          {agent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="size-3.5 text-green-600" />
            <span>{status.tasksCompleted} concluídas</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-3.5 text-yellow-600" />
            <span>{status.tasksPending} pendentes</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="size-3.5 text-purple-600" />
            <span>{status.memoriesCount} memórias</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="size-3.5 text-blue-600" />
            <span>{status.messagesLast24h} msgs/24h</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/agents/${agent.id}`}>
              <MessageSquare className="size-3.5" />
              Chat
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="/agents/memory">
              <Brain className="size-3.5" />
              Memória
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Props ── */

interface AgentsContentProps {
  agentStatuses: AgentStatus[];
}

/* ── Page ── */

export default function AgentsContent({ agentStatuses }: AgentsContentProps) {
  const statuses = agentStatuses;

  const totalTasks = statuses.reduce((s, a) => s + a.tasksCompleted, 0);
  const totalPending = statuses.reduce((s, a) => s + a.tasksPending, 0);
  const onlineCount = statuses.filter((a) => a.status === "online").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agentes IA</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie o time de agentes IA da AfterSlim.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/agents/messages">
              <MessageSquare className="size-4" />
              Mensagens
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/agents/tasks">
              <ListTodo className="size-4" />
              Tarefas
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agentes Online
            </CardTitle>
            <Activity className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {onlineCount}/{AGENTS.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Concluídas
            </CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTasks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Pendentes
            </CardTitle>
            <Clock className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mensagens (24h)
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {statuses.reduce((s, a) => s + a.messagesLast24h, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            agentStatuses={statuses}
          />
        ))}
      </div>
    </div>
  );
}
