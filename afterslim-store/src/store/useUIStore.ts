"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

export interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  leadPopupShown: boolean;

  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setLeadPopupShown: (shown: boolean) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  leadPopupShown: false,

  setCartOpen: (open) => set({ cartOpen: open }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setLeadPopupShown: (shown) => set({ leadPopupShown: shown }),
}));
