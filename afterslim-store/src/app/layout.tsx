import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { CartSyncProvider } from "@/components/shared/cart-sync-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AfterSlim | Premium Supplements",
    template: "%s | AfterSlim",
  },
  description:
    "Premium US supplements for weight management, wellness, and vitality. Science-backed formulas with natural ingredients, delivered to your door.",
  keywords: [
    "supplements",
    "weight management",
    "wellness",
    "vitamins",
    "AfterSlim",
    "health",
    "natural supplements",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AfterSlim",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartSyncProvider />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
