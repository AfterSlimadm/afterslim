"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Brain,
  Pill,
  FlaskConical,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import type { InventoryRow } from "@/lib/queries/inventory";

/* ── Types ─────────────────────────────────────────────────── */

type StockStatus = "NORMAL" | "BAIXO" | "CRITICO";

interface ProductCard {
  id: string;
  name: string;
  sku: string;
  stock: number;
  reorderPoint: number;
  status: StockStatus;
  icon: React.ReactNode;
  iconBg: string;
}

/* ── Stock icon helper ────────────────────────────────────── */

const STOCK_ICONS = [
  { icon: <Pill className="size-5 text-[#00628c]" />, iconBg: "bg-[#00628c]/10" },
  { icon: <FlaskConical className="size-5 text-amber-600" />, iconBg: "bg-amber-500/10" },
  { icon: <Box className="size-5 text-red-600" />, iconBg: "bg-red-500/10" },
];

/* ── Helpers ──────────────────────────────────────────────── */

function statusBadge(status: StockStatus) {
  const config = {
    NORMAL: {
      label: "NORMAL",
      bg: "bg-emerald-500/12",
      text: "text-emerald-700",
    },
    BAIXO: {
      label: "BAIXO",
      bg: "bg-amber-500/12",
      text: "text-amber-700",
    },
    CRITICO: {
      label: "CRITICO",
      bg: "bg-red-500/12",
      text: "text-red-700",
    },
  };
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        c.bg,
        c.text
      )}
    >
      {c.label}
    </span>
  );
}

function typeBadge(type: "ENTRADA" | "SAIDA") {
  const isEntry = type === "ENTRADA";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        isEntry ? "bg-emerald-500/12 text-emerald-700" : "bg-red-500/12 text-red-700"
      )}
    >
      {isEntry ? (
        <ArrowDownRight className="size-3" />
      ) : (
        <ArrowUpRight className="size-3" />
      )}
      {type}
    </span>
  );
}

/* ── Main Component ──────────────────────────────────────── */

interface InventoryContentProps {
  inventory: InventoryRow[];
}

interface StockMovement {
  id: string;
  date: string;
  product: string;
  type: "ENTRADA" | "SAIDA";
  qty: number;
  responsible: string;
}

