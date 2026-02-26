import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | AfterSlim",
  description: "Sign in to your AfterSlim account to manage orders and subscriptions.",
};

export default function LoginPage() {
  return <LoginForm />;
}
