"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "./cart-item";
import { FreeShippingBar } from "./free-shipping-bar";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = subtotalCents();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added any supplements yet. Browse our
          collection to find what&apos;s right for you.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/shop">
            Browse Products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      {/* Cart items */}
      <div className="lg:col-span-2">
        <div className="divide-y rounded-lg border">
          {items.map((item) => (
            <div key={item.id} className="px-4">
              <CartItem item={item} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shop">
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>

            <FreeShippingBar subtotalCents={subtotal} />

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-sm text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-sm text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" asChild>
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
