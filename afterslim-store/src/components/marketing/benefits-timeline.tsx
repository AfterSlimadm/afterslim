"use client";

import { BENEFITS_TIMELINE } from "@/lib/constants";
import * as m from "motion/react-client";

export function BenefitsTimeline() {
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
            Feel the Difference
          </p>
          <h2 className="as-h2 mt-3 text-foreground">
            Results That Build Over Time
          </h2>
        </m.div>

        {/* Timeline */}
        <div className="mt-12">
          {/* Desktop: horizontal */}
          <div className="hidden sm:block">
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-[var(--color-as-peach)] via-[var(--color-as-orange)] to-[var(--color-as-peach)]" />

              <div className="grid grid-cols-4 gap-6">
                {BENEFITS_TIMELINE.map((milestone, index) => (
                  <m.div
                    key={milestone.period}
                    className="relative pt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    {/* Dot on line */}
                    <div className="absolute left-1/2 top-3 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[var(--color-as-orange)] bg-background">
                      <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-as-orange)]" />
                    </div>

                    {/* Period badge */}
                    <span className="inline-block rounded-full bg-[var(--color-as-orange)] px-3 py-1 text-xs font-bold text-white">
                      {milestone.period}
                    </span>

                    <h3 className="mt-3 text-sm font-display font-bold text-foreground">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {milestone.description}
                    </p>
                  </m.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="sm:hidden">
            <div className="relative ml-4 border-l-2 border-[var(--color-as-orange)]/30 pl-8">
              {BENEFITS_TIMELINE.map((milestone, index) => (
                <m.div
                  key={milestone.period}
                  className="relative pb-10 last:pb-0"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Dot */}
                  <div className="absolute -left-[calc(2rem+5px)] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--color-as-orange)] bg-background">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-as-orange)]" />
                  </div>

                  <span className="inline-block rounded-full bg-[var(--color-as-orange)] px-3 py-1 text-xs font-bold text-white">
                    {milestone.period}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}