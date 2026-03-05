"use client";

import {
  FlaskConical,
  Gauge,
  Battery,
  Sparkles,
  Brain,
  Pill,
  Sun,
  Shield,
  Flame,
} from "lucide-react";
import { PRODUCT } from "@/lib/constants";
import * as m from "motion/react-client";
import type { LucideIcon } from "lucide-react";

interface IngredientInfo {
  icon: LucideIcon;
  description: string;
}

const INGREDIENT_META: Record<string, IngredientInfo> = {
  "Berberine HCl": {
    icon: FlaskConical,
    description:
      "Activates AMPK to boost metabolism and support natural GLP-1.",
  },
  "Chromium Picolinate": {
    icon: Gauge,
    description:
      "Stabilizes blood sugar for steady energy throughout the day.",
  },
  "Alpha Lipoic Acid": {
    icon: Battery,
    description:
      "Powerful antioxidant that enhances cellular energy production.",
  },
  "Magnesium Glycinate": {
    icon: Sparkles,
    description: "Promotes deep sleep and muscle relaxation.",
  },
  "L-Theanine": {
    icon: Brain,
    description: "Calms the mind without drowsiness for better rest.",
  },
  "Vitamin B12": {
    icon: Pill,
    description:
      "Essential for energy metabolism and nervous system health.",
  },
  "Vitamin D3": {
    icon: Sun,
    description:
      "Supports immune function and bone health during weight loss.",
  },
  Zinc: {
    icon: Shield,
    description: "Boosts immune recovery and supports skin health.",
  },
  "BioPerine (Black Pepper Extract)": {
    icon: Flame,
    description:
      "Enhances absorption of all other ingredients by up to 2x.",
  },
};

export function IngredientCards() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-accent)]">
            What&apos;s Inside
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            9 Science-Backed Ingredients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every ingredient is dosed at clinical levels and backed by peer-reviewed research.
          </p>
        </m.div>

        {/* Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT.supplementFacts.ingredients.map((ingredient, index) => {
            const meta = INGREDIENT_META[ingredient.name];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <m.div
                key={ingredient.name}
                className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-accent-subtle)] transition-colors group-hover:bg-[var(--color-brand-accent)]/20">
                    <Icon className="size-5 text-[var(--color-brand-accent)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {ingredient.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[var(--color-brand-accent)]">
                      {ingredient.amount}
                      {ingredient.dailyValue && (
                        <span className="ml-1 text-muted-foreground">
                          ({ingredient.dailyValue} DV)
                        </span>
                      )}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}