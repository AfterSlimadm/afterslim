"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  Plus,
  Search,
  FlaskConical,
  CheckCircle,
  Factory,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Calendar,
  Zap,
  User,
  Tag,
  MessageSquare,
  Send,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters, type ViewMode, type SortOption } from "@/components/ideas/idea-filters";
import { NewIdeaDialog } from "@/components/ideas/new-idea-dialog";
import { IDEA_STATUS_CONFIG, PRIORITY_CONFIG, IDEA_SOURCE_CONFIG } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Idea, IdeaStatus, IdeaPriority } from "@/lib/types";
import { toast } from "sonner";
import type { IdeaRow } from "@/lib/queries/ideas";

// ─── Map DB status to front-end IdeaStatus ───────────────────
const DB_STATUS_MAP: Record<string, IdeaStatus> = {
  new: "backlog",
  under_review: "researching",
  approved: "approved",
  discarded: "rejected",
};

// ─── Map DB idea row to front-end Idea type ──────────────────
function mapIdeaRowToIdea(row: IdeaRow): Idea {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: DB_STATUS_MAP[row.status] ?? "backlog",
    priority: (row.priority as IdeaPriority) ?? "medium",
    category: row.category ?? "Other",
    estimated_cost: null,
    estimated_revenue: null,
    score: row.votes > 0 ? row.votes : null,
    source: row.source ?? null,
    assignee: row.author ?? null,
    tags: row.tags ?? [],
    attachments: [],
    notes: null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ─── Priority Sorting Order ──────────────────────────────────
const PRIORITY_ORDER: Record<IdeaPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const PRIORITY_ICONS: Record<IdeaPriority, React.ReactNode> = {
  low: <ArrowDown className="h-3 w-3" />,
  medium: <ArrowRight className="h-3 w-3" />,
  high: <ArrowUp className="h-3 w-3" />,
  critical: <AlertTriangle className="h-3 w-3" />,
};

interface IdeasContentProps {
  ideaRows: IdeaRow[];
}

// ─── Component ───────────────────────────────────────────────
export default function IdeasContent({ ideaRows }: IdeasContentProps) {
  const router = useRouter();
  const ideas = useMemo(() => ideaRows.map(mapIdeaRowToIdea), [ideaRows]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<IdeaPriority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  // Filtered & sorted ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q) ||
          idea.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((idea) => idea.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((idea) => idea.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((idea) => idea.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "priority":
        result.sort(
          (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        );
        break;
      case "score":
        result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        break;
    }

    return result;
  }, [ideas, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: ideas.length,
      researching: ideas.filter((i) => i.status === "researching").length,
      approved: ideas.filter((i) => i.status === "approved").length,
      inProduction: ideas.filter((i) => i.status === "in_production").length,
    };
  }, [ideas]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Banco de Ideias</h1>
          <p className="page-description">
            Pipeline de ideias da pesquisa ao lancamento. Avalie, priorize
            e acompanhe novos conceitos.
          </p>
        </div>
        <NewIdeaDialog>
          <Button>
            <Plus className="h-4 w-4" />
            Nova Ideia
          </Button>
        </NewIdeaDialog>
      </div>

      {/* Stats Row */}
      <div className="kpi-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Ideias
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Pesquisa
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.researching}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aprovadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Produção
            </CardTitle>
            <Factory className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProduction}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <IdeaFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredIdeas.length} de {ideas.length} ideias
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onClick={setSelectedIdea} />
          ))}
          {filteredIdeas.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">
                Nenhuma ideia encontrada
              </p>
              <p className="text-sm text-muted-foreground">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="text-right">Custo Est.</TableHead>
                  <TableHead className="text-right">Receita Est.</TableHead>
                  <TableHead className="text-center">Pontuação</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIdeas.map((idea) => {
                  const statusConfig = IDEA_STATUS_CONFIG[idea.status];
                  const priorityConfig = PRIORITY_CONFIG[idea.priority];
                  return (
                    <TableRow
                      key={idea.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedIdea(idea)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{idea.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {idea.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", statusConfig.color)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] gap-1",
                            priorityConfig.color
                          )}
                        >
                          {PRIORITY_ICONS[idea.priority]}
                          {priorityConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {idea.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {idea.source && IDEA_SOURCE_CONFIG[idea.source] ? (
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px]", IDEA_SOURCE_CONFIG[idea.source].color)}
                          >
                            {IDEA_SOURCE_CONFIG[idea.source].label}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-700">
                            Manual
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {idea.estimated_cost !== null
                          ? formatCurrency(idea.estimated_cost)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {idea.estimated_revenue !== null
                          ? formatCurrency(idea.estimated_revenue)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {idea.score !== null ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                              idea.score >= 80
                                ? "badge-success"
                                : idea.score >= 60
                                ? "badge-info"
                                : idea.score >= 40
                                ? "badge-warning"
                                : "badge-error"
                            )}
                          >
                            <Zap className="h-3 w-3" />
                            {idea.score}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(idea.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredIdeas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground font-medium">
                          Nenhuma ideia encontrada
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tente ajustar sua busca ou filtros
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Idea Detail Sheet */}
      <IdeaDetailSheet
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        onDelete={async (id) => {
          try {
            const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir");
            toast.success("Ideia excluida");
            setSelectedIdea(null);
            router.refresh();
          } catch {
            toast.error("Erro ao excluir ideia");
          }
        }}
      />
    </div>
  );
}

// ─── Comments Section ────────────────────────────────────────

interface IdeaComment {
  id: string;
  idea_id: string;
  content: string;
  user_id: string | null;
  agent_id: string | null;
  created_at: string;
}

function CommentsSection({ ideaId }: { ideaId: string }) {
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("[comments] fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, created]);
        setNewComment("");
      }
    } catch (err) {
      console.error("[comments] submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Comentarios</p>
        {comments.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {comments.length}
          </Badge>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {loading ? (
          <p className="text-xs text-muted-foreground">Carregando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum comentario ainda.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border p-2.5 bg-muted/20 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {comment.agent_id
                    ? `Agente: ${comment.agent_id}`
                    : comment.user_id ?? "Admin"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-xs whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* New comment */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Adicionar comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="text-xs resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          className="shrink-0 self-end"
          onClick={handleSubmit}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Idea Detail Sheet ───────────────────────────────────────

function IdeaDetailSheet({
  idea,
  onClose,
  onDelete,
}: {
  idea: Idea | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  if (!idea) {
    return (
      <Sheet open={false} onOpenChange={() => onClose()}>
        <SheetContent side="right" className="sm:max-w-lg" />
      </Sheet>
    );
  }

  const statusConfig = IDEA_STATUS_CONFIG[idea.status];
  const priorityConfig = PRIORITY_CONFIG[idea.priority];
  const sourceConfig = idea.source ? IDEA_SOURCE_CONFIG[idea.source] : null;

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={cn("text-[10px] font-medium", statusConfig.color)}
            >
              {statusConfig.label}
            </Badge>
            <Badge
              variant="secondary"
              className={cn("text-[10px] font-medium gap-1", priorityConfig.color)}
            >
              {PRIORITY_ICONS[idea.priority]}
              {priorityConfig.label}
            </Badge>
            {sourceConfig && (
              <Badge
                variant="secondary"
                className={cn("text-[10px] font-medium", sourceConfig.color)}
              >
                {sourceConfig.label}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-lg">
            {idea.title}
          </SheetTitle>
          <SheetDescription>
            {idea.description}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-4 px-4">
          {/* Categoria */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Categoria:</span>
            <Badge variant="outline" className="text-xs">
              {idea.category}
            </Badge>
          </div>

          {/* Origem */}
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Origem:</span>
            <span className="text-sm font-medium">
              {sourceConfig ? sourceConfig.label : "Manual"}
            </span>
          </div>

          {/* Responsavel */}
          {idea.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Responsavel:</span>
              <span className="text-sm font-medium">{idea.assignee}</span>
            </div>
          )}

          {/* Estimativas Financeiras */}
          {(idea.estimated_cost !== null || idea.estimated_revenue !== null) && (
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Estimativas Financeiras
              </p>
              <div className="grid grid-cols-2 gap-3">
                {idea.estimated_cost !== null && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Custo</p>
                      <p className="text-sm font-semibold">{formatCurrency(idea.estimated_cost)}</p>
                    </div>
                  </div>
                )}
                {idea.estimated_revenue !== null && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Receita</p>
                      <p className="text-sm font-semibold">{formatCurrency(idea.estimated_revenue)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pontuacao */}
          {idea.score !== null && (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pontuacao:</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                  idea.score >= 80
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : idea.score >= 60
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : idea.score >= 40
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                <Zap className="h-3 w-3" />
                {idea.score}
              </span>
            </div>
          )}

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {idea.notes && (
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Notas</p>
              <p className="text-sm whitespace-pre-wrap rounded-lg border p-3 bg-muted/30">
                {idea.notes}
              </p>
            </div>
          )}

          {/* Data */}
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Criada em {formatDate(idea.created_at)}
          </div>

          <Separator />

          {/* Comentarios */}
          <CommentsSection ideaId={idea.id} />

          <Separator />

          {/* Deletar */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm("Tem certeza que deseja excluir esta ideia?")) {
                onDelete(idea.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Excluir Ideia
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
