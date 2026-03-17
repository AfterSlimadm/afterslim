"use client";

import { useState } from "react";
import { PackSelector } from "@/components/product/pack-selector";
import { PRODUCT } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import * as m from "motion/react-client";

export function PackSelectorSection() {
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

  return (
    <section className="as-section-cream py-20 sm:py-24">
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
            Choose Your Supply
          </p>
          <h2 className="as-h2 mt-3 text-foreground">
            The More You Stock, the More You Save
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Every bottle contains 120 capsules for a full 30-day supply.
          </p>
        </m.div>

        {/* Pack Selector */}
        <div className="mt-12">
          <PackSelector
            selectedTier={selectedTier}
            onSelect={setSelectedTier}
            purchaseType={purchaseType}
            onPurchaseTypeChange={setPurchaseType}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </section>
  );
}