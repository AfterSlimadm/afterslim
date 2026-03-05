"use client";

import * as m from "motion/react-client";
import { cn } from "@/lib/utils";

type BottleCount = 1 | 3 | 6;
type BottleSize = "sm" | "md" | "lg" | "xl" | "2xl" | "hero";

interface BottleVisualProps {
  count?: BottleCount;
  size?: BottleSize;
  animated?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const sizeMap: Record<BottleSize, string> = {
  sm: "h-28",
  md: "h-44",
  lg: "h-64",
  xl: "h-80",
  "2xl": "h-96",
  hero: "h-[28rem]",
};

/* ────────────────────────────────────────────────────────────────────────────
 * SingleBottle — SVG detalhado do frasco AfterSlim Berberina
 * Baseado no design real: gradiente amarelo→laranja, tampa branca,
 * 4 icones de beneficio, 120 capsulas.
 * ──────────────────────────────────────────────────────────────────────────── */

function SingleBottle({ id = "bottle" }: { id?: string }) {
  return (
    <svg
      viewBox="0 0 240 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      role="img"
      aria-label="AfterSlim supplement bottle"
    >
      <defs>
        {/* Body gradient: golden yellow → deep warm orange */}
        <linearGradient
          id={`${id}-body`}
          x1="120"
          y1="58"
          x2="120"
          y2="438"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f5d050" />
          <stop offset="15%" stopColor="#edba38" />
          <stop offset="38%" stopColor="#e09828" />
          <stop offset="62%" stopColor="#d07822" />
          <stop offset="82%" stopColor="#c4641c" />
          <stop offset="100%" stopColor="#b85818" />
        </linearGradient>

        {/* Radial glow — bright center highlight */}
        <radialGradient id={`${id}-glow`} cx="0.48" cy="0.15" r="0.4">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#f5d860" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#e8a830" stopOpacity="0" />
        </radialGradient>

        {/* Cap gradient */}
        <linearGradient
          id={`${id}-cap`}
          x1="120"
          y1="2"
          x2="120"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ececf0" />
        </linearGradient>

        {/* Edge shadows for 3D cylinder effect */}
        <linearGradient id={`${id}-eL`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-eR`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>

        {/* Vertical highlight/shine strip */}
        <linearGradient id={`${id}-shine`} x1="0.32" y1="0" x2="0.68" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="58%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* Clip path — body shape for edge overlays */}
        <clipPath id={`${id}-clip`}>
          <rect x="32" y="57" width="176" height="380" rx="26" />
        </clipPath>
      </defs>

      {/* ── Drop shadow ── */}
      <ellipse cx="120" cy="450" rx="70" ry="8" fill="#000" opacity="0.07" />

      {/* ══════════ CAP ══════════ */}
      <rect x="72" y="4" width="96" height="44" rx="13" fill={`url(#${id}-cap)`} />
      {/* Highlight streak */}
      <rect
        x="88"
        y="11"
        width="34"
        height="2.5"
        rx="1.25"
        fill="white"
        opacity="0.55"
      />
      {/* Bottom edge */}
      <rect x="72" y="44" width="96" height="3" rx="1.5" fill="#d2d2d8" />

      {/* ══════════ NECK RING ══════════ */}
      <rect
        x="62"
        y="47"
        width="116"
        height="12"
        rx="6"
        fill={`url(#${id}-body)`}
        opacity="0.82"
      />
      <rect
        x="62"
        y="47"
        width="116"
        height="2.5"
        rx="1.25"
        fill="#ecc848"
        opacity="0.35"
      />

      {/* ══════════ BODY ══════════ */}
      <rect
        x="32"
        y="57"
        width="176"
        height="380"
        rx="26"
        fill={`url(#${id}-body)`}
      />
      {/* Glow overlay */}
      <rect
        x="32"
        y="57"
        width="176"
        height="380"
        rx="26"
        fill={`url(#${id}-glow)`}
      />

      {/* Edge shading (clipped to body) */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="32" y="57" width="40" height="380" fill={`url(#${id}-eL)`} />
        <rect x="168" y="57" width="40" height="380" fill={`url(#${id}-eR)`} />
        {/* Shine */}
        <rect x="32" y="57" width="176" height="380" fill={`url(#${id}-shine)`} />
      </g>

      {/* ══════════ LABEL CONTENT ══════════ */}

      {/* ── AfterSlim swoosh (teal curve before the logo) ── */}
      <path
        d="M76,152 Q89,136 106,146 Q113,150 119,157"
        stroke="#3ab8c4"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── "AfterSlim" logo ── */}
      <text
        x="128"
        y="170"
        textAnchor="middle"
        fill="#0f1445"
        fontSize="24"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.3"
      >
        AfterSlim
      </text>
      {/* ™ */}
      <text
        x="178"
        y="156"
        fill="#0f1445"
        fontSize="7"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        {"™"}
      </text>

      {/* ── Tagline ── */}
      <text
        x="120"
        y="188"
        textAnchor="middle"
        fill="#2a2a4a"
        fontSize="7"
        fontWeight="400"
        fontFamily="system-ui, sans-serif"
        fontStyle="italic"
      >
        Functional Support for the Weight Loss Journey
      </text>

      {/* ── Subtle divider ── */}
      <line
        x1="68"
        y1="200"
        x2="172"
        y2="200"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* ── DAY SUPPORT ── */}
      <text
        x="120"
        y="226"
        textAnchor="middle"
        fill="white"
        fontSize="17"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="2.5"
      >
        DAY SUPPORT
      </text>

      {/* ══════════ 4 BENEFIT ICONS ══════════ */}

      {/* ── Metabolism (flame) ── */}
      <g transform="translate(72, 258)">
        <circle r="11.5" fill="#d94830" opacity="0.92" />
        <path
          d="M0,-6 C-1.2,-3.5 -4.2,-0.5 -3.2,2.5 C-2.2,5 -0.5,6 0,6 C0.5,6 2.2,5 3.2,2.5 C4.2,-0.5 1.2,-3.5 0,-6 Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M0,-1.5 C-0.5,-0.5 -1.6,0.8 -1,2 C-0.6,2.8 -0.2,3 0,3 C0.2,3 0.6,2.8 1,2 C1.6,0.8 0.5,-0.5 0,-1.5 Z"
          fill="#d94830"
          opacity="0.65"
        />
      </g>
      <text
        x="72"
        y="278"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
        opacity="0.9"
      >
        METABOLISM
      </text>

      {/* ── Energy (lightning bolt) ── */}
      <g transform="translate(104, 258)">
        <circle r="11.5" fill="#e0a820" opacity="0.92" />
        <polygon
          points="-1.5,-6.5 -3.8,0.5 -0.5,0 1.5,6.5 3.8,-0.5 0.5,0"
          fill="white"
          opacity="0.95"
        />
      </g>
      <text
        x="104"
        y="278"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
        opacity="0.9"
      >
        ENERGY
      </text>

      {/* ── Sleep (moon + Zz) ── */}
      <g transform="translate(136, 258)">
        <circle r="11.5" fill="#38a048" opacity="0.92" />
        <path
          d="M-1.5,-5 A4,4 0 1,0 -1.5,5 A2.8,2.8 0 1,1 -1.5,-5 Z"
          fill="white"
          opacity="0.95"
        />
        <text
          x="3.5"
          y="-0.5"
          fill="white"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          opacity="0.9"
        >
          z
        </text>
        <text
          x="5.5"
          y="-3.5"
          fill="white"
          fontSize="4"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          opacity="0.7"
        >
          z
        </text>
      </g>
      <text
        x="136"
        y="278"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
        opacity="0.9"
      >
        SLEEP
      </text>

      {/* ── Recovery (cycle arrows) ── */}
      <g transform="translate(168, 258)">
        <circle r="11.5" fill="#8848a8" opacity="0.92" />
        {/* Top arc */}
        <path
          d="M-4.5,-1.5 A5,5 0 0,1 3.5,-3"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <polygon points="3,-5 5,-2.5 1.5,-2.5" fill="white" opacity="0.95" />
        {/* Bottom arc */}
        <path
          d="M4.5,1.5 A5,5 0 0,1 -3.5,3"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <polygon points="-3,5 -5,2.5 -1.5,2.5" fill="white" opacity="0.95" />
      </g>
      <text
        x="168"
        y="278"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
        opacity="0.9"
      >
        RECOVERY
      </text>

      {/* ══════════ BOTTOM TEXT ══════════ */}

      <text
        x="120"
        y="314"
        textAnchor="middle"
        fill="#1a1a3a"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        120 Capsules
      </text>
      <text
        x="120"
        y="332"
        textAnchor="middle"
        fill="#2a2a4a"
        fontSize="8.5"
        fontWeight="400"
        fontFamily="system-ui, sans-serif"
      >
        {"Day & Night Recovery"}
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * BottleVisual — wrapper que suporta 1, 3 ou 6 bottles com arranjo
 * ──────────────────────────────────────────────────────────────────────────── */

export function BottleVisual({
  count = 1,
  size = "lg",
  animated = true,
  glowEffect = false,
  className,
}: BottleVisualProps) {
  const Wrapper = animated ? m.div : "div";
  const animProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      }
    : {};

  return (
    <Wrapper
      className={cn(
        "relative flex items-center justify-center",
        sizeMap[size],
        className,
      )}
      {...animProps}
    >
      {/* Glow effect behind the bottle(s) */}
      {glowEffect && (
        <div className="absolute h-3/4 w-3/4 rounded-full bg-[var(--color-brand-accent)] opacity-15 blur-[80px]" />
      )}

      {/* Bottles arrangement */}
      <div className="relative flex items-end justify-center">
        {count === 1 && (
          <div className={cn("relative", sizeMap[size])}>
            <SingleBottle id="b1" />
          </div>
        )}

        {count === 3 && (
          <>
            <div
              className={cn("relative opacity-70", sizeMap[size])}
              style={{ transform: "translateX(20px) scale(0.85)", zIndex: 1 }}
            >
              <SingleBottle id="b3a" />
            </div>
            <div
              className={cn("relative", sizeMap[size])}
              style={{ zIndex: 3 }}
            >
              <SingleBottle id="b3b" />
            </div>
            <div
              className={cn("relative opacity-70", sizeMap[size])}
              style={{ transform: "translateX(-20px) scale(0.85)", zIndex: 1 }}
            >
              <SingleBottle id="b3c" />
            </div>
          </>
        )}

        {count === 6 && (
          <>
            {/* Back row: 3 smaller */}
            <div
              className={cn("relative opacity-50", sizeMap[size])}
              style={{
                transform: "translateX(30px) translateY(-10px) scale(0.75)",
                zIndex: 0,
              }}
            >
              <SingleBottle id="b6a" />
            </div>
            <div
              className={cn("relative opacity-50", sizeMap[size])}
              style={{
                transform: "translateY(-10px) scale(0.75)",
                zIndex: 0,
              }}
            >
              <SingleBottle id="b6b" />
            </div>
            <div
              className={cn("relative opacity-50", sizeMap[size])}
              style={{
                transform: "translateX(-30px) translateY(-10px) scale(0.75)",
                zIndex: 0,
              }}
            >
              <SingleBottle id="b6c" />
            </div>
            {/* Front row: 3 larger */}
            <div
              className={cn("absolute left-0 opacity-80", sizeMap[size])}
              style={{ transform: "translateX(15px) scale(0.88)", zIndex: 1 }}
            >
              <SingleBottle id="b6d" />
            </div>
            <div
              className={cn("absolute", sizeMap[size])}
              style={{ zIndex: 3 }}
            >
              <SingleBottle id="b6e" />
            </div>
            <div
              className={cn("absolute right-0 opacity-80", sizeMap[size])}
              style={{ transform: "translateX(-15px) scale(0.88)", zIndex: 1 }}
            >
              <SingleBottle id="b6f" />
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
}
