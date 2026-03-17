"use client";

import Link from "next/link";
import { Zap, Heart, BookOpen, ArrowUpRight } from "lucide-react";
import * as m from "motion/react-client";

/* ---------------------------------------------------------------------------
   Seed-style technology/science section
   Full-width with large padding, split layout
   Left: stats + text, Right: visual element
   --------------------------------------------------------------------------- */

const STATS = [
  { icon: Zap, label: "Activates AMPK", value: "1,200mg" },
  { icon: Heart, label: "Supports GLP-1", value: "Natural" },
  { icon: BookOpen, label: "Clinical Studies", value: "2,000+" },
  { icon: ArrowUpRight, label: "BioPerine Boost", value: "2x" },
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

export function BerberineSection() {
  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div className="mx-auto max-w-[90rem]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text + stats */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-as-navy/20 px-2.5 py-1 font-display text-xs font-medium text-as-navy">
                AS-01
              </span>
              <span className="font-display text-sm font-medium tracking-tight text-as-navy/60">
                Hero Ingredient
              </span>
            </div>

            <p className="mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.015em] text-as-navy sm:text-[3rem]">
              Why Berberine?
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-as-navy/70">
              Berberine is a bioactive compound found in several plants. Clinical
              studies show it activates AMPK, the same enzyme activated by
              exercise. It supports natural GLP-1 production, helping maintain
              satiety and metabolic balance.
            </p>

            {/* Stats row — Seed style: inline stat + label */}
            <div className="mt-8 flex flex-wrap gap-6">
              {STATS.map((stat) => (
                <m.div
                  key={stat.label}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-as-peach">
                    <stat.icon className="size-5 text-as-orange" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-medium uppercase tracking-wider text-as-orange">
                      {stat.value}
                    </p>
                    <p className="text-xs text-as-navy/60">{stat.label}</p>
                  </div>
                </m.div>
              ))}
            </div>

            <Link
              href="/about"
              className="group relative mt-8 inline-flex items-center gap-2 font-display text-base font-medium text-as-navy transition-colors hover:text-as-orange"
            >
              Read the Full Science
              <ArrowIcon />
              <span className="absolute -bottom-1 left-0 h-px w-[calc(100%-20px)] bg-current" />
            </Link>
          </m.div>

          {/* Right: visual — large stat display */}
          <m.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative flex h-80 w-80 items-center justify-center rounded-[2rem] bg-as-navy sm:h-96 sm:w-96">
              {/* Decorative radial */}
              <div
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(208,133,48,0.2) 0%, transparent 60%)",
                }}
              />
              {/* Center content */}
              <div className="relative text-center">
                <p className="font-display text-6xl font-bold tracking-tight text-as-orange sm:text-7xl">
                  BBR
                </p>
                <p className="mt-2 font-display text-lg font-medium text-as-snow">
                  Berberine HCl
                </p>
                <p className="mt-1 font-mono text-sm uppercase tracking-wider text-as-snow/60">
                  1,200 mg per serving
                </p>
              </div>
              {/* Glow pulse */}
              <div className="absolute inset-0 animate-[as-glow-pulse_3s_ease-in-out_infinite] rounded-[2rem]" />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
