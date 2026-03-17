"use client";

import { Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICE_COMPARISON, PRODUCT } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import * as m from "motion/react-client";

export function PriceComparison() {
  const separateTotal = PRICE_COMPARISON.reduce(
    (sum, item) => sum + item.priceCents,
    0,
  );
  const afterslimPrice = PRODUCT.packOptions[0].totalPriceCents;
  const savingsCents = separateTotal - afterslimPrice;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="as-label text-as-orange">
            Compare &amp; Save
          </p>
          <h2 className="as-h2 mt-3 text-foreground">
            Why Pay More for Less?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            AfterSlim replaces 9 separate supplements in one convenient formula.
          </p>
        </m.div>

        {/* Cards */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Buying separately */}
          <m.div
            className="rounded-2xl border bg-muted/50 p-6"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-display font-bold text-foreground">
              Buying Separately
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              9 different bottles, 9 different schedules
            </p>

            <ul className="mt-5 space-y-2.5">
              {PRICE_COMPARISON.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <X className="size-3.5 text-destructive" />
                    {item.name}
                  </span>
                  <span className="as-mono font-medium text-foreground">
                    {formatCurrency(item.priceCents)}/mo
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Total per month
                </span>
                <span className="as-mono text-xl font-bold text-destructive line-through">
                  {formatCurrency(separateTotal)}
                </span>
              </div>
            </div>
          </m.div>

          {/* AfterSlim */}
          <m.div
            className="relative rounded-2xl border-2 border-as-orange bg-card p-6 shadow-lg"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Savings badge */}
            <span className="absolute -top-3 right-4 rounded-full bg-as-orange px-4 py-1 text-xs font-bold text-as-snow">
              SAVE {formatCurrency(savingsCents)}+/mo
            </span>

            <h3 className="text-lg font-display font-bold text-foreground">AfterSlim</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All-in-one formula, one bottle, one schedule
            </p>

            <ul className="mt-5 space-y-2.5">
              {PRODUCT.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Check className="size-4 shrink-0 text-as-orange" />
                  {benefit}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-as-orange" />
                9 ingredients in one formula
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-as-orange" />
                120 capsules, 30-day supply
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-as-orange" />
                Physician formulated
              </li>
            </ul>

            <div className="mt-5 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Starting at
                </span>
                <span className="as-mono text-2xl font-bold text-as-orange">
                  {formatCurrency(afterslimPrice)}/mo
                </span>
              </div>
            </div>

            <Button
              variant="ds-primary"
              className="mt-4 w-full"
              asChild
            >
              <Link href="/shop">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </m.div>
        </div>
      </div>
    </section>
  );
}