import { getAdminClient } from "@/lib/supabase/admin";

export interface CreatorRow {
  id: string;
  name: string;
  handle: string | null;
  platform: string | null;
  followers: number | null;
  engagement_rate: number | null;
  niche: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  tier: string | null;
  status: string;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all creators ordered by name.
 */
export async function getCreators(): Promise<CreatorRow[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[getCreators]", error.message);
    return [];
  }

  return (data ?? []) as CreatorRow[];
}

/**
 * Fetch all campaigns.
 */
export async function getCampaigns() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCampaigns]", error.message);
    return [];
  }

  return data ?? [];
}
