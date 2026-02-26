import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | AfterSlim",
  description: "Create your AfterSlim account and start your wellness journey.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
