import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { SymptomsSection } from "@/components/marketing/symptoms-section";
import { FeaturedProducts } from "@/components/marketing/featured-products";
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
      <SymptomsSection />
      <FeaturedProducts />
      <Testimonials />
      <CTASection />
    </>
  );
}
