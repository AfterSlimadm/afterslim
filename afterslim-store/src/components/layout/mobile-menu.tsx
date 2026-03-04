"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package } from "lucide-react";
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

        {/* Prominent Bundle CTA */}
        <div className="px-4 pb-2">
          <Button asChild className="w-full gap-2" size="lg">
            <Link
              href="/shop/complete-bundle"
              onClick={() => setOpen(false)}
            >
              <Package className="size-4" />
              Shop the Bundle
              <span className="ml-auto rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-semibold leading-none">
                SAVE 15%
              </span>
            </Link>
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isBundle = item.label === "Bundle";
            // Skip Bundle from the list since it's already the CTA above
            if (isBundle) return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
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
