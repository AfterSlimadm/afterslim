import type { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/checkout-content";

export const metadata: Metadata = {
  title: "Checkout | AfterSlim",
  description: "Complete your order securely.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <CheckoutContent />
    </div>
  );
}
