"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/types/database";

/**
 * Syncs the cookie-based cart with the Supabase DB cart whenever the user
 * logs in or out. Place this in a layout that wraps all cart-aware pages.
 *
 * - On login: pushes cookie cart to DB (cookie = source of truth)
 * - On logout: keeps cookie cart intact (user doesn't lose items)
 * - While logged in: any cart change triggers a background DB sync
 */
export function useCartSync() {
  const didSync = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    // Sync cart to DB
    async function pushCartToDb() {
      const items = useCartStore.getState().items;
      const couponCode = useCartStore.getState().couponCode;

      try {
        await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, coupon_code: couponCode }),
        });
      } catch {
        // Silent fail — cookie cart still works
      }
    }

    // Pull cart from DB (only on initial login when cookie cart is empty)
    async function pullCartFromDb() {
      try {
        const res = await fetch("/api/cart/sync");
        if (!res.ok) return;
        const data = await res.json();

        const currentItems = useCartStore.getState().items;
        if (currentItems.length === 0 && data.items?.length > 0) {
          // Cookie cart is empty but DB has items — restore from DB
          for (const item of data.items as CartItem[]) {
            useCartStore.getState().addItem(item);
          }
          if (data.coupon_code) {
            useCartStore.getState().applyCoupon(data.coupon_code);
          }
        } else if (currentItems.length > 0) {
          // Cookie cart has items — push to DB (cookie wins)
          await pushCartToDb();
        }
      } catch {
        // Silent fail
      }
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !didSync.current) {
        didSync.current = true;
        pullCartFromDb();
      }
      if (event === "SIGNED_OUT") {
        didSync.current = false;
      }
    });

    // Check initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !didSync.current) {
        didSync.current = true;
        pullCartFromDb();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
