"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/constants";
import { ProductGallery } from "@/components/product/product-gallery";
import { SubscriptionToggle } from "@/components/product/subscription-toggle";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SupplementFacts } from "@/components/product/supplement-facts";
import { ProductReviews } from "@/components/product/product-reviews";
import * as m from "motion/react-client";
import type { Product } from "@/types/database";

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
            {product.is_featured && (
              <Badge className="bg-[var(--color-brand-secondary)] text-[var(--color-brand-primary-dark)]">
                Best Seller
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
              30-Day Guarantee
            </div>
          </div>
        </m.div>
      </div>

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
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
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
