export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getSettings, getRecentAuditLog } from "@/lib/queries/settings";
import { getTeamMembers } from "@/lib/queries/team";
import { createSupabaseServerWithCookies } from "@/lib/supabase/server";
import SettingsContent from "./settings-content";

export default async function SettingsPage() {
  await requireAuth("/settings");
  let settings: Record<string, unknown> = {};
  let team: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let auditLog: Awaited<ReturnType<typeof getRecentAuditLog>> = [];

  const supabase = await createSupabaseServerWithCookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    [settings, team, auditLog] = await Promise.all([
      getSettings(),
      getTeamMembers(),
      getRecentAuditLog(20),
    ]);
  } catch (error) {
    console.error("[SettingsPage] Falha ao carregar dados:", error);
  }

  return (
    <SettingsContent
      initialSettings={settings}
      initialTeam={team}
      initialAuditLog={auditLog}
      currentUser={
        user
          ? { email: user.email ?? "", id: user.id }
          : { email: "", id: "" }
      }
    />
  );
}
