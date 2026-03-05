"use client";

import { CheckCircle, Truck } from "lucide-react";
import * as m from "motion/react-client";
import { formatCurrency } from "@/lib/utils";

/** Free shipping on 3+ bottles (≥ $149.97). Threshold set at $100 for UX. */
const FREE_SHIPPING_THRESHOLD_CENTS = 10000;

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
        {qualified ? (
          <CheckCircle className="size-4 flex-shrink-0 text-green-600" />
        ) : (
          <Truck className="size-4 flex-shrink-0 text-primary" />
        )}
        {qualified ? (
          <span className="font-medium text-green-600">
            You&apos;ve earned free shipping!
          </span>
        ) : (
          <span className="text-muted-foreground">
            You&apos;re{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(remaining)}
            </span>{" "}
            away from free shipping!
          </span>
        )}
      </div>

      {/* Animated progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <m.div
          className={`h-full rounded-full ${
            qualified ? "bg-green-600" : "bg-primary"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
