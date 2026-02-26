"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  message?: string;
  className?: string;
}

export function AnnouncementBar({
  message = "Free shipping on orders over $99 \u2014 Shop now!",
  className,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-[var(--color-brand-primary)] px-4 py-2.5 text-center text-sm font-medium text-white",
        className,
      )}
    >
      <p className="pr-8">{message}</p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
