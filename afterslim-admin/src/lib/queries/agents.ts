import { getAdminClient } from "@/lib/supabase/admin";

// ─── Agent Memory ────────────────────────────────────────────

export interface AgentMemoryRow {
  id: string;
  agent_id: string;
  kind: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Fetch all agent memories ordered by newest first.
 */
export async function getAgentMemories(): Promise<AgentMemoryRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("as_agent_memory")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAgentMemories]", error.message);
    return [];
  }

  return (data ?? []) as AgentMemoryRow[];
}

// ─── Agent Tasks ─────────────────────────────────────────────

export interface AgentTaskRow {
  id: string;
  agent_id: string;
  task_type: string | null;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

/**
 * Fetch all agent tasks ordered by newest first.
 */
export async function getAgentTasks(): Promise<AgentTaskRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("as_agent_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAgentTasks]", error.message);
    return [];
  }

  return (data ?? []) as AgentTaskRow[];
}

// ─── Message Log ─────────────────────────────────────────────

export interface MessageLogRow {
  id: string;
  source_channel: string | null;
  source_group: string | null;
  sender_name: string | null;
  sender_id: string | null;
  message_text: string | null;
  message_type: string;
  classification: string | null;
  processed: boolean;
  target_module: string | null;
  target_id: string | null;
  agent_response: string | null;
  created_at: string;
}

/**
 * Fetch all message log entries ordered by newest first.
 */
export async function getAgentMessages(): Promise<MessageLogRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("as_message_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAgentMessages]", error.message);
    return [];
  }

  return (data ?? []) as MessageLogRow[];
}
