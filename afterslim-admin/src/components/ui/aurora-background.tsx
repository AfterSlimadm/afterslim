"use client";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Aurora layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050f19] via-[#0a1929] to-[#121d27]" />

        {/* Aurora blobs */}
        <div
          className="absolute -left-[20%] top-[10%] h-[500px] w-[600px] animate-pulse rounded-full opacity-[0.15] blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse, #0091CC 0%, transparent 70%)",
            animationDuration: "6s",
          }}
        />
        <div
          className="absolute -right-[10%] top-[30%] h-[400px] w-[500px] animate-pulse rounded-full opacity-[0.12] blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse, #86ceff 0%, transparent 70%)",
            animationDuration: "8s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[30%] h-[350px] w-[450px] animate-pulse rounded-full opacity-[0.08] blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse, #007CB0 0%, transparent 70%)",
            animationDuration: "7s",
            animationDelay: "4s",
          }}
        />

        {/* Radial vignette */}
        {showRadialGradient && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050f19_80%)]" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
