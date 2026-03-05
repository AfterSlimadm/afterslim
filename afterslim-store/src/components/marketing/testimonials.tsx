"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as m from "motion/react-client";
import { cn } from "@/lib/utils";

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
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real results from real people on GLP-1 medications. From 2,000+
            verified reviews.
          </p>
        </m.div>

        {/* Testimonials grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <m.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                  <StarRating rating={testimonial.rating} />

                  <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <span className="text-xs font-medium text-[var(--color-brand-accent)]">
                      {testimonial.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}