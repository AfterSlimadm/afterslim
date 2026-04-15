"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NewCreatorDialogProps {
  children: React.ReactNode;
}

export function NewCreatorDialog({ children }: NewCreatorDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [niche, setNiche] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [tier, setTier] = useState<string>("");
  const [status, setStatus] = useState<string>("prospect");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setName("");
    setHandle("");
    setPlatform("");
    setFollowers("");
    setEngagementRate("");
    setNiche("");
    setContactEmail("");
    setTier("");
    setStatus("prospect");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Nome e obrigatorio (min. 2 caracteres)");
      return;
    }
    if (!handle.trim() || handle.trim().length < 2) {
      toast.error("Handle e obrigatorio (min. 2 caracteres)");
      return;
    }
    if (!platform) {
      toast.error("Selecione a plataforma");
      return;
    }
    if (!followers || Number(followers) <= 0) {
      toast.error("Seguidores deve ser um numero positivo");
      return;
    }
    if (!engagementRate || Number(engagementRate) <= 0) {
      toast.error("Taxa de engajamento deve ser um numero positivo");
      return;
    }
    if (!tier) {
      toast.error("Selecione o nivel");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: handle.trim(),
          platform,
          followers: Number(followers),
          engagement_rate: Number(engagementRate),
          niche: niche.trim() || undefined,
          contact_email: contactEmail.trim() || undefined,
          tier,
          status,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao criar criador");
      }

      toast.success("Criador adicionado com sucesso");
      resetForm();
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar criador");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Criador</DialogTitle>
          <DialogDescription>
            Adicione um influencer ou criador de conteúdo ao pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="creator-name">Nome</Label>
              <Input
                id="creator-name"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creator-handle">Handle</Label>
              <Input
                id="creator-handle"
                placeholder="@username"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Plataforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Nível</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nano">Nano (1K-10K)</SelectItem>
                  <SelectItem value="micro">Micro (10K-100K)</SelectItem>
                  <SelectItem value="macro">Macro (100K-1M)</SelectItem>
                  <SelectItem value="mega">Mega (1M+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="creator-followers">Seguidores</Label>
              <Input
                id="creator-followers"
                type="number"
                placeholder="50000"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creator-engagement">Engajamento (%)</Label>
              <Input
                id="creator-engagement"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="creator-niche">Nicho</Label>
              <Input
                id="creator-niche"
                placeholder="Ex: Fitness, Wellness"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospecto</SelectItem>
                  <SelectItem value="contacted">Contatado</SelectItem>
                  <SelectItem value="negotiating">Negociando</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="creator-email">Email de Contato</Label>
            <Input
              id="creator-email"
              type="email"
              placeholder="email@exemplo.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="creator-notes">Notas</Label>
            <Textarea
              id="creator-notes"
              placeholder="Observações sobre o criador..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Criar Criador
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
