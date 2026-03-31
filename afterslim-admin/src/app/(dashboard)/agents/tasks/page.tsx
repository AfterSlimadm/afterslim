export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getAgentTasks } from "@/lib/queries/agents";
import TasksContent from "./tasks-content";

export default async function AgentTasksPage() {
  await requireAuth("/agents");
  const tasks = await getAgentTasks();

  return <TasksContent tasks={tasks} />;
}
