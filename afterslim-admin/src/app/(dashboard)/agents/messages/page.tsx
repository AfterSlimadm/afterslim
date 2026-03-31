export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getAgentMessages } from "@/lib/queries/agents";
import MessagesContent from "./messages-content";

export default async function AgentMessagesPage() {
  await requireAuth("/agents");
  const messages = await getAgentMessages();

  return <MessagesContent messages={messages} />;
}
