"use client";

import Link from "next/link";
import { PRODUCT } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { BottleVisual } from "@/components/product/bottle-visual";
import * as m from "motion/react-client";

/* ---------------------------------------------------------------------------
   Arrow icon (Seed-style)
   --------------------------------------------------------------------------- */
function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      fill="none"
      viewBox="0 0 11 11"
      style={{ width: 12, height: 12 }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Seed-style product card with ::before scaleY hover
   --------------------------------------------------------------------------- */
function ProductCard({
  pack,
  index,
}: {
  pack: (typeof PRODUCT.packOptions)[number];
  index: number;
}) {
  const badgeColors: Record<string, string> = {
    "Most Popular": "bg-as-orange-glow text-as-navy",
    "Best Value": "bg-green-500 text-white",
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href="/shop"
        className="as-product-card group relative flex w-full flex-col items-center justify-center rounded-2xl p-10 text-center no-underline"
      >
        {/* ::before bg - simulated with a div since Tailwind can't do scaleY on ::before easily */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[calc(100%+50px)] w-full -translate-x-1/2 -translate-y-1/2 scale-y-[0.9] rounded-2xl bg-as-navy-card transition-transform duration-300 group-hover:scale-y-100" />

        {/* Badge */}
        {pack.badge && (
          <span
            className={`absolute left-2 top-2 z-10 inline-flex items-center rounded-full px-2 py-1.5 font-display text-xs font-medium leading-none transition-[top] duration-300 group-hover:top-3 ${badgeColors[pack.badge] ?? "bg-as-orange-glow text-as-navy"}`}
          >
            {pack.badge}
          </span>
        )}

        {/* Card top — pill + product name */}
        <div className="relative z-10 text-center transition-transform duration-300 group-hover:-translate-y-5">
          <span className="inline-flex items-center rounded-full border border-as-snow/30 px-2.5 py-1 font-display text-xs font-medium tracking-tight text-as-snow">
            {pack.label}
          </span>
          <p className="mt-2 font-display text-xl font-medium tracking-tight text-as-snow">
            AfterSlim
          </p>
        </div>

        {/* Card center — bottle visual */}
        <div className="relative z-10 my-4 flex h-36 w-28 items-center justify-center">
          <BottleVisual
            size="card"
            count={pack.bottles as 1 | 2 | 3}
          />
        </div>

        {/* Card bottom — CTA + price */}
        <div className="relative z-10 text-center transition-transform duration-300 group-hover:translate-y-5">
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-as-orange px-5 py-3 font-display text-base font-medium text-as-snow transition-colors group-hover:bg-as-orange-bright">
            Shop Now
            <span className="inline-flex w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100">
              <ArrowIcon />
            </span>
          </span>
          <p className="mt-3 text-sm text-as-snow/70">
            {pack.subscriptionPriceCents
              ? `Starting at ${formatCurrency(pack.subscriptionPriceCents / pack.bottles)}/mo`
              : `${formatCurrency(pack.pricePerBottleCents)}/bottle`}
          </p>
        </div>
      </Link>
    </m.div>
  );
}

/* ---------------------------------------------------------------------------
   Product Cards Section — Seed-style dark section with heading + cards
   --------------------------------------------------------------------------- */
export function ProductCardsSection() {
  return (
    <section className="bg-as-navy py-14">
      {/* Left text block */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-14">
        <div className="mb-10 max-w-[570px]">
          <m.p
            className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.015em] text-as-snow sm:text-[3rem]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            One formula for your
            <br />
            entire GLP-1 journey.
          </m.p>
          <m.p
            className="mt-4 max-w-md text-base leading-relaxed text-as-snow/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Clinically dosed ingredients that provide sustained support for
            metabolism, energy, sleep, and recovery.
          </m.p>
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              href="/shop"
              className="group mt-4 inline-flex items-center gap-2 font-display text-base font-medium capitalize text-as-snow transition-colors hover:text-as-orange"
            >
              Shop all
              <ArrowIcon />
            </Link>
          </m.div>
        </div>

        {/* Product cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT.packOptions.map((pack, i) => (
            <ProductCard key={pack.tier} pack={pack} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
