"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BottleVisual } from "@/components/product/bottle-visual";
import * as m from "motion/react-client";

/* ---------------------------------------------------------------------------
   Arrow icon (Seed-style) — small inline SVG
   --------------------------------------------------------------------------- */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      fill="none"
      viewBox="0 0 11 11"
      className={className}
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

/* ---------------------------------------------------------------------------
   Hero Section — Seed-style full-height dark hero with rounded bottom
   --------------------------------------------------------------------------- */
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-as-navy"
      style={{
        height: "min(calc(100vh - 3rem), 900px)",
        marginTop: "calc(var(--nav-height, 3rem) * -1)",
      }}
    >
      {/* Rounded bottom overlay */}
      <div className="pointer-events-none absolute inset-0 z-[3] rounded-b-[2rem] ring-1 ring-inset ring-white/[0.04]" />

      {/* Content container */}
      <div className="relative z-10 flex h-full w-full items-center">
        <div className="mx-auto flex h-full w-full max-w-[90rem] items-center px-4 pt-16 sm:px-8 lg:px-14">
          {/* Left: text content */}
          <m.div
            className="relative z-10 max-w-[750px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Product label + brand (Seed-style) */}
            <m.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center rounded-full border border-as-snow/30 px-2.5 py-1 font-display text-xs font-medium tracking-tight text-as-snow">
                AS-01
              </span>
              <span className="font-display text-xl font-medium tracking-tight text-as-snow sm:text-2xl">
                AfterSlim
              </span>
            </m.div>

            {/* Headline — Seed uses 48px/350fw, we use Satoshi 700 */}
            <m.h1
              className="mt-5 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.025em] text-as-snow sm:text-[3rem]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Feel better on your
              <br />
              <span className="text-as-orange-bright">GLP-1 journey.</span>
            </m.h1>

            {/* Description — Seed: 16px, max-w 426px */}
            <m.p
              className="mt-4 max-w-[426px] text-base leading-[1.3] tracking-[-0.01em] text-as-snow/80"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              9 science-backed ingredients in one formula. Metabolism, energy,
              sleep, and recovery support for people on Ozempic, Wegovy, and
              Mounjaro.*
            </m.p>

            {/* CTAs — Seed: small pill button + text link with arrow */}
            <m.div
              className="mt-6 flex items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {/* Primary CTA — Seed-style small pill (not giant) */}
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-as-orange px-5 py-2.5 font-display text-sm font-medium tracking-tight text-as-snow transition-all duration-300 hover:bg-as-orange-bright"
              >
                Shop Now
                <span className="inline-flex w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100 group-hover:ml-1">
                  <ArrowIcon />
                </span>
              </Link>

              {/* Text link — Seed-style with underline ::after */}
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-2 font-display text-base font-medium capitalize tracking-tight text-as-snow transition-colors hover:text-as-orange"
              >
                See the Science
                <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
                <span className="absolute -bottom-1 left-0 h-px w-[calc(100%-20px)] bg-current" />
              </Link>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* Right: bottle visual — positioned absolute for Seed-like layout */}
      <m.div
        className="pointer-events-none absolute right-[5%] top-1/2 z-[5] -translate-y-1/2 lg:right-[8%]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <BottleVisual size="hero" animated glowEffect />
      </m.div>

      {/* Bottom gradient overlay (Seed pattern) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[40%]"
        style={{
          background:
            "linear-gradient(to top, rgba(13,27,42,0.6), transparent)",
        }}
      />

      {/* Decorative orange radial glow (Seed pattern) */}
      <div
        className="pointer-events-none absolute right-[10%] top-[20%] z-[1] h-[300px] w-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(208,133,48,0.15) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
