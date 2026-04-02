"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child */
  staggerDelay?: number;
  /** Initial delay before first item */
  initialDelay?: number;
  /** Animation direction */
  direction?: "up" | "down" | "left" | "right";
}

const directionMap = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.08,
  initialDelay = 0,
  direction = "up",
}: StaggerRevealProps) {
  const offset = directionMap[direction];

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 24,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
