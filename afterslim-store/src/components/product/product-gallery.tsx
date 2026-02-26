"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import * as m from "motion/react-client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

// ---------------------------------------------------------------------------
// Placeholder color palette for image slots
// ---------------------------------------------------------------------------

const PLACEHOLDER_GRADIENTS = [
  "from-[var(--color-brand-primary)]/15 to-[var(--color-brand-secondary)]/10",
  "from-[var(--color-brand-secondary)]/15 to-[var(--color-brand-primary)]/10",
  "from-emerald-500/15 to-teal-600/10",
  "from-amber-500/15 to-orange-400/10",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Use at least 4 placeholder slots even if images array is shorter
  const slots = images.length > 0 ? images : ["", "", "", ""];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <m.div
        key={activeIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br"
      >
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br",
            PLACEHOLDER_GRADIENTS[activeIndex % PLACEHOLDER_GRADIENTS.length]
          )}
        >
          <div className="text-center text-muted-foreground/50">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-background/60">
              <span className="text-2xl font-bold">AS</span>
            </div>
            <p className="text-sm">{productName}</p>
            <p className="mt-1 text-xs">Image {activeIndex + 1}</p>
          </div>
        </div>
      </m.div>

      {/* Thumbnail strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {slots.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative flex-shrink-0 aspect-square w-20 overflow-hidden rounded-lg bg-gradient-to-br transition-all duration-200",
              PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
              activeIndex === index
                ? "ring-2 ring-[var(--color-brand-primary)] ring-offset-2"
                : "opacity-60 hover:opacity-100"
            )}
          >
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground/50">
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
