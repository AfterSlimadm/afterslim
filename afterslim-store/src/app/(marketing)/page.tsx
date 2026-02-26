import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturedKits } from "@/components/marketing/featured-kits";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { CTASection } from "@/components/marketing/cta-section";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/queries/products";

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
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <TrustBadges />

      {/* Featured products from Supabase */}
      {featuredProducts.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Featured Products
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Our most popular supplements, trusted by thousands for real
                results.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/shop">
                  View All Products
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <FeaturedKits />
      <BenefitsSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
