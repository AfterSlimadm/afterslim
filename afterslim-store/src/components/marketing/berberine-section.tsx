"use client";

import Link from "next/link";
import { Zap, Heart, BookOpen, ArrowUpRight, ArrowRight } from "lucide-react";
import * as m from "motion/react-client";

const STATS = [
  { icon: Zap, label: "Activates AMPK" },
  { icon: Heart, label: "Supports GLP-1" },
  { icon: BookOpen, label: "2,000+ Studies" },
  { icon: ArrowUpRight, label: "2x Absorption" },
];

export function BerberineSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-accent)]">
              The Hero Ingredient
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Berberine?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Berberine is a bioactive compound found in several plants.
              Clinical studies show it activates AMPK, the same enzyme
              activated by exercise. It supports natural GLP-1 production,
              helping maintain satiety and metabolic balance. Combined with
              BioPerine for 2x absorption.
            </p>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-accent-subtle)]">
                    <stat.icon className="size-5 text-[var(--color-brand-accent)]" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-accent)] hover:underline"
            >
              Read the Full Science
              <ArrowRight className="size-4" />
            </Link>
          </m.div>

          {/* Visual */}
          <m.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
              {/* Decorative circle */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-bottle-top), var(--color-bottle-bottom))",
                  opacity: 0.15,
                }}
              />
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-bottle-top), var(--color-bottle-bottom))",
                  opacity: 0.1,
                }}
              />
              {/* Center text */}
              <div className="relative text-center">
                <p className="text-5xl font-bold text-[var(--color-brand-accent)]">
                  BBR
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Berberine HCl
                </p>
                <p className="text-xs text-muted-foreground">1,200 mg</p>
              </div>
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, var(--color-brand-accent) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}