"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  /** Glow color in CSS format */
  glowColor?: string;
  /** Glow radius in px (default 200) */
  glowRadius?: number;
}

export function GlowingCard({
  children,
  className,
  glowColor = "rgba(0, 145, 204, 0.12)",
  glowRadius = 200,
}: GlowingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowRadius}px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 60%)`,
        }}
      />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
