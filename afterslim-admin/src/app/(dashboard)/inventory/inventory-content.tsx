"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  TrendingUp,
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

  const costPrice = Number(product.unit_cost);
  const sellPrice = Number(product.selling_price);
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
