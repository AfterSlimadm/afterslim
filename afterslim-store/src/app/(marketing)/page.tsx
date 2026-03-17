import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductCardsSection } from "@/components/marketing/product-cards-section";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { BerberineSection } from "@/components/marketing/berberine-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
  },
};

/* ---------------------------------------------------------------------------
   Homepage — Seed-style section flow:
   1. Hero (dark navy, full viewport)
   2. Product Cards (dark navy, 3 pack cards with scaleY hover)
   3. Benefits (rounded-top snow, split layout + 2x2 pillar grid)
   4. Berberine (science/technology section, split layout)
   5. Trust Badges (cream inline bar)
   6. Testimonials (large heading + clean cards)
   7. CTA (dark navy, rounded-top, final push)
   --------------------------------------------------------------------------- */

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductCardsSection />
      <BenefitsSection />
      <BerberineSection />
      <TrustBadges />
      <Testimonials />
      <CTASection />
    </>
  );
}
