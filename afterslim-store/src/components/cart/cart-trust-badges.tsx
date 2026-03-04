"use client";

import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const badges = [
  { icon: RotateCcw, label: "60-Day Guarantee" },
  { icon: Truck, label: "Free Shipping $99+" },
  { icon: ShieldCheck, label: "GMP Certified" },
] as const;

export function CartTrustBadges() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-1 text-[10px] text-muted-foreground"
        >
          <Icon className="size-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  );
}
