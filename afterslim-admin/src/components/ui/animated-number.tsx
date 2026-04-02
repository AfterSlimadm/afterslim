"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  /** Format function (e.g. formatCurrency) */
  format?: (n: number) => string;
  /** Spring stiffness (default 100) */
  stiffness?: number;
  /** Spring damping (default 30) */
  damping?: number;
}

export function AnimatedNumber({
  value,
  className,
  format,
  stiffness = 100,
  damping = 30,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness, damping });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest);
        ref.current.textContent = format ? format(rounded) : rounded.toString();
      }
    });
    return unsubscribe;
  }, [springValue, format]);

  return <span ref={ref} className={className} />;
}
