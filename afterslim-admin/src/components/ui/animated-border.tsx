"use client";

import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  /** Border gradient colors */
  colors?: string[];
  /** Animation duration in seconds */
  duration?: number;
  /** Border width in px */
  borderWidth?: number;
}

export function AnimatedBorder({
  children,
  className,
  colors = ["#0091CC", "#86ceff", "#007CB0", "#c8e6ff"],
  duration = 4,
  borderWidth = 1,
}: AnimatedBorderProps) {
  const gradient = colors.join(", ");

  return (
    <div className={cn("relative rounded-xl p-[1px]", className)}>
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: `conic-gradient(from var(--angle, 0deg), ${gradient})`,
          animation: `spin-border ${duration}s linear infinite`,
          padding: borderWidth,
        }}
      />
      {/* Static subtle border */}
      <div className="absolute inset-0 rounded-xl border border-border/40" />
      {/* Content */}
      <div className="relative rounded-xl bg-card">{children}</div>

      <style>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spin-border {
          to { --angle: 360deg; }
        }
      `}</style>
    </div>
  );
}
