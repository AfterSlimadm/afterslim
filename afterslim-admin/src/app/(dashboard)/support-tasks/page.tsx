export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getSupportTasks } from "@/lib/queries/support-tasks";
import SupportTasksContent from "./support-tasks-content";

export default async function SupportTasksPage() {
  await requireAuth("/support-tasks");

  const tasks = await getSupportTasks();

  return <SupportTasksContent tasks={tasks} />;
}
