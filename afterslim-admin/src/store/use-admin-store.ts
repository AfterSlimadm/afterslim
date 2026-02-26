"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdminStore {
  /* ── Sidebar ────────────────────────────────────── */
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;

  /* ── Filters ────────────────────────────────────── */
  activeFilters: Record<string, string[]>;
  setFilter: (key: string, values: string[]) => void;
  clearFilters: () => void;

  /* ── Theme ──────────────────────────────────────── */
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  /* ── User preferences ──────────────────────────── */
  preferences: {
    compactMode: boolean;
    showIds: boolean;
    defaultPageSize: number;
    currency: string;
  };
  setPreference: <K extends keyof AdminStore["preferences"]>(
    key: K,
    value: AdminStore["preferences"][K]
  ) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      /* ── Sidebar ───────────────────────────────── */
      sidebarOpen: false,
      sidebarCollapsed: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      /* ── Filters ───────────────────────────────── */
      activeFilters: {},
      setFilter: (key, values) =>
        set((s) => ({
          activeFilters: { ...s.activeFilters, [key]: values },
        })),
      clearFilters: () => set({ activeFilters: {} }),

      /* ── Theme ─────────────────────────────────── */
      theme: "light",
      setTheme: (theme) => set({ theme }),

      /* ── User preferences ──────────────────────── */
      preferences: {
        compactMode: false,
        showIds: false,
        defaultPageSize: 25,
        currency: "BRL",
      },
      setPreference: (key, value) =>
        set((s) => ({
          preferences: { ...s.preferences, [key]: value },
        })),
    }),
    {
      name: "afterslim-admin-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        preferences: state.preferences,
      }),
    }
  )
);
