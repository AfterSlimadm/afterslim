"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart,
  Clock,
  Loader,
  Truck,
  Download,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderTable } from "@/components/orders/order-table";
import {
  OrderFiltersBar,
  type OrderFilters,
} from "@/components/orders/order-filters";
import type { Order } from "@/lib/types";

/* ── Stats ────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Props ────────────────────────────────────────────────── */

interface OrdersContentProps {
  orders: Order[];
}

/* ── Page component ───────────────────────────────────────── */

const PAGE_SIZE = 10;

export default function OrdersContent({ orders }: OrdersContentProps) {
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    statuses: [],
    sort: "newest",
  });
  const [page, setPage] = useState(1);

  /* -- Filtered + sorted orders -- */
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          `AS-${o.id}`.toLowerCase().includes(q) ||
          o.customer?.name.toLowerCase().includes(q) ||
          o.customer?.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((o) => filters.statuses.includes(o.status));
    }

    // Sort
    switch (filters.sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case "highest":
        result.sort((a, b) => b.total - a.total);
        break;
      case "lowest":
        result.sort((a, b) => a.total - b.total);
        break;
    }

    return result;
  }, [orders, filters]);

  /* -- Pagination -- */
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* -- Stats -- */
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter(
      (o) => o.status === "processing" || o.status === "confirmed"
    ).length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    return { total, pending, processing, shipped };
  }, [orders]);

  /* -- Reset page on filter change -- */
  function handleFilterChange(newFilters: OrderFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders, track shipments, and handle returns.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => toast.info("Export feature coming soon")}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={stats.total}
          icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          icon={<Loader className="h-5 w-5 text-indigo-600" />}
        />
        <StatCard
          label="Shipped"
          value={stats.shipped}
          icon={<Truck className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Filters */}
      <OrderFiltersBar filters={filters} onChange={handleFilterChange} />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <OrderTable orders={paginatedOrders} />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="w-9"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
