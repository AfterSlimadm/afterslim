import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password | AfterSlim",
  description: "Set a new password for your AfterSlim account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
