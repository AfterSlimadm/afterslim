"use client";

import { useCartSync } from "@/hooks/useCartSync";

/**
 * Invisible client component that syncs the cookie cart with
 * the Supabase DB cart on auth state changes.
 */
export function CartSyncProvider() {
  useCartSync();
  return null;
}
