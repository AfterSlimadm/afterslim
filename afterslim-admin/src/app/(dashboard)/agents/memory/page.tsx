export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getAgentMemories } from "@/lib/queries/agents";
import MemoryContent from "./memory-content";

export default async function AgentMemoryPage() {
  await requireAuth("/agents");
  const memories = await getAgentMemories();

  return <MemoryContent memories={memories} />;
}
