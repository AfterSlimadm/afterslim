"use client";

import Link from "next/link";
import { ArrowRight, Stethoscope, ShieldCheck, Flag, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRUST_INDICATORS } from "@/lib/constants";
import * as m from "motion/react-client";

const ICON_MAP = { Stethoscope, ShieldCheck, Flag, RotateCcw } as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Radial gradient background — premium navy */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 120% at 75% 50%, rgba(30,40,100,0.9) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 20% 80%, rgba(25,30,80,0.8) 0%, transparent 50%),
            radial-gradient(ellipse 80% 80% at 50% 20%, rgba(40,50,120,0.6) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 80% 70%, rgba(50,60,140,0.4) 0%, transparent 40%),
            linear-gradient(135deg, #0a0e24 0%, #111838 30%, #0d1230 60%, #080c1e 100%)
          `,
        }}
      />

      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              Designed for GLP-1 Users
            </span>
          </m.div>

          {/* Headline */}
          <m.h1
            className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Support Your Body{" "}
            <br className="hidden sm:block" />
            on Your{" "}
            <span className="text-[var(--color-brand-secondary-light)]">
              GLP-1 Journey
            </span>
          </m.h1>

          {/* Subheadline */}
          <m.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Comprehensive Day &amp; Night nutrition designed for people on
            weight loss medications. Restore energy, protect your hair, and
            feel your best.
          </m.p>

          {/* CTAs */}
          <m.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
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
                Shop the Bundle
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="#symptoms">Learn More</Link>
            </Button>
          </m.div>

          {/* Trust indicators */}
          <m.div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {TRUST_INDICATORS.map((item) => {
              const Icon = ICON_MAP[item.iconName];
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-white/70"
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </m.div>
        </div>
      </div>
    </section>
  );
}