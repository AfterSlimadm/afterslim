"use client";

import Link from "next/link";
import {
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  Flag,
  RotateCcw,
  Star,
} from "lucide-react";
import { BottleVisual } from "@/components/product/bottle-visual";
import { Button } from "@/components/ui/button";
import { TRUST_INDICATORS } from "@/lib/constants";
import * as m from "motion/react-client";

const ICON_MAP = { Stethoscope, ShieldCheck, Flag, RotateCcw } as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#faf8f5] to-[#f5f0ea]">
      {/* Subtle warm radial accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 60%, oklch(0.72 0.18 55 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="mb-6 inline-block rounded-full bg-[var(--color-brand-accent)]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-accent-dark)]">
                Powered by Berberine
              </span>
            </m.div>

            {/* Headline */}
            <m.h1
              className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[var(--color-brand-primary)] sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              Feel Better on Your{" "}
              <span className="text-[var(--color-brand-accent-dark)]">
                GLP-1 Journey
              </span>
            </m.h1>

            {/* Subheadline */}
            <m.p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              Metabolism. Energy. Sleep. Recovery. One formula, 120 capsules,
              designed for people on Ozempic, Mounjaro, and Wegovy.
            </m.p>

            {/* Stars / Social proof */}
            <m.div
              className="mt-6 flex items-center justify-center gap-1 lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]"
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                4.8 from 2,000+ reviews
              </span>
            </m.div>

            {/* CTAs */}
            <m.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Button
                size="lg"
                className="h-12 rounded-full bg-[var(--color-brand-accent)] px-8 text-base font-semibold text-white shadow-lg shadow-[var(--color-brand-accent)]/20 hover:bg-[var(--color-brand-accent-dark)]"
                asChild
              >
                <Link href="/shop">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-8 text-base font-semibold"
                asChild
              >
                <Link href="/about">See the Science</Link>
              </Button>
            </m.div>

            {/* Trust indicators */}
            <m.div
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {TRUST_INDICATORS.map((item) => {
                const Icon = ICON_MAP[item.iconName];
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 text-muted-foreground"
                  >
                    <Icon className="size-4 text-[var(--color-brand-accent)]" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                );
              })}
            </m.div>
          </div>

          {/* Right: SVG bottle */}
          <div className="relative flex items-center justify-center">
            <BottleVisual
              size="hero"
              animated
              glowEffect
            />
          </div>
        </div>
      </div>
    </section>
  );
}
