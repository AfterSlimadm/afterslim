"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/database";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4">
      {/* Image placeholder */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          AS
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground capitalize">
          {item.type === "kit" ? "Kit / Bundle" : "Supplement"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>

          {/* Line total */}
          <p className="text-sm font-semibold">
            {formatCurrency(item.price_cents * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
