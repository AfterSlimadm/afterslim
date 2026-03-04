export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE, PRODUCTS } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FdaDisclaimer } from "@/components/marketing/fda-disclaimer";
import { ProductDetail } from "./product-detail";
import { getProductBySlug } from "@/lib/queries/products";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Placeholder fallback (when Supabase has no matching product)
// ---------------------------------------------------------------------------

function getPlaceholderProduct(slug: string): Product | null {
  const data = PRODUCTS[slug];
  if (!data) return null;

  return {
    id: `placeholder-${slug}`,
    slug,
    name: data.name,
    short_description: data.shortDescription,
    description: data.name,
    category: data.category,
    product_type: data.category === "bundle" ? "kit" : "single",
    price_cents: data.price,
    compare_at_price_cents: data.compareAtPrice ?? null,
    subscription_price_cents: data.subscriptionPrice ?? null,
    subscription_interval: "month",
    sku: `AS-${slug.toUpperCase()}`,
    barcode: null,
    weight_oz: 3.2,
    stock_quantity: 500,
    low_stock_threshold: 50,
    is_active: true,
    is_featured: true,
    sort_order: 0,
    supplement_facts: {
      serving_size: data.supplementFacts.servingSize,
      servings_per_container: data.supplementFacts.servings,
      ingredients: data.supplementFacts.ingredients.map((i) => ({
        name: i.name,
        amount: i.amount,
        daily_value: i.dailyValue ?? "",
      })),
      other_ingredients: data.supplementFacts.otherIngredients,
    },
    meta_title: data.name,
    meta_description: data.shortDescription,
    images: [],
    tags: [slug, "glp-1"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  };
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) ?? getPlaceholderProduct(slug);

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
  const product = (await getProductBySlug(slug)) ?? getPlaceholderProduct(slug);

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
