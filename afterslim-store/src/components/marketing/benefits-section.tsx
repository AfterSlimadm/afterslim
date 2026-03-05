"use client";

import { Flame, Zap, Moon, Heart } from "lucide-react";
import * as m from "motion/react-client";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  solution: string;
  description: string;
  color: string;
  bgColor: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Flame,
    title: "Metabolism",
    solution: "Activate your body's fat-burning engine",
    description:
      "Berberine activates AMPK, the same enzyme triggered by exercise. Combined with Chromium and Alpha Lipoic Acid, AfterSlim helps your body metabolize efficiently even during caloric restriction.",
    color: "text-[var(--color-brand-accent)]",
    bgColor: "bg-[var(--color-brand-accent-subtle)]",
  },
  {
    icon: Zap,
    title: "Energy",
    solution: "Sustained energy without the crash",
    description:
      "GLP-1 medications can leave you drained. Vitamin B12 and Alpha Lipoic Acid support cellular energy production, keeping you alert and focused throughout the day.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Moon,
    title: "Sleep",
    solution: "Deep, restorative rest every night",
    description:
      "Your body needs quality sleep to recover during weight loss. Magnesium Glycinate and L-Theanine calm the mind and promote deep sleep so you wake up refreshed.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Heart,
    title: "Recovery",
    solution: "Support your body's natural healing",
    description:
      "Vitamin D3, Zinc, and BioPerine work together to strengthen immunity, support skin health, and enhance nutrient absorption during rapid weight change.",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-accent)]">
            One Formula. Four Pillars.
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything Your Body Needs on GLP-1
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Weight loss medications are powerful, but they come with challenges.
            AfterSlim addresses the four key areas so you can focus on your
            results.
          </p>
        </m.div>

        {/* Pillars grid */}
        <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <m.div
                key={pillar.title}
                className="group relative rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 sm:rounded-2xl sm:p-8 sm:hover:shadow-md"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3 sm:block">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${pillar.bgColor} ${pillar.color} sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl`}
                  >
                    <Icon className="size-5 sm:size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide ${pillar.color} sm:text-sm`}
                    >
                      {pillar.title}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-foreground sm:mt-2 sm:text-xl">
                      {pillar.solution}
                    </h3>
                    <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                      {pillar.description}
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