"use client";

import { FlaskConical, Leaf, RefreshCw, Truck } from "lucide-react";
import * as m from "motion/react-client";

const BENEFITS = [
  {
    icon: FlaskConical,
    title: "Science-Backed Formulas",
    description:
      "Every ingredient is carefully selected based on clinical research and third-party tested for purity and potency.",
  },
  {
    icon: Leaf,
    title: "Premium Ingredients",
    description:
      "We source only the highest quality natural ingredients, free from artificial fillers, binders, and unnecessary additives.",
  },
  {
    icon: RefreshCw,
    title: "Subscribe & Save",
    description:
      "Never run out of your favorites. Subscribe for automatic deliveries and save up to 20% on every order.",
  },
  {
    icon: Truck,
    title: "Fast & Free Shipping",
    description:
      "Enjoy free shipping on all orders over $99. Most orders are processed within 24 hours and arrive within 3-5 business days.",
  },
];

export function BenefitsSection() {
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
            Why Choose AfterSlim?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We hold ourselves to the highest standards so you can focus on what
            matters most: your health.
          </p>
        </m.div>

        {/* Benefits grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <m.div
              key={benefit.title}
              className="group rounded-2xl bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
