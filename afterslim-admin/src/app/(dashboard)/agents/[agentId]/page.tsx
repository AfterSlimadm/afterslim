import { notFound } from "next/navigation";
import { AGENTS } from "@/lib/constants";
import { getAgentMemories } from "@/lib/queries/agents";
import AgentChat from "./agent-chat";

export const dynamic = "force-dynamic";

export default async function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const agent = AGENTS.find((a) => a.id === agentId);

  if (!agent) notFound();

  const allMemories = await getAgentMemories();
  const agentMemories = allMemories
    .filter((m) => m.agent_id === agentId)
    .slice(0, 10);

  return <AgentChat agent={agent} recentMemories={agentMemories} />;
}
