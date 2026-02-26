"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as m from "motion/react-client";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Placeholder testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    quote:
      "I've tried so many supplements before, but the Slim Starter Kit is the real deal. I've lost 15 lbs in two months and feel more energetic than ever. The quality is outstanding.",
    product: "Slim Starter Kit",
    verified: true,
  },
  {
    id: "2",
    name: "James R.",
    rating: 5,
    quote:
      "The Complete Wellness Kit has been a game-changer for my daily routine. My immunity has never been better, and the subscribe & save option makes it so convenient.",
    product: "Complete Wellness Kit",
    verified: true,
  },
  {
    id: "3",
    name: "Maria L.",
    rating: 5,
    quote:
      "I was skeptical at first, but the Vitality Boost Kit exceeded my expectations. My focus is sharper, my energy is steady throughout the day, and the ingredients are clean.",
    product: "Vitality Boost Kit",
    verified: true,
  },
  {
    id: "4",
    name: "David K.",
    rating: 4,
    quote:
      "Great quality supplements at fair prices. Free shipping over $99 is a nice touch. Customer service was also very responsive when I had a question about dosage.",
    product: "Slim Starter Kit",
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
            Real results from real people. See why thousands trust AfterSlim for
            their health journey.
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
