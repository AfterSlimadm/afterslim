import { getAgentMemories } from "@/lib/queries/agents";
import MemoryContent from "./memory-content";

export default async function AgentMemoryPage() {
  const memories = await getAgentMemories();

  return <MemoryContent memories={memories} />;
}
