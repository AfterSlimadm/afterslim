import { Navbar } from "@/components/layout/navbar";
import { CartSheet } from "@/components/cart/cart-sheet";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartSheet />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <AccountSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
