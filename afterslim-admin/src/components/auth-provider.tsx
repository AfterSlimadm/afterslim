"use client";

import { createContext, useContext } from "react";
import type { AdminUser } from "@/lib/auth";

const AuthContext = createContext<AdminUser | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth(): AdminUser {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback for static pages (e.g. _not-found) rendered outside AuthProvider
    return {
      id: "",
      email: "",
      display_name: "",
      role: "viewer",
      is_active: false,
    };
  }
  return ctx;
}
