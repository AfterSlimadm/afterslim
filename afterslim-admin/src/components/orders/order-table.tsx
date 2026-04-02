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
import { useAuth } from "@/components/auth-provider";
import { getLocaleFromRole, getPaymentStatusLabel, t } from "@/lib/i18n";

/* -- Props ---------------------------------------------------- */

interface OrderTableProps {
  orders: Order[];
}

/* -- Component ------------------------------------------------- */

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const { role } = useAuth();
  const locale = getLocaleFromRole(role);

  function handleRowClick(orderId: string) {
    router.push(`/orders/${orderId}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">{t("orderTable.orderNumber", locale)}</TableHead>
          <TableHead>{t("orderTable.customer", locale)}</TableHead>
          <TableHead className="hidden md:table-cell">{t("orderTable.items", locale)}</TableHead>
          <TableHead>{t("orderTable.total", locale)}</TableHead>
          <TableHead>{t("orderTable.status", locale)}</TableHead>
          <TableHead className="hidden sm:table-cell">{t("orderTable.payment", locale)}</TableHead>
          <TableHead className="hidden lg:table-cell">{t("orderTable.date", locale)}</TableHead>
          <TableHead className="w-[50px] pr-4 text-right">{t("orderTable.actions", locale)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center">
              <p className="text-muted-foreground">{t("orderTable.noOrders", locale)}</p>
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
                      {order.customer?.name ?? t("orderTable.unknown", locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer?.email ?? ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {itemCount} {itemCount === 1 ? t("orderTable.item", locale) : t("orderTable.itemsPlural", locale)}
                </TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} locale={locale} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-none text-xs font-medium",
                      paymentConfig.color
                    )}
                  >
                    {getPaymentStatusLabel(order.payment_status, locale)}
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
                        <span className="sr-only">{t("orderTable.actions", locale)}</span>
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
                        {t("orderTable.viewDetails", locale)}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Truck className="h-4 w-4" />
                        {t("orderTable.updateStatus", locale)}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Printer className="h-4 w-4" />
                        {t("orderTable.printInvoice", locale)}
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
