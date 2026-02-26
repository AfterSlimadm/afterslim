export const dynamic = "force-dynamic";

import { getAgentMessages } from "@/lib/queries/agents";
import MessagesContent from "./messages-content";

export default async function AgentMessagesPage() {
  const messages = await getAgentMessages();

  return <MessagesContent messages={messages} />;
}
