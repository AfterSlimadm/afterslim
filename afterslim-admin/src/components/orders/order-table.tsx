"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Printer, Truck } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { Order } from "@/lib/types";

/* ── Props ────────────────────────────────────────────────── */

interface OrderTableProps {
  orders: Order[];
}

/* ── Component ────────────────────────────────────────────── */

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  function handleRowClick(orderId: string) {
    router.push(`/orders/${orderId}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Pedido #</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Itens</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Pagamento</TableHead>
          <TableHead className="hidden lg:table-cell">Data</TableHead>
          <TableHead className="w-[50px] pr-4 text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center">
              <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const itemCount = order.items?.length ?? 0;
            const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];

            return (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(order.id)}
              >
                <TableCell className="pl-4 font-medium">
                  {`AS-${order.id.padStart(6, "0")}`}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {order.customer?.name ?? "Desconhecido"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer?.email ?? ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {itemCount} {itemCount === 1 ? "item" : "itens"}
                </TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-none text-xs font-medium",
                      paymentConfig.color
                    )}
                  >
                    {paymentConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {formatDate(order.created_at)}
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Acoes</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/orders/${order.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Truck className="h-4 w-4" />
                        Atualizar status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Printer className="h-4 w-4" />
                        Imprimir fatura
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
