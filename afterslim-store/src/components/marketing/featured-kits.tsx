"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
import * as m from "motion/react-client";

// ---------------------------------------------------------------------------
// Placeholder data (will be fetched from Supabase later)
// ---------------------------------------------------------------------------

const PLACEHOLDER_KITS = [
  {
    id: "kit-1",
    slug: "slim-starter-kit",
    name: "Slim Starter Kit",
    description:
      "Everything you need to kickstart your weight management journey. Includes our best-selling fat burner, appetite suppressant, and metabolism booster.",
    price_cents: 8997,
    compare_at_price_cents: 11997,
    badge: "Best Seller",
    gradient: "from-emerald-500/20 to-teal-600/20",
  },
  {
    id: "kit-2",
    slug: "complete-wellness-kit",
    name: "Complete Wellness Kit",
    description:
      "Our comprehensive wellness bundle for total body support. Includes multivitamin, probiotic, omega-3, and immune support supplements.",
    price_cents: 12497,
    compare_at_price_cents: 15997,
    badge: "Most Popular",
    gradient: "from-amber-500/20 to-orange-600/20",
  },
  {
    id: "kit-3",
    slug: "vitality-boost-kit",
    name: "Vitality Boost Kit",
    description:
      "Supercharge your energy and focus naturally. Includes our premium energy complex, B-vitamin blend, and adaptogen stack.",
    price_cents: 7497,
    compare_at_price_cents: 9997,
    badge: "New",
    gradient: "from-violet-500/20 to-purple-600/20",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeaturedKits() {
  return (
    <section className="py-20 sm:py-24">
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
            Our Best-Selling Kits
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Curated bundles designed to work together for maximum results. Save
            more when you buy a kit.
          </p>
        </m.div>

        {/* Kit cards grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_KITS.map((kit, index) => (
            <m.div
              key={kit.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                {/* Image placeholder */}
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${kit.gradient}`}
                >
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-muted-foreground/50">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-background/50">
                        <span className="text-lg font-bold">AS</span>
                      </div>
                      <p className="text-xs">Kit Image</p>
                    </div>
                  </div>

                  {/* Badge */}
                  {kit.badge && (
                    <Badge className="absolute left-4 top-4">{kit.badge}</Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{kit.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {kit.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {formatCurrency(kit.price_cents)}
                    </span>
                    {kit.compare_at_price_cents && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(kit.compare_at_price_cents)}
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/kits/${kit.slug}`}>
                      View Kit
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </m.div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/kits">
              View All Kits
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
