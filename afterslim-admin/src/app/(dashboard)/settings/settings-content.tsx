"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  Truck,
  Mail,
  MessageSquare,
  Smartphone,
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
    (initialSettings.store_name as string) || "AfterSlim Brasil"
  );
  const [cnpj, setCnpj] = useState(
    (initialSettings.cnpj as string) || "00.000.000/0000-00"
  );
  const [contactEmail, setContactEmail] = useState(
    (initialSettings.support_email as string) || "contato@afterslim.com.br"
  );
  const [phone, setPhone] = useState(
    (initialSettings.phone as string) || "+55 (11) 99999-9999"
  );
  const [address, setAddress] = useState(
    (initialSettings.address as string) ||
      "Av. Paulista, 1000 - Bela Vista, Sao Paulo - SP"
  );

  // Regional preferences
  const [currency, setCurrency] = useState(
    (initialSettings.currency as string) || "USD"
  );
  const [timezone, setTimezone] = useState(
    (initialSettings.timezone as string) || "America/Sao_Paulo"
  );
  const [language, setLanguage] = useState(
    (initialSettings.language as string) || "pt-BR"
  );

  // Shipping
  const [carrier, setCarrier] = useState(
    (initialSettings.default_carrier as string) || "correios"
  );
  const [freeShippingMin, setFreeShippingMin] = useState(
    (initialSettings.free_shipping_min as string) || "R$199,00"
  );
  const [processingTime, setProcessingTime] = useState(
    (initialSettings.processing_time as string) || "2 dias uteis"
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

  // Saving
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveMultipleSettings({
        store_name: storeName,
        cnpj,
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
      toast.success("Configuracoes salvas com sucesso");
    } catch (err) {
      toast.error(
        `Erro ao salvar: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setStoreName((initialSettings.store_name as string) || "AfterSlim Brasil");
    setCnpj((initialSettings.cnpj as string) || "00.000.000/0000-00");
    setContactEmail(
      (initialSettings.support_email as string) || "contato@afterslim.com.br"
    );
    setPhone((initialSettings.phone as string) || "+55 (11) 99999-9999");
    setAddress(
      (initialSettings.address as string) ||
        "Av. Paulista, 1000 - Bela Vista, Sao Paulo - SP"
    );
    setCurrency((initialSettings.currency as string) || "USD");
    setTimezone((initialSettings.timezone as string) || "America/Sao_Paulo");
    setLanguage((initialSettings.language as string) || "pt-BR");
    setCarrier((initialSettings.default_carrier as string) || "correios");
    setFreeShippingMin(
      (initialSettings.free_shipping_min as string) || "R$199,00"
    );
    setProcessingTime(
      (initialSettings.processing_time as string) || "2 dias uteis"
    );
    setEmailNotif(initialSettings.channel_email !== false);
    setSmsNotif(initialSettings.channel_sms === true);
    setWhatsappNotif(initialSettings.channel_whatsapp !== false);
    toast.info("Alteracoes descartadas");
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
            Configuracoes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as diretrizes e preferencias do ecossistema AfterSlim.
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
            <TabsTrigger value="notificacoes" className="text-sm">
              Notificacoes
            </TabsTrigger>
            <TabsTrigger value="integracao" className="text-sm">
              Integracao
            </TabsTrigger>
            <TabsTrigger value="equipe" className="text-sm">
              Equipe
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="text-sm">
              Seguranca
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
                    Informacoes da Loja
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
                      <FieldLabel>CNPJ</FieldLabel>
                      <Input
                        value={cnpj}
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
                      <FieldLabel>Endereco comercial</FieldLabel>
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
                    Preferencias Regionais
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
                            Dolar Americano (USD)
                          </SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Fuso horario</FieldLabel>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">
                            America/Sao_Paulo (GMT-3)
                          </SelectItem>
                          <SelectItem value="America/Manaus">
                            America/Manaus (GMT-4)
                          </SelectItem>
                          <SelectItem value="America/Belem">
                            America/Belem (GMT-3)
                          </SelectItem>
                          <SelectItem value="America/Recife">
                            America/Recife (GMT-3)
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
                            Portugues (PT-BR)
                          </SelectItem>
                          <SelectItem value="en-US">English (EN-US)</SelectItem>
                          <SelectItem value="es">Espanol (ES)</SelectItem>
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
                    Logistica e Envio
                  </h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <FieldLabel>Transportadora padrao</FieldLabel>
                      <Select value={carrier} onValueChange={setCarrier}>
                        <SelectTrigger className="border-0 bg-[#dae3ee]/60 shadow-none focus:ring-1 focus:ring-[#00628c]/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="correios">Correios</SelectItem>
                          <SelectItem value="jadlog">Jadlog</SelectItem>
                          <SelectItem value="totalexpress">
                            Total Express
                          </SelectItem>
                          <SelectItem value="loggi">Loggi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Frete gratis (minimo)</FieldLabel>
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
                    Canais de Notificacao
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
                            Notificacoes por e-mail
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
                  {saving ? "Salvando..." : "Salvar Alteracoes"}
                </Button>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Notificacoes Tab (placeholder) ──────────────── */}
          <TabsContent value="notificacoes">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-muted-foreground">
                  Configuracoes de notificacoes em breve.
                </p>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Integracao Tab (placeholder) ────────────────── */}
          <TabsContent value="integracao">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-muted-foreground">
                  Configuracoes de integracao em breve.
                </p>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Equipe Tab (placeholder) ────────────────────── */}
          <TabsContent value="equipe">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-muted-foreground">
                  Gerenciamento de equipe em breve.
                </p>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Seguranca Tab (placeholder) ─────────────────── */}
          <TabsContent value="seguranca">
            <BlurFade delay={0.1}>
              <div className="rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-muted-foreground">
                  Configuracoes de seguranca em breve.
                </p>
              </div>
            </BlurFade>
          </TabsContent>
        </Tabs>
      </BlurFade>
    </div>
  );
}
