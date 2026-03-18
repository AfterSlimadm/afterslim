import { getAdminClient } from "@/lib/supabase/admin";

export interface DocumentRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  file_url: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

export async function getDocuments(): Promise<DocumentRow[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[documents] query error:", error.message);
      return [];
    }

    return (data ?? []) as DocumentRow[];
  } catch (err) {
    console.error("[documents] unexpected error:", err);
    return [];
  }
}
