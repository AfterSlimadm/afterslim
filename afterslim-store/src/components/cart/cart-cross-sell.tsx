"use client";

import { Plus, Sparkles } from "lucide-react";
import * as m from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { PRODUCT } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { CartItem } from "@/types/database";

// ---------------------------------------------------------------------------
// Upsell logic: suggest upgrading to a bigger pack
// ---------------------------------------------------------------------------

interface UpsellSuggestion {
  tier: "2-bottle" | "3-bottle";
  label: string;
  savingsPercent: number;
  pricePerBottle: number;
}

function getUpsellSuggestion(
  items: CartItem[],
): UpsellSuggestion | null {
  const hasThreeBottle = items.some((i) => i.pack_tier === "3-bottle");
  if (hasThreeBottle) return null;

  const hasTwoBottle = items.some((i) => i.pack_tier === "2-bottle");

  if (hasTwoBottle) {
    const pack = PRODUCT.packOptions.find((p) => p.tier === "3-bottle")!;
    return {
      tier: "3-bottle",
      label: "Upgrade to 3 Pack",
      savingsPercent: pack.savingsPercent,
      pricePerBottle: pack.pricePerBottleCents,
    };
  }

  // Has 1-bottle or no AfterSlim at all
  const pack = PRODUCT.packOptions.find((p) => p.tier === "2-bottle")!;
  return {
    tier: "2-bottle",
    label: "Upgrade to 2 Pack",
    savingsPercent: pack.savingsPercent,
    pricePerBottle: pack.pricePerBottleCents,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CartCrossSell() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const suggestion = getUpsellSuggestion(items);

  if (!suggestion) return null;

  function handleUpgrade() {
    if (!suggestion) return;
    const pack = PRODUCT.packOptions.find((p) => p.tier === suggestion.tier)!;
    addItem({
      id: `afterslim-${suggestion.tier}-one-time`,
      type: "product",
      name: `AfterSlim (${pack.bottles} Bottles)`,
      slug: "afterslim",
      price_cents: pack.totalPriceCents,
      quantity: 1,
      image: null,
      pack_tier: suggestion.tier,
      bottles: pack.bottles,
      is_subscription: false,
    });
    toast.success(`Upgraded to ${pack.bottles} bottles!`);
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-lg border border-dashed border-as-orange/30 bg-as-peach/30 p-3"
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-as-orange" />
        <span className="as-label text-as-orange">
          Save {suggestion.savingsPercent}% More
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">
            {suggestion.label}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(suggestion.pricePerBottle)}/bottle
          </p>
        </div>

        <Button
          size="sm"
          className="shrink-0 bg-as-orange text-as-snow hover:bg-as-orange-bright"
          onClick={handleUpgrade}
        >
          <Plus className="size-3.5" />
          Upgrade
        </Button>
      </div>
    </m.div>
  );
}
