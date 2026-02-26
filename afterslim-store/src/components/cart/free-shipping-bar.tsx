"use client";

import { Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/constants";

interface FreeShippingBarProps {
  subtotalCents: number;
}

export function FreeShippingBar({ subtotalCents }: FreeShippingBarProps) {
  const remaining = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;
  const progress = Math.min(
    (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
    100
  );
  const qualified = remaining <= 0;

  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-2 text-sm">
        <Truck className="size-4 flex-shrink-0 text-primary" />
        {qualified ? (
          <span className="font-medium text-primary">
            You qualify for free shipping!
          </span>
        ) : (
          <span className="text-muted-foreground">
            Add{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(remaining)}
            </span>{" "}
            more for free shipping
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
