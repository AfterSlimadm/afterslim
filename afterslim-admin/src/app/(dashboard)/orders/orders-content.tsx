"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart,
  Clock,
  Loader,
  Truck,
  Download,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Calendar,
  MoreHorizontal,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate, cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TiltCard } from "@/components/ui/tilt-card";
import { CountUp } from "@/components/ui/count-up";
import { BlurFade } from "@/components/ui/blur-fade";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
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
import type { Order } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { getLocaleFromRole, getStatusPillLabel, t } from "@/lib/i18n";

/* -- Stat Card ------------------------------------------------- */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
  delay?: number;
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  badge,
  badgeColor = "bg-[#00628c]/10 text-[#00628c]",
  delay = 0,
}: StatCardProps) {
  return (
    <BlurFade delay={delay}>
      <TiltCard maxTilt={4} glowColor="rgba(0, 145, 204, 0.06)">
        <Card className="border-border/15 overflow-hidden shadow-none">
          <div className="h-[2px] bg-gradient-to-r from-[#0091CC]/10 to-transparent" />
          <CardContent className="flex items-center gap-4 p-5">
            <div className={cn("icon-box rounded-xl", iconBg)}>
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                  {label}
                </p>
                {badge && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider",
                      badgeColor
                    )}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <CountUp
                value={value}
                className="text-[2rem] font-bold tracking-tight leading-none"
                delay={delay + 0.2}
              />
            </div>
          </CardContent>
        </Card>
      </TiltCard>
    </BlurFade>
  );
}

/* -- Status Badge (inline, pill-shaped, 12% opacity bg) -------- */

const STATUS_PILL_MAP: Record<
  string,
  { bg: string; text: string }
> = {
  pending: { bg: "bg-blue-500/12", text: "text-blue-700" },
  confirmed: { bg: "bg-sky-500/12", text: "text-sky-700" },
  paid: { bg: "bg-green-500/12", text: "text-green-700" },
  processing: { bg: "bg-amber-500/12", text: "text-amber-700" },
  shipped: { bg: "bg-emerald-500/12", text: "text-emerald-700" },
  delivered: { bg: "bg-green-500/12", text: "text-green-700" },
  cancelled: { bg: "bg-neutral-500/12", text: "text-neutral-600" },
  refunded: { bg: "bg-neutral-500/12", text: "text-neutral-600" },
};

function StatusPill({ status, locale }: { status: string; locale: "pt" | "en" }) {
  const config = STATUS_PILL_MAP[status] ?? {
    bg: "bg-neutral-500/12",
    text: "text-neutral-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text
      )}
    >
      {getStatusPillLabel(status, locale)}
    </span>
  );
}

/* -- Avatar circle (initials) ---------------------------------- */

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
];

function AvatarCircle({ name }: { name: string }) {
  const initials = getInitials(name);
  const colorIndex =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        AVATAR_COLORS[colorIndex]
      )}
    >
      {initials}
    </div>
  );
}

/* -- Props ---------------------------------------------------- */

interface OrdersContentProps {
  orders: Order[];
}

/* -- Page component ------------------------------------------- */

const PAGE_SIZE = 5;

