"use client";

import { Zap, Heart, Sparkles, Moon } from "lucide-react";
import * as m from "motion/react-client";

const SYMPTOMS = [
  {
    icon: Zap,
    symptom: "Low Energy & Fatigue",
    solution: "Day Support restores your energy",
    description:
      "GLP-1 medications can leave you drained. Our Day formula delivers sustained energy with B-vitamins, iron, and adaptogenic herbs. No crash, no jitters.",
    product: "Day Support",
  },
  {
    icon: Heart,
    symptom: "Digestive Issues",
    solution: "Day Support soothes your gut",
    description:
      "Nausea, bloating, and constipation are common side effects. Our gut-health blend with probiotics, ginger, and digestive enzymes helps you feel comfortable again.",
    product: "Day Support",
  },
  {
    icon: Sparkles,
    symptom: "Hair Loss & Thinning",
    solution: "Night Support strengthens from within",
    description:
      "Rapid weight loss can trigger hair shedding. Biotin, collagen peptides, and zinc in our Night formula nourish follicles and promote healthy growth.",
    product: "Night Support",
  },
  {
    icon: Moon,
    symptom: "Poor Sleep & Recovery",
    solution: "Night Support helps you rest & repair",
    description:
      "Your body needs deep rest to recover during weight loss. Magnesium, L-theanine, and melatonin support restorative sleep so you wake up refreshed.",
    product: "Night Support",
  },
];

export function SymptomsSection() {
  return (
    <section id="symptoms" className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary/70">
            Formulated for GLP-1 Side Effects
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Body Deserves Better Support
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Weight loss medications are powerful, but they come with side
            effects. AfterSlim addresses the four most common challenges so you
            can focus on your results.
          </p>
        </m.div>

        {/* Symptoms grid — compact on mobile, full on desktop */}
        <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {SYMPTOMS.map((item, index) => (
            <m.div
              key={item.symptom}
              className="group relative rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 sm:rounded-2xl sm:p-8 sm:hover:shadow-md"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Mobile: horizontal compact layout */}
              <div className="flex items-start gap-3 sm:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl">
                  <item.icon className="size-5 sm:size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-destructive/80 sm:text-sm">
                    {item.symptom}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-foreground sm:mt-2 sm:text-xl">
                    {item.solution}
                  </h3>
                  {/* Description — hidden on mobile */}
                  <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                    {item.description}
                  </p>
                  <div className="mt-2 sm:mt-5">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary sm:px-3 sm:py-1 sm:text-xs">
                      {item.product}
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
