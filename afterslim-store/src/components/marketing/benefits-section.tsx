"use client";

import { Flame, Zap, Moon, Heart } from "lucide-react";
import * as m from "motion/react-client";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
   Seed-style feature/benefits section
   Snow bg, rounded-top-[2rem] (overlaps dark section above), 80px padding
   Split layout: left text + CTA, right 2x2 pillar grid
   --------------------------------------------------------------------------- */

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Flame,
    title: "Metabolism",
    description:
      "Berberine activates AMPK, the same enzyme triggered by exercise. Combined with Chromium and Alpha Lipoic Acid for metabolic support.",
  },
  {
    icon: Zap,
    title: "Energy",
    description:
      "Vitamin B12 and Alpha Lipoic Acid support cellular energy production. Sustained focus without crashes or jitters.",
  },
  {
    icon: Moon,
    title: "Sleep",
    description:
      "Magnesium Glycinate and L-Theanine promote deep, restorative sleep. Your body needs quality rest during weight loss.",
  },
  {
    icon: Heart,
    title: "Recovery",
    description:
      "Vitamin D3, Zinc, and BioPerine strengthen immunity and enhance nutrient absorption during rapid weight change.",
  },
];

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

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="rounded-t-[2rem] bg-as-snow"
      style={{ padding: "5rem 2rem" }}
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text + CTA */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-as-orange-glow px-2.5 py-1.5 font-display text-xs font-medium text-as-navy">
              One Formula. Four Pillars.
            </span>
            <p className="mt-4 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.01em] text-as-navy sm:text-[2.5rem]">
              Everything your body needs on GLP-1 therapy.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-as-navy/70">
              Weight loss medications are powerful, but they come with
              challenges. AfterSlim addresses the four key areas so you can
              focus on your results.
            </p>
            <Link
              href="/shop"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-as-navy px-5 py-2.5 font-display text-sm font-medium text-as-snow transition-colors hover:bg-as-navy-mid"
            >
              Shop AfterSlim
              <span className="inline-flex w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100">
                <ArrowIcon />
              </span>
            </Link>
          </m.div>

          {/* Right: 2x2 pillar grid */}
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <m.div
                  key={pillar.title}
                  className="rounded-2xl bg-as-cream p-5 sm:p-6"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-as-peach">
                    <Icon className="size-5 text-as-orange" />
                  </div>
                  <p className="font-display text-base font-bold tracking-tight text-as-navy sm:text-lg">
                    {pillar.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-as-navy/60">
                    {pillar.description}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
