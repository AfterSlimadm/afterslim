"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StickyAddToCartProps {
  product: Product;
  activePriceCents: number;
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StickyAddToCart({
  product,
  activePriceCents,
  visible,
}: StickyAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const isOutOfStock = product.stock_quantity === 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product.stock_quantity, q + 1));
  }

  function handleAddToCart() {
    addItem({
      id: product.id,
      type: "product",
      name: product.name,
      slug: product.slug,
      price_cents: activePriceCents,
      quantity,
      image: product.images[0] ?? null,
    });
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}`,
    });
    setQuantity(1);
    setCartOpen(true);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop: top bar below navbar */}
          <m.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-30 hidden lg:block border-b border-border/50 bg-background/80 shadow-md backdrop-blur-lg"
          >
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Left: thumbnail + name + price */}
              <div className="flex items-center gap-4">
                {/* Thumbnail placeholder */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)]/15 to-[var(--color-brand-secondary)]/10">
                  <span className="text-xs font-bold text-muted-foreground/50">
                    AS
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                    {product.name}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(activePriceCents)}
                  </span>
                </div>
              </div>

              {/* Right: quantity + ATC button */}
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center overflow-hidden rounded-lg border">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={decrement}
                    disabled={isOutOfStock || quantity <= 1}
                    className="rounded-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="flex h-7 w-8 items-center justify-center text-xs font-medium tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={increment}
                    disabled={isOutOfStock || quantity >= product.stock_quantity}
                    className="rounded-none"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>

                <m.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="sm"
                  >
                    <ShoppingCart className="size-4" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </m.div>
              </div>
            </div>
          </m.div>

          {/* Mobile: bottom bar */}
          <m.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-border/50 bg-background/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-lg"
          >
            <div className="flex items-center gap-3 px-4 py-3 safe-bottom">
              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(activePriceCents)}
                </p>
              </div>

              {/* Full-width ATC button */}
              <m.div whileTap={{ scale: 0.97 }} className="shrink-0">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                  className="px-6"
                >
                  <ShoppingCart className="size-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              </m.div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
