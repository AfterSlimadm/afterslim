"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { COST_CATEGORY_CONFIG, COST_PAYERS, PARTNERS } from "@/lib/constants";
import type { Cost, CostCategory } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  DollarSign,
  Trash2,
  Loader2,
  Users,
  Paperclip,
  File,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

/* -- Helpers -------------------------------------------------- */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* -- Props ---------------------------------------------------- */

interface CostsContentProps {
  costs: Cost[];
}

/* -- Component ------------------------------------------------ */

export default function CostsContent({ costs }: CostsContentProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [paidByFilter, setPaidByFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Drill-down sheet (mostra todos os investimentos de um pagador)
  const [drilldownPayerId, setDrilldownPayerId] = useState<string | null>(null);

  // Form state
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState<CostCategory>("other");
  const [formPaidBy, setFormPaidBy] = useState<string>(COST_PAYERS[0].id);
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");

  // Upload state for receipt
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -- Filtering ---------------------------------------------- */

  const filtered = useMemo(() => {
    return costs.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.description.toLowerCase().includes(q) &&
          !(c.notes?.toLowerCase().includes(q) ?? false)
        )
          return false;
      }
      if (paidByFilter !== "all" && c.paid_by !== paidByFilter) return false;
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      return true;
    });
  }, [costs, search, paidByFilter, categoryFilter]);

  /* -- Stats -------------------------------------------------- */

  const totalSpent = useMemo(
    () => costs.reduce((sum, c) => sum + Number(c.amount), 0),
    [costs]
  );

  const perPerson = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of COST_PAYERS) map[p.id] = 0;
    for (const c of costs) {
      map[c.paid_by] = (map[c.paid_by] ?? 0) + Number(c.amount);
    }
    return map;
  }, [costs]);

  /* -- Upload handler ----------------------------------------- */

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "receipts");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao fazer upload");
      } else {
        setReceiptUrl(data.url);
        setReceiptName(data.name);
      }
    } catch {
      toast.error("Erro de conexao ao fazer upload");
    } finally {
      setIsUploading(false);
    }
  }

  /* -- Reset -------------------------------------------------- */

  function resetForm() {
    setFormDesc("");
    setFormAmount("");
    setFormCategory("other");
    setFormPaidBy(COST_PAYERS[0].id);
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNotes("");
    setReceiptUrl(null);
    setReceiptName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* -- Open edit ---------------------------------------------- */

  function openEdit(cost: Cost) {
    setEditingCost(cost);
    setFormDesc(cost.description);
    setFormAmount(String(cost.amount));
    setFormCategory(cost.category as CostCategory);
    setFormPaidBy(cost.paid_by);
    setFormDate(cost.date);
    setFormNotes(cost.notes ?? "");
    setReceiptUrl(cost.receipt_url ?? null);
    setReceiptName(cost.receipt_url ? "comprovante" : null);
    setDialogOpen(true);
  }

  /* -- Save --------------------------------------------------- */

  async function handleSave() {
    if (!formDesc.trim()) {
      toast.error("Insira uma descricao");
      return;
    }
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) {
      toast.error("Insira um valor valido");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        description: formDesc.trim(),
        amount,
        category: formCategory,
        paid_by: formPaidBy,
        date: formDate,
        notes: formNotes.trim() || undefined,
        receipt_url: receiptUrl || undefined,
      };

      const url = editingCost ? `/api/costs/${editingCost.id}` : "/api/costs";
      const method = editingCost ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        const fieldErrors = data.details?.fieldErrors as
          | Record<string, string[]>
          | undefined;
        if (fieldErrors) {
          const issues = Object.entries(fieldErrors)
            .map(([f, msgs]) => `${f}: ${msgs.join(", ")}`)
            .join(" | ");
          throw new Error(`${data.error ?? "Dados invalidos"} — ${issues}`);
        }
        throw new Error(data.error ?? "Erro ao salvar");
      }

      toast.success(editingCost ? "Custo atualizado" : "Custo registrado");
      setDialogOpen(false);
      setEditingCost(null);
      resetForm();
      router.refresh();
    } catch (err) {
      toast.error(`Erro: ${err instanceof Error ? err.message : "desconhecido"}`);
    } finally {
      setIsSaving(false);
    }
  }

  /* -- Delete ------------------------------------------------- */

  async function handleDelete(id: string) {
    if (!confirm("Excluir este custo?")) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/costs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");

      toast.success("Custo excluido");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir custo");
    } finally {
      setIsDeleting(null);
    }
  }

  /* -- Render ------------------------------------------------- */

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="page-header">
          <h1 className="page-title">Custos</h1>
          <p className="page-description">
            Controle quem pagou o que. Sem obrigatoriedade financeira igual pra todos.
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) { resetForm(); setEditingCost(null); }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Custo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{editingCost ? "Editar Custo" : "Registrar Custo"}</DialogTitle>
              <DialogDescription>
                {editingCost ? "Altere os dados do custo." : "Registre um gasto e quem pagou."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cost-desc">Descricao</Label>
                <Input
                  id="cost-desc"
                  placeholder="Ex: Estoque 500un berberina"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cost-amount">Valor (USD)</Label>
                  <Input
                    id="cost-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost-date">Data</Label>
                  <Input
                    id="cost-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cost-paid-by">Quem pagou</Label>
                  <Select value={formPaidBy} onValueChange={setFormPaidBy}>
                    <SelectTrigger id="cost-paid-by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COST_PAYERS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost-category">Categoria</Label>
                  <Select
                    value={formCategory}
                    onValueChange={(v) => setFormCategory(v as CostCategory)}
                  >
                    <SelectTrigger id="cost-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COST_CATEGORY_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost-notes">Observacoes (opcional)</Label>
                <Textarea
                  id="cost-notes"
                  placeholder="Detalhes adicionais..."
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Comprovante (opcional)</Label>
                {!receiptUrl && !isUploading && (
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleReceiptUpload}
                    className="cursor-pointer"
                  />
                )}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                )}
                {receiptUrl && receiptName && (
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{receiptName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptUrl(null);
                        setReceiptName(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Salvando..." : editingCost ? "Salvar Alteracoes" : "Registrar Custo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards - Total + por pessoa */}
      <div className="kpi-grid">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gasto
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {costs.length} registros
            </p>
          </CardContent>
        </Card>

        {COST_PAYERS.map((p) => {
          const payerCosts = costs.filter((c) => c.paid_by === p.id);
          return (
            <Card
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setDrilldownPayerId(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDrilldownPayerId(p.id);
                }
              }}
              className="gap-0 py-0 cursor-pointer transition-all hover:shadow-md hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Ver investimentos de ${p.name}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {p.name}{" "}
                  <span className="text-xs font-normal text-muted-foreground/70">
                    · {p.role}
                  </span>
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-2xl font-bold">
                  {formatCurrency(perPerson[p.id] ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {payerCosts.length} pagamentos · ver detalhes →
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar custos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={paidByFilter} onValueChange={setPaidByFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Quem pagou" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {COST_PAYERS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(COST_CATEGORY_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <DollarSign />
          <p className="font-medium">Nenhum custo registrado</p>
          <p className="text-sm">
            {costs.length === 0
              ? "Registre o primeiro custo do projeto."
              : "Tente ajustar sua busca ou filtros."}
          </p>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DESCRICAO</TableHead>
                  <TableHead>QUEM PAGOU</TableHead>
                  <TableHead>CATEGORIA</TableHead>
                  <TableHead>DATA</TableHead>
                  <TableHead className="text-right">VALOR</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cost) => {
                  const catConfig =
                    COST_CATEGORY_CONFIG[cost.category as CostCategory] ??
                    COST_CATEGORY_CONFIG.other;
                  const partner =
                    COST_PAYERS.find((p) => p.id === cost.paid_by) ??
                    PARTNERS.find((p) => p.id === cost.paid_by);

                  return (
                    <TableRow key={cost.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[250px]">
                            {cost.description}
                          </p>
                          {cost.notes && (
                            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {cost.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-sm">
                          {partner?.name ?? cost.paid_by}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", catConfig.color)}
                        >
                          {catConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(cost.date)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm whitespace-nowrap">
                        {formatCurrency(Number(cost.amount))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {cost.receipt_url && (
                            <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                              <a
                                href={cost.receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEdit(cost)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(cost.id)}
                            disabled={isDeleting === cost.id}
                          >
                            {isDeleting === cost.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Drill-down: detalhes de um pagador */}
      <Sheet
        open={drilldownPayerId !== null}
        onOpenChange={(open) => {
          if (!open) setDrilldownPayerId(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          {(() => {
            if (!drilldownPayerId) return null;
            const payer = COST_PAYERS.find((p) => p.id === drilldownPayerId);
            if (!payer) return null;
            const payerCosts = costs.filter((c) => c.paid_by === payer.id);
            const total = payerCosts.reduce(
              (sum, c) => sum + Number(c.amount),
              0
            );
            const byCategory = payerCosts.reduce<Record<string, number>>(
              (acc, c) => {
                acc[c.category] = (acc[c.category] ?? 0) + Number(c.amount);
                return acc;
              },
              {}
            );
            const categoryEntries = Object.entries(byCategory).sort(
              (a, b) => b[1] - a[1]
            );
            const sortedCosts = [...payerCosts].sort((a, b) =>
              b.date.localeCompare(a.date)
            );

            return (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>{payer.name}</SheetTitle>
                  <SheetDescription>
                    {payer.role} · todos os investimentos registrados
                  </SheetDescription>
                </SheetHeader>

                {/* Totais */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Card className="gap-0 py-0">
                    <CardContent className="py-4 px-4">
                      <p className="text-xs text-muted-foreground">
                        Total investido
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {formatCurrency(total)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="gap-0 py-0">
                    <CardContent className="py-4 px-4">
                      <p className="text-xs text-muted-foreground">
                        Pagamentos
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {payerCosts.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Breakdown por categoria */}
                {categoryEntries.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-3">Por categoria</p>
                    <div className="space-y-2">
                      {categoryEntries.map(([cat, amt]) => {
                        const catConfig =
                          COST_CATEGORY_CONFIG[cat as CostCategory] ??
                          COST_CATEGORY_CONFIG.other;
                        const pct = total > 0 ? (amt / total) * 100 : 0;
                        return (
                          <div
                            key={cat}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <Badge
                              variant="secondary"
                              className={cn("text-[10px]", catConfig.color)}
                            >
                              {catConfig.label}
                            </Badge>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-medium tabular-nums whitespace-nowrap">
                              {formatCurrency(amt)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lista de investimentos */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">
                    Investimentos ({payerCosts.length})
                  </p>
                  {sortedCosts.length === 0 ? (
                    <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                      Nenhum investimento registrado por {payer.name}.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sortedCosts.map((c) => {
                        const catConfig =
                          COST_CATEGORY_CONFIG[c.category as CostCategory] ??
                          COST_CATEGORY_CONFIG.other;
                        return (
                          <div
                            key={c.id}
                            className="rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">
                                  {c.description}
                                </p>
                                {c.notes && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {c.notes}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant="secondary"
                                    className={cn("text-[10px]", catConfig.color)}
                                  >
                                    {catConfig.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(c.date)}
                                  </span>
                                  {c.receipt_url && (
                                    <a
                                      href={c.receipt_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      comprovante
                                    </a>
                                  )}
                                </div>
                              </div>
                              <p className="font-semibold tabular-nums whitespace-nowrap">
                                {formatCurrency(Number(c.amount))}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
