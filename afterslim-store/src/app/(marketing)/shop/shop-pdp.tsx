"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRODUCT, CONTACT } from "@/lib/constants";
import { PackSelector } from "@/components/product/pack-selector";
import { SupplementFacts } from "@/components/product/supplement-facts";
import { BenefitsTimeline } from "@/components/marketing/benefits-timeline";
import { BerberineSection } from "@/components/marketing/berberine-section";
import { IngredientCards } from "@/components/marketing/ingredient-cards";
import { PriceComparison } from "@/components/marketing/price-comparison";
import { Testimonials } from "@/components/marketing/testimonials";
import { CTASection } from "@/components/marketing/cta-section";
import { useCartStore } from "@/store/useCartStore";
import { BottleVisual } from "@/components/product/bottle-visual";
import * as m from "motion/react-client";

// ---------------------------------------------------------------------------
// FAQ data for the PDP
// ---------------------------------------------------------------------------

const PDP_FAQ = [
  {
    q: "How does AfterSlim work?",
    a: "AfterSlim combines 9 science-backed ingredients led by Berberine HCl, which activates AMPK (the same enzyme activated by exercise). This supports your body's natural metabolism, GLP-1 production, energy levels, and sleep quality. Take 4 capsules daily with a meal.",
  },
  {
    q: "When will I feel results?",
    a: "Most customers notice improved energy and reduced bloating within the first 1-2 weeks. Better sleep quality typically follows by week 2-3. Full metabolic and recovery benefits develop over 1-3 months of consistent use.",
  },
  {
    q: "Can I take it with my GLP-1 medication?",
    a: "AfterSlim was specifically formulated to complement GLP-1 therapy, not interfere with it. It contains no stimulants, no appetite suppressants, and no ingredients known to interact with semaglutide or tirzepatide. We always recommend consulting your prescribing physician before starting any new supplement.",
  },
  {
    q: "What if it doesn't work for me?",
    a: `We offer a 60-day money-back guarantee on all orders, including opened bottles. If AfterSlim isn't right for you, email ${CONTACT.email} within 60 days for a full refund. No hassle, no questions.`,
  },
  {
    q: "How do the pack options work?",
    a: "Choose between 1, 2, or 3 bottles. Each bottle contains 120 capsules (a full 30-day supply). Larger packs come with bigger savings and free shipping on 2+ bottles. Subscribe & Save locks in the lowest price with flexible cancellation.",
  },
  {
    q: "Is it safe? Any side effects?",
    a: "AfterSlim is manufactured in an FDA-registered, cGMP-certified facility in the USA. Every batch is third-party tested. It's gluten-free, soy-free, and non-GMO. Some people may experience mild digestive adjustment in the first few days, which typically resolves on its own.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShopPDP() {
  const [selectedTier, setSelectedTier] = useState<
    "1-bottle" | "2-bottle" | "3-bottle"
  >("2-bottle");
  const [purchaseType, setPurchaseType] = useState<
    "subscription" | "one-time"
  >("subscription");

  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    const pack = PRODUCT.packOptions.find((p) => p.tier === selectedTier);
    if (!pack) return;

    const pricePerBottle =
      purchaseType === "subscription"
        ? pack.subscriptionPriceCents
        : pack.totalPriceCents / pack.bottles;

    addItem({
      id: `afterslim-${selectedTier}-${purchaseType}`,
      type: "product",
      name: `AfterSlim (${pack.bottles} ${pack.bottles === 1 ? "Bottle" : "Bottles"})`,
      slug: "afterslim",
      price_cents: pricePerBottle,
      quantity: 1,
      image: null,
      pack_tier: selectedTier,
      bottles: pack.bottles,
      is_subscription: purchaseType === "subscription",
    });
  }

  const selectedPack = PRODUCT.packOptions.find(
    (p) => p.tier === selectedTier,
  )!;

  const supplementFactsForComponent = {
    serving_size: PRODUCT.supplementFacts.servingSize,
    servings_per_container: PRODUCT.supplementFacts.servings,
    ingredients: PRODUCT.supplementFacts.ingredients.map((i) => ({
      name: i.name,
      amount: i.amount,
      daily_value: i.dailyValue ?? "",
    })),
    other_ingredients: PRODUCT.supplementFacts.otherIngredients,
  };

  return (
    <>
      {/* ================================================================= */}
      {/* 1. PRODUCT HERO */}
      {/* ================================================================= */}
      <section className="py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: SVG bottle */}
            <div className="flex items-center justify-center">
              <BottleVisual
                size="hero"
                animated
                glowEffect
              />
            </div>

            {/* Right: Product info + pack selector */}
            <m.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="as-label text-as-orange">
                Berberine-Powered Formula
              </p>
              <h1 className="as-h1 mt-2 text-foreground">
                AfterSlim
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {PRODUCT.shortDescription}
              </p>

              {/* Benefits checklist */}
              <ul className="mt-6 grid grid-cols-2 gap-2">
                {PRODUCT.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="size-4 shrink-0 text-as-orange" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Pack Selector */}
              <div className="mt-8">
                <PackSelector
                  selectedTier={selectedTier}
                  onSelect={setSelectedTier}
                  purchaseType={purchaseType}
                  onPurchaseTypeChange={setPurchaseType}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. TRUST LINE */}
      {/* ================================================================= */}
      <section className="border-y as-section-cream py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-10">
            <span className="flex items-center gap-2">
              <Shield className="size-4 text-as-orange" />
              60-Day Money-Back Guarantee
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-as-orange" />
              Free Shipping on 2+ Bottles
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-as-orange" />
              Cancel Anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-as-orange" />
              cGMP Certified, Made in USA
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. BENEFITS TIMELINE */}
      {/* ================================================================= */}
      <BenefitsTimeline />

      {/* ================================================================= */}
      {/* 4. BERBERINE HERO INGREDIENT */}
      {/* ================================================================= */}
      <BerberineSection />

      {/* ================================================================= */}
      {/* 5. INGREDIENT CARDS */}
      {/* ================================================================= */}
      <IngredientCards />

      {/* ================================================================= */}
      {/* 6. SUPPLEMENT FACTS ACCORDION */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <m.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="as-label text-as-orange">
              Full Transparency
            </p>
            <h2 className="as-h2 mt-3 text-foreground">
              Supplement Facts
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              No proprietary blends. Every ingredient, every dose, clearly
              listed.
            </p>
          </m.div>

          <m.div
            className="mx-auto mt-10 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SupplementFacts facts={supplementFactsForComponent} />
          </m.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. PRICE COMPARISON */}
      {/* ================================================================= */}
      <PriceComparison />

      {/* ================================================================= */}
      {/* 8. FAQ ACCORDION */}
      {/* ================================================================= */}
      <section className="as-section-cream py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <m.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="as-h2 text-foreground">
              Frequently Asked Questions
            </h2>
          </m.div>

          <Accordion type="single" collapsible className="mt-10">
            {PDP_FAQ.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/faq">
                View All FAQs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 9. TESTIMONIALS */}
      {/* ================================================================= */}
      <Testimonials />

      {/* ================================================================= */}
      {/* 10. FINAL CTA */}
      {/* ================================================================= */}
      <CTASection />
    </>
  );
}
