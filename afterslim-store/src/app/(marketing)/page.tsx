import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { PackSelectorSection } from "@/components/marketing/pack-selector-section";
import { BenefitsTimeline } from "@/components/marketing/benefits-timeline";
import { BerberineSection } from "@/components/marketing/berberine-section";
import { IngredientCards } from "@/components/marketing/ingredient-cards";
import { PriceComparison } from "@/components/marketing/price-comparison";
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

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <BenefitsSection />
      <PackSelectorSection />
      <BenefitsTimeline />
      <BerberineSection />
      <IngredientCards />
      <PriceComparison />
      <Testimonials />
      <CTASection />
    </>
  );
}
