"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  /** Format function (e.g. currency, percentage) */
  format?: (n: number) => string;
  className?: string;
  /** Duration in seconds */
  duration?: number;
  /** Delay before starting */
  delay?: number;
}

export function CountUp({
  value,
  format = (n) => n.toLocaleString(),
  className,
  duration = 1.5,
  delay = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(format(Math.round(latest)));
    });
    return unsubscribe;
  }, [springValue, format]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      {display}
    </motion.span>
  );
}
