"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, BadgeCheck } from "lucide-react";
import * as m from "motion/react-client";
import { AnimatePresence } from "motion/react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PURCHASE_NOTIFICATIONS = [
  { name: "Sarah M.", location: "Austin, TX", product: "Complete Bundle" },
  { name: "James R.", location: "Miami, FL", product: "Day Support" },
  { name: "Maria L.", location: "Portland, OR", product: "Night Support" },
  { name: "David K.", location: "Denver, CO", product: "Complete Bundle" },
  { name: "Emily W.", location: "Nashville, TN", product: "Day Support" },
  { name: "Michael C.", location: "San Diego, CA", product: "Night Support" },
  { name: "Jessica T.", location: "Seattle, WA", product: "Complete Bundle" },
  { name: "Robert H.", location: "Chicago, IL", product: "Day Support" },
] as const;

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const FIRST_DELAY_MS = 8_000;
const MIN_INTERVAL_MS = 15_000;
const MAX_INTERVAL_MS = 25_000;
const DISPLAY_DURATION_MS = 4_000;
const MAX_PER_SESSION = 5;
const SESSION_KEY = "afterslim_sp_count";

function isAllowedPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/shop") return true;
  return false;
}

function randomInterval(): number {
  return (
    MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)
  );
}

function getSessionCount(): number {
  try {
    return Number(sessionStorage.getItem(SESSION_KEY) ?? "0");
  } catch {
    return 0;
  }
}

function incrementSessionCount(): number {
  const next = getSessionCount() + 1;
  try {
    sessionStorage.setItem(SESSION_KEY, String(next));
  } catch {
    // sessionStorage unavailable
  }
  return next;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SocialProofToast() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<
    (typeof PURCHASE_NOTIFICATIONS)[number] | null
  >(null);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabVisibleRef = useRef(true);
  const mountedRef = useRef(true);
  const countRef = useRef(0);
  const isMobileRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showNext = useCallback(() => {
    if (!mountedRef.current || isMobileRef.current) return;
    if (countRef.current >= MAX_PER_SESSION) return;
    if (!tabVisibleRef.current) return;

    const notification =
      PURCHASE_NOTIFICATIONS[indexRef.current % PURCHASE_NOTIFICATIONS.length];
    indexRef.current += 1;
    countRef.current = incrementSessionCount();

    setCurrent(notification);
    setVisible(true);

    // Auto-hide after display duration
    hideTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setVisible(false);

      // Schedule next notification if under the cap
      if (countRef.current < MAX_PER_SESSION) {
        timerRef.current = setTimeout(() => {
          showNext();
        }, randomInterval());
      }
    }, DISPLAY_DURATION_MS);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    clearTimers();

    // Schedule next notification after a random interval
    if (countRef.current < MAX_PER_SESSION) {
      timerRef.current = setTimeout(() => {
        showNext();
      }, randomInterval());
    }
  }, [clearTimers, showNext]);

  useEffect(() => {
    mountedRef.current = true;
    countRef.current = getSessionCount();

    // Check if mobile (< 768px = md breakpoint)
    isMobileRef.current = window.matchMedia("(max-width: 767px)").matches;

    // Don't start if mobile, wrong path, or session cap reached
    if (isMobileRef.current) return;
    if (!isAllowedPath(pathname)) return;
    if (countRef.current >= MAX_PER_SESSION) return;

    // Visibility change handler
    function handleVisibility() {
      tabVisibleRef.current = document.visibilityState === "visible";

      if (!tabVisibleRef.current) {
        // Pause: clear pending timers
        clearTimers();
        setVisible(false);
      } else {
        // Resume: schedule next if still under cap
        if (
          countRef.current < MAX_PER_SESSION &&
          !timerRef.current &&
          !hideTimerRef.current
        ) {
          timerRef.current = setTimeout(() => {
            showNext();
          }, randomInterval());
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    // First notification after initial delay
    timerRef.current = setTimeout(() => {
      showNext();
    }, FIRST_DELAY_MS);

    return () => {
      mountedRef.current = false;
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname, clearTimers, showNext]);

  // Don't render anything on non-allowed paths or mobile
  if (!isAllowedPath(pathname)) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-20 left-4 z-40 hidden md:block"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {visible && current && (
          <m.div
            key={current.name + current.product}
            className="pointer-events-auto flex w-[320px] items-start gap-3 rounded-lg border border-border/60 bg-white p-3.5 shadow-md"
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">
                {current.name} from{" "}
                <span className="text-muted-foreground">{current.location}</span>{" "}
                just purchased{" "}
                <span className="font-semibold">{current.product}</span>
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                <BadgeCheck className="size-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-600">
                  Verified Purchase
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={dismiss}
              className="mt-0.5 flex-shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
