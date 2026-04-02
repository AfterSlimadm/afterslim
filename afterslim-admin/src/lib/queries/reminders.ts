import { getAdminClient } from "@/lib/supabase/admin";
import type { Reminder } from "@/lib/types";

/**
 * Fetch all reminders ordered by due_date (soonest first), then newest.
 */
export async function getReminders(): Promise<Reminder[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getReminders]", error.message);
    return [];
  }

  return (data ?? []) as Reminder[];
}
