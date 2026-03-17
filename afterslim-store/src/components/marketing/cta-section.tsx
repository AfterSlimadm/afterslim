"use client";

import Link from "next/link";
import { BottleVisual } from "@/components/product/bottle-visual";
import * as m from "motion/react-client";

/* ---------------------------------------------------------------------------
   Seed-style final CTA section
   Dark navy bg, rounded-top-[2rem], split layout:
   Left: large heading + text link
   Right: bottle visual with decorative glow
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

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden rounded-t-[2rem] bg-as-navy"
      style={{ padding: "5rem 2rem 6rem" }}
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text content */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.015em] text-as-snow sm:text-[3rem]">
              Take control of your
              <br />
              GLP-1 journey.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-as-snow/70">
              9 clinically dosed ingredients. One formula. Complete support for
              metabolism, energy, sleep, and recovery.
            </p>
            <Link
              href="/shop"
              className="group relative mt-8 inline-flex items-center gap-2 font-display text-base font-medium text-as-snow transition-colors hover:text-as-orange"
            >
              Shop AfterSlim
              <ArrowIcon />
              <span className="absolute -bottom-1 left-0 h-px w-[calc(100%-20px)] bg-current" />
            </Link>
          </m.div>

          {/* Right: bottle visual */}
          <m.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative">
              <BottleVisual size="hero" glowEffect />
              {/* Decorative glow behind bottle */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(208,133,48,0.2) 0%, transparent 60%)",
                }}
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
