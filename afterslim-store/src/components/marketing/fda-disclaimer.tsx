import { cn } from "@/lib/utils";

interface FdaDisclaimerProps {
  className?: string;
}

export function FdaDisclaimer({ className }: FdaDisclaimerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs leading-relaxed text-muted-foreground/70">
        * These statements have not been evaluated by the Food and Drug
        Administration. This product is not intended to diagnose, treat, cure,
        or prevent any disease. Consult your physician before beginning any
        supplement program. Individual results may vary.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground/70">
        All products are manufactured in the USA in a GMP-certified,
        FDA-registered facility using only the highest quality ingredients.
      </p>
    </div>
  );
}
