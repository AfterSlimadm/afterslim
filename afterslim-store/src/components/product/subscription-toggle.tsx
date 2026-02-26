"use client";

import { Check, Truck, RotateCcw, Percent } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import * as m from "motion/react-client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SubscriptionToggleProps {
  priceCents: number;
  subscriptionPriceCents: number | null;
  subscriptionInterval: string | null;
  onSelect: (type: "one-time" | "subscription") => void;
  selected: "one-time" | "subscription";
}

// ---------------------------------------------------------------------------
// Subscription benefits
// ---------------------------------------------------------------------------

const SUBSCRIPTION_BENEFITS = [
  { icon: Truck, label: "Free shipping" },
  { icon: RotateCcw, label: "Cancel anytime" },
  { icon: Percent, label: "Exclusive savings" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SubscriptionToggle({
  priceCents,
  subscriptionPriceCents,
  subscriptionInterval,
  onSelect,
  selected,
}: SubscriptionToggleProps) {
  if (!subscriptionPriceCents) return null;

  const savingsPercent = Math.round(
    ((priceCents - subscriptionPriceCents) / priceCents) * 100
  );

  const intervalLabel =
    subscriptionInterval === "bimonth"
      ? "every 2 months"
      : subscriptionInterval === "quarter"
        ? "every 3 months"
        : "monthly";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* One-time purchase */}
      <m.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("one-time")}
        className={cn(
          "relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-200",
          selected === "one-time"
            ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm"
            : "border-border hover:border-[var(--color-brand-primary)]/40"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              selected === "one-time"
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
                : "border-muted-foreground/30"
            )}
          >
            {selected === "one-time" && (
              <Check className="size-3 text-white" />
            )}
          </div>
          <span className="text-sm font-semibold">One-Time Purchase</span>
        </div>
        <p className="mt-2 text-xl font-bold text-foreground">
          {formatCurrency(priceCents)}
        </p>
      </m.button>

      {/* Subscribe & Save */}
      <m.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("subscription")}
        className={cn(
          "relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-200",
          selected === "subscription"
            ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm"
            : "border-border hover:border-[var(--color-brand-primary)]/40"
        )}
      >
        {/* Savings badge */}
        <div className="absolute -top-2.5 right-3 rounded-full bg-[var(--color-brand-secondary)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-brand-primary-dark)]">
          Save {savingsPercent}%
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              selected === "subscription"
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
                : "border-muted-foreground/30"
            )}
          >
            {selected === "subscription" && (
              <Check className="size-3 text-white" />
            )}
          </div>
          <span className="text-sm font-semibold">Subscribe &amp; Save</span>
        </div>
        <p className="mt-2 text-xl font-bold text-foreground">
          {formatCurrency(subscriptionPriceCents)}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {intervalLabel}
          </span>
        </p>

        {/* Benefits list */}
        <ul className="mt-3 space-y-1.5">
          {SUBSCRIPTION_BENEFITS.map((benefit) => (
            <li
              key={benefit.label}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <benefit.icon className="size-3.5 text-[var(--color-brand-primary)]" />
              {benefit.label}
            </li>
          ))}
        </ul>
      </m.button>
    </div>
  );
}
