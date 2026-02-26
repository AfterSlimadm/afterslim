"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

/* ── Mock data ────────────────────────────────────────────── */

const MOCK_RETURNS: Order[] = [
  {
    id: "100008",
    customer_id: "c8",
    status: "cancelled",
    payment_status: "refunded",
    payment_method: "stripe",
    subtotal: 49.99,
    discount: 0,
    shipping_cost: 5.99,
    total: 55.98,
    tracking_code: null,
    notes: "Customer cancelled — changed mind",
    created_at: "2026-02-22T20:15:00Z",
    updated_at: "2026-02-23T08:00:00Z",
    shipping_address: {
      street: "234 Walnut St",
      number: "",
      neighborhood: "SoDo",
      city: "Portland",
      state: "OR",
      zip_code: "97201",
    },
    customer: {
      id: "c8",
      name: "David Brown",
      email: "d.brown@email.com",
      phone: "+1 (503) 555-0155",
      cpf: null,
      total_orders: 2,
      total_spent: 55.98,
      last_order_at: "2026-02-22T20:15:00Z",
      notes: null,
      created_at: "2026-01-28T09:00:00Z",
      updated_at: "2026-02-22T20:15:00Z",
    },
    items: [
      {
        id: "i14",
        order_id: "100008",
        product_id: "p1",
        product_name: "AfterSlim Burn",
        variant: "60 capsules",
        quantity: 1,
        unit_price: 49.99,
        total_price: 49.99,
        created_at: "2026-02-22T20:15:00Z",
      },
    ],
  },
  {
    id: "100013",
    customer_id: "c13",
    status: "refunded",
    payment_status: "refunded",
    payment_method: "stripe",
    subtotal: 49.99,
    discount: 0,
    shipping_cost: 5.99,
    total: 55.98,
    tracking_code: null,
    notes: "Refund — product did not meet expectations",
    created_at: "2026-02-19T11:00:00Z",
    updated_at: "2026-02-21T14:00:00Z",
    shipping_address: {
      street: "777 Sycamore Ln",
      number: "",
      neighborhood: "Riverside",
      city: "Phoenix",
      state: "AZ",
      zip_code: "85001",
    },
    customer: {
      id: "c13",
      name: "Rachel Adams",
      email: "r.adams@email.com",
      phone: "+1 (480) 555-0862",
      cpf: null,
      total_orders: 2,
      total_spent: 55.98,
      last_order_at: "2026-02-19T11:00:00Z",
      notes: null,
      created_at: "2026-01-05T10:00:00Z",
      updated_at: "2026-02-19T11:00:00Z",
    },
    items: [
      {
        id: "i23",
        order_id: "100013",
        product_id: "p1",
        product_name: "AfterSlim Burn",
        variant: "60 capsules",
        quantity: 1,
        unit_price: 49.99,
        total_price: 49.99,
        created_at: "2026-02-19T11:00:00Z",
      },
    ],
  },
  {
    id: "100019",
    customer_id: "c19",
    status: "cancelled",
    payment_status: "refunded",
    payment_method: "stripe",
    subtotal: 99.98,
    discount: 0,
    shipping_cost: 5.99,
    total: 105.97,
    tracking_code: null,
    notes: "Cancelled per customer request — duplicate order",
    created_at: "2026-02-20T07:45:00Z",
    updated_at: "2026-02-20T10:00:00Z",
    shipping_address: {
      street: "215 Aspen Ridge",
      number: "Apt 15",
      neighborhood: "Highlands",
      city: "Charlotte",
      state: "NC",
      zip_code: "28202",
    },
    customer: {
      id: "c19",
      name: "Ashley Moore",
      email: "a.moore@email.com",
      phone: "+1 (704) 555-0634",
      cpf: null,
      total_orders: 3,
      total_spent: 210.94,
      last_order_at: "2026-02-20T07:45:00Z",
      notes: null,
      created_at: "2025-12-15T08:00:00Z",
      updated_at: "2026-02-20T07:45:00Z",
    },
    items: [
      {
        id: "i34",
        order_id: "100019",
        product_id: "p1",
        product_name: "AfterSlim Burn",
        variant: "60 capsules",
        quantity: 2,
        unit_price: 49.99,
        total_price: 99.98,
        created_at: "2026-02-20T07:45:00Z",
      },
    ],
  },
  {
    id: "100021",
    customer_id: "c21",
    status: "refunded",
    payment_status: "refunded",
    payment_method: "paypal",
    subtotal: 74.98,
    discount: 0,
    shipping_cost: 5.99,
    total: 80.97,
    tracking_code: null,
    notes: "Refund — package damaged during shipping",
    created_at: "2026-02-15T10:30:00Z",
    updated_at: "2026-02-18T16:00:00Z",
    shipping_address: {
      street: "560 Ivy Ct",
      number: "Unit 6",
      neighborhood: "Greenwood",
      city: "Indianapolis",
      state: "IN",
      zip_code: "46201",
    },
    customer: {
      id: "c21",
      name: "Marcus Webb",
      email: "m.webb@email.com",
      phone: "+1 (317) 555-0490",
      cpf: null,
      total_orders: 2,
      total_spent: 80.97,
      last_order_at: "2026-02-15T10:30:00Z",
      notes: null,
      created_at: "2026-01-02T11:00:00Z",
      updated_at: "2026-02-15T10:30:00Z",
    },
    items: [
      {
        id: "i38",
        order_id: "100021",
        product_id: "p1",
        product_name: "AfterSlim Burn",
        variant: "60 capsules",
        quantity: 1,
        unit_price: 49.99,
        total_price: 49.99,
        created_at: "2026-02-15T10:30:00Z",
      },
      {
        id: "i39",
        order_id: "100021",
        product_id: "p5",
        product_name: "AfterSlim Fiber Plus",
        variant: null,
        quantity: 1,
        unit_price: 24.99,
        total_price: 24.99,
        created_at: "2026-02-15T10:30:00Z",
      },
    ],
  },
];

/* ── Stats ────────────────────────────────────────────────── */

const totalRefunded = MOCK_RETURNS.reduce((sum, o) => sum + o.total, 0);
const cancelledCount = MOCK_RETURNS.filter(
  (o) => o.status === "cancelled"
).length;
const refundedCount = MOCK_RETURNS.filter(
  (o) => o.status === "refunded"
).length;

/* ── Component ────────────────────────────────────────────── */

export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Returns & Refunds
          </h1>
          <p className="text-muted-foreground">
            View and manage cancelled and refunded orders.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_RETURNS.length}</p>
              <p className="text-xs text-muted-foreground">
                Total Returns
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <span className="text-sm font-bold text-red-700 dark:text-red-400">
                {cancelledCount}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold">{cancelledCount}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800/50">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-400">
                $
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(totalRefunded)}
              </p>
              <p className="text-xs text-muted-foreground">Total Refunded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Return / Refund Orders</CardTitle>
          <CardDescription>
            Orders that have been cancelled or refunded
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="pr-6 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RETURNS.map((order) => {
                const paymentConfig =
                  PAYMENT_STATUS_CONFIG[order.payment_status];

                return (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        AS-{order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {order.customer?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {order.notes ?? "—"}
                    </TableCell>
                    <TableCell className="pr-6 text-right text-muted-foreground">
                      {formatDate(order.created_at)}
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
