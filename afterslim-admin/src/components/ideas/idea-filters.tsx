"use client";

import { useState } from "react";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDEA_STATUS_CONFIG, PRIORITY_CONFIG, IDEA_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { IdeaStatus, IdeaPriority } from "@/lib/types";

export type ViewMode = "grid" | "list";
export type SortOption = "newest" | "priority" | "score";

interface IdeaFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: IdeaStatus | "all";
  onStatusFilterChange: (value: IdeaStatus | "all") => void;
  priorityFilter: IdeaPriority | "all";
  onPriorityFilterChange: (value: IdeaPriority | "all") => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const STATUS_OPTIONS: { value: IdeaStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  ...Object.entries(IDEA_STATUS_CONFIG).map(([key, config]) => ({
    value: key as IdeaStatus,
    label: config.label,
  })),
];

export function IdeaFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
}: IdeaFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Controls Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ideias..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <Select
            value={priorityFilter}
            onValueChange={(val) => onPriorityFilterChange(val as IdeaPriority | "all")}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Prioridades</SelectItem>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={onCategoryFilterChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {IDEA_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(val) => onSortByChange(val as SortOption)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="priority">Prioridade</SelectItem>
              <SelectItem value="score">Pontuacao</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusFilterChange(option.value)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
