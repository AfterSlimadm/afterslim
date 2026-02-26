"use client";

import Link from "next/link";
import { ArrowRight, Shield, Flag, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as m from "motion/react-client";

const trustIndicators = [
  { icon: Shield, label: "GMP Certified" },
  { icon: Flag, label: "Made in USA" },
  { icon: RotateCcw, label: "30-Day Guarantee" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-primary-dark)] to-[#0f3d2b]" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="max-w-2xl">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                Premium US Supplements
              </span>
            </m.div>

            <m.h1
              className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Transform Your{" "}
              <span className="text-[var(--color-brand-secondary-light)]">
                Health
              </span>{" "}
              Journey
            </m.h1>

            <m.p
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/80"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Science-backed formulas crafted with premium natural ingredients.
              Achieve your wellness goals with supplements you can trust.
            </m.p>

            <m.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Button
                size="lg"
                className="h-12 rounded-full bg-[var(--color-brand-secondary)] px-8 text-base font-semibold text-[var(--color-brand-primary-dark)] hover:bg-[var(--color-brand-secondary-light)]"
                asChild
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </m.div>

            {/* Trust indicators */}
            <m.div
              className="mt-12 flex flex-wrap items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {trustIndicators.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-white/70"
                >
                  <item.icon className="size-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </m.div>
          </div>

          {/* Image placeholder */}
          <m.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-1 backdrop-blur-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-[var(--color-brand-primary-light)]/20 to-transparent">
                <div className="text-center text-white/50">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <span className="text-3xl font-bold">AS</span>
                  </div>
                  <p className="text-sm">Product Hero Image</p>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
