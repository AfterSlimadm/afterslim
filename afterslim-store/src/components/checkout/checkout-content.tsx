"use client";

import Link from "next/link";
import { ArrowLeft, Lock, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { FreeShippingBar } from "@/components/cart/free-shipping-bar";

export function CheckoutContent() {
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents);

  const subtotal = subtotalCents();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="mb-4 size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Add some products before checking out.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-5">
      {/* Checkout form */}
      <div className="space-y-6 lg:col-span-3">
        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone (optional)
              </label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address1" className="text-sm font-medium">
                Address
              </label>
              <Input id="address1" placeholder="123 Main St" />
            </div>
            <div className="space-y-2">
              <label htmlFor="address2" className="text-sm font-medium">
                Apartment, suite, etc. (optional)
              </label>
              <Input id="address2" placeholder="Apt 4B" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input id="city" placeholder="New York" />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input id="state" placeholder="NY" />
              </div>
              <div className="space-y-2">
                <label htmlFor="zip" className="text-sm font-medium">
                  ZIP Code
                </label>
                <Input id="zip" placeholder="10001" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="size-5" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-muted p-8 text-center">
              <Lock className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="font-medium">Stripe Checkout Coming Soon</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Secure payment processing will be integrated with Stripe.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ArrowLeft className="size-4" />
            Return to Cart
          </Link>
        </Button>
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-2">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                    AS
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.price_cents * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <FreeShippingBar subtotalCents={subtotal} />

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">TBD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-muted-foreground">TBD</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <Button size="lg" className="w-full" disabled>
              <Lock className="size-4" />
              Place Order (Coming Soon)
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your payment is secured with 256-bit SSL encryption.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
