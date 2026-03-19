"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOCUMENT_CATEGORY_CONFIG } from "@/lib/constants";
import type { DocumentCategory } from "@/lib/types";
import type { DocumentRow } from "@/lib/queries/documents";
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
  Plus,
  Search,
  FileText,
  Download,
  Trash2,
  Loader2,
  File,
  Receipt,
  Shield,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

/* -- Icon map for categories ---------------------------------- */

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  FileText,
  Receipt,
  CreditCard,
  Shield,
  MoreHorizontal,
};

/* -- Category options ----------------------------------------- */

const CATEGORY_OPTIONS = Object.entries(DOCUMENT_CATEGORY_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

/* -- Helpers -------------------------------------------------- */

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* -- Props ---------------------------------------------------- */

interface DocumentsContentProps {
  documents: DocumentRow[];
}

/* -- Component ------------------------------------------------ */

export default function DocumentsContent({ documents }: DocumentsContentProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | DocumentCategory>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<DocumentCategory>("contract");

  // Upload state
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploadedType, setUploadedType] = useState<string | null>(null);
  const [uploadedSize, setUploadedSize] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -- Filtering ---------------------------------------------- */

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          doc.title.toLowerCase().includes(q) ||
          doc.file_name.toLowerCase().includes(q) ||
          (doc.description?.toLowerCase().includes(q) ?? false);
        if (!matchesSearch) return false;
      }
      if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
      return true;
    });
  }, [documents, search, categoryFilter]);

  /* -- Stats -------------------------------------------------- */

  const stats = useMemo(() => ({
    total: documents.length,
    contracts: documents.filter((d) => d.category === "contract").length,
    invoices: documents.filter((d) => d.category === "invoice").length,
    other: documents.filter((d) => !["contract", "invoice"].includes(d.category)).length,
  }), [documents]);

  /* -- Upload handler ----------------------------------------- */

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "documents");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Erro ao fazer upload.");
      } else {
        setUploadedUrl(data.url);
        setUploadedPath(data.path);
        setUploadedName(data.name);
        setUploadedType(file.type);
        setUploadedSize(file.size);
      }
    } catch {
      setUploadError("Erro de conexao ao fazer upload.");
    } finally {
      setIsUploading(false);
    }
  }

  /* -- Reset form --------------------------------------------- */

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("contract");
    setUploadedUrl(null);
    setUploadedPath(null);
    setUploadedName(null);
    setUploadedType(null);
    setUploadedSize(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* -- Save handler ------------------------------------------- */

  async function handleSave() {
    if (!formTitle.trim()) {
      toast.error("Insira um titulo para o documento");
      return;
    }
    if (!uploadedUrl || !uploadedPath || !uploadedName) {
      toast.error("Selecione um arquivo para upload");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          category: formCategory,
          file_name: uploadedName,
          file_url: uploadedUrl,
          file_path: uploadedPath,
          file_type: uploadedType,
          file_size: uploadedSize,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao salvar");
      }

      toast.success("Documento salvo com sucesso");
      setDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      toast.error(`Erro: ${err instanceof Error ? err.message : "desconhecido"}`);
    } finally {
      setIsSaving(false);
    }
  }

  /* -- Delete handler ----------------------------------------- */

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");

      toast.success("Documento excluido");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir documento");
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
          <h1 className="page-title">Documentos</h1>
          <p className="page-description">
            Armazene e organize contratos, notas fiscais e documentos importantes.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Novo Documento</DialogTitle>
              <DialogDescription>
                Faca upload de um contrato, nota fiscal ou outro documento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="doc-title">Titulo</Label>
                <Input
                  id="doc-title"
                  placeholder="Ex: Contrato VQ Group Fulfillment"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doc-category">Categoria</Label>
                <Select value={formCategory} onValueChange={(v) => setFormCategory(v as DocumentCategory)}>
                  <SelectTrigger id="doc-category">
                    <SelectValue />
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
                <Label htmlFor="doc-description">Descricao (opcional)</Label>
                <Textarea
                  id="doc-description"
                  placeholder="Detalhes sobre o documento..."
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doc-file">Arquivo</Label>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, XLS, XLSX, PNG, JPG. Maximo 10MB.
                </p>
                {!uploadedUrl && !isUploading && (
                  <Input
                    id="doc-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                )}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando arquivo...
                  </div>
                )}
                {uploadedUrl && uploadedName && (
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm min-w-0 overflow-hidden">
                    <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 min-w-0 truncate">{uploadedName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedSize)}
                    </span>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {uploadError && (
                  <p className="text-xs text-destructive">{uploadError}</p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={isSaving || !uploadedUrl}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSaving ? "Salvando..." : "Salvar Documento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{stats.contracts}</p>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notas Fiscais</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{stats.invoices}</p>
          </CardContent>
        </Card>
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outros</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-5 px-5">
            <p className="text-2xl font-bold">{stats.other}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as "all" | DocumentCategory)}
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

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} de {documents.length} documentos
      </p>

      {/* Documents grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <FileText />
          <p className="font-medium">Nenhum documento encontrado</p>
          <p className="text-sm">
            {documents.length === 0
              ? "Faca upload do seu primeiro documento."
              : "Tente ajustar sua busca ou filtros."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const catConfig = DOCUMENT_CATEGORY_CONFIG[doc.category as DocumentCategory] ?? DOCUMENT_CATEGORY_CONFIG.other;
            const IconComponent = CATEGORY_ICONS[catConfig.icon] ?? FileText;

            return (
              <Card key={doc.id} className="group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn("icon-box shrink-0", catConfig.color)}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={cn("text-[10px]", catConfig.color)}>
                          {catConfig.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.file_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDeleting === doc.id}
                    >
                      {isDeleting === doc.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
