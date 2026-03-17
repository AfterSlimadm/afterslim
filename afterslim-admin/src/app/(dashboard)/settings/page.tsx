export const dynamic = "force-dynamic";

import { getSettings, getRecentAuditLog } from "@/lib/queries/settings";
import { getTeamMembers } from "@/lib/queries/team";
import SettingsContent from "./settings-content";

export default async function SettingsPage() {
  let settings: Record<string, unknown> = {};
  let team: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let auditLog: Awaited<ReturnType<typeof getRecentAuditLog>> = [];

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
    />
  );
}
