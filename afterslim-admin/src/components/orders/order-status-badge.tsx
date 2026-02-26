import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

/* ── Props ────────────────────────────────────────────────── */

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/* ── Component ────────────────────────────────────────────── */

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <Badge
      variant="secondary"
      className={cn("border-none text-xs font-medium", config.color, className)}
    >
      {config.label}
    </Badge>
  );
}
