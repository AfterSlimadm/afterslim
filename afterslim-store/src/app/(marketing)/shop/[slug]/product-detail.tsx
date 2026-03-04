"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Truck, ArrowRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PRODUCTS,
  PRODUCT_CATEGORY_CONFIG,
  type ProductCategory,
} from "@/lib/constants";
import { ProductGallery } from "@/components/product/product-gallery";
import { SubscriptionToggle } from "@/components/product/subscription-toggle";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SupplementFacts } from "@/components/product/supplement-facts";
import { ProductReviews } from "@/components/product/product-reviews";
import * as m from "motion/react-client";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Cross-sell mapping
// ---------------------------------------------------------------------------

const CROSS_SELL: Record<string, { slug: string; label: string; description: string }> = {
  "day-support": {
    slug: "night-support",
    label: "Complete Your Routine",
    description: "Add Night Support for hair, skin, sleep, and full 24/7 coverage.",
  },
  "night-support": {
    slug: "day-support",
    label: "Complete Your Routine",
    description: "Add Day Support for energy, gut health, and satiety during the day.",
  },
  "complete-bundle": {
    slug: "",
    label: "Everything You Need",
    description: "You have the complete Day + Night system for comprehensive 24/7 GLP-1 support.",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductDetailProps {
  product: Product;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductDetail({ product }: ProductDetailProps) {
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">(
    "one-time"
  );

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

  const isInStock = product.stock_quantity > 0;
  const qualifiesForFreeShipping =
    product.price_cents >= FREE_SHIPPING_THRESHOLD_CENTS;

  const activePriceCents =
    purchaseType === "subscription" && product.subscription_price_cents
      ? product.subscription_price_cents
      : product.price_cents;

  // Resolve product data from constants
  const productData = PRODUCTS[product.slug];
  const category = productData?.category as ProductCategory | undefined;
  const categoryConfig = category ? PRODUCT_CATEGORY_CONFIG[category] : null;
  const crossSell = CROSS_SELL[product.slug];

  return (
    <div className="mt-8">
      {/* Two-column layout */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Gallery */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </m.div>

        {/* Right: Info */}
        <m.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryConfig && (
              <Badge variant="outline" className={categoryConfig.className}>
                {categoryConfig.label}
              </Badge>
            )}
            {productData?.badge && (
              <Badge className="bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary-dark)]">
                {productData.badge}
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                Save {savingsPercent}%
              </Badge>
            )}
          </div>

          {/* Name */}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Short description */}
          {product.short_description && (
            <p className="mt-3 text-lg text-muted-foreground">
              {product.short_description}
            </p>
          )}

          {/* GLP-1 Side Effects Addressed */}
          {productData?.addresses && productData.addresses.length > 0 && (
            <div className="mt-4 rounded-lg border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 p-4">
              <p className="text-sm font-semibold text-foreground">
                <Shield className="mb-0.5 mr-1.5 inline-block size-4 text-[var(--color-brand-primary)]" />
                Addresses:
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {productData.addresses.join(" \u00B7 ")}
              </p>
            </div>
          )}

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(product.price_cents)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price_cents!)}
              </span>
            )}
          </div>

          {/* Subscription toggle */}
          {product.subscription_price_cents && (
            <div className="mt-6">
              <SubscriptionToggle
                priceCents={product.price_cents}
                subscriptionPriceCents={product.subscription_price_cents}
                subscriptionInterval={product.subscription_interval}
                onSelect={setPurchaseType}
                selected={purchaseType}
              />
            </div>
          )}

          {/* Stock & shipping */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {isInStock ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle2 className="size-4" />
                In Stock
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                <XCircle className="size-4" />
                Out of Stock
              </div>
            )}

            {qualifiesForFreeShipping && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-primary)]">
                <Truck className="size-4" />
                Free Shipping
              </div>
            )}
          </div>

          {/* Add to cart */}
          <div className="mt-6">
            <AddToCartButton
              product={product}
              priceCentsOverride={activePriceCents}
            />
          </div>

          {/* Benefits list */}
          {productData && (
            <ul className="mt-6 grid grid-cols-2 gap-2">
              {productData.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-xs">
                    &#x2713;
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          {/* Trust notes */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                &#x2713;
              </span>
              GMP Certified
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                &#x2713;
              </span>
              Made in USA
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                &#x2713;
              </span>
              Third-Party Tested
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                &#x2713;
              </span>
              60-Day Guarantee
            </div>
          </div>
        </m.div>
      </div>

      {/* Cross-sell section */}
      {crossSell && (
        <m.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="rounded-xl border border-[var(--color-brand-primary)]/20 bg-gradient-to-r from-[var(--color-brand-primary)]/5 to-[var(--color-brand-secondary)]/10 p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {crossSell.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {crossSell.description}
                </p>
              </div>
              {crossSell.slug ? (
                <Button asChild className="shrink-0">
                  <Link href={`/shop/${crossSell.slug}`}>
                    View {PRODUCTS[crossSell.slug]?.name ?? "Product"}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              ) : (
                <Badge className="shrink-0 bg-green-100 text-green-800 border-green-200 px-3 py-1.5 text-sm">
                  <CheckCircle2 className="mr-1.5 size-4" />
                  Complete Coverage
                </Badge>
              )}
            </div>
          </div>
        </m.div>
      )}

      {/* Tabs section */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            {product.supplement_facts && (
              <TabsTrigger value="supplement-facts">
                Supplement Facts
              </TabsTrigger>
            )}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Description tab */}
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-muted-foreground">
                  No detailed description available yet.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Supplement Facts tab */}
          {product.supplement_facts && (
            <TabsContent value="supplement-facts" className="mt-6">
              <SupplementFacts facts={product.supplement_facts} />
            </TabsContent>
          )}

          {/* Reviews tab */}
          <TabsContent value="reviews" className="mt-6">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
