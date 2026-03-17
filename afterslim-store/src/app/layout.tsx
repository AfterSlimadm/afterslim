import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { CartSyncProvider } from "@/components/shared/cart-sync-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 700",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
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
      <body className={`${satoshi.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <PostHogProvider>
            <CartSyncProvider />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
