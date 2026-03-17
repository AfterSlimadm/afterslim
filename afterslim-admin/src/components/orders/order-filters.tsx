"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

/* ── Types ────────────────────────────────────────────────── */

export interface OrderFilters {
  search: string;
  statuses: OrderStatus[];
  sort: "newest" | "oldest" | "highest" | "lowest";
}

interface OrderFiltersBarProps {
  filters: OrderFilters;
  onChange: (filters: OrderFilters) => void;
}

/* ── Status options ───────────────────────────────────────── */

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "processing", label: "Processando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

/* ── Component ────────────────────────────────────────────── */

export function OrderFiltersBar({ filters, onChange }: OrderFiltersBarProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.statuses.length > 0) count += filters.statuses.length;
    if (filters.sort !== "newest") count++;
    return count;
  }, [filters]);

  function toggleStatus(status: OrderStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  }

  function clearStatuses() {
    onChange({ ...filters, statuses: [] });
  }

  function clearAll() {
    onChange({ search: "", statuses: [], sort: "newest" });
  }

  return (
    <div className="space-y-3">
      {/* Top row: search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por numero do pedido ou cliente..."
            value={filters.search}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            onChange({
              ...filters,
              sort: value as OrderFilters["sort"],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="oldest">Mais antigos</SelectItem>
            <SelectItem value="highest">Maior valor</SelectItem>
            <SelectItem value="lowest">Menor valor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status toggle badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Status:
        </span>
        {STATUS_OPTIONS.map((opt) => {
          if (opt.value === "all") {
            const isActive = filters.statuses.length === 0;
            return (
              <button key="all" onClick={clearStatuses}>
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  Todos
                </Badge>
              </button>
            );
          }

          const status = opt.value as OrderStatus;
          const isActive = filters.statuses.includes(status);
          const config = ORDER_STATUS_CONFIG[status];

          return (
            <button key={status} onClick={() => toggleStatus(status)}>
              <Badge
                variant="secondary"
                className={cn(
                  "cursor-pointer border transition-all",
                  isActive
                    ? cn("border-transparent", config.color)
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {opt.label}
              </Badge>
            </button>
          );
        })}

        {/* Active filter count */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="ml-2 h-7 gap-1 px-2 text-xs"
          >
            Limpar filtros
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
