"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import * as m from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ---------------------------------------------------------------------------
   Seed-style announcement bar — orange-glow bg (#ffd699), navy text
   Height: 2.5rem (40px), font-display 14px, centered link
   --------------------------------------------------------------------------- */

const ANNOUNCEMENTS = [
  {
    id: "free-shipping",
    text: "Free Shipping on 2+ Bottles. Subscribe & Save up to 30%.",
    href: "/shop",
  },
  {
    id: "berberine",
    text: "Clinically Dosed Berberine HCl. 9 Science-Backed Ingredients.",
    href: "/about",
  },
  {
    id: "guarantee",
    text: "60-Day Money-Back Guarantee. Try Risk-Free.",
    href: "/shop",
  },
] as const;

const STORAGE_KEY = "afterslim-announcement-dismissed";
const ROTATION_INTERVAL = 4000;

export function AnnouncementBar({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [index, setIndex] = useState(0);
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setDismissed(stored === "true");
  }, []);

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

  if (dismissed === null || dismissed) return null;

  const current = ANNOUNCEMENTS[index];

  return (
    <div
      className={cn(
        "relative z-50 flex h-10 w-full items-center justify-center bg-as-orange-glow px-10",
        className,
      )}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      {/* Rotating message — Seed style: centered link, display font, 14px */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Link
              href={current.href}
              className="font-display text-sm font-medium tracking-[-0.035px] text-as-navy transition-colors hover:text-as-navy/70"
            >
              {current.text} ➞
            </Link>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-as-navy/50 transition-colors hover:text-as-navy sm:right-3"
      >
        <X className="size-3.5 sm:size-4" />
      </button>
    </div>
  );
}
