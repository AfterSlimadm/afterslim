import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FdaDisclaimer } from "@/components/marketing/fda-disclaimer";
import { ProductDetail } from "./product-detail";
import { getProductBySlug, getAllProductSlugs } from "@/lib/queries/products";

// ---------------------------------------------------------------------------
// Static params (for static generation)
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((p) => ({ slug: p.slug }));
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? SITE.description,
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description: product.meta_description ?? product.short_description ?? SITE.description,
      type: "website",
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
        />

        {/* Product detail (client component) */}
        <ProductDetail product={product} />

        {/* FDA disclaimer */}
        <FdaDisclaimer className="mt-16 border-t pt-8" />
      </div>
    </section>
  );
}
