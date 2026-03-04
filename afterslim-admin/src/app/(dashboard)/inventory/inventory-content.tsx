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
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { InventoryRow } from "@/lib/queries/inventory";

interface InventoryContentProps {
  inventory: InventoryRow[];
}

export default function InventoryContent({ inventory }: InventoryContentProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    unitCost: "",
    sellingPrice: "",
    stockQty: "",
    reorderPoint: "",
    supplier: "",
  });

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      sku: "",
      unitCost: "",
      sellingPrice: "",
      stockQty: "",
      reorderPoint: "",
      supplier: "",
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!newProduct.sku.trim()) {
      toast.error("SKU is required");
      return;
    }

    // TODO: wire up to API / Supabase insert
    toast.success(`Product "${newProduct.name}" added successfully`);
    resetNewProduct();
    setAddOpen(false);
  };

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
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g. AfterSlim Capsules 60ct"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="product-sku">SKU</Label>
                  <Input
                    id="product-sku"
                    placeholder="e.g. AS-CAP-060"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, sku: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-cost">Unit Cost (USD)</Label>
                    <Input
                      id="product-cost"
                      type="number"
                      placeholder="0.00"
                      value={newProduct.unitCost}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, unitCost: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-price">Selling Price (USD)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      placeholder="0.00"
                      value={newProduct.sellingPrice}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          sellingPrice: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      placeholder="0"
                      value={newProduct.stockQty}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, stockQty: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-reorder">Reorder Point</Label>
                    <Input
                      id="product-reorder"
                      type="number"
                      placeholder="0"
                      value={newProduct.reorderPoint}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          reorderPoint: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="product-supplier">Supplier (optional)</Label>
                  <Input
                    id="product-supplier"
                    placeholder="e.g. NutraLab Inc."
                    value={newProduct.supplier}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, supplier: e.target.value }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  <Plus className="size-4" />
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <p className="text-2xl font-bold">{formatNumber(totalItems)}</p>
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
                      {item.supplier ?? "-"}
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
