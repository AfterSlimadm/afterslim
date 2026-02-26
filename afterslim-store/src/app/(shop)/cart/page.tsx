import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Shopping Cart | AfterSlim",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <CartPageContent />
    </div>
  );
}
