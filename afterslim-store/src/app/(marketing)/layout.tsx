import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { LeadCapturePopup } from "@/components/shared/lead-capture-popup";
import { CartSheet } from "@/components/cart/cart-sheet";
import { CookieConsent } from "@/components/shared/cookie-consent";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <MobileMenu />
      <CartSheet />

      <main className="flex-1">{children}</main>

      <Footer />
      <WhatsAppButton />
      <LeadCapturePopup />
      <CookieConsent />
    </div>
  );
}
