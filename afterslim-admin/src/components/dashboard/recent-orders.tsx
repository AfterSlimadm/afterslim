"use client";

import Link from "next/link";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import type { RecentOrder } from "@/lib/queries/dashboard-charts";

/* ── Status badge config ────────────────────────────────── */

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  processing: {
    label: "Processing",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  shipped: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
  },
};

/* ── Props ───────────────────────────────────────────────── */

interface RecentOrdersProps {
  orders: RecentOrder[];
}

/* ── Component ──────────────────────────────────────────── */

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders placed in the store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            Nenhum pedido recente
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest {orders.length} orders placed in the store</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders" className="gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusStyle = STATUS_STYLES[order.status];
              return (
                <TableRow key={order.id}>
                  <TableCell className="pl-6 font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-none text-xs font-medium",
                        statusStyle.className
                      )}
                    >
                      {statusStyle.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-muted-foreground">
                    {formatDate(order.date)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
