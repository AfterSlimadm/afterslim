"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as m from "motion/react-client";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// GLP-1 relevant testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    quote:
      "Since starting Mounjaro, my hair was falling out in clumps. AfterSlim Night changed everything — my hair feels thicker and stronger after just 6 weeks.",
    product: "AfterSlim Night Support",
    verified: true,
  },
  {
    id: "2",
    name: "James R.",
    rating: 5,
    quote:
      "The nausea was unbearable until I found AfterSlim Day Support. Within days my stomach settled and I could actually eat without discomfort.",
    product: "AfterSlim Day Support",
    verified: true,
  },
  {
    id: "3",
    name: "Maria L.",
    rating: 5,
    quote:
      "I finally sleep through the night again. Game changer. I wake up feeling rested instead of exhausted. Night Support is now a non-negotiable for me.",
    product: "AfterSlim Night Support",
    verified: true,
  },
  {
    id: "4",
    name: "David K.",
    rating: 5,
    quote:
      "Day & Night bundle is worth every penny. My energy is back, my gut feels great, and my skin looks healthier than it has in months.",
    product: "Complete Bundle",
    verified: true,
  },
];

// ---------------------------------------------------------------------------
// Star Rating
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
            Real results from real people on GLP-1 medications. See why
            thousands trust AfterSlim for their wellness journey.
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
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {testimonial.product}
                      </p>
                      {testimonial.verified && (
                        <span className="text-xs font-medium text-primary">
                          Verified Buyer
                        </span>
                      )}
                    </div>
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
