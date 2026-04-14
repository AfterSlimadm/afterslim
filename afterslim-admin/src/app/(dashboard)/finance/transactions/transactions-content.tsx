"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TRANSACTION_CATEGORY_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import type { Transaction, TransactionType, TransactionCategory } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  X,
  Loader2,
} from "lucide-react";
import { TransactionTable } from "@/components/finance/transaction-table";
import type { TransactionRow } from "@/lib/queries/finance";

/* -- Map DB rows to front-end Transaction type ---------------- */

function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    category: (row.category ?? "other") as TransactionCategory,
    description: row.description ?? "",
    amount: Number(row.amount),
    reference_id: row.reference_id,
    reference_type: row.reference_type,
    attachment_url: row.attachment_url ?? null,
    date: row.date,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

/* -- Constants -------------------------------------------------- */

const ITEMS_PER_PAGE = 10;

const CATEGORY_OPTIONS = Object.entries(TRANSACTION_CATEGORY_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

/* -- Props ------------------------------------------------------ */

interface TransactionsContentProps {
  transactionRows: TransactionRow[];
}

/* -- Component -------------------------------------------------- */

export default function TransactionsContent({
  transactionRows,
}: TransactionsContentProps) {
  const allTransactions = useMemo(
    () => transactionRows.map(mapRowToTransaction),
    [transactionRows]
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TransactionCategory>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Form state
  const [formType, setFormType] = useState<TransactionType>("income");
  const [formCategory, setFormCategory] = useState<TransactionCategory>("order_revenue");
  const [formAmount, setFormAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formReference, setFormReference] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Erro ao fazer upload.");
        setSelectedFile(null);
      } else {
        setUploadedUrl(data.url);
        setUploadedName(data.name);
      }
    } catch {
      setUploadError("Erro de conexao ao fazer upload.");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setUploadedUrl(null);
    setUploadedName(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm() {
    setFormType("income");
    setFormCategory("order_revenue");
    setFormAmount("");
    setFormDescription("");
    setFormDate("");
    setFormReference("");
    handleRemoveFile();
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  async function handleSaveTransaction() {
    if (!formAmount || Number(formAmount) <= 0) {
      toast.error("Insira um valor valido");
      return;
    }
    if (!formDescription || formDescription.length < 3) {
      toast.error("Insira uma descrição (minimo 3 caracteres)");
      return;
    }
    if (!formDate) {
      toast.error("Selecione uma data");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          category: formCategory,
          amount: Number(formAmount),
          description: formDescription,
          date: formDate,
          reference_id: formReference || undefined,
          attachment_url: uploadedUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao salvar");
      }

      toast.success("Transacao salva com sucesso");
      setDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      toast.error(
        `Erro: ${err instanceof Error ? err.message : "desconhecido"}`
      );
    } finally {
      setIsSaving(false);
    }
  }

  /* -- Filtering ------------------------------------------------ */

  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          tx.description.toLowerCase().includes(q) ||
          (tx.reference_id?.toLowerCase().includes(q) ?? false);
        if (!matchesSearch) return false;
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
      return true;
    });
  }, [allTransactions, search, typeFilter, categoryFilter]);

  /* -- Pagination ----------------------------------------------- */

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="page-header">
          <h1 className="page-title">Transações</h1>
          <p className="page-description">
            Visualize e gerencie todas as transações de receita e despesa.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Registre uma nova transação de receita ou despesa.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tx-type">Tipo</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as TransactionType)}>
                  <SelectTrigger id="tx-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-category">Categoria</Label>
                <Select value={formCategory} onValueChange={(v) => setFormCategory(v as TransactionCategory)}>
                  <SelectTrigger id="tx-category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-amount">Valor (USD)</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-description">Descrição</Label>
                <Textarea
                  id="tx-description"
                  placeholder="Detalhes da transação..."
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-date">Data</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-reference">ID de Referência (opcional)</Label>
                <Input
                  id="tx-reference"
                  placeholder="Ex: ORD-1234"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tx-attachment">Anexo (opcional)</Label>
                <p className="text-xs text-muted-foreground">
                  PDF, PNG, JPG ou WEBP. Maximo 10MB.
                </p>
                {!uploadedUrl && !isUploading && (
                  <div className="flex items-center gap-2">
                    <Input
                      id="tx-attachment"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando arquivo...
                  </div>
                )}
                {uploadedUrl && uploadedName && (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{uploadedName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {uploadError && (
                  <p className="text-xs text-red-500">{uploadError}</p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSaveTransaction}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {isSaving ? "Salvando..." : "Salvar Transação"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-md border">
                {(["all", "income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setPage(1);
                    }}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md",
                      typeFilter === t
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {t === "all" ? "Todos" : t === "income" ? "Receita" : "Despesa"}
                  </button>
                ))}
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v as "all" | TransactionCategory);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {paginated.length} de {filtered.length} transações
        </span>
        <div className="flex gap-3">
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            {filtered.filter((t) => t.type === "income").length} receitas
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            {filtered.filter((t) => t.type === "expense").length} despesas
          </Badge>
        </div>
      </div>

      {/* Transactions table */}
      <Card>
        <CardContent className="p-0">
          <TransactionTable transactions={paginated} showFooter />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Proximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
