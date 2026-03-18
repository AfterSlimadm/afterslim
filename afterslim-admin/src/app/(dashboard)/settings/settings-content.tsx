"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Settings,
  Users,
  Bell,
  Palette,
  Shield,
  Save,
  Store,
  Plus,
  Activity,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/lib/queries/team";
import type { AuditLogEntry } from "@/lib/queries/settings";

// ─── Types ────────────────────────────────────────────────────

interface SettingsContentProps {
  initialSettings: Record<string, unknown>;
  initialTeam: TeamMember[];
  initialAuditLog: AuditLogEntry[];
  currentUser: { email: string; id: string };
}

// ─── Helpers ──────────────────────────────────────────────────

async function saveSetting(key: string, value: unknown) {
  const res = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Falha ao salvar");
  }
}

async function saveMultipleSettings(entries: Record<string, unknown>) {
  const promises = Object.entries(entries).map(([key, value]) =>
    saveSetting(key, value)
  );
  await Promise.all(promises);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Nunca";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────

export default function SettingsContent({
  initialSettings,
  initialTeam,
  initialAuditLog,
  currentUser,
}: SettingsContentProps) {
  // Theme (next-themes)
  const { setTheme: setNextTheme } = useTheme();

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Store settings state
  const [storeName, setStoreName] = useState(
    (initialSettings.store_name as string) || "AfterSlim"
  );
  const [supportEmail, setSupportEmail] = useState(
    (initialSettings.support_email as string) || ""
  );
  const [currency, setCurrency] = useState(
    (initialSettings.currency as string) || "BRL"
  );
  const [timezone, setTimezone] = useState(
    (initialSettings.timezone as string) || "America/Sao_Paulo"
  );

  // Notification settings state
  const [notifyOrders, setNotifyOrders] = useState(
    initialSettings.notify_new_orders !== false
  );
  const [notifyStock, setNotifyStock] = useState(
    initialSettings.notify_low_stock !== false
  );
  const [notifyAgents, setNotifyAgents] = useState(
    initialSettings.notify_agent_alerts !== false
  );
  const [notifyWeekly, setNotifyWeekly] = useState(
    initialSettings.notify_weekly_summary === true
  );

  // Appearance (local state synced with next-themes)
  const [theme, setThemeLocal] = useState(
    (initialSettings.theme as string) || "system"
  );

  function setTheme(value: string) {
    setThemeLocal(value);
    setNextTheme(value);
  }

  // Team
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);

  // Saving states
  const [savingStore, setSavingStore] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);

  // Danger zone
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  // ─── Save handlers ──────────────────────────────────────────

  async function handleSaveStore() {
    setSavingStore(true);
    try {
      await saveMultipleSettings({
        store_name: storeName,
        support_email: supportEmail,
        currency,
        timezone,
      });
      toast.success("Configurações da loja salvas");
    } catch (err) {
      toast.error(
        `Erro ao salvar: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSavingStore(false);
    }
  }

  async function handleSaveNotifications() {
    setSavingNotif(true);
    try {
      await saveMultipleSettings({
        notify_new_orders: notifyOrders,
        notify_low_stock: notifyStock,
        notify_agent_alerts: notifyAgents,
        notify_weekly_summary: notifyWeekly,
      });
      toast.success("Preferências de notificação salvas");
    } catch (err) {
      toast.error(
        `Erro ao salvar: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSavingNotif(false);
    }
  }

  async function handleSaveAppearance() {
    setSavingAppearance(true);
    try {
      await saveSetting("theme", theme);
      toast.success("Preferências de aparência salvas");
    } catch (err) {
      toast.error(
        `Erro ao salvar: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSavingAppearance(false);
    }
  }

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      toast.error("Preencha ambos os campos de senha");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Senha alterada com sucesso");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        `Erro ao trocar senha: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleInvite() {
    if (!inviteEmail || !inviteRole) {
      toast.error("Preencha email e perfil");
      return;
    }
    setInviting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          displayName: inviteName,
          role: inviteRole,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Falha ao convidar");
      }

      const newMember = await res.json();
      setTeam((prev) => [...prev, newMember]);
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("admin");
      toast.success("Membro convidado com sucesso");
    } catch (err) {
      toast.error(
        `Erro: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setInviting(false);
    }
  }

  async function handleResetAgentMemory() {
    setResetting(true);
    try {
      // POST setting to flag reset
      await saveSetting("agent_memory_reset_at", new Date().toISOString());
      toast.success("Memória dos agentes resetada");
      setConfirmReset(false);
    } catch (err) {
      toast.error(
        `Erro: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setResetting(false);
    }
  }

  // ─── Role labels ────────────────────────────────────────────

  const roleLabels: Record<string, string> = {
    owner: "Dono",
    admin: "Admin",
    viewer: "Visualizador",
  };

  function getRoleLabel(role: string) {
    return roleLabels[role] || role;
  }

  function getRoleBadgeVariant(role: string) {
    if (role === "owner") return "default" as const;
    if (role === "admin") return "secondary" as const;
    return "outline" as const;
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="size-6 text-muted-foreground" />
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie preferências da loja, equipe e notificações.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">
            <User className="size-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="store">
            <Store className="size-4" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="size-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="size-4" />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Activity className="size-4" />
            Atividades
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Shield className="size-4" />
            Perigo
          </TabsTrigger>
        </TabsList>

        {/* ─── Conta ────────────────────────────────────────── */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5 text-muted-foreground" />
                  Perfil
                </CardTitle>
                <CardDescription>
                  Informações da conta logada.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={currentUser.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Este é o email usado para login. Para alterar, entre em contato com o suporte.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trocar Senha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5 text-muted-foreground" />
                  Trocar Senha
                </CardTitle>
                <CardDescription>
                  Atualize a senha da sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                  >
                    {savingPassword ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Lock className="size-4" />
                    )}
                    {savingPassword ? "Salvando..." : "Trocar Senha"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Loja ─────────────────────────────────────────── */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="size-5 text-muted-foreground" />
                Configurações da Loja
              </CardTitle>
              <CardDescription>
                Informações básicas e preferências globais da loja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da loja</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="suporte@afterslim.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL (R$)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">
                        America/Sao_Paulo (BRT)
                      </SelectItem>
                      <SelectItem value="America/Manaus">
                        America/Manaus (AMT)
                      </SelectItem>
                      <SelectItem value="America/Belem">
                        America/Belem (BRT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (ET)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveStore} disabled={savingStore}>
                  {savingStore ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {savingStore ? "Salvando..." : "Salvar Loja"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Notificações ────────────────────────────────── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5 text-muted-foreground" />
                Notificações
              </CardTitle>
              <CardDescription>
                Escolha quais notificações você deseja receber.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "orders",
                  label: "Novos pedidos",
                  description:
                    "Receber notificação quando um novo pedido for feito",
                  checked: notifyOrders,
                  onChange: setNotifyOrders,
                },
                {
                  id: "lowStock",
                  label: "Estoque baixo",
                  description:
                    "Alertar quando produtos ficarem abaixo do ponto de reposição",
                  checked: notifyStock,
                  onChange: setNotifyStock,
                },
                {
                  id: "agents",
                  label: "Alertas de agentes",
                  description:
                    "Receber notificação quando um agente sinalizar um problema",
                  checked: notifyAgents,
                  onChange: setNotifyAgents,
                },
                {
                  id: "weekly",
                  label: "Resumo semanal",
                  description:
                    "Receber um email com o desempenho semanal do negócio",
                  checked: notifyWeekly,
                  onChange: setNotifyWeekly,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={item.checked}
                    onCheckedChange={item.onChange}
                  />
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveNotifications} disabled={savingNotif}>
                  {savingNotif ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {savingNotif ? "Salvando..." : "Salvar Notificações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Aparência ───────────────────────────────────── */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="size-5 text-muted-foreground" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do painel administrativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-xs">
                <Label>Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveAppearance}
                  disabled={savingAppearance}
                >
                  {savingAppearance ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {savingAppearance ? "Salvando..." : "Salvar Aparência"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Equipe ──────────────────────────────────────── */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-muted-foreground" />
                  Equipe
                </CardTitle>
                <CardDescription>
                  Gerencie os membros com acesso ao painel administrativo.
                </CardDescription>
              </div>
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="size-4" />
                    Convidar Membro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar Novo Membro</DialogTitle>
                    <DialogDescription>
                      Adicione um novo membro a equipe administrativa.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="inviteEmail">Email</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteName">Nome</Label>
                      <Input
                        id="inviteName"
                        placeholder="Nome completo"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteRole">Perfil</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger id="inviteRole">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Dono</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setInviteOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleInvite} disabled={inviting}>
                      {inviting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                      {inviting ? "Convidando..." : "Convidar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {team.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Users className="size-10 mb-3" />
                  <p className="text-sm">Nenhum membro cadastrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.display_name || "Sem nome"}
                        </TableCell>
                        <TableCell>{member.email || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {getRoleLabel(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(member.last_login_at)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.is_active ? "default" : "secondary"
                            }
                          >
                            {member.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Log de Atividades ───────────────────────────── */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5 text-muted-foreground" />
                Log de Atividades
              </CardTitle>
              <CardDescription>
                Últimas 20 ações registradas no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {initialAuditLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Activity className="size-10 mb-3" />
                  <p className="text-sm">Nenhuma atividade registrada</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quem</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Quando</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialAuditLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.user_name || "Sistema"}
                        </TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(entry.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Zona de Perigo ──────────────────────────────── */}
        <TabsContent value="danger">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="size-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis. Prossiga com cautela.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Resetar memória dos agentes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Limpar todos os insights e resumos armazenados pelos agentes
                  </p>
                </div>
                {!confirmReset ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setConfirmReset(true)}
                  >
                    Resetar Memória
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmReset(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={resetting}
                      onClick={handleResetAgentMemory}
                    >
                      {resetting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      {resetting
                        ? "Resetando..."
                        : "Confirmar Reset"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
