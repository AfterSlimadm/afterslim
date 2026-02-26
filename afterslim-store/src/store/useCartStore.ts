"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import type { CartItem } from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CART_COOKIE = "afterslim_cart";
const COUPON_COOKIE = "afterslim_coupon";
const COOKIE_EXPIRY_DAYS = 7;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function persistCart(items: CartItem[]) {
  Cookies.set(CART_COOKIE, JSON.stringify(items), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: "lax",
  });
}

function loadCart(): CartItem[] {
  try {
    const raw = Cookies.get(CART_COOKIE);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadCoupon(): string | null {
  return Cookies.get(COUPON_COOKIE) ?? null;
}

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  couponCode: string | null;

  // Computed
  totalItems: () => number;
  subtotalCents: () => number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  setLoading: (value: boolean) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  isLoading: false,
  couponCode: loadCoupon(),

  // -- Computed ---------------------------------------------------------------

  totalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  subtotalCents: () =>
    get().items.reduce(
      (sum, item) => sum + item.price_cents * item.quantity,
      0
    ),

  // -- Actions ----------------------------------------------------------------

  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === newItem.id);
      let updated: CartItem[];

      if (existing) {
        updated = state.items.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      } else {
        updated = [...state.items, newItem];
      }

      persistCart(updated);
      return { items: updated };
    }),

  removeItem: (id) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== id);
      persistCart(updated);
      return { items: updated };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const updated = state.items.filter((i) => i.id !== id);
        persistCart(updated);
        return { items: updated };
      }

      const updated = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      persistCart(updated);
      return { items: updated };
    }),

  clearCart: () => {
    Cookies.remove(CART_COOKIE);
    Cookies.remove(COUPON_COOKIE);
    set({ items: [], couponCode: null });
  },

  applyCoupon: (code) => {
    Cookies.set(COUPON_COOKIE, code, {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: "lax",
    });
    set({ couponCode: code });
  },

  removeCoupon: () => {
    Cookies.remove(COUPON_COOKIE);
    set({ couponCode: null });
  },

  setLoading: (value) => set({ isLoading: value }),
}));
