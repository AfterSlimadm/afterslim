"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { onCartAdd } from "@/lib/cart-animation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as m from "motion/react-client";
import { AnimatePresence } from "motion/react";

// ---------------------------------------------------------------------------
// Cart Icon w/ Badge — opens the CartSheet, bounces on item add
// ---------------------------------------------------------------------------

export function CartButton() {
  const items = useCartStore((s) => s.items);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const [bouncing, setBouncing] = useState(false);
  const [prevCount, setPrevCount] = useState(count);
  const [badgePop, setBadgePop] = useState(false);

  // Listen for cart-add events and trigger bounce
  useEffect(() => {
    return onCartAdd(() => {
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
    });
  }, []);

  // Detect badge count change for pop animation
  useEffect(() => {
    if (count !== prevCount && count > 0) {
      setBadgePop(true);
      const timer = setTimeout(() => setBadgePop(false), 300);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <m.div
      animate={
        bouncing
          ? {
              rotate: [0, -12, 10, -8, 5, 0],
              scale: [1, 1.2, 0.95, 1.1, 1],
            }
          : { rotate: 0, scale: 1 }
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCartOpen(true)}
        aria-label={`Shopping cart with ${count} items`}
        data-cart-icon
        suppressHydrationWarning
      >
        <span className="relative">
          <ShoppingBag className="size-5" />
          <AnimatePresence mode="popLayout">
            {count > 0 && (
              <m.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: badgePop ? 1.3 : 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -top-2.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary p-0.5 text-[10px] font-medium leading-none text-primary-foreground"
              >
                {count > 99 ? "99+" : count}
              </m.span>
            )}
          </AnimatePresence>
        </span>
      </Button>
    </m.div>
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
          ? "border-b border-border/50 bg-as-snow/80 shadow-sm backdrop-blur-lg"
          : "bg-as-snow/0",
      )}
    >
      {children}
    </header>
  );
}
