import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AfterSlim Admin",
    template: "%s | AfterSlim Admin",
  },
  description:
    "Painel administrativo interno da AfterSlim. Pedidos, financeiro, estoque, criadores e agentes IA.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "AfterSlim Admin",
    description: "Pedidos, financeiro, estoque e gestão completa",
    images: [{ url: "/og-admin.jpg", width: 1200, height: 630, alt: "AfterSlim Admin Dashboard" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfterSlim Admin",
    description: "Pedidos, financeiro, estoque e gestão completa",
    images: ["/og-admin.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
