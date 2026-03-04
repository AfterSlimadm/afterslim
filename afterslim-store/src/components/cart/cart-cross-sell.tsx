"use client";

import { Plus, Sparkles } from "lucide-react";
import * as m from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { PRODUCTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { CartItem } from "@/types/database";

// ---------------------------------------------------------------------------
// Cross-sell logic
// ---------------------------------------------------------------------------

interface CrossSellSuggestion {
  slug: string;
  name: string;
  price: number;
  shortLabel: string;
}

function getCrossSellSuggestion(
  items: CartItem[]
): CrossSellSuggestion | null {
  const slugs = items.map((i) => i.slug);

  const hasDay = slugs.includes("day-support");
  const hasNight = slugs.includes("night-support");
  const hasBundle = slugs.includes("complete-bundle");

  // Already has the bundle or both individual products
  if (hasBundle || (hasDay && hasNight)) return null;

  if (hasDay && !hasNight) {
    const product = PRODUCTS["night-support"];
    return {
      slug: product.slug,
      name: product.name,
      price: product.price,
      shortLabel: "Night Support",
    };
  }

  if (hasNight && !hasDay) {
    const product = PRODUCTS["day-support"];
    return {
      slug: product.slug,
      name: product.name,
      price: product.price,
      shortLabel: "Day Support",
    };
  }

  // Cart has neither day nor night
  const bundle = PRODUCTS["complete-bundle"];
  return {
    slug: bundle.slug,
    name: bundle.name,
    price: bundle.price,
    shortLabel: "Complete Bundle",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CartCrossSell() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const suggestion = getCrossSellSuggestion(items);

  if (!suggestion) return null;

  function handleQuickAdd() {
    if (!suggestion) return;
    addItem({
      id: suggestion.slug,
      type: suggestion.slug === "complete-bundle" ? "kit" : "product",
      name: suggestion.name,
      slug: suggestion.slug,
      price_cents: suggestion.price,
      quantity: 1,
      image: null,
    });
    toast.success(`${suggestion.name} added to cart`);
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3"
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Complete Your Routine
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">
            {suggestion.shortLabel}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(suggestion.price)}
          </p>
        </div>

        <Button
          size="sm"
          variant="default"
          className="shrink-0"
          onClick={handleQuickAdd}
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
    </m.div>
  );
}
