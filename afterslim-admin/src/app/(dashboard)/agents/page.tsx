import { getAgentTasks, getAgentMemories, getAgentMessages } from "@/lib/queries/agents";
import { AGENTS } from "@/lib/constants";
import AgentsContent, { type AgentStatus } from "./agents-content";

export default async function AgentsPage() {
  let agentStatuses: AgentStatus[] = [];

  try {
    const [tasks, memories, messages] = await Promise.all([
      getAgentTasks(),
      getAgentMemories(),
      getAgentMessages(),
    ]);

    // Compute 24-hour window for messages
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    agentStatuses = AGENTS.map((agent) => {
      const agentTasks = tasks.filter((t) => t.agent_id === agent.id);
      const agentMemories = memories.filter((m) => m.agent_id === agent.id);
      const agentMessages = messages.filter(
        (m) =>
          (m.target_module === agent.id || m.sender_id === agent.id) &&
          new Date(m.created_at) >= twentyFourHoursAgo
      );

      const completedTasks = agentTasks.filter(
        (t) => t.status === "completed"
      ).length;
      const pendingTasks = agentTasks.filter(
        (t) => t.status === "pending" || t.status === "running"
      ).length;

      // Determine agent status based on recent activity
      const lastTask = agentTasks[0]; // already sorted by newest first
      let status: "online" | "idle" | "offline" = "offline";
      let lastActive = "No activity";

      if (lastTask) {
        const lastTaskDate = new Date(lastTask.created_at);
        const minutesAgo = Math.floor(
          (now.getTime() - lastTaskDate.getTime()) / 60000
        );

        if (minutesAgo < 15) {
          status = "online";
          lastActive = "Just now";
        } else if (minutesAgo < 120) {
          status = "idle";
          lastActive =
            minutesAgo < 60
              ? `${minutesAgo}m ago`
              : `${Math.floor(minutesAgo / 60)}h ago`;
        } else {
          status = "offline";
          lastActive = `${Math.floor(minutesAgo / 60)}h ago`;
        }
      }

      return {
        agentId: agent.id,
        status,
        lastActive,
        tasksCompleted: completedTasks,
        tasksPending: pendingTasks,
        memoriesCount: agentMemories.length,
        messagesLast24h: agentMessages.length,
      };
    });
  } catch (error) {
    console.error("[AgentsPage] Failed to fetch agent data:", error);
  }

  return <AgentsContent agentStatuses={agentStatuses} />;
}
