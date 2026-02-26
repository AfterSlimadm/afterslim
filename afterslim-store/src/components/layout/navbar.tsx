import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
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
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Cart */}
        <div className="flex items-center gap-2">
          <CartButton />
        </div>
      </nav>
    </NavbarWrapper>
  );
}
