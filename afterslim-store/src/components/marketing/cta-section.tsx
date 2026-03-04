"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as m from "motion/react-client";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)]" />

      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Thrive on Your GLP-1?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands who support their bodies with AfterSlim Day &amp;
            Night. Comprehensive nutrition designed for your weight loss
            medication journey.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[var(--color-brand-secondary)] px-8 text-base font-semibold text-[var(--color-brand-primary-dark)] hover:bg-[var(--color-brand-secondary-light)]"
              asChild
            >
              <Link href="/shop">
                Get the Bundle - Save 15%
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </m.div>
      </div>
    </section>
  );
}
