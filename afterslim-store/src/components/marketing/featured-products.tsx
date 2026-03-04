"use client";

import Link from "next/link";
import { ArrowRight, Sun, Moon, Sparkles } from "lucide-react";
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
import { PRODUCTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import * as m from "motion/react-client";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Visual config per product (gradient, icon, tagline — not duplicating data)
// ---------------------------------------------------------------------------

const PRODUCT_VISUAL: Record<string, { icon: LucideIcon; tagline: string; gradient: string }> = {
  "day-support": {
    icon: Sun,
    tagline: "Energy \u00b7 Gut Health \u00b7 Satiety",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  "night-support": {
    icon: Moon,
    tagline: "Hair \u00b7 Skin \u00b7 Sleep \u00b7 Recovery",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  "complete-bundle": {
    icon: Sparkles,
    tagline: "24/7 GLP-1 Support",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeaturedProducts() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <m.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Choose Your Support
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Targeted nutrition for every stage of your GLP-1 journey. Day,
            Night, or both. You decide what your body needs.
          </p>
        </m.div>

        {/* Product cards grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(PRODUCTS).map((product, index) => {
            const visual = PRODUCT_VISUAL[product.slug];
            if (!visual) return null;
            const Icon = visual.icon;
            const hasCompare = product.compareAtPrice > product.price;
            const savingsPercent = hasCompare
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : 0;

            return (
              <m.div
                key={product.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  {/* Visual header */}
                  <div
                    className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${visual.gradient}`}
                  >
                    <div className="text-center text-muted-foreground/60">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-background/60 shadow-sm">
                        <Icon className="size-10" />
                      </div>
                      <p className="text-xs font-medium">{visual.tagline}</p>
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <Badge className="absolute left-4 top-4">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      <Link href={`/shop/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {product.shortDescription}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(product.price)}
                      </span>
                      {hasCompare && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {hasCompare && (
                      <p className="mt-1 text-xs font-medium text-primary">
                        Save {savingsPercent}%
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/shop/${product.slug}`}>
                        {product.badge ? "Get the Bundle" : "Add to Cart"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </m.div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/shop">
              View All Products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
