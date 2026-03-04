// ---------------------------------------------------------------------------
// AfterSlim -- Site-wide constants
// ---------------------------------------------------------------------------

export const SITE = {
  name: "AfterSlim",
  tagline: "Day & Night Nutrition for Your GLP-1 Journey",
  description:
    "Comprehensive Day & Night nutrition designed for people on GLP-1 weight loss medications. Physician formulated, science-backed supplements.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://afterslim.com",
} as const;

export const CONTACT = {
  email: "support@afterslim.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: "",
} as const;

export const SOCIAL = {
  instagram: "https://instagram.com/afterslim",
  facebook: "https://facebook.com/afterslim",
  tiktok: "https://tiktok.com/@afterslim",
  youtube: "https://youtube.com/@afterslim",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Day Support", href: "/shop/day-support" },
  { label: "Night Support", href: "/shop/night-support" },
  { label: "Bundle", href: "/shop/complete-bundle" },
  { label: "Science", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export const FOOTER_NAV = {
  shop: [
    { label: "Day Support", href: "/shop/day-support" },
    { label: "Night Support", href: "/shop/night-support" },
    { label: "Complete Bundle", href: "/shop/complete-bundle" },
    { label: "All Products", href: "/shop" },
  ],
  learn: [
    { label: "Our Science", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Ingredients", href: "/about#transparency" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/refunds" },
    { label: "Track Order", href: "/account/orders" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

/** Number of items shown per page on the shop grid */
export const PRODUCTS_PER_PAGE = 12;

/** Free shipping threshold in cents */
export const FREE_SHIPPING_THRESHOLD_CENTS = 9900; // $99.00

/** Default currency */
export const CURRENCY = "USD" as const;

// ---------------------------------------------------------------------------
// Product Data
// ---------------------------------------------------------------------------

export type ProductCategory = "day" | "night" | "bundle";

export interface ProductData {
  slug: string;
  name: string;
  shortDescription: string;
  price: number; // cents
  compareAtPrice: number; // cents
  subscriptionPrice: number; // cents
  subscriptionInterval: "month" | "bimonth" | "quarter";
  benefits: string[];
  supplementFacts: {
    servingSize: string;
    servings: number;
    ingredients: { name: string; amount: string; dailyValue?: string }[];
    otherIngredients?: string;
  };
  featured: boolean;
  category: ProductCategory;
  badge?: string;
  /** GLP-1 side effects this product addresses */
  addresses: string[];
}

export const PRODUCTS: Record<string, ProductData> = {
  "day-support": {
    slug: "day-support",
    name: "AfterSlim Day Support",
    shortDescription:
      "Comprehensive daytime nutrition for GLP-1 users. Supports energy, gut health, and satiety.",
    price: 3999,
    compareAtPrice: 4999,
    subscriptionPrice: 3599,
    subscriptionInterval: "month",
    benefits: [
      "Restores Natural Energy",
      "Soothes Digestive Discomfort",
      "Supports Healthy Satiety",
      "Physician Formulated",
    ],
    supplementFacts: {
      servingSize: "2 Capsules",
      servings: 30,
      ingredients: [
        { name: "Vitamin B12", amount: "1,000 mcg", dailyValue: "41,667%" },
        { name: "Vitamin B6", amount: "25 mg", dailyValue: "1,471%" },
        { name: "Iron", amount: "18 mg", dailyValue: "100%" },
        { name: "Ginger Root Extract", amount: "500 mg" },
        { name: "DigeZyme\u00AE Enzyme Complex", amount: "150 mg" },
        { name: "Chromium Picolinate", amount: "200 mcg", dailyValue: "571%" },
        { name: "Prebiotic Fiber Blend", amount: "3 g" },
        { name: "Probiotic Blend", amount: "5 Billion CFU" },
      ],
      otherIngredients:
        "Hypromellose (Capsule), Microcrystalline Cellulose, Magnesium Stearate, Silicon Dioxide.",
    },
    featured: true,
    category: "day",
    addresses: ["Low Energy", "Nausea", "Bloating", "Constipation", "Poor Satiety"],
  },
  "night-support": {
    slug: "night-support",
    name: "AfterSlim Night Support",
    shortDescription:
      "Nighttime recovery formula for GLP-1 users. Supports hair, skin, sleep, and overall restoration.",
    price: 3999,
    compareAtPrice: 4999,
    subscriptionPrice: 3599,
    subscriptionInterval: "month",
    benefits: [
      "Strengthens Hair & Nails",
      "Supports Skin Elasticity",
      "Promotes Restful Sleep",
      "Physician Formulated",
    ],
    supplementFacts: {
      servingSize: "2 Capsules",
      servings: 30,
      ingredients: [
        { name: "Collagen Peptides", amount: "5 g" },
        { name: "Biotin", amount: "5,000 mcg", dailyValue: "16,667%" },
        { name: "Keratin Complex", amount: "500 mg" },
        { name: "Magnesium Glycinate", amount: "400 mg", dailyValue: "95%" },
        { name: "L-Theanine", amount: "200 mg" },
        { name: "Vitamin D3", amount: "2,000 IU", dailyValue: "250%" },
        { name: "Vitamin K2", amount: "100 mcg", dailyValue: "83%" },
        { name: "Zinc", amount: "15 mg", dailyValue: "136%" },
        { name: "Selenium", amount: "55 mcg", dailyValue: "100%" },
      ],
      otherIngredients:
        "Hypromellose (Capsule), Microcrystalline Cellulose, Magnesium Stearate, Silicon Dioxide.",
    },
    featured: true,
    category: "night",
    addresses: ["Hair Loss", "Skin Changes", "Poor Sleep", "Nail Weakness"],
  },
  "complete-bundle": {
    slug: "complete-bundle",
    name: "AfterSlim Complete Bundle",
    shortDescription:
      "24/7 GLP-1 support. Day + Night formulas working together for comprehensive nutrition.",
    price: 6799,
    compareAtPrice: 9998,
    subscriptionPrice: 5999,
    subscriptionInterval: "month",
    benefits: [
      "Complete 24/7 Support",
      "Save 15% vs Individual",
      "Free Shipping Included",
      "60-Day Money Back Guarantee",
    ],
    supplementFacts: {
      servingSize: "2 Capsules (Day) + 2 Capsules (Night)",
      servings: 30,
      ingredients: [
        { name: "Day Formula", amount: "See Day Support label" },
        { name: "Night Formula", amount: "See Night Support label" },
      ],
    },
    featured: true,
    category: "bundle",
    badge: "Most Popular",
    addresses: ["All GLP-1 Side Effects \u2014 24/7 Coverage"],
  },
};

/** Product category labels and colors for UI */
export const PRODUCT_CATEGORY_CONFIG: Record<
  ProductCategory,
  { label: string; className: string }
> = {
  day: {
    label: "Day",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  night: {
    label: "Night",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  bundle: {
    label: "Bundle",
    className: "bg-[var(--color-brand-primary)] text-white",
  },
};

// ---------------------------------------------------------------------------
// Trust Indicators (shared between hero-section and trust-badges)
// ---------------------------------------------------------------------------

export interface TrustIndicator {
  /** Lucide icon name (components import the actual icon) */
  iconName: "Stethoscope" | "ShieldCheck" | "Flag" | "RotateCcw";
  label: string;
  description: string;
}

export const TRUST_INDICATORS: TrustIndicator[] = [
  {
    iconName: "Stethoscope",
    label: "Physician Formulated",
    description: "Developed with healthcare professionals",
  },
  {
    iconName: "ShieldCheck",
    label: "cGMP Certified",
    description: "Current Good Manufacturing Practice",
  },
  {
    iconName: "Flag",
    label: "Made in USA",
    description: "Proudly manufactured domestically",
  },
  {
    iconName: "RotateCcw",
    label: "60-Day Guarantee",
    description: "100% satisfaction guaranteed",
  },
];

/** Shop filter tab categories */
export const SHOP_CATEGORIES = ["All", "Day", "Night", "Bundle"] as const;
