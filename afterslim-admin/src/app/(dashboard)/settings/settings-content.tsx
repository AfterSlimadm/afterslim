"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  Truck,
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  ShoppingCart,
  Package,
  DollarSign,
  Link2,
  CreditCard,
  Users,
  UserPlus,
  Shield,
  Key,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { toast } from "sonner";
import type { TeamMember } from "@/lib/queries/team";
import type { AuditLogEntry } from "@/lib/queries/settings";

// ── Types ────────────────────────────────────────────────────

interface SettingsContentProps {
  initialSettings: Record<string, unknown>;
  initialTeam: TeamMember[];
  initialAuditLog: AuditLogEntry[];
  currentUser: { email: string; id: string };
}

// ── Helpers ──────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────

export default function SettingsContent({
  initialSettings,
}: SettingsContentProps) {
  // Store info
  const [storeName, setStoreName] = useState(
    (initialSettings.store_name as string) || "AfterSlim"
  );
  const [ein, setCnpj] = useState(
    (initialSettings.ein as string) || "00-0000000"
  );
  const [contactEmail, setContactEmail] = useState(
    (initialSettings.support_email as string) || "support@afterslim.com"
  );
  const [phone, setPhone] = useState(
    (initialSettings.phone as string) || "+55 (11) 99999-9999"
  );
  const [address, setAddress] = useState(
    (initialSettings.address as string) ||
      "Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
  );

  // Regional preferences
  const [currency, setCurrency] = useState(
    (initialSettings.currency as string) || "USD"
  );
  const [timezone, setTimezone] = useState(
    (initialSettings.timezone as string) || "America/New_York"
  );
  const [language, setLanguage] = useState(
    (initialSettings.language as string) || "pt-BR"
  );

  // Shipping
  const [carrier, setCarrier] = useState(
    (initialSettings.default_carrier as string) || "fullstack"
  );
  const [freeShippingMin, setFreeShippingMin] = useState(
    (initialSettings.free_shipping_min as string) || "$49.99"
  );
  const [processingTime, setProcessingTime] = useState(
    (initialSettings.processing_time as string) || "2 business days"
  );

  // Notification channels
  const [emailNotif, setEmailNotif] = useState(
    initialSettings.channel_email !== false
  );
  const [smsNotif, setSmsNotif] = useState(
    initialSettings.channel_sms === true
  );
  const [whatsappNotif, setWhatsappNotif] = useState(
    initialSettings.channel_whatsapp !== false
  );

  // Notification preferences
  const [notifNewOrder, setNotifNewOrder] = useState(true);
  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifPayment, setNotifPayment] = useState(false);
  const [notifDailySummary, setNotifDailySummary] = useState(false);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);

  // Saving
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveMultipleSettings({
        store_name: storeName,
        ein,
        support_email: contactEmail,
        phone,
        address,
        currency,
        timezone,
        language,
        default_carrier: carrier,
        free_shipping_min: freeShippingMin,
        processing_time: processingTime,
        channel_email: emailNotif,
        channel_sms: smsNotif,
        channel_whatsapp: whatsappNotif,
      });
      toast.success("Configurações salvas com sucesso");
    } catch (err) {
      toast.error(
        `Erro ao salvar: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setStoreName((initialSettings.store_name as string) || "AfterSlim");
    setCnpj((initialSettings.ein as string) || "00-0000000");
    setContactEmail(
      (initialSettings.support_email as string) || "support@afterslim.com"
    );
    setPhone((initialSettings.phone as string) || "+55 (11) 99999-9999");
    setAddress(
      (initialSettings.address as string) ||
        "Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
    );
    setCurrency((initialSettings.currency as string) || "USD");
    setTimezone((initialSettings.timezone as string) || "America/New_York");
    setLanguage((initialSettings.language as string) || "pt-BR");
    setCarrier((initialSettings.default_carrier as string) || "fullstack");
    setFreeShippingMin(
      (initialSettings.free_shipping_min as string) || "$49.99"
    );
    setProcessingTime(
      (initialSettings.processing_time as string) || "2 business days"
    );
    setEmailNotif(initialSettings.channel_email !== false);
    setSmsNotif(initialSettings.channel_sms === true);
    setWhatsappNotif(initialSettings.channel_whatsapp !== false);
    toast.info("Alterações descartadas");
  }

  // ── Label component (Clinical Editorial) ───────────────────

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Label
      className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground"
    >
      {children}
    </Label>
  );

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="page-container">
      {/* Header */}
      <BlurFade delay={0}>
        <div className="page-header">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground">
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as diretrizes e preferências do ecossistema AfterSlim.
          </p>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={0.05}>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList variant="line" className="mb-6 border-b border-border/40 pb-0">
            <TabsTrigger value="geral" className="text-sm">
              Geral
            </TabsTrigger>
            <TabsTrigger value="notificações" className="text-sm">
              Notificações
            </TabsTrigger>
            <TabsTrigger value="integração" className="text-sm">
              Integração
            </TabsTrigger>
            <TabsTrigger value="equipe" className="text-sm">
              Equipe
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="text-sm">
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* ── Geral Tab ──────────────────────────────────────── */}
          <TabsContent value="geral" className="space-y-6">
            {/* Top row: Store Info + Regional Preferences */}
            <BlurFade delay={0.1}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
                {/* Store Info Card */}
                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <h2 className="mb-6 text-base font-semibold text-foreground">
                    Informações da Loja
                  </h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <FieldLabel>Nome da empresa</FieldLabel>
                      <Input
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>EIN</FieldLabel>
                      <Input
                        value={ein}
                        onChange={(e) => setCnpj(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>E-mail de contato</FieldLabel>
                      <Input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Telefone</FieldLabel>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Endereço comercial</FieldLabel>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Regional Preferences Card */}
                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <h2 className="mb-6 text-base font-semibold text-foreground">
                    Preferências Regionais
                  </h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <FieldLabel>Moeda base</FieldLabel>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">
                            Real Brasileiro (BRL)
                          </SelectItem>
                          <SelectItem value="USD">
                            Dólar Americano (USD)
                          </SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Fuso horário</FieldLabel>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">
                            America/New_York (EST)
                          </SelectItem>
                          <SelectItem value="America/Manaus">
                            America/Manaus (GMT-4)
                          </SelectItem>
                          <SelectItem value="America/Belem">
                            America/Belem (EST)
                          </SelectItem>
                          <SelectItem value="America/Recife">
                            America/Recife (EST)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Idioma do painel</FieldLabel>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">
                            Português (PT-BR)
                          </SelectItem>
                          <SelectItem value="en-US">English (EN-US)</SelectItem>
                          <SelectItem value="es">Español (ES)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </BlurFade>

            {/* Bottom row: Shipping + Notification Channels */}
            <BlurFade delay={0.15}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Shipping Card */}
                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <h2 className="mb-6 flex items-center gap-2 text-base font-semibold text-foreground">
                    <Truck className="size-4 text-muted-foreground" />
                    Logística e Envio
                  </h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <FieldLabel>Transportadora padrão</FieldLabel>
                      <Select value={carrier} onValueChange={setCarrier}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usps">USPS</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="fullstack">FullStack Fulfillment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Frete grátis (mínimo)</FieldLabel>
                      <Input
                        value={freeShippingMin}
                        onChange={(e) => setFreeShippingMin(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Prazo de processamento</FieldLabel>
                      <Input
                        value={processingTime}
                        onChange={(e) => setProcessingTime(e.target.value)}
                        className="border-0 bg-[#dae3ee]/60 shadow-none focus-visible:ring-1 focus-visible:ring-[#00628c]/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Channels Card */}
                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <h2 className="mb-6 text-base font-semibold text-foreground">
                    Canais de Notificação
                  </h2>
                  <div className="space-y-5">
                    {/* Email toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                          <Mail className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            E-mail
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Notificações por e-mail
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={emailNotif}
                        onCheckedChange={setEmailNotif}
                        className="data-[state=checked]:bg-[#00628c]"
                      />
                    </div>
                    {/* SMS toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                          <Smartphone className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            SMS Marketing
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Campanhas via SMS
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={smsNotif}
                        onCheckedChange={setSmsNotif}
                        className="data-[state=checked]:bg-[#00628c]"
                      />
                    </div>
                    {/* WhatsApp toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                          <MessageSquare className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            WhatsApp Business
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mensagens via WhatsApp
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={whatsappNotif}
                        onCheckedChange={setWhatsappNotif}
                        className="data-[state=checked]:bg-[#00628c]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </BlurFade>

            {/* Action buttons */}
            <BlurFade delay={0.2}>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={handleDiscard}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Descartar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#00628c] text-white hover:bg-[#00496a] shadow-none"
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Notificações Tab ──────────────────────────── */}
          <TabsContent value="notificações" className="space-y-6">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="mb-6 text-base font-semibold text-foreground flex items-center gap-2">
                  <Bell className="size-4 text-muted-foreground" />
                  Preferências de Notificação
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <ShoppingCart className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Novo pedido recebido</p>
                        <p className="text-xs text-muted-foreground">Receba alertas a cada novo pedido</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifNewOrder}
                      onCheckedChange={setNotifNewOrder}
                      className="data-[state=checked]:bg-[#00628c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Estoque baixo</p>
                        <p className="text-xs text-muted-foreground">Alerta quando o estoque atingir o ponto de recompra</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifLowStock}
                      onCheckedChange={setNotifLowStock}
                      className="data-[state=checked]:bg-[#00628c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <DollarSign className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Pagamento recebido</p>
                        <p className="text-xs text-muted-foreground">Notificação ao confirmar pagamento</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifPayment}
                      onCheckedChange={setNotifPayment}
                      className="data-[state=checked]:bg-[#00628c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <Mail className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Resumo diário</p>
                        <p className="text-xs text-muted-foreground">Receba um resumo diário por e-mail</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifDailySummary}
                      onCheckedChange={setNotifDailySummary}
                      className="data-[state=checked]:bg-[#00628c]"
                    />
                  </div>
                </div>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Integração Tab ────────────────────────────── */}
          <TabsContent value="integração" className="space-y-6">
            <BlurFade delay={0.1}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* CartRover */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                        <Truck className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">CartRover</CardTitle>
                        <CardDescription className="text-xs">Fulfillment</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-red-50 text-red-700 text-[10px]">Desconectado</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => toast.info("Configuração do CartRover em breve")}
                      >
                        <Link2 className="size-3 mr-1" />
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stripe */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50">
                        <CreditCard className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">Stripe</CardTitle>
                        <CardDescription className="text-xs">Pagamentos</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-red-50 text-red-700 text-[10px]">Desconectado</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => toast.info("Configuração do Stripe em breve")}
                      >
                        <Link2 className="size-3 mr-1" />
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp Business */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
                        <MessageSquare className="size-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">WhatsApp Business</CardTitle>
                        <CardDescription className="text-xs">Mensagens</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px]">Conectado</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => toast.info("Gerenciamento do WhatsApp em breve")}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Equipe Tab ────────────────────────────────── */}
          <TabsContent value="equipe" className="space-y-6">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    Membros da Equipe
                  </h2>
                  <Button
                    size="sm"
                    className="bg-[#00628c] hover:bg-[#00496a] text-white gap-1.5"
                    onClick={() => toast.info("Convite de membros em breve")}
                  >
                    <UserPlus className="size-4" />
                    Convidar Membro
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Nome</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Papel</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Vitor Araújo", role: "Owner", status: "Ativo" },
                      { name: "Henrique Vaz", role: "Admin", status: "Ativo" },
                      { name: "Fernando Quintas", role: "Admin", status: "Ativo" },
                      { name: "Allan Godoy", role: "Admin", status: "Ativo" },
                    ].map((member) => (
                      <TableRow key={member.name} className="border-border/40">
                        <TableCell className="text-sm font-medium text-foreground">{member.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={member.role === "Owner" ? "bg-[#00628c]/10 text-[#00628c]" : "bg-muted text-muted-foreground"}
                          >
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                            {member.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Segurança Tab ─────────────────────────────── */}
          <TabsContent value="seguranca" className="space-y-6">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h2 className="mb-6 text-base font-semibold text-foreground flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  Segurança da Conta
                </h2>
                <div className="space-y-6">
                  {/* 2FA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <Key className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Autenticação em dois fatores (2FA)</p>
                        <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                      className="data-[state=checked]:bg-[#00628c]"
                    />
                  </div>

                  {/* Active sessions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <Monitor className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Sessões ativas</p>
                        <p className="text-xs text-muted-foreground">1 sessão ativa</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => toast.info("Encerramento de sessões em breve")}
                    >
                      Encerrar outras sessões
                    </Button>
                  </div>

                  {/* Change password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#dae3ee]/60">
                        <Shield className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Alterar senha</p>
                        <p className="text-xs text-muted-foreground">Atualize sua senha periodicamente</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => toast.info("Alteração de senha em breve")}
                    >
                      Alterar senha
                    </Button>
                  </div>
                </div>
              </div>
            </BlurFade>
          </TabsContent>
        </Tabs>
      </BlurFade>
    </div>
  );
}
