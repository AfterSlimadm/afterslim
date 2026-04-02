export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getReminders } from "@/lib/queries/reminders";
import RemindersContent from "./reminders-content";

export default async function RemindersPage() {
  await requireAuth("/reminders");
  const reminders = await getReminders();

  return <RemindersContent reminders={reminders} />;
}
