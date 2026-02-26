import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "light" | "dark";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  asLink?: boolean;
}

const sizeMap: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Logo({
  size = "md",
  variant = "dark",
  className,
  asLink = true,
}: LogoProps) {
  const content = (
    <span
      className={cn(
        "font-bold tracking-tight select-none",
        sizeMap[size],
        variant === "dark" ? "text-foreground" : "text-white",
        className,
      )}
    >
      <span
        className={cn(
          variant === "dark"
            ? "text-[var(--color-brand-primary)]"
            : "text-white",
        )}
      >
        After
      </span>
      <span
        className={cn(
          "font-extrabold",
          variant === "dark"
            ? "text-[var(--color-brand-secondary)]"
            : "text-[var(--color-brand-secondary-light)]",
        )}
      >
        Slim
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label="AfterSlim Home">
      {content}
    </Link>
  );
}
