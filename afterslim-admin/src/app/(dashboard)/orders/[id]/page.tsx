"use client";

import { use, useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { useAuth } from "@/components/auth-provider";
import { OrderSupportTasks } from "@/components/support/order-support-tasks";
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

/* ── Status transition options ────────────────────────────── */

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

/* ── Empty order default ──────────────────────────────────── */

const EMPTY_ORDER: Order = {
  id: "",
  customer_id: "",
  status: "pending",
  payment_status: "pending",
  payment_method: "other",
  subtotal: 0,
  discount: 0,
  shipping_cost: 0,
  total: 0,
  tracking_code: null,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  shipping_address: {
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
  },
  customer: undefined,
  items: [],
  events: [],
};

/* ── Page component ───────────────────────────────────────── */

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { role } = useAuth();
  const [order, setOrder] = useState<Order>(EMPTY_ORDER);
  const [loading, setLoading] = useState(true);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar pedido");
        const json = await res.json();
        // API returns { order, items, events } — unwrap
        const data = json.order ?? json;
        const rawItems = (json.items ?? data.order_items ?? []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          order_id: item.order_id as string,
          product_id: item.product_id as string,
          product_name: (item.product_name as string) ?? "Produto",
          variant: (item.variant as string) ?? null,
          quantity: Number(item.quantity ?? 1),
          unit_price: Number(item.unit_price_cents ?? item.unit_price ?? 0) / (item.unit_price_cents ? 100 : 1),
          total_price: Number(item.total_price_cents ?? item.total_price ?? 0) / (item.total_price_cents ? 100 : 1),
          created_at: (item.created_at as string) ?? "",
        }));
        // If item total_price is 0 but we have unit_price and quantity, calculate it
        for (const item of rawItems) {
          if (item.total_price === 0 && item.unit_price > 0) {
            item.total_price = item.unit_price * item.quantity;
          }
        }
        // Build customer from order-level fields (email, shipping_address.name)
        const addr = data.shipping_address as Record<string, string> | null;
        const customerName = addr?.name ?? data.customer?.name ?? undefined;
        const customerEmail = data.email ?? data.customer?.email ?? undefined;
        const customer = (customerName || customerEmail)
          ? { name: customerName ?? "Unknown", email: customerEmail, phone: data.customer?.phone }
          : data.customer ?? undefined;

        setOrder({
          id: data.id ?? id,
          order_number: data.order_number ?? undefined,
          customer_id: data.profile_id ?? data.customer_id ?? "",
          status: data.status ?? "pending",
          payment_status: data.payment_status ?? "pending",
          payment_method: data.payment_method ?? data.stripe_payment_intent_id ? "stripe" : "other",
          subtotal: Number(data.subtotal_cents ?? data.subtotal ?? 0) / (data.subtotal_cents != null ? 100 : 1),
          discount: Number(data.discount_cents ?? data.discount ?? 0) / (data.discount_cents != null ? 100 : 1),
          shipping_cost: Number(data.shipping_cents ?? data.shipping_cost ?? 0) / (data.shipping_cents != null ? 100 : 1),
          total: Number(data.total_cents ?? data.total ?? 0) / (data.total_cents != null ? 100 : 1),
          tracking_code: data.tracking_code ?? data.tracking_number ?? null,
          notes: data.notes ?? null,
          created_at: data.created_at ?? new Date().toISOString(),
          updated_at: data.updated_at ?? new Date().toISOString(),
          shipping_address: {
            street: addr?.street ?? addr?.line1 ?? "",
            number: addr?.number ?? "",
            neighborhood: addr?.neighborhood ?? "",
            city: addr?.city ?? "",
            state: addr?.state ?? "",
            zip_code: addr?.zip_code ?? addr?.postal_code ?? "",
          },
          customer: customer as Order["customer"],
          items: rawItems,
          events: json.events ?? data.order_events ?? [],
        });
      } catch (err) {
        console.error("[OrderDetail] fetch failed:", err);
        toast.error("Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p className="text-sm">Carregando pedido...</p>
      </div>
    );
  }

  if (!order.id) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Pedidos
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="h-10 w-10 mb-3" />
          <p className="font-medium">Pedido nao encontrado</p>
          <p className="text-sm">O pedido #{id} nao existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const orderNumber = order.order_number ?? `AS-${id.slice(-8).toUpperCase()}`;
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.payment_status];
  const nextStatuses = STATUS_TRANSITIONS[order.status];

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      setOrder((prev) => ({ ...prev, status: newStatus as OrderStatus }));
      toast.success(
        `Status do pedido atualizado para ${ORDER_STATUS_CONFIG[newStatus].label}`
      );
    } catch {
      toast.error("Erro ao atualizar status. Tente novamente.");
    }
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    try {
      const existingNotes = order.notes ? order.notes + "\n\n" : "";
      const timestamp = new Date().toLocaleString("pt-BR");
      const updatedNotes = `${existingNotes}[${timestamp}] ${noteText.trim()}`;
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      if (!res.ok) throw new Error("Erro ao salvar nota");
      setOrder((prev) => ({ ...prev, notes: updatedNotes }));
      toast.success("Nota adicionada com sucesso");
      setNoteText("");
      setNoteOpen(false);
    } catch {
      toast.error("Erro ao salvar nota. Tente novamente.");
    }
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
            {role !== "support" && nextStatuses.length > 0 && (
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
            <CardContent className="p-0 overflow-x-auto">
              {order.items && order.items.length > 0 ? (
                <Table className="min-w-[400px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Produto</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="pr-6 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhum item neste pedido.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Pedido</CardTitle>
              <CardDescription>
                Histórico de atividades deste pedido
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
              {order.customer ? (
                <>
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.total_orders ?? 0} pedidos &middot;{" "}
                      {formatCurrency(order.customer.total_spent ?? 0)} gasto
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{order.customer.email}</span>
                    </div>
                    {order.customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{order.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Dados do cliente nao disponiveis.
                </p>
              )}
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
              {order.shipping_address?.city || order.shipping_address?.street ? (
                <div className="text-sm leading-relaxed">
                  {order.shipping_address.street && (
                    <p>
                      {order.shipping_address.street}
                      {order.shipping_address.number &&
                        `, ${order.shipping_address.number}`}
                    </p>
                  )}
                  {order.shipping_address.neighborhood && (
                    <p>{order.shipping_address.neighborhood}</p>
                  )}
                  {(order.shipping_address.city || order.shipping_address.state) && (
                    <p>
                      {[order.shipping_address.city, order.shipping_address.state, order.shipping_address.zip_code].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Endereco nao informado.
                </p>
              )}
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

          {/* Support Tasks */}
          <OrderSupportTasks orderId={id} />
        </div>
      </div>
    </div>
  );
}
