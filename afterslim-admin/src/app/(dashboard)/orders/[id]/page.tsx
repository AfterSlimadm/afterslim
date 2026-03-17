"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  MessageSquarePlus,
  ChevronDown,
  MapPin,
  CreditCard,
  User,
  Package,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/constants";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import type { Order, OrderStatus, OrderEvent } from "@/lib/types";

/* ── Mock data (single order detail) ─────────────────────── */

const MOCK_ORDER: Order = {
  id: "100001",
  customer_id: "c1",
  status: "shipped",
  payment_status: "paid",
  payment_method: "stripe",
  subtotal: 129.97,
  discount: 10.0,
  shipping_cost: 5.99,
  total: 125.96,
  tracking_code: "1Z999AA10123456784",
  notes: "Customer prefers delivery before noon",
  created_at: "2026-02-22T14:30:00Z",
  updated_at: "2026-02-25T10:00:00Z",
  shipping_address: {
    street: "123 Main St",
    number: "Apt 4B",
    neighborhood: "Downtown",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
  },
  customer: {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (512) 555-0147",
    cpf: null,
    total_orders: 5,
    total_spent: 412.5,
    last_order_at: "2026-02-22T14:30:00Z",
    notes: null,
    created_at: "2025-11-10T08:00:00Z",
    updated_at: "2026-02-22T14:30:00Z",
  },
  items: [
    {
      id: "i1",
      order_id: "100001",
      product_id: "p1",
      product_name: "AfterSlim Burn",
      variant: "60 capsules",
      quantity: 1,
      unit_price: 49.99,
      total_price: 49.99,
      created_at: "2026-02-22T14:30:00Z",
    },
    {
      id: "i2",
      order_id: "100001",
      product_id: "p2",
      product_name: "AfterSlim Cleanse",
      variant: "60 capsules",
      quantity: 1,
      unit_price: 44.99,
      total_price: 44.99,
      created_at: "2026-02-22T14:30:00Z",
    },
    {
      id: "i3",
      order_id: "100001",
      product_id: "p4",
      product_name: "AfterSlim Glow",
      variant: "30 capsules",
      quantity: 1,
      unit_price: 34.99,
      total_price: 34.99,
      created_at: "2026-02-22T14:30:00Z",
    },
  ],
  events: [
    {
      id: "e1",
      order_id: "100001",
      type: "created",
      description: "Order placed by customer",
      metadata: null,
      created_by: "Sarah Johnson",
      created_at: "2026-02-22T14:30:00Z",
    },
    {
      id: "e2",
      order_id: "100001",
      type: "payment_confirmed",
      description: "Payment of $125.96 confirmed via Stripe",
      metadata: { transaction_id: "pi_3QX7abc123" },
      created_by: "System",
      created_at: "2026-02-22T14:32:00Z",
    },
    {
      id: "e3",
      order_id: "100001",
      type: "status_changed",
      description: "Status changed from Pending to Processing",
      metadata: { from: "pending", to: "processing" },
      created_by: "Admin",
      created_at: "2026-02-23T09:15:00Z",
    },
    {
      id: "e4",
      order_id: "100001",
      type: "shipped",
      description: "Package shipped via USPS — tracking 1Z999AA10123456784",
      metadata: {
        carrier: "USPS",
        tracking: "1Z999AA10123456784",
      },
      created_by: "Admin",
      created_at: "2026-02-24T11:45:00Z",
    },
    {
      id: "e5",
      order_id: "100001",
      type: "note_added",
      description: "Customer called to confirm delivery address is correct",
      metadata: null,
      created_by: "Admin",
      created_at: "2026-02-25T10:00:00Z",
    },
  ],
};

/* ── Status transition options ────────────────────────────── */

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

/* ── Page component ───────────────────────────────────────── */

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order>(MOCK_ORDER);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const orderNumber = `AS-${id.padStart(6, "0")}`;
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];
  const nextStatuses = STATUS_TRANSITIONS[order.status];

  function handleStatusChange(newStatus: OrderStatus) {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    toast.success(
      `Status do pedido atualizado para ${ORDER_STATUS_CONFIG[newStatus].label}`
    );
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    toast.success("Nota adicionada com sucesso");
    setNoteText("");
    setNoteOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Pedidos
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {orderNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Realizado em {formatDateTime(order.created_at)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {nextStatuses.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
                    Atualizar Status
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {nextStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                    >
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mr-2 border-none text-xs",
                          ORDER_STATUS_CONFIG[status].color
                        )}
                      >
                        {ORDER_STATUS_CONFIG[status].label}
                      </Badge>
                      Marcar como {ORDER_STATUS_CONFIG[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MessageSquarePlus className="h-4 w-4" />
                  Adicionar Nota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nota</DialogTitle>
                  <DialogDescription>
                    Adicione uma nota interna a este pedido. Notas sao visiveis
                    apenas para a equipe admin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="note">Nota</Label>
                  <Textarea
                    id="note"
                    placeholder="Digite sua nota..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNoteOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddNote}>Salvar Nota</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => toast.info("Impressao de fatura em breve")}
            >
              <Printer className="h-4 w-4" />
              Imprimir Fatura
            </Button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Produto</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Preco Unit.</TableHead>
                    <TableHead className="pr-6 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {item.variant}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="pr-6 text-right font-mono">
                        {formatCurrency(item.total_price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="pl-6 text-right">
                      Subtotal
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono">
                      {formatCurrency(order.subtotal)}
                    </TableCell>
                  </TableRow>
                  {order.discount > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="pl-6 text-right">
                        Desconto
                      </TableCell>
                      <TableCell className="pr-6 text-right font-mono text-red-600">
                        -{formatCurrency(order.discount)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} className="pl-6 text-right">
                      Frete
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono">
                      {order.shipping_cost === 0
                        ? "Gratis"
                        : formatCurrency(order.shipping_cost)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="pl-6 text-right font-bold"
                    >
                      Total
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono font-bold">
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Historico do Pedido</CardTitle>
              <CardDescription>
                Historico de atividades deste pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.events && order.events.length > 0 ? (
                <OrderTimeline events={order.events} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento registrado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.customer?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer?.total_orders} pedidos &middot;{" "}
                  {formatCurrency(order.customer?.total_spent ?? 0)} gasto
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.customer?.email}</span>
                </div>
                {order.customer?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Endereco de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed">
                <p>
                  {order.shipping_address.street}
                  {order.shipping_address.number &&
                    `, ${order.shipping_address.number}`}
                </p>
                <p>{order.shipping_address.neighborhood}</p>
                <p>
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.state}{" "}
                  {order.shipping_address.zip_code}
                </p>
              </div>
              {order.tracking_code && (
                <>
                  <Separator className="my-3" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Codigo de Rastreio</p>
                    <p className="font-mono font-medium">
                      {order.tracking_code}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Metodo</span>
                <span className="text-sm font-medium capitalize">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "border-none text-xs font-medium",
                    paymentConfig.color
                  )}
                >
                  {paymentConfig.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valor</span>
                <span className="font-mono font-medium">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-mono text-red-600">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-mono">
                  {order.shipping_cost === 0
                    ? "Gratis"
                    : formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span className="font-mono">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
