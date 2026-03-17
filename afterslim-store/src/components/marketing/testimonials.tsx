"use client";

import { Star } from "lucide-react";
import * as m from "motion/react-client";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Seed-style testimonials — large heading, clean cards, generous padding
   --------------------------------------------------------------------------- */

const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    quote:
      "Since starting Mounjaro, my energy was completely gone. AfterSlim brought it back within the first week. I feel like myself again.",
    label: "Verified Buyer",
  },
  {
    id: "2",
    name: "James R.",
    rating: 5,
    quote:
      "I was taking 5 different supplements to manage my GLP-1 side effects. AfterSlim replaced all of them in one bottle. So much simpler.",
    label: "Verified Buyer",
  },
  {
    id: "3",
    name: "Maria L.",
    rating: 5,
    quote:
      "I finally sleep through the night again. The Magnesium and L-Theanine combo is incredible. I wake up feeling rested instead of exhausted.",
    label: "Verified Buyer",
  },
  {
    id: "4",
    name: "David K.",
    rating: 5,
    quote:
      "AfterSlim is worth every penny. My metabolism feels faster, my energy is back, and my skin looks healthier than it has in months.",
    label: "Verified Buyer",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-as-orange text-as-orange" : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section style={{ padding: "5rem 2rem 6rem" }}>
      <div className="mx-auto max-w-[90rem]">
        {/* Seed-style large heading */}
        <m.div
          className="mb-12 max-w-[700px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.015em] text-as-navy sm:text-[3rem]">
            Real results from real
            <br />
            people (and counting).
          </p>
          <p className="mt-4 text-base leading-relaxed text-as-navy/70">
            See how people on GLP-1 medications are transforming their
            experience with AfterSlim.
          </p>
        </m.div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, index) => (
            <m.div
              key={t.id}
              className="flex flex-col rounded-2xl border border-as-navy/10 bg-as-cream p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <StarRating rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-as-navy/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-as-navy/10 pt-4">
                <p className="font-display text-sm font-semibold text-as-navy">
                  {t.name}
                </p>
                <span className="text-xs font-medium text-as-orange">
                  {t.label}
                </span>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
