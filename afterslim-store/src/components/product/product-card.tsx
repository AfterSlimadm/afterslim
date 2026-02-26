"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import * as m from "motion/react-client";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount =
    product.compare_at_price_cents !== null &&
    product.compare_at_price_cents > product.price_cents;

  const savingsPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price_cents! - product.price_cents) /
          product.compare_at_price_cents!) *
          100
      )
    : 0;

  function handleAddToCart() {
    addItem({
      id: product.id,
      type: "product",
      name: product.name,
      slug: product.slug,
      price_cents: product.price_cents,
      quantity: 1,
      image: product.images[0] ?? null,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        {/* Image placeholder */}
        <Link href={`/shop/${product.slug}`}>
          <div className="relative aspect-[3/4] bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-[var(--color-brand-secondary)]/10">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground/50">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-background/60">
                  <span className="text-lg font-bold">AS</span>
                </div>
                <p className="text-xs">Product Image</p>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_featured && (
                <Badge className="bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary-dark)]">
                  Best Seller
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive">
                  Sale &minus;{savingsPercent}%
                </Badge>
              )}
            </div>
          </div>
        </Link>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <Link
              href={`/shop/${product.slug}`}
              className="transition-colors hover:text-[var(--color-brand-primary)]"
            >
              {product.name}
            </Link>
          </CardTitle>
          {product.short_description && (
            <CardDescription className="line-clamp-2">
              {product.short_description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="mt-auto space-y-2">
          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              {formatCurrency(product.price_cents)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price_cents!)}
              </span>
            )}
          </div>

          {/* Subscription price */}
          {product.subscription_price_cents && (
            <p className="text-sm text-[var(--color-brand-primary)]">
              Subscribe &amp; Save:{" "}
              <span className="font-semibold">
                {formatCurrency(product.subscription_price_cents)}
              </span>
              /mo
            </p>
          )}
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/shop/${product.slug}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </m.div>
  );
}
