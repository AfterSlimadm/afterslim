"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
  fillColor?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
  /** Animate on enter */
  animate?: boolean;
}

export function Sparkline({
  data,
  className,
  color = "#0091CC",
  fillColor,
  height = 40,
  width = 120,
  strokeWidth = 2,
  animate = true,
}: SparklineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (val - min) / range) * (height - padding * 2),
  }));

  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) / 3;
      const cpx2 = prev.x + (2 * (p.x - prev.x)) / 3;
      return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const defaultFill = fillColor || `${color}15`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      width={width}
      height={height}
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sparkline-fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <motion.path
        d={fillD}
        fill={`url(#sparkline-fill-${color.replace("#", "")})`}
        initial={animate ? { opacity: 0 } : {}}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* End dot */}
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={color}
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
      />
    </svg>
  );
}
