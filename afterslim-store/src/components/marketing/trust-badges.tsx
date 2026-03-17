"use client";

import { Stethoscope, ShieldCheck, Flag, RotateCcw } from "lucide-react";
import { TRUST_INDICATORS } from "@/lib/constants";
import * as m from "motion/react-client";

/* ---------------------------------------------------------------------------
   Seed-style trust bar — minimal horizontal strip below hero
   Subtle cream bg, inline icon + text, generous spacing
   --------------------------------------------------------------------------- */

const ICON_MAP = { Stethoscope, ShieldCheck, Flag, RotateCcw } as const;

export function TrustBadges() {
  return (
    <section style={{ padding: "2.5rem 2rem" }} className="bg-as-cream">
      <m.div
        className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-10 gap-y-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
      >
        {TRUST_INDICATORS.map((item) => {
          const Icon = ICON_MAP[item.iconName];
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-as-peach">
                <Icon className="size-4 text-as-orange" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight text-as-navy">
                  {item.label}
                </p>
                <p className="text-xs text-as-navy/50">{item.description}</p>
              </div>
            </div>
          );
        })}
      </m.div>
    </section>
  );
}
