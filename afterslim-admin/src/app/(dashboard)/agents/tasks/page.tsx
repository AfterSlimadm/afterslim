export const dynamic = "force-dynamic";

import { getAgentTasks } from "@/lib/queries/agents";
import TasksContent from "./tasks-content";

export default async function AgentTasksPage() {
  const tasks = await getAgentTasks();

  return <TasksContent tasks={tasks} />;
}
