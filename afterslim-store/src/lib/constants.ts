// ---------------------------------------------------------------------------
// AfterSlim -- Site-wide constants (One Product Store)
// ---------------------------------------------------------------------------

export const SITE = {
  name: "AfterSlim",
  tagline: "Functional Support for the Weight Loss Journey",
  description:
    "Berberine-powered supplement supporting metabolism, energy, sleep, and recovery for people on GLP-1 weight loss medications like Ozempic, Mounjaro, and Wegovy. 120 capsules per bottle.",
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

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Science", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
] as const;

export const FOOTER_NAV = {
  shop: [
    { label: "AfterSlim", href: "/shop" },
    { label: "Subscribe & Save", href: "/shop#subscribe" },
  ],
  learn: [
    { label: "The Science", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Ingredients", href: "/about#ingredients" },
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

// ---------------------------------------------------------------------------
// Product Data (One Product Store)
// ---------------------------------------------------------------------------

export type PackTier = "1-bottle" | "3-bottle" | "6-bottle";

export interface PackOption {
  tier: PackTier;
  bottles: number;
  label: string;
  supplyDays: number;
  /** Price per bottle in this pack (cents) */
  pricePerBottleCents: number;
  /** Total pack price (cents) */
  totalPriceCents: number;
  /** Strikethrough total (cents) */
  compareAtTotalCents: number;
  /** Subscription total price (cents) */
  subscriptionPriceCents: number;
  badge?: string;
  /** Savings % vs 1-bottle price */
  savingsPercent: number;
  freeShipping: boolean;
}

export interface BenefitDetail {
  /** Lucide icon name */
  icon: string;
  title: string;
  description: string;
}

export interface SingleProduct {
  slug: string;
  name: string;
  shortDescription: string;
  capsulesPerBottle: number;
  mainIngredient: string;
  benefits: string[];
  packOptions: PackOption[];
  supplementFacts: {
    servingSize: string;
    servings: number;
    ingredients: { name: string; amount: string; dailyValue?: string }[];
    otherIngredients?: string;
  };
  benefitsDetail: BenefitDetail[];
}

export const PRODUCT: SingleProduct = {
  slug: "afterslim",
  name: "AfterSlim",
  shortDescription:
    "120 capsules of Berberine-powered functional support. Metabolism, energy, sleep, and recovery in one formula.",
  capsulesPerBottle: 120,
  mainIngredient: "Berberine",
  benefits: [
    "Boosts Metabolism",
    "Sustains Energy",
    "Supports Restful Sleep",
    "Accelerates Recovery",
  ],
  packOptions: [
    {
      tier: "1-bottle",
      bottles: 1,
      label: "1 Bottle",
      supplyDays: 30,
      pricePerBottleCents: 5999,
      totalPriceCents: 5999,
      compareAtTotalCents: 6999,
      subscriptionPriceCents: 4999,
      savingsPercent: 0,
      freeShipping: false,
    },
    {
      tier: "3-bottle",
      bottles: 3,
      label: "3 Bottles",
      supplyDays: 90,
      pricePerBottleCents: 4999,
      totalPriceCents: 14997,
      compareAtTotalCents: 17997,
      subscriptionPriceCents: 12997,
      badge: "Most Popular",
      savingsPercent: 17,
      freeShipping: true,
    },
    {
      tier: "6-bottle",
      bottles: 6,
      label: "6 Bottles",
      supplyDays: 180,
      pricePerBottleCents: 3999,
      totalPriceCents: 23994,
      compareAtTotalCents: 35994,
      subscriptionPriceCents: 20994,
      badge: "Best Value",
      savingsPercent: 33,
      freeShipping: true,
    },
  ],
  supplementFacts: {
    servingSize: "4 Capsules",
    servings: 30,
    ingredients: [
      { name: "Berberine HCl", amount: "1,200 mg" },
      { name: "Chromium Picolinate", amount: "200 mcg", dailyValue: "571%" },
      { name: "Alpha Lipoic Acid", amount: "300 mg" },
      { name: "Magnesium Glycinate", amount: "200 mg", dailyValue: "48%" },
      { name: "L-Theanine", amount: "200 mg" },
      { name: "Vitamin B12", amount: "1,000 mcg", dailyValue: "41,667%" },
      { name: "Vitamin D3", amount: "2,000 IU", dailyValue: "250%" },
      { name: "Zinc", amount: "15 mg", dailyValue: "136%" },
      { name: "BioPerine (Black Pepper Extract)", amount: "10 mg" },
    ],
    otherIngredients:
      "Hypromellose (Capsule), Microcrystalline Cellulose, Magnesium Stearate, Silicon Dioxide.",
  },
  benefitsDetail: [
    {
      icon: "Flame",
      title: "Metabolism",
      description:
        "Berberine activates AMPK, the master metabolic switch. Supports natural GLP-1 production for sustained satiety.",
    },
    {
      icon: "Zap",
      title: "Energy",
      description:
        "B-vitamins, Alpha Lipoic Acid, and Chromium maintain steady energy without crashes or jitters.",
    },
    {
      icon: "Moon",
      title: "Sleep",
      description:
        "Magnesium Glycinate and L-Theanine promote deep, restorative sleep essential for weight loss recovery.",
    },
    {
      icon: "Heart",
      title: "Recovery",
      description:
        "Zinc, Vitamin D3, and antioxidants support immune function and help your body repair during rapid weight loss.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Price Comparison (AG1 pattern: us vs buying separately)
// ---------------------------------------------------------------------------

export interface PriceComparisonItem {
  name: string;
  priceCents: number;
}

export const PRICE_COMPARISON: PriceComparisonItem[] = [
  { name: "Berberine Supplement", priceCents: 3500 },
  { name: "Magnesium Glycinate", priceCents: 2500 },
  { name: "B-Vitamin Complex", priceCents: 2000 },
  { name: "Chromium Picolinate", priceCents: 1500 },
  { name: "L-Theanine", priceCents: 2000 },
  { name: "Vitamin D3 + K2", priceCents: 1800 },
  { name: "Zinc", priceCents: 1200 },
  { name: "Alpha Lipoic Acid", priceCents: 2500 },
  { name: "BioPerine Extract", priceCents: 1500 },
];

// ---------------------------------------------------------------------------
// Benefits Timeline (Seed pattern: results over time)
// ---------------------------------------------------------------------------

export interface TimelineMilestone {
  period: string;
  title: string;
  description: string;
}

export const BENEFITS_TIMELINE: TimelineMilestone[] = [
  {
    period: "Week 1",
    title: "Reduced Bloating, Improved Energy",
    description:
      "Berberine begins activating AMPK. Digestive comfort improves. B-vitamins restore natural energy levels.",
  },
  {
    period: "Week 2",
    title: "Better Sleep Quality",
    description:
      "Magnesium Glycinate and L-Theanine promote deeper, more restorative sleep cycles.",
  },
  {
    period: "Month 1",
    title: "Metabolism Stabilization",
    description:
      "Natural GLP-1 support kicks in. Blood sugar stability improves. Satiety feels more natural even between doses.",
  },
  {
    period: "Month 3",
    title: "Full Companion Benefits",
    description:
      "Complete metabolic, immune, and recovery support. Your body adapts to the formula for sustained results.",
  },
];

// ---------------------------------------------------------------------------
// Trust Indicators
// ---------------------------------------------------------------------------

export interface TrustIndicator {
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

/** Default currency */
export const CURRENCY = "USD" as const;