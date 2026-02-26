import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | AfterSlim",
  description: "Reset your AfterSlim account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
