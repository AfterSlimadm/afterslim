import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  NavbarWrapper,
  CartButton,
  MobileMenuButton,
} from "./navbar-client";

export function Navbar() {
  return (
    <NavbarWrapper>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenuButton />
          <Logo size="md" />
        </div>

        {/* Center: Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isBundle = item.label === "Bundle";
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isBundle
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                  {isBundle && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
                      SAVE 15%
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Cart */}
        <div className="flex items-center gap-2">
          <CartButton />
        </div>
      </nav>
    </NavbarWrapper>
  );
}
