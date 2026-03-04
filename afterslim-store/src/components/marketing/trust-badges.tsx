"use client";

import { Stethoscope, ShieldCheck, Flag, RotateCcw } from "lucide-react";
import { TRUST_INDICATORS } from "@/lib/constants";
import * as m from "motion/react-client";

const ICON_MAP = { Stethoscope, ShieldCheck, Flag, RotateCcw } as const;

export function TrustBadges() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {TRUST_INDICATORS.map((item, index) => {
            const Icon = ICON_MAP[item.iconName];
            return (
              <m.div
                key={item.label}
                className="flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
