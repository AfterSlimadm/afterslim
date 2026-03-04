"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "./cart-item";
import { FreeShippingBar } from "./free-shipping-bar";
import { CartCrossSell } from "./cart-cross-sell";
import { CartTrustBadges } from "./cart-trust-badges";

export function CartSheet() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const totalItems = useCartStore((s) => s.totalItems);

  const subtotal = subtotalCents();
  const count = totalItems();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Cart ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some supplements to get started.
              </p>
            </div>
            <Button asChild onClick={() => setCartOpen(false)}>
              <Link href="/shop">
                Browse Products
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-1">
              <FreeShippingBar subtotalCents={subtotal} />
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-1">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Cross-sell suggestion */}
              <div className="py-3">
                <CartCrossSell />
              </div>
            </div>

            {/* Trust badges */}
            <CartTrustBadges />

            <Separator />

            {/* Footer */}
            <SheetFooter className="flex-col gap-3 pt-2 sm:flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>

              <Button
                size="lg"
                className="w-full"
                asChild
                onClick={() => setCartOpen(false)}
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
