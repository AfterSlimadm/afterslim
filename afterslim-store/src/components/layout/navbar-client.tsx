"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Cart Icon w/ Badge — opens the CartSheet
// ---------------------------------------------------------------------------

export function CartButton() {
  const totalItems = useCartStore((s) => s.totalItems);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const count = totalItems();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCartOpen(true)}
      aria-label={`Shopping cart with ${count} items`}
    >
      <span className="relative">
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <Badge className="absolute -top-2.5 -right-2.5 flex h-4 min-w-4 items-center justify-center p-0.5 text-[10px] leading-none">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </span>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Mobile Menu Toggle
// ---------------------------------------------------------------------------

export function MobileMenuButton() {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={toggleMobileMenu}
      aria-label="Open menu"
    >
      <Menu className="size-5" />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Scroll-aware Navbar Wrapper
// ---------------------------------------------------------------------------

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export function NavbarWrapper({ children }: NavbarWrapperProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-lg"
          : "bg-background/0",
      )}
    >
      {children}
    </header>
  );
}
