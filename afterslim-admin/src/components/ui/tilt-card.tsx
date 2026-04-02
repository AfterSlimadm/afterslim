"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees */
  maxTilt?: number;
  /** Glow color */
  glowColor?: string;
}

export function TiltCard({
  children,
  className,
  maxTilt = 6,
  glowColor = "rgba(0, 145, 204, 0.08)",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
    glowX.set(mouseX);
    glowY.set(mouseY);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-xl transition-shadow duration-300",
        isHovered && "shadow-[0_20px_40px_-12px_rgba(0,145,204,0.12)]",
        className
      )}
    >
      {/* Glow follower */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl"
          style={{
            background: `radial-gradient(280px circle at ${glowX.get()}px ${glowY.get()}px, ${glowColor}, transparent 60%)`,
          }}
        />
      )}
      <div className="relative" style={{ transform: "translateZ(0)" }}>
        {children}
      </div>
    </motion.div>
  );
}
