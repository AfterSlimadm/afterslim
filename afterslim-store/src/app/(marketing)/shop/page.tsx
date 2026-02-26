import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShopCatalog } from "./shop-catalog";
import { getProducts, getProductCategories } from "@/lib/queries/products";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Shop All Products",
  description: `Browse our complete collection of premium supplements. ${SITE.description}`,
  openGraph: {
    title: `Shop All Products | ${SITE.name}`,
    description: `Browse our complete collection of premium supplements. ${SITE.description}`,
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// Placeholder products (fallback when Supabase is unreachable)
// ---------------------------------------------------------------------------

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "afterslim-burn",
    name: "AfterSlim Burn",
    short_description:
      "Thermogenic fat burner with green tea extract and L-carnitine to boost metabolism and support weight management.",
    description:
      "<p>AfterSlim Burn is our flagship thermogenic formula designed to support your weight management goals. Featuring a powerful blend of green tea extract (EGCG), caffeine anhydrous, L-carnitine, and cayenne pepper extract, this science-backed formula helps boost your metabolism and increase energy expenditure.</p><p>Enhanced with BioPerine for maximum absorption and chromium picolinate to support healthy blood sugar levels already within the normal range. Take 2 capsules daily with water, preferably before your morning workout for best results.</p>",
    category: "Weight Management",
    product_type: "single",
    price_cents: 4999,
    compare_at_price_cents: 5999,
    subscription_price_cents: 4249,
    subscription_interval: "month",
    sku: "AS-BURN-60",
    barcode: null,
    weight_oz: 3.2,
    stock_quantity: 150,
    low_stock_threshold: 20,
    is_active: true,
    is_featured: true,
    sort_order: 1,
    supplement_facts: {
      serving_size: "2 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Green Tea Extract (EGCG)", amount: "500 mg", daily_value: "" },
        { name: "Caffeine Anhydrous", amount: "200 mg", daily_value: "" },
        { name: "L-Carnitine", amount: "500 mg", daily_value: "" },
        { name: "Cayenne Pepper Extract", amount: "100 mg", daily_value: "" },
        {
          name: "Black Pepper Extract (BioPerine)",
          amount: "5 mg",
          daily_value: "",
        },
        {
          name: "Chromium (as Chromium Picolinate)",
          amount: "200 mcg",
          daily_value: "571%",
        },
      ],
      other_ingredients:
        "Vegetable cellulose (capsule), rice flour, magnesium stearate, silicon dioxide.",
      allergen_warning:
        "Manufactured in a facility that also processes milk, soy, eggs, wheat, peanuts, and tree nuts.",
    },
    meta_title: "AfterSlim Burn - Thermogenic Fat Burner",
    meta_description:
      "Boost your metabolism with AfterSlim Burn. Science-backed thermogenic formula with green tea extract, L-carnitine, and BioPerine for maximum absorption.",
    images: [],
    tags: ["weight-management", "fat-burner", "best-seller"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "prod-2",
    slug: "afterslim-cleanse",
    name: "AfterSlim Cleanse",
    short_description:
      "Gentle 15-day detox support formula with milk thistle, dandelion root, and probiotics to support digestive wellness.",
    description:
      "<p>AfterSlim Cleanse provides gentle yet effective detox support with a carefully balanced blend of natural ingredients. Milk thistle and dandelion root work together to support liver function, while a 5-strain probiotic blend promotes healthy gut flora.</p><p>This 15-day cleanse program includes artichoke extract for digestive comfort and turmeric for its antioxidant properties. Designed to be gentle enough for everyday wellness support without harsh side effects.</p>",
    category: "Weight Management",
    product_type: "single",
    price_cents: 3999,
    compare_at_price_cents: null,
    subscription_price_cents: 3399,
    subscription_interval: "month",
    sku: "AS-CLNS-30",
    barcode: null,
    weight_oz: 2.8,
    stock_quantity: 200,
    low_stock_threshold: 25,
    is_active: true,
    is_featured: false,
    sort_order: 2,
    supplement_facts: {
      serving_size: "2 capsules",
      servings_per_container: 15,
      ingredients: [
        { name: "Milk Thistle Extract (80% Silymarin)", amount: "250 mg", daily_value: "" },
        { name: "Dandelion Root Extract", amount: "200 mg", daily_value: "" },
        { name: "Artichoke Leaf Extract", amount: "150 mg", daily_value: "" },
        { name: "Turmeric Extract (95% Curcuminoids)", amount: "100 mg", daily_value: "" },
        { name: "Probiotic Blend (5 Billion CFU)", amount: "100 mg", daily_value: "" },
        { name: "Ginger Root Extract", amount: "50 mg", daily_value: "" },
      ],
      other_ingredients:
        "Vegetable cellulose (capsule), rice flour, silicon dioxide.",
      allergen_warning:
        "Manufactured in a facility that also processes milk, soy, and tree nuts.",
    },
    meta_title: "AfterSlim Cleanse - Gentle Detox Support",
    meta_description:
      "Support your digestive wellness with AfterSlim Cleanse. A gentle 15-day detox formula with milk thistle, probiotics, and turmeric.",
    images: [],
    tags: ["weight-management", "detox", "cleanse"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "prod-3",
    slug: "afterslim-probiotics-plus",
    name: "AfterSlim Probiotics+",
    short_description:
      "Advanced 50 billion CFU probiotic with 16 strains and prebiotic fiber for optimal gut health and immune support.",
    description:
      "<p>AfterSlim Probiotics+ delivers 50 billion CFU of beneficial bacteria across 16 carefully selected strains. Each strain is chosen for its specific benefit to digestive health, immune function, and overall wellness.</p><p>Our delayed-release capsule technology ensures the probiotics survive stomach acid and reach your intestines alive. Enhanced with prebiotic fiber (FOS) to nourish the good bacteria already in your gut.</p>",
    category: "Supplements",
    product_type: "single",
    price_cents: 3499,
    compare_at_price_cents: 4199,
    subscription_price_cents: 2974,
    subscription_interval: "month",
    sku: "AS-PROB-60",
    barcode: null,
    weight_oz: 2.5,
    stock_quantity: 300,
    low_stock_threshold: 30,
    is_active: true,
    is_featured: true,
    sort_order: 3,
    supplement_facts: {
      serving_size: "1 capsule",
      servings_per_container: 60,
      ingredients: [
        { name: "Probiotic Blend (16 Strains)", amount: "50 Billion CFU", daily_value: "" },
        { name: "Prebiotic Fiber (FOS)", amount: "200 mg", daily_value: "" },
        { name: "Lactobacillus acidophilus", amount: "12.5 Billion CFU", daily_value: "" },
        { name: "Bifidobacterium lactis", amount: "10 Billion CFU", daily_value: "" },
        { name: "Lactobacillus rhamnosus", amount: "7.5 Billion CFU", daily_value: "" },
      ],
      other_ingredients:
        "Delayed-release vegetable capsule (HPMC, gellan gum), rice flour, silicon dioxide.",
    },
    meta_title: "AfterSlim Probiotics+ - 50 Billion CFU Probiotic",
    meta_description:
      "Support gut health with 50 billion CFU and 16 probiotic strains. Delayed-release capsule with prebiotic fiber for optimal digestive wellness.",
    images: [],
    tags: ["supplements", "probiotics", "gut-health", "best-seller"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-03T00:00:00Z",
    updated_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "prod-4",
    slug: "afterslim-omega-3-ultra",
    name: "AfterSlim Omega-3 Ultra",
    short_description:
      "Triple-strength fish oil with 2400 mg EPA/DHA per serving for heart, brain, and joint support.",
    description:
      "<p>AfterSlim Omega-3 Ultra delivers a potent 2400 mg of combined EPA and DHA per serving from sustainably sourced wild-caught fish. Our molecular distillation process ensures pharmaceutical-grade purity free from heavy metals and contaminants.</p><p>Each softgel features a natural lemon coating to eliminate fishy aftertaste. Supports cardiovascular health, cognitive function, and joint comfort.</p>",
    category: "Supplements",
    product_type: "single",
    price_cents: 2999,
    compare_at_price_cents: null,
    subscription_price_cents: null,
    subscription_interval: null,
    sku: "AS-OMG3-90",
    barcode: null,
    weight_oz: 5.6,
    stock_quantity: 180,
    low_stock_threshold: 20,
    is_active: true,
    is_featured: false,
    sort_order: 4,
    supplement_facts: null,
    meta_title: "AfterSlim Omega-3 Ultra - Triple Strength Fish Oil",
    meta_description:
      "Triple-strength fish oil with 2400 mg EPA/DHA. Sustainably sourced, molecularly distilled for purity. Supports heart, brain, and joints.",
    images: [],
    tags: ["supplements", "omega-3", "heart-health"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-04T00:00:00Z",
    updated_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "prod-5",
    slug: "afterslim-vitamin-d3-k2",
    name: "AfterSlim Vitamin D3+K2",
    short_description:
      "5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption, bone strength, and immune support.",
    description:
      "<p>AfterSlim Vitamin D3+K2 combines 5000 IU of Vitamin D3 (cholecalciferol) with 100 mcg of Vitamin K2 (as MK-7) for synergistic bone and immune support. Vitamin K2 directs calcium to your bones where it belongs, rather than to your arteries.</p><p>Our formula uses organic coconut oil as a carrier for enhanced fat-soluble vitamin absorption. One small softgel daily is all you need.</p>",
    category: "Supplements",
    product_type: "single",
    price_cents: 2499,
    compare_at_price_cents: 2999,
    subscription_price_cents: 2124,
    subscription_interval: "month",
    sku: "AS-D3K2-120",
    barcode: null,
    weight_oz: 1.8,
    stock_quantity: 250,
    low_stock_threshold: 30,
    is_active: true,
    is_featured: false,
    sort_order: 5,
    supplement_facts: null,
    meta_title: "AfterSlim Vitamin D3+K2 - Bone & Immune Support",
    meta_description:
      "5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption. Supports bone strength, immune health, and cardiovascular wellness.",
    images: [],
    tags: ["supplements", "vitamins", "bone-health"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "prod-6",
    slug: "afterslim-collagen-peptides",
    name: "AfterSlim Collagen Peptides",
    short_description:
      "Hydrolyzed multi-collagen peptides (Types I, II, III, V, X) for radiant skin, strong joints, and healthy hair.",
    description:
      "<p>AfterSlim Collagen Peptides provides 10g of hydrolyzed multi-collagen per serving from five collagen types (I, II, III, V, and X). Our advanced hydrolysis process breaks collagen into small peptides for rapid absorption and bioavailability.</p><p>Sourced from grass-fed, pasture-raised bovine, wild-caught fish, and cage-free chicken. Unflavored and dissolves easily in coffee, smoothies, or water. Supports skin elasticity, joint comfort, hair strength, and nail growth.</p>",
    category: "Supplements",
    product_type: "single",
    price_cents: 4499,
    compare_at_price_cents: 5399,
    subscription_price_cents: 3824,
    subscription_interval: "month",
    sku: "AS-COLL-30",
    barcode: null,
    weight_oz: 10.6,
    stock_quantity: 120,
    low_stock_threshold: 15,
    is_active: true,
    is_featured: true,
    sort_order: 6,
    supplement_facts: null,
    meta_title: "AfterSlim Collagen Peptides - Multi-Collagen Protein",
    meta_description:
      "Hydrolyzed multi-collagen peptides with Types I, II, III, V, X. Supports radiant skin, strong joints, and healthy hair and nails.",
    images: [],
    tags: ["supplements", "collagen", "skin-health", "best-seller"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-06T00:00:00Z",
    updated_at: "2025-01-06T00:00:00Z",
  },
  {
    id: "prod-7",
    slug: "afterslim-sleep-formula",
    name: "AfterSlim Sleep Formula",
    short_description:
      "Natural sleep support with melatonin, magnesium glycinate, L-theanine, and ashwagandha for restful recovery.",
    description:
      "<p>AfterSlim Sleep Formula combines the most effective natural sleep ingredients into one convenient capsule. Melatonin helps regulate your circadian rhythm, while magnesium glycinate relaxes muscles and calms the nervous system.</p><p>L-theanine promotes alpha brain waves for calm focus before bed, and ashwagandha (KSM-66) helps reduce occasional stress. Wake up refreshed without grogginess. Non-habit-forming formula you can trust.</p>",
    category: "Energy",
    product_type: "single",
    price_cents: 3299,
    compare_at_price_cents: null,
    subscription_price_cents: 2804,
    subscription_interval: "month",
    sku: "AS-SLEP-60",
    barcode: null,
    weight_oz: 2.4,
    stock_quantity: 175,
    low_stock_threshold: 20,
    is_active: true,
    is_featured: false,
    sort_order: 7,
    supplement_facts: null,
    meta_title: "AfterSlim Sleep Formula - Natural Sleep Support",
    meta_description:
      "Fall asleep faster and wake refreshed with our natural sleep formula. Melatonin, magnesium, L-theanine, and ashwagandha. Non-habit-forming.",
    images: [],
    tags: ["energy", "sleep", "recovery"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-07T00:00:00Z",
    updated_at: "2025-01-07T00:00:00Z",
  },
  {
    id: "prod-8",
    slug: "afterslim-immunity-shield",
    name: "AfterSlim Immunity Shield",
    short_description:
      "Comprehensive immune support with Vitamin C, zinc, elderberry, and echinacea to keep your defenses strong.",
    description:
      "<p>AfterSlim Immunity Shield is your daily defense against seasonal challenges. This comprehensive formula combines Vitamin C (1000 mg), zinc bisglycinate, elderberry extract, and echinacea to support a robust immune response.</p><p>Enhanced with quercetin and selenium for powerful antioxidant protection. Perfect for daily use or increased dosing during times when extra immune support is needed.</p>",
    category: "Supplements",
    product_type: "single",
    price_cents: 2799,
    compare_at_price_cents: 3359,
    subscription_price_cents: null,
    subscription_interval: null,
    sku: "AS-IMMU-90",
    barcode: null,
    weight_oz: 3.0,
    stock_quantity: 220,
    low_stock_threshold: 25,
    is_active: true,
    is_featured: false,
    sort_order: 8,
    supplement_facts: null,
    meta_title: "AfterSlim Immunity Shield - Immune Support Complex",
    meta_description:
      "Strengthen your immune defenses with Vitamin C, zinc, elderberry, and echinacea. Comprehensive daily immune support formula.",
    images: [],
    tags: ["supplements", "immune-support", "vitamins"],
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_subscription_price_id: null,
    created_at: "2025-01-08T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ShopPage() {
  // Fetch products and categories from Supabase
  const [products, dbCategories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  // Fall back to placeholder data if Supabase returns nothing
  const finalProducts = products.length > 0 ? products : PLACEHOLDER_PRODUCTS;

  // Build categories list: "All" + distinct categories from DB (or fallback)
  const categories =
    dbCategories.length > 0
      ? ["All", ...dbCategories]
      : ["All", "Supplements", "Weight Management", "Energy"];

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Shop", href: "/shop" }]} />

        {/* Page header */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shop All Products
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Premium supplements backed by science, crafted for results.
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
