"use client";

import { useState } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { InventoryRow } from "@/lib/queries/inventory";

interface InventoryContentProps {
  inventory: InventoryRow[];
}

export default function InventoryContent({ inventory }: InventoryContentProps) {
  const [search, setSearch] = useState("");

  const filtered = inventory.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = inventory.reduce((s, i) => s + i.stock_qty, 0);
  const totalValue = inventory.reduce((s, i) => s + i.stock_qty * Number(i.unit_cost), 0);
  const lowStockCount = inventory.filter((i) => i.stock_qty <= i.reorder_point).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track stock levels, costs, and reorder points.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Export coming soon")}>
            <Download className="size-4" />
            Export
          </Button>
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Value
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
              Products
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products or SKU..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const isLow = item.stock_qty <= item.reorder_point;
                const costPrice = Number(item.unit_cost);
                const sellPrice = Number(item.selling_price);
                const margin = sellPrice > 0
                  ? ((sellPrice - costPrice) / sellPrice * 100).toFixed(0)
                  : "0";
                return (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-medium">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-mono", isLow && "text-red-600 font-semibold")}>
                          {item.stock_qty}
                        </span>
                        {isLow && (
                          <Badge variant="destructive" className="text-[10px]">
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {item.reorder_point}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(costPrice)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(sellPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {margin}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.supplier ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
