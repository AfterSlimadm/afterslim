import { Navbar } from "@/components/layout/navbar";
import { CartSheet } from "@/components/cart/cart-sheet";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartSheet />
      <main className="flex-1">{children}</main>
    </div>
  );
}
