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
  pending: { label: "Pendente", className: "badge-warning" },
  confirmed: { label: "Confirmado", className: "badge-info" },
  processing: { label: "Processando", className: "badge-info" },
  shipped: { label: "Enviado", className: "badge-purple" },
  delivered: { label: "Entregue", className: "badge-success" },
  cancelled: { label: "Cancelado", className: "badge-error" },
  refunded: { label: "Reembolsado", className: "badge-neutral" },
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
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos pedidos feitos na loja</CardDescription>
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
        <CardTitle>Pedidos Recentes</CardTitle>
        <CardDescription>Últimos {orders.length} pedidos feitos na loja</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders" className="gap-1">
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Data</TableHead>
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
