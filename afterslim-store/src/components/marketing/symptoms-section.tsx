"use client";

import { Zap, Heart, Sparkles, Moon } from "lucide-react";
import * as m from "motion/react-client";

const SYMPTOMS = [
  {
    icon: Zap,
    symptom: "Low Energy & Fatigue",
    solution: "Day Support restores your energy",
    description:
      "GLP-1 medications can leave you drained. Our Day formula delivers sustained energy with B-vitamins, iron, and adaptogenic herbs — no crash, no jitters.",
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
    <section id="symptoms" className="py-20 sm:py-24">
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
            Weight loss medications are powerful — but they come with side
            effects. AfterSlim addresses the four most common challenges so you
            can focus on your results.
          </p>
        </m.div>

        {/* Symptoms grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {SYMPTOMS.map((item, index) => (
            <m.div
              key={item.symptom}
              className="group relative rounded-2xl border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="size-6" />
              </div>

              {/* Symptom label */}
              <p className="text-sm font-semibold uppercase tracking-wide text-destructive/80">
                {item.symptom}
              </p>

              {/* Solution */}
              <h3 className="mt-2 text-xl font-bold text-foreground">
                {item.solution}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {/* Product tag */}
              <div className="mt-5">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {item.product}
                </span>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
