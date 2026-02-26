import { cn, formatDateTime } from "@/lib/utils";
import type { OrderEvent, OrderEventType } from "@/lib/types";
import {
  ShoppingCart,
  CreditCard,
  RefreshCw,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

/* ── Event config ─────────────────────────────────────────── */

const EVENT_CONFIG: Record<
  OrderEventType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  created: {
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  payment_confirmed: {
    icon: CreditCard,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  status_changed: {
    icon: RefreshCw,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  shipped: {
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  delivered: {
    icon: PackageCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  refunded: {
    icon: RotateCcw,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800/50",
  },
  note_added: {
    icon: MessageSquare,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
};

/* ── Props ────────────────────────────────────────────────── */

interface OrderTimelineProps {
  events: OrderEvent[];
}

/* ── Component ────────────────────────────────────────────── */

export function OrderTimeline({ events }: OrderTimelineProps) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="relative space-y-0">
      {sorted.map((event, index) => {
        const config = EVENT_CONFIG[event.type];
        const Icon = config.icon;
        const isLast = index === sorted.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4 pb-6">
            {/* Connecting line */}
            {!isLast && (
              <div className="absolute left-[17px] top-10 h-[calc(100%-24px)] w-px bg-border" />
            )}

            {/* Icon dot */}
            <div
              className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                config.bg
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(event.created_at)}
              </p>
              {event.created_by && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  by {event.created_by}
                </p>
              )}
              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <div className="mt-1 rounded-md bg-muted/50 px-2 py-1">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <p key={key} className="text-xs text-muted-foreground">
                      <span className="font-medium capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>{" "}
                      {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
