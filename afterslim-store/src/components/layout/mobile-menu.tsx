"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>
            <Logo size="md" asLink={false} />
          </SheetTitle>
          <SheetDescription className="sr-only">
            {SITE.tagline}
          </SheetDescription>
        </SheetHeader>

        {/* Get Started CTA */}
        <div className="px-4 pb-2">
          <Button
            asChild
            className="w-full gap-2 rounded-full bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-light)]"
            size="lg"
          >
            <Link href="/shop" onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-brand-accent-subtle)] text-[var(--color-brand-accent)]"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t px-4 py-4">
          <p className="text-xs text-muted-foreground">
            {SITE.tagline}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
