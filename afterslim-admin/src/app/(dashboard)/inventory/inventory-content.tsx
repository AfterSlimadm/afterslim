"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  TrendingUp,
  Pencil,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { InventoryRow } from "@/lib/queries/inventory";

interface InventoryContentProps {
  inventory: InventoryRow[];
}

export default function InventoryContent({ inventory }: InventoryContentProps) {
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockQty, setRestockQty] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editStock, setEditStock] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editSell, setEditSell] = useState("");
  const [editReorder, setEditReorder] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Single product - take first item or show empty state
  const product = inventory[0];

  if (!product) {
    return (
      <div className="empty-state">
        <Package />
        <p className="text-lg font-medium">Nenhum produto no estoque</p>
        <p className="text-sm">Execute o seed SQL para adicionar o Berberine.</p>
      </div>
    );
  }

  // Prices stored in cents (e.g. 5999 = $59.99)
  const costCents = Number(product.unit_cost);
  const sellCents = Number(product.selling_price);
  const costPrice = costCents / 100;
  const sellPrice = sellCents / 100;
  const margin = sellPrice > 0
    ? ((sellPrice - costPrice) / sellPrice * 100).toFixed(0)
    : "0";
  const isLow = product.stock_qty <= product.reorder_point;
  const totalValue = product.stock_qty * costPrice;

  const handleRestock = async () => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) {
      toast.error("Insira uma quantidade valida");
      return;
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.sku,
          addQty: qty,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar estoque");

      toast.success(`+${qty} unidades adicionadas ao estoque`);
      setRestockQty("");
      setRestockOpen(false);
      window.location.reload();
    } catch {
      toast.error("Erro ao reabastecer. Tente novamente.");
    }
  };

  const openEdit = () => {
    setEditStock(String(product.stock_qty));
    setEditCost(String(costPrice));
    setEditSell(String(sellPrice));
    setEditReorder(String(product.reorder_point));
    setEditOpen(true);
  };

  const handleEdit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          stock_qty: parseInt(editStock) || 0,
          unit_cost: Math.round(parseFloat(editCost) * 100) || 0,
          selling_price: Math.round(parseFloat(editSell) * 100) || 0,
          reorder_point: parseInt(editReorder) || 0,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      toast.success("Estoque atualizado");
      setEditOpen(false);
      window.location.reload();
    } catch {
      toast.error("Erro ao atualizar estoque");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Estoque</h1>
          <p className="page-description">
            Controle do estoque do AfterSlim Berberine 1200mg
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="size-4" />
            Editar
          </Button>
        <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Reabastecer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Reabastecer Estoque</DialogTitle>
              <DialogDescription>
                Adicione unidades ao estoque do {product.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
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
              <Button variant="outline" onClick={() => setRestockOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRestock}>
                <Plus className="size-4" />
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Estoque</DialogTitle>
            <DialogDescription>
              Ajuste os valores do {product.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-stock">Quantidade em Estoque</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cost">Preco de Custo ($)</Label>
              <Input
                id="edit-cost"
                type="number"
                min="0"
                step="0.01"
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sell">Preco de Venda ($)</Label>
              <Input
                id="edit-sell"
                type="number"
                min="0"
                step="0.01"
                value={editSell}
                onChange={(e) => setEditSell(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-reorder">Ponto de Reposicao</Label>
              <Input
                id="edit-reorder"
                type="number"
                min="0"
                value={editReorder}
                onChange={(e) => setEditReorder(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={isSaving}>
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unidades em Estoque
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className={cn("text-2xl font-bold", isLow && "text-red-600")}>
              {formatNumber(product.stock_qty)}
            </p>
            {isLow && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                Abaixo do ponto de reposição ({product.reorder_point})
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor do Estoque
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Preço de Venda
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(sellPrice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{margin}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Custo: {formatCurrency(costPrice)} / Venda: {formatCurrency(sellPrice)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Detail Card */}
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>
            SKU: <span className="font-mono">{product.sku}</span>
            {product.supplier && (
              <> · Fornecedor: {product.supplier}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={isLow ? "destructive" : "default"}
                className="mt-1"
              >
                {isLow ? "Estoque Baixo" : "Estoque Normal"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ponto de Reposição</p>
              <p className="text-lg font-semibold mt-1">{product.reorder_point} unidades</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="text-lg font-semibold mt-1">{product.category ?? "Suplemento"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
