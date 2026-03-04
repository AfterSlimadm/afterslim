"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as m from "motion/react-client";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AddToCartButtonProps {
  product: Product;
  /** Optional override price (e.g. subscription price) in cents */
  priceCentsOverride?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddToCartButton({
  product,
  priceCentsOverride,
  className,
}: AddToCartButtonProps) {
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
      price_cents: priceCentsOverride ?? product.price_cents,
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
    <div className={cn("flex items-center gap-3", className)}>
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
          <Minus className="size-4" />
        </Button>
        <span className="flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums">
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
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Add to cart */}
      <m.div whileTap={{ scale: 0.97 }} className="flex-1">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="size-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </m.div>
    </div>
  );
}
