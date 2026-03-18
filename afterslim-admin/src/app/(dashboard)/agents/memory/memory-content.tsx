"use client";

import Link from "next/link";
import { ArrowLeft, Search, Brain, Lightbulb, Zap, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AgentId } from "@/lib/types";
import type { AgentMemoryRow } from "@/lib/queries/agents";

type MemoryKind = "insight" | "action" | "summary" | "alert" | "classification";

const KIND_CONFIG: Record<MemoryKind, { label: string; icon: typeof Brain; color: string }> = {
  insight: { label: "Insight", icon: Lightbulb, color: "badge-warning" },
  action: { label: "Ação", icon: Zap, color: "badge-info" },
  summary: { label: "Resumo", icon: FileText, color: "badge-purple" },
  alert: { label: "Alerta", icon: AlertTriangle, color: "badge-error" },
  classification: { label: "Classificação", icon: Brain, color: "badge-info" },
};

function getAgentName(agentId: string): string {
  return AGENTS.find((a) => a.id === agentId)?.name ?? agentId;
}

interface MemoryContentProps {
  memories: AgentMemoryRow[];
}

export default function MemoryContent({ memories }: MemoryContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Memory</h1>
          <p className="text-muted-foreground">
            Browse agent insights, summaries, and stored knowledge.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search memories..." className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(Object.entries(KIND_CONFIG) as [MemoryKind, typeof KIND_CONFIG.insight][]).map(
            ([kind, cfg]) => (
              <Button key={kind} variant="outline" size="sm" className="text-xs">
                <cfg.icon className="size-3.5" />
                {cfg.label}
              </Button>
            )
          )}
        </div>
      </div>

      <div className="space-y-3">
        {memories.map((mem) => {
          const kindCfg = KIND_CONFIG[mem.kind as MemoryKind] ?? KIND_CONFIG.insight;
          const KindIcon = kindCfg.icon;
          return (
            <Card key={mem.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-8 flex-shrink-0 items-center justify-center rounded-lg",
                      kindCfg.color
                    )}
                  >
                    <KindIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {getAgentName(mem.agent_id)}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("border-none text-[10px]", kindCfg.color)}
                      >
                        {kindCfg.label}
                      </Badge>
                      <span className="ml-auto text-xs text-muted-foreground" suppressHydrationWarning>
                        {new Date(mem.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {mem.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {memories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">No memories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
