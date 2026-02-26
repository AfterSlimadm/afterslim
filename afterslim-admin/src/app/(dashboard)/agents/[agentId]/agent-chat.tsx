"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Brain,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { AgentInfo } from "@/lib/constants";
import type { AgentMemoryRow } from "@/lib/queries/agents";

/* ── Types ── */

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  source?: string;
  timestamp: Date;
}

interface AgentChatProps {
  agent: AgentInfo;
  recentMemories: AgentMemoryRow[];
}

/* ── Source badge color mapping ── */

const SOURCE_COLORS: Record<string, string> = {
  nvidia: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  openclaw:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  openrouter:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function getSourceBadgeClass(source: string): string {
  return (
    SOURCE_COLORS[source.toLowerCase()] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
  );
}

/* ── Typing indicator ── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
    </div>
  );
}

/* ── Main component ── */

export default function AgentChat({ agent, recentMemories }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [memoriesOpen, setMemoriesOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agent.id,
          message: trimmed,
          ...(conversationId ? { conversation_id: conversationId } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const agentMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        content: data.content,
        source: data.source,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/agents">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to agents</span>
          </Link>
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <Avatar className="size-10 border">
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {agent.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight">
                {agent.name}
              </h1>
              <span className="inline-block size-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Online
              </span>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {agent.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Memories collapsible ── */}
      {recentMemories.length > 0 && (
        <Collapsible open={memoriesOpen} onOpenChange={setMemoriesOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-between gap-2 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Brain className="size-4" />
                <span className="text-sm font-medium">
                  Recent Memories ({recentMemories.length})
                </span>
              </div>
              {memoriesOpen ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="p-3">
                <div className="space-y-2">
                  {recentMemories.map((memory) => (
                    <div
                      key={memory.id}
                      className="rounded-md border bg-muted/30 px-3 py-2"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {memory.kind}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(memory.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {memory.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* ── Chat area ── */}
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Bot className="size-4" />
            Conversation
            {conversationId && (
              <Badge variant="outline" className="ml-auto text-xs font-normal">
                {conversationId.slice(0, 8)}...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        {/* Messages scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {/* Empty state */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Bot className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">
                  Chat with {agent.name}
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Start a conversation with the {agent.name} agent. Ask
                  questions, request analysis, or give instructions.
                </p>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <Avatar className="size-8 shrink-0 border">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-bold",
                      msg.role === "user"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      agent.avatar
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] space-y-1",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Source badge + timestamp */}
                  <div
                    className={cn(
                      "flex items-center gap-2 px-1",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.source && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-medium",
                          getSourceBadgeClass(msg.source)
                        )}
                      >
                        {msg.source}
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="size-8 shrink-0 border">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {agent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md bg-muted">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="border-t bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Failed to send message: {error}
          </div>
        )}

        {/* Input form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              disabled={isLoading}
              className="flex-1"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
