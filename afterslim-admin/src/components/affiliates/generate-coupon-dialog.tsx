"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { CreatorRow } from "@/lib/queries/creators";

interface GenerateCouponDialogProps {
  children: React.ReactNode;
  availableCreators: CreatorRow[];
}

export function GenerateCouponDialog({
  children,
  availableCreators,
}: GenerateCouponDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatorId, setCreatorId] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("10");

  const resetForm = () => {
    setCreatorId("");
    setCommissionPercent("10");
  };

  const handleSubmit = async () => {
    if (!creatorId) {
      toast.error("Selecione um criador");
      return;
    }

    const commission = Number(commissionPercent);
    if (!commission || commission < 1 || commission > 100) {
      toast.error("Comissão deve ser entre 1% e 100%");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliates/generate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_id: creatorId,
          commission_percent: commission,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao gerar cupom");
      }

      const data = await res.json();
      toast.success(`Cupom ${data.code} gerado com sucesso`);
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao gerar cupom"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Cupom de Afiliado</DialogTitle>
          <DialogDescription>
            Crie um cupom exclusivo vinculado a um criador. Vendas com esse
            cupom geram comissão automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Criador</Label>
            {availableCreators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todos os criadores já possuem cupom de afiliado.
              </p>
            ) : (
              <Select value={creatorId} onValueChange={setCreatorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar criador" />
                </SelectTrigger>
                <SelectContent>
                  {availableCreators.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                      {c.handle ? ` (${c.handle})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="commission">Comissão (%)</Label>
            <Input
              id="commission"
              type="number"
              min={1}
              max={100}
              step={1}
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Porcentagem do valor do pedido creditada ao afiliado.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || availableCreators.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Gerar Cupom
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
