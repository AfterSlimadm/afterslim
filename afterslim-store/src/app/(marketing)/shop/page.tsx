export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SITE, PRODUCTS, SHOP_CATEGORIES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShopCatalog } from "./shop-catalog";
import { getProducts } from "@/lib/queries/products";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Shop GLP-1 Companion Supplements",
  description: `Day & Night nutrition designed for GLP-1 users. ${SITE.description}`,
  openGraph: {
    title: `Shop GLP-1 Companion Supplements | ${SITE.name}`,
    description: `Day & Night nutrition designed for GLP-1 users. ${SITE.description}`,
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// Placeholder products (fallback when Supabase is unreachable)
// ---------------------------------------------------------------------------

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "prod-day",
    slug: "day-support",
    name: PRODUCTS["day-support"].name,
    short_description: PRODUCTS["day-support"].shortDescription,
    description:
      "<p>AfterSlim Day Support is a comprehensive daytime formula specifically designed for people on GLP-1 medications like Ozempic, Mounjaro, and Wegovy. Our physician-formulated blend targets the most common daytime side effects: low energy, nausea, bloating, constipation, and poor satiety.</p><p>With clinically studied ingredients including Vitamin B12, Ginger Root Extract for digestive comfort, DigeZyme Enzyme Complex, Chromium Picolinate for blood sugar support, and a Prebiotic Fiber + Probiotic blend for gut health. Take 2 capsules daily with your morning meal.</p>",
    category: "day",
    product_type: "single",
    price_cents: PRODUCTS["day-support"].price,
    compare_at_price_cents: PRODUCTS["day-support"].compareAtPrice,
    subscription_price_cents: PRODUCTS["day-support"].subscriptionPrice,
    subscription_interval: "month",
    sku: "AS-DAY-60",
    barcode: null,
    weight_oz: 3.2,
    stock_quantity: 500,
    low_stock_threshold: 50,
    is_active: true,
    is_featured: true,
    sort_order: 1,
    supplement_facts: {
      serving_size: PRODUCTS["day-support"].supplementFacts.servingSize,
      servings_per_container: PRODUCTS["day-support"].supplementFacts.servings,
      ingredients: PRODUCTS["day-support"].supplementFacts.ingredients.map((i) => ({
        name: i.name,
        amount: i.amount,
        daily_value: i.dailyValue ?? "",
      })),
      other_ingredients: PRODUCTS["day-support"].supplementFacts.otherIngredients,
    },
    meta_title: "AfterSlim Day Support - Daytime GLP-1 Companion Supplement",
    meta_description:
      "Comprehensive daytime nutrition for GLP-1 users. Supports energy, gut health, and satiety. Physician formulated. 60 capsules.",
    images: [],
    tags: ["day-support", "energy", "gut-health", "glp-1"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "prod-night",
    slug: "night-support",
    name: PRODUCTS["night-support"].name,
    short_description: PRODUCTS["night-support"].shortDescription,
    description:
      "<p>AfterSlim Night Support is a nighttime recovery formula designed to address the cosmetic and sleep-related side effects of GLP-1 medications. While you sleep, this formula works to support hair strength, skin elasticity, nail health, and restful sleep.</p><p>Featuring Collagen Peptides for skin and joint support, Biotin and Keratin Complex for hair and nails, Magnesium Glycinate and L-Theanine for deep relaxation, plus Vitamin D3, K2, Zinc, and Selenium for comprehensive nighttime restoration. Take 2 capsules 30 minutes before bed.</p>",
    category: "night",
    product_type: "single",
    price_cents: PRODUCTS["night-support"].price,
    compare_at_price_cents: PRODUCTS["night-support"].compareAtPrice,
    subscription_price_cents: PRODUCTS["night-support"].subscriptionPrice,
    subscription_interval: "month",
    sku: "AS-NIGHT-60",
    barcode: null,
    weight_oz: 3.4,
    stock_quantity: 500,
    low_stock_threshold: 50,
    is_active: true,
    is_featured: true,
    sort_order: 2,
    supplement_facts: {
      serving_size: PRODUCTS["night-support"].supplementFacts.servingSize,
      servings_per_container: PRODUCTS["night-support"].supplementFacts.servings,
      ingredients: PRODUCTS["night-support"].supplementFacts.ingredients.map((i) => ({
        name: i.name,
        amount: i.amount,
        daily_value: i.dailyValue ?? "",
      })),
      other_ingredients: PRODUCTS["night-support"].supplementFacts.otherIngredients,
    },
    meta_title: "AfterSlim Night Support - Nighttime GLP-1 Recovery Formula",
    meta_description:
      "Nighttime recovery for GLP-1 users. Supports hair, skin, sleep, and nail health. Collagen, Biotin, Magnesium. 60 capsules.",
    images: [],
    tags: ["night-support", "hair", "skin", "sleep", "glp-1"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "prod-bundle",
    slug: "complete-bundle",
    name: PRODUCTS["complete-bundle"].name,
    short_description: PRODUCTS["complete-bundle"].shortDescription,
    description:
      "<p>The AfterSlim Complete Bundle combines our Day Support and Night Support formulas for comprehensive 24/7 GLP-1 companion nutrition. This is the most popular choice for people who want full coverage against all common GLP-1 side effects.</p><p>During the day, restore energy, soothe digestive discomfort, and maintain healthy satiety. At night, support hair and nail strength, skin elasticity, and restful sleep. Save 15% compared to buying each formula individually, plus enjoy free shipping on every order.</p>",
    category: "bundle",
    product_type: "kit",
    price_cents: PRODUCTS["complete-bundle"].price,
    compare_at_price_cents: PRODUCTS["complete-bundle"].compareAtPrice,
    subscription_price_cents: PRODUCTS["complete-bundle"].subscriptionPrice,
    subscription_interval: "month",
    sku: "AS-BUNDLE-120",
    barcode: null,
    weight_oz: 6.6,
    stock_quantity: 300,
    low_stock_threshold: 30,
    is_active: true,
    is_featured: true,
    sort_order: 0, // Bundle shows first
    supplement_facts: {
      serving_size: PRODUCTS["complete-bundle"].supplementFacts.servingSize,
      servings_per_container: PRODUCTS["complete-bundle"].supplementFacts.servings,
      ingredients: PRODUCTS["complete-bundle"].supplementFacts.ingredients.map((i) => ({
        name: i.name,
        amount: i.amount,
        daily_value: i.dailyValue ?? "",
      })),
    },
    meta_title: "AfterSlim Complete Bundle - 24/7 GLP-1 Companion System",
    meta_description:
      "Day + Night GLP-1 companion nutrition. Save 15%. Addresses energy, gut health, hair, skin, sleep, and more. Free shipping.",
    images: [],
    tags: ["bundle", "complete", "day-night", "glp-1", "best-seller"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ShopPage() {
  // Fetch products from Supabase
  const products = await getProducts();

  // Fall back to placeholder data if Supabase returns nothing
  const finalProducts = products.length > 0 ? products : PLACEHOLDER_PRODUCTS;

  // Use our predefined shop categories (All, Day, Night, Bundle)
  const categories = [...SHOP_CATEGORIES];

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Shop", href: "/shop" }]} />

        {/* Page header */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            GLP-1 Companion Supplements
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Physician-formulated Day &amp; Night nutrition designed for people on Ozempic, Mounjaro, and Wegovy.
          </p>
        </div>

        {/* Catalog (client component handles filtering/sorting) */}
        <ShopCatalog
          products={finalProducts}
          categories={categories}
        />
      </div>
    </section>
  );
}
