// ---------------------------------------------------------------------------
// AfterSlim -- Site-wide constants
// ---------------------------------------------------------------------------

export const SITE = {
  name: "AfterSlim",
  tagline: "Premium Supplements for a Better You",
  description:
    "Premium US supplements for weight management, wellness, and vitality. Science-backed formulas with natural ingredients.",
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
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Kits", href: "/kits" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Kits & Bundles", href: "/kits" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Shipping Policy", href: "/shipping" },
  ],
} as const;

/** Number of items shown per page on the shop grid */
export const PRODUCTS_PER_PAGE = 12;

/** Free shipping threshold in cents */
export const FREE_SHIPPING_THRESHOLD_CENTS = 9900; // $99.00

/** Default currency */
export const CURRENCY = "USD" as const;
