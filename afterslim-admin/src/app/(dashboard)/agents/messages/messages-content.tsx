"use client";

import Link from "next/link";
import { ArrowLeft, Search, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AGENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MessageLogRow } from "@/lib/queries/agents";

function getAgentName(agentId: string): string {
  return AGENTS.find((a) => a.id === agentId)?.name ?? agentId;
}

function getAgentAvatar(agentId: string): string {
  return AGENTS.find((a) => a.id === agentId)?.avatar ?? "??";
}

interface MessagesContentProps {
  messages: MessageLogRow[];
}

export default function MessagesContent({ messages }: MessagesContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Messages</h1>
          <p className="text-muted-foreground">
            View all messages sent and received by agents.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((msg) => {
          // Determine direction: if sender_name starts with "as-" it's an agent (outbound)
          const isAgent = msg.sender_name?.startsWith("as-") ?? false;
          const isInbound = msg.source_channel === "whatsapp" && !isAgent;
          const direction = isInbound ? "inbound" : "outbound";
          const agentId = isAgent ? msg.sender_name! : (msg.sender_name ?? "as-after");
          const displayName = isInbound
            ? msg.sender_name ?? msg.source_group ?? "Unknown"
            : getAgentName(agentId);
          const avatarText = isInbound
            ? (msg.sender_name?.[0] ?? "?")
            : getAgentAvatar(agentId);

          // For messages with agent_response, show the response as the outbound content
          const content = msg.message_text ?? "";
          const channel = msg.source_channel ?? "internal";

          return (
            <Card key={msg.id}>
              <CardContent className="flex gap-4 py-4">
                <Avatar className="size-9 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {avatarText}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {displayName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        direction === "inbound"
                          ? "border-blue-200 text-blue-700"
                          : "border-green-200 text-green-700"
                      )}
                    >
                      {direction === "inbound" ? "Received" : "Sent"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {channel}
                    </Badge>
                    {msg.classification && (
                      <Badge variant="secondary" className="text-[10px]">
                        {msg.classification}
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {content}
                  </p>
                  {msg.agent_response && (
                    <div className="mt-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                      <span className="text-xs font-medium text-foreground">Response: </span>
                      {msg.agent_response}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
