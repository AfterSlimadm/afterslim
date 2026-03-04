"use client";

import { useState, useMemo } from "react";
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
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters, type ViewMode, type SortOption } from "@/components/ideas/idea-filters";
import { NewIdeaDialog } from "@/components/ideas/new-idea-dialog";
import { IDEA_STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Idea, IdeaStatus, IdeaPriority } from "@/lib/types";
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ideas Bank</h1>
          <p className="text-muted-foreground">
            Product idea pipeline from research to launch. Score, prioritize,
            and track new product concepts.
          </p>
        </div>
        <NewIdeaDialog>
          <Button>
            <Plus className="h-4 w-4" />
            New Idea
          </Button>
        </NewIdeaDialog>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ideas
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
              In Research
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
              Approved
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
              In Production
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
        Showing {filteredIdeas.length} of {ideas.length} ideas
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onClick={setSelectedIdea} />
          ))}
          {filteredIdeas.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">
                No ideas found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
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
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead className="text-right">Est. Revenue</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground font-medium">
                          No ideas found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
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
      <Sheet
        open={selectedIdea !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedIdea(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
          {selectedIdea && (() => {
            const statusConfig = IDEA_STATUS_CONFIG[selectedIdea.status];
            const priorityConfig = PRIORITY_CONFIG[selectedIdea.priority];
            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-2">
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
                      {PRIORITY_ICONS[selectedIdea.priority]}
                      {priorityConfig.label}
                    </Badge>
                  </div>
                  <SheetTitle className="text-lg">
                    {selectedIdea.title}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedIdea.description}
                  </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="space-y-4 px-4">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedIdea.category}
                    </Badge>
                  </div>

                  {/* Assignee */}
                  {selectedIdea.assignee && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Assignee:</span>
                      <span className="text-sm font-medium">{selectedIdea.assignee}</span>
                    </div>
                  )}

                  {/* Financial Estimates */}
                  {(selectedIdea.estimated_cost !== null || selectedIdea.estimated_revenue !== null) && (
                    <div className="rounded-lg border p-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Financial Estimates
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedIdea.estimated_cost !== null && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-[10px] text-muted-foreground">Cost</p>
                              <p className="text-sm font-semibold">{formatCurrency(selectedIdea.estimated_cost)}</p>
                            </div>
                          </div>
                        )}
                        {selectedIdea.estimated_revenue !== null && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="text-[10px] text-muted-foreground">Revenue</p>
                              <p className="text-sm font-semibold">{formatCurrency(selectedIdea.estimated_revenue)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Score */}
                  {selectedIdea.score !== null && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                          selectedIdea.score >= 80
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : selectedIdea.score >= 60
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : selectedIdea.score >= 40
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        <Zap className="h-3 w-3" />
                        {selectedIdea.score}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedIdea.tags.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedIdea.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedIdea.notes && (
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm whitespace-pre-wrap rounded-lg border p-3 bg-muted/30">
                        {selectedIdea.notes}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Created {formatDate(selectedIdea.created_at)}
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
