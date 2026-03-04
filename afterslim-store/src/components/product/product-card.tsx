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
import {
  PRODUCT_CATEGORY_CONFIG,
  PRODUCTS,
  type ProductCategory,
} from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import * as m from "motion/react-client";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve the product category from our constants map, falling back to the DB category field */
function resolveCategory(product: Product): ProductCategory | null {
  const productData = PRODUCTS[product.slug];
  if (productData) return productData.category;
  // Fallback: try to match DB category to our known categories
  const cat = product.category?.toLowerCase();
  if (cat === "day" || cat === "night" || cat === "bundle") return cat;
  return null;
}

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

  const category = resolveCategory(product);
  const categoryConfig = category ? PRODUCT_CATEGORY_CONFIG[category] : null;
  const productData = PRODUCTS[product.slug];
  const isBundle = category === "bundle";

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
              {/* Category badge */}
              {categoryConfig && (
                <Badge
                  variant="outline"
                  className={categoryConfig.className}
                >
                  {categoryConfig.label}
                </Badge>
              )}
              {/* Most Popular badge for bundle */}
              {productData?.badge && (
                <Badge className="bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary-dark)]">
                  {productData.badge}
                </Badge>
              )}
              {/* Save % badge for bundle */}
              {isBundle && (
                <Badge variant="destructive">Save 15%</Badge>
              )}
              {/* Sale badge for non-bundle discounts */}
              {!isBundle && hasDiscount && (
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

          {/* Benefits preview */}
          {productData && (
            <ul className="mt-1 space-y-0.5">
              {productData.benefits.slice(0, 3).map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="text-[var(--color-brand-primary)]">&#x2713;</span>
                  {benefit}
                </li>
              ))}
            </ul>
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
