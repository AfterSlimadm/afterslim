"use client";

import { Truck, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { BottleVisual } from "@/components/product/bottle-visual";
import { Button } from "@/components/ui/button";
import { PRODUCT, type PackTier } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import * as m from "motion/react-client";

interface PackSelectorProps {
  selectedTier: PackTier;
  onSelect: (tier: PackTier) => void;
  purchaseType: "subscription" | "one-time";
  onPurchaseTypeChange: (type: "subscription" | "one-time") => void;
  onAddToCart: () => void;
  className?: string;
}

export function PackSelector({
  selectedTier,
  onSelect,
  purchaseType,
  onPurchaseTypeChange,
  onAddToCart,
  className,
}: PackSelectorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Purchase type toggle */}
      <div className="mx-auto mb-6 flex w-fit rounded-full bg-as-cream p-1">
        <button
          onClick={() => onPurchaseTypeChange("subscription")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-display font-semibold transition-all",
            purchaseType === "subscription"
              ? "bg-as-orange text-as-snow shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Subscribe & Save
        </button>
        <button
          onClick={() => onPurchaseTypeChange("one-time")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-display font-semibold transition-all",
            purchaseType === "one-time"
              ? "bg-as-orange text-as-snow shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          One-time Purchase
        </button>
      </div>

      {/* Pack cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PRODUCT.packOptions.map((pack, index) => {
          const isSelected = pack.tier === selectedTier;
          const price =
            purchaseType === "subscription"
              ? pack.subscriptionPriceCents
              : pack.totalPriceCents;
          const perBottle =
            purchaseType === "subscription"
              ? Math.round(pack.subscriptionPriceCents / pack.bottles)
              : pack.pricePerBottleCents;

          return (
            <m.button
              key={pack.tier}
              onClick={() => onSelect(pack.tier)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col items-center rounded-2xl border-2 p-5 text-center transition-all",
                isSelected
                  ? "border-as-orange bg-as-peach shadow-lg"
                  : "border-border bg-card hover:border-as-orange/40 hover:shadow-md",
                pack.badge === "Most Popular" && "sm:scale-[1.03]",
              )}
            >
              {/* Badge */}
              {pack.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-as-orange px-3 py-1 text-xs font-bold text-as-snow">
                  {pack.badge}
                </span>
              )}

              {/* Bottle SVG */}
              <div className="mb-3 mt-2 flex items-center justify-center">
                <BottleVisual
                  count={pack.bottles as 1 | 2 | 3}
                  size={pack.bottles === 1 ? "md" : "sm"}
                  animated={false}
                />
              </div>

              {/* Supply label */}
              <p className="text-xs font-medium text-muted-foreground">
                {pack.supplyDays}-Day Supply
              </p>

              {/* Price per bottle */}
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="as-mono text-lg font-bold text-foreground">
                  {formatCurrency(perBottle)}
                </span>
                <span className="text-xs text-muted-foreground">/bottle</span>
              </div>

              {/* Compare price */}
              {pack.compareAtTotalCents > price && (
                <p className="as-mono mt-1 text-xs text-muted-foreground line-through">
                  {formatCurrency(pack.compareAtTotalCents)}
                </p>
              )}

              {/* Total */}
              <p className="as-mono mt-1 text-sm font-semibold text-foreground">
                {formatCurrency(price)} total
              </p>

              {/* Savings */}
              {pack.savingsPercent > 0 && (
                <span className="mt-2 inline-block rounded-full bg-as-orange/10 px-2.5 py-0.5 text-xs font-bold text-as-orange">
                  Save {pack.savingsPercent}%
                </span>
              )}

              {/* Free shipping */}
              {pack.freeShipping && (
                <div className="mt-2 flex items-center gap-1 text-xs text-as-orange">
                  <Truck className="size-3" />
                  <span className="font-medium">Free Shipping</span>
                </div>
              )}

              {/* Selected check */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-as-orange">
                  <Check className="size-3 text-as-snow" />
                </div>
              )}
            </m.button>
          );
        })}
      </div>

      {/* Trust line */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3.5" />
          60-day money-back guarantee
        </span>
        <span>Cancel anytime</span>
        <span className="flex items-center gap-1">
          <Truck className="size-3.5" />
          Free shipping on 2+ bottles
        </span>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onAddToCart}
        variant="ds-primary"
        className="mt-6 h-14 w-full text-lg"
      >
        Get Started
        <ArrowRight className="ml-2 size-5" />
      </Button>
    </div>
  );
}