export default function OrdersContent({ orders }: OrdersContentProps) {
  const { role } = useAuth();
  const locale = getLocaleFromRole(role);
  const router = useRouter();
  const isSupport = role === "support";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* -- Filtered orders -- */
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          (o.order_number ?? o.id).toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return result;
  }, [orders, search]);

  /* -- Pagination -- */
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* -- Stats -- */
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newToday = orders.filter((o) => {
      const d = new Date(o.created_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && o.status === "pending";
    }).length;

    const processing = orders.filter(
      (o) => o.status === "processing" || o.status === "confirmed"
    ).length;

    const shipped = orders.filter(
      (o) => o.status === "shipped" || o.status === "delivered"
    ).length;

    const problems = orders.filter(
      (o) => o.status === "cancelled" || o.status === "refunded"
    ).length;

    return { newToday, processing, shipped, problems };
  }, [orders]);

  /* -- Reset page on search change -- */
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  /* -- Pagination helpers -- */
  function getPageNumbers() {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="page-container">
      {/* -- Header ------------------------------------------------ */}
      <BlurFade delay={0}>
        <div className="page-header">
          <h1 className="page-title">
            {t("orders.title", locale)}
          </h1>
          <p className="page-description">
            {t("orders.description", locale)}
          </p>
        </div>
      </BlurFade>

      {/* -- Filter row -------------------------------------------- */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("orders.search", locale)}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 border-border/15 bg-white shadow-none"
              />
            </div>

            {/* Date picker placeholder */}
            <Button
              variant="outline"
              className="gap-2 border-border/15 bg-white shadow-none text-muted-foreground"
              onClick={() => toast.info(t("orders.dateFilterSoon", locale))}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t("orders.selectDate", locale)}</span>
            </Button>

            {/* Filters */}
            <Button
              variant="outline"
              className="gap-2 border-border/15 bg-white shadow-none text-muted-foreground"
              onClick={() => toast.info(t("orders.advancedFiltersSoon", locale))}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">{t("orders.filters", locale)}</span>
            </Button>
          </div>

          {/* Export CSV */}
          {!isSupport && (
            <Button
              className="gap-2 bg-[#00628c] hover:bg-[#00496a] text-white shadow-none"
              onClick={() => toast.info(t("orders.exportSoon", locale))}
            >
              <Download className="h-4 w-4" />
              {t("orders.exportCsv", locale)}
            </Button>
          )}
        </div>
      </BlurFade>

      {/* -- Stats row --------------------------------------------- */}
      <div className="kpi-grid">
        <StatCard
          label={t("orders.newToday", locale)}
          value={stats.newToday}
          icon={<ShoppingCart className="h-5 w-5 text-[#00628c]" />}
          iconBg="bg-[#c8e6ff]/30"
          badge={t("orders.today", locale)}
          badgeColor="bg-[#00628c]/10 text-[#00628c]"
          delay={0.1}
        />
        <StatCard
          label={t("orders.processing", locale)}
          value={stats.processing}
          icon={<Loader className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-100"
          delay={0.15}
        />
        <StatCard
          label={t("orders.shipped", locale)}
          value={stats.shipped}
          icon={<Truck className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          delay={0.2}
        />
        <StatCard
          label={t("orders.problems", locale)}
          value={stats.problems}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-100"
          delay={0.25}
        />
      </div>

      {/* -- Data Table -------------------------------------------- */}
      <BlurFade delay={0.3}>
        <Card className="border-border/15 overflow-hidden shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/15 hover:bg-transparent">
                  <TableHead className="pl-5 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.orderNumber", locale)}
                  </TableHead>
                  <TableHead className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.customer", locale)}
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.products", locale)}
                  </TableHead>
                  <TableHead className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.status", locale)}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.date", locale)}
                  </TableHead>
                  <TableHead className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.value", locale)}
                  </TableHead>
                  <TableHead className="w-[60px] pr-5 text-right text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                    {t("table.actions", locale)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {t("orders.noOrders", locale)}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => {
                    const itemCount = order.items?.length ?? 0;
                    const customerName =
                      order.customer?.name ?? t("order.unknown", locale);

                    return (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer border-border/15 transition-colors hover:bg-[#f6f9ff]/60"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        {/* Order # */}
                        <TableCell className="pl-5 font-medium text-foreground">
                          {order.order_number ?? `AS-${order.id.slice(-8).toUpperCase()}`}
                        </TableCell>

                        {/* Client with avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <AvatarCircle name={customerName} />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {customerName}
                              </p>
                              {order.customer?.email && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {order.customer.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Products */}
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {itemCount} {itemCount === 1 ? t("orders.product", locale) : t("orders.products", locale)}
                        </TableCell>

                        {/* Status pill */}
                        <TableCell>
                          <StatusPill status={order.status} locale={locale} />
                        </TableCell>

                        {/* Date */}
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {formatDate(order.created_at)}
                        </TableCell>

                        {/* Value */}
                        <TableCell className="font-semibold text-foreground tabular-nums">
                          {formatCurrency(order.total)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("table.actions", locale)}</span>
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
                                {t("orders.viewDetails", locale)}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info(t("orders.statusUpdateSoon", locale));
                                }}
                              >
                                <Truck className="h-4 w-4" />
                                {t("orders.updateStatus", locale)}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info(t("orders.printSoon", locale));
                                }}
                              >
                                <Printer className="h-4 w-4" />
                                {t("orders.printInvoice", locale)}
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
          </CardContent>
        </Card>
      </BlurFade>

      {/* -- Pagination -------------------------------------------- */}
      <BlurFade delay={0.35}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("orders.showing", locale)}{" "}
            {filteredOrders.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} -{" "}
            {Math.min(page * PAGE_SIZE, filteredOrders.length)} {t("orders.of", locale)}{" "}
            {filteredOrders.length} {t("orders.ordersLabel", locale)}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-border/15 shadow-none"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 shadow-none",
                    p === page
                      ? "bg-[#00628c] hover:bg-[#00496a] text-white"
                      : "border-border/15"
                  )}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-border/15 shadow-none"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