export default function InventoryContent({ inventory }: InventoryContentProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [restockQty, setRestockQty] = useState("");
  const [restockSku, setRestockSku] = useState(inventory[0]?.sku ?? "");
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Build product cards from real DB data
  const products: ProductCard[] = inventory.map((row, i) => {
    const icons = STOCK_ICONS[i % STOCK_ICONS.length];
    const status: StockStatus =
      row.stock_qty <= row.reorder_point * 0.5
        ? "CRITICO"
        : row.stock_qty <= row.reorder_point
        ? "BAIXO"
        : "NORMAL";
    return {
      id: row.id ?? String(i),
      name: row.name ?? row.sku,
      sku: row.sku,
      stock: row.stock_qty,
      reorderPoint: row.reorder_point,
      status,
      ...icons,
    };
  });

  const alerts = products.filter((p) => p.status !== "NORMAL");

  const handleRestock = async () => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) {
      toast.error("Insira uma quantidade válida");
      return;
    }
    try {
      if (!restockSku) throw new Error("Selecione um produto");
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: restockSku, addQty: qty }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar estoque");
      const product = products.find((p) => p.sku === restockSku);
      const newMovement: StockMovement = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        product: product?.name ?? restockSku,
        type: "ENTRADA",
        qty,
        responsible: "Admin",
      };
      setMovements((prev) => [newMovement, ...prev]);
      toast.success(`+${qty} unidades adicionadas ao estoque de ${product?.name ?? restockSku}`);
      setRestockQty("");
      setAddOpen(false);
      window.location.reload();
    } catch {
      toast.error("Erro ao reabastecer. Tente novamente.");
    }
  };

  return (
    <div className="page-container">
      {/* ── Header ───────────────────────────────────────── */}
      <BlurFade delay={0}>
        <div className="flex items-center justify-between">
          <div className="page-header">
            <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground">
              Estoque
            </h1>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#00628c] hover:bg-[#00496a] text-white rounded-full px-5"
          >
            <Plus className="size-4 mr-1.5" />
            Reabastecer Estoque
          </Button>
        </div>
      </BlurFade>

      {/* ── Main grid: cards + alerts sidebar ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Product cards */}
        <div className="space-y-6">
          {/* Product cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <BlurFade key={product.id} delay={0.1 + i * 0.08}>
                <Card className="relative overflow-hidden border-0 shadow-sm bg-white">
                  <CardContent className="p-5">
                    {/* Icon + status row */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          "flex items-center justify-center size-10 rounded-xl",
                          product.iconBg
                        )}
                      >
                        {product.icon}
                      </div>
                      {statusBadge(product.status)}
                    </div>

                    {/* Product name + SKU */}
                    <h3 className="text-sm font-semibold text-foreground leading-tight mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mb-4">
                      SKU: {product.sku}
                    </p>

                    {/* Big stock number */}
                    <div className="mb-3">
                      <p
                        className={cn(
                          "text-[2.5rem] font-bold leading-none tracking-tight",
                          product.status === "CRITICO"
                            ? "text-red-600"
                            : product.status === "BAIXO"
                            ? "text-amber-600"
                            : "text-foreground"
                        )}
                      >
                        {formatNumber(product.stock)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        unidades
                      </p>
                    </div>

                    {/* Reorder point */}
                    <div className="pt-3 border-t border-border/40">
                      <p className="text-xs text-muted-foreground">
                        Ponto de Recompra:{" "}
                        <span className="font-medium text-foreground">
                          {formatNumber(product.reorderPoint)} unidades
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>

          {/* AI Demand Forecast Card */}
          <BlurFade delay={0.4}>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-[#00628c] to-[#00496a] text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-10 rounded-xl bg-white/15 shrink-0">
                    <Brain className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-1">
                      Relatório Inteligente de Demanda
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed mb-4">
                      Análise automática de demanda com base nas vendas recentes.
                      Configure alertas para receber notificações de reposição.
                    </p>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full text-sm px-4"
                      onClick={() => toast.info("Automação de reposição em breve")}
                    >
                      <TrendingUp className="size-4 mr-1.5" />
                      Configurar Automação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Stock Movement Table */}
          <BlurFade delay={0.5}>
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    Movimentação de Estoque
                  </CardTitle>
                  <button
                    className="text-sm font-medium text-[#00628c] hover:text-[#00496a] transition-colors"
                    onClick={() => toast.info("Relatório completo em breve")}
                  >
                    Ver Relatório Completo
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold pl-6">
                        Data
                      </TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Produto
                      </TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Tipo
                      </TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Quantidade
                      </TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold pr-6">
                        Responsável
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          Nenhuma movimentação registrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="pl-6 text-sm text-muted-foreground">
                            {m.date}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            {m.product}
                          </TableCell>
                          <TableCell>{typeBadge(m.type)}</TableCell>
                          <TableCell className="text-sm font-semibold text-foreground">
                            +{m.qty}
                          </TableCell>
                          <TableCell className="pr-6 text-sm text-muted-foreground">
                            {m.responsible}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Right: Alerts sidebar */}
        <div className="space-y-6">
          <BlurFade delay={0.25}>
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Alertas de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts
                  .sort((a, b) =>
                    a.status === "CRITICO" ? -1 : b.status === "CRITICO" ? 1 : 0
                  )
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "rounded-xl p-3.5",
                        alert.status === "CRITICO"
                          ? "bg-red-50"
                          : "bg-amber-50"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {statusBadge(alert.status)}
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">
                        {alert.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2.5">
                        {formatNumber(alert.stock)} unidades restantes
                        <span className="mx-1">-</span>
                        Recompra: {formatNumber(alert.reorderPoint)}
                      </p>
                      <button
                        className={cn(
                          "text-xs font-semibold transition-colors",
                          alert.status === "CRITICO"
                            ? "text-red-600 hover:text-red-700"
                            : "text-amber-600 hover:text-amber-700"
                        )}
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/support-tasks", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                task_type: "restock",
                                description: `${alert.status === "CRITICO" ? "URGENTE: " : ""}Reabastecer ${alert.name} (SKU: ${alert.sku}) - Estoque atual: ${alert.stock}, Ponto de recompra: ${alert.reorderPoint}`,
                              }),
                            });
                            if (!res.ok) throw new Error("Erro");
                            toast.success(
                              alert.status === "CRITICO"
                                ? "Reposição solicitada com urgência"
                                : "Cotação de reposição criada"
                            );
                          } catch {
                            toast.error("Erro ao criar solicitação. Tente novamente.");
                          }
                        }}
                      >
                        {alert.status === "CRITICO"
                          ? "Pedir Reposição"
                          : "Gerar Cotação"}
                        {" ->"}
                      </button>
                    </div>
                  ))}

                {alerts.length === 0 && (
                  <div className="text-center py-6">
                    <Package className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Todos os produtos estão com estoque normal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>

      {/* ── Add Product Dialog ───────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reabastecer Estoque</DialogTitle>
            <DialogDescription>
              Adicione unidades ao estoque.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="restock-product">Produto</Label>
              <select
                id="restock-product"
                value={restockSku}
                onChange={(e) => setRestockSku(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {products.map((p) => (
                  <option key={p.sku} value={p.sku}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="restock-qty">Quantidade</Label>
              <Input
                id="restock-qty"
                type="number"
                min="1"
                placeholder="Ex: 100"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleRestock}
              className="bg-[#00628c] hover:bg-[#00496a]"
            >
              <Plus className="size-4" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
