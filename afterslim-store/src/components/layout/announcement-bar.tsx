"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Truck, Percent, ShieldCheck, X } from "lucide-react";
import * as m from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Announcement messages with associated icons
// ---------------------------------------------------------------------------

const ANNOUNCEMENTS = [
  {
    id: "free-shipping",
    text: "Free Shipping on 3+ Bottles",
    Icon: Truck,
  },
  {
    id: "subscribe-save",
    text: "Subscribe & Save up to 30%",
    Icon: Percent,
  },
  {
    id: "money-back",
    text: "60-Day Money-Back Guarantee",
    Icon: ShieldCheck,
  },
] as const;

const STORAGE_KEY = "afterslim-announcement-dismissed";
const ROTATION_INTERVAL = 4000;

// ---------------------------------------------------------------------------
// AnnouncementBar
// ---------------------------------------------------------------------------

export function AnnouncementBar({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [index, setIndex] = useState(0);
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate dismissed state from localStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setDismissed(stored === "true");
  }, []);

  // Auto-rotate messages
  const startRotation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
      }
    }, ROTATION_INTERVAL);
  }, []);

  useEffect(() => {
    startRotation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startRotation]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  // Wait for hydration before rendering (avoids flash)
  if (dismissed === null || dismissed) return null;

  const current = ANNOUNCEMENTS[index];

  return (
    <div
      className={cn(
        "relative z-50 flex h-9 w-full items-center justify-center bg-[var(--color-brand-primary)] px-10 text-white sm:h-10",
        className,
      )}
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      {/* Rotating message */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute flex items-center gap-2 text-xs font-medium sm:text-sm"
          >
            <current.Icon className="size-3.5 shrink-0 sm:size-4" />
            <span>{current.text}</span>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:right-3"
      >
        <X className="size-3.5 sm:size-4" />
      </button>
    </div>
  );
}
