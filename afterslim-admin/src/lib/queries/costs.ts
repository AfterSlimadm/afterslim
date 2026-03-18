import { getAdminClient } from "@/lib/supabase/admin";
import type { Cost } from "@/lib/types";

export async function getCosts(): Promise<Cost[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("costs")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("[costs] query error:", error.message);
      return [];
    }

    return (data ?? []) as Cost[];
  } catch (err) {
    console.error("[costs] unexpected error:", err);
    return [];
  }
}
