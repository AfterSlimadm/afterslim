import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import {
  NavbarWrapper,
  CartButton,
  MobileMenuButton,
} from "./navbar-client";

/* ---------------------------------------------------------------------------
   Seed-style Navbar
   Height: ~49px (h-12), transparent bg, glassmorphism on scroll
   Logo left, nav center, CTA pill + cart right
   --------------------------------------------------------------------------- */

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      fill="none"
      viewBox="0 0 11 11"
      style={{ width: 11, height: 11 }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <NavbarWrapper>
      <nav className="mx-auto flex h-12 max-w-[90rem] items-center justify-between px-4 sm:px-8 lg:px-14">
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
                className="rounded-md px-3 py-2 font-display text-sm font-medium text-as-navy/70 transition-colors hover:text-as-navy"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: CTA + Cart */}
        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="group hidden items-center gap-1.5 rounded-full bg-as-orange px-4 py-2 font-display text-sm font-medium text-as-snow transition-colors hover:bg-as-orange-bright sm:inline-flex"
          >
            Shop Now
            <span className="inline-flex w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100">
              <ArrowIcon />
            </span>
          </Link>
          <CartButton />
        </div>
      </nav>
    </NavbarWrapper>
  );
}
