// ---------------------------------------------------------------------------
// AfterSlim -- TypeScript types for all e-commerce database tables
// ---------------------------------------------------------------------------

/** Status of an order as it moves through fulfillment. */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

/** Status of a subscription (recurring orders). */
export type SubscriptionStatus =
  | "active"
  | "paused"
  | "cancelled"
  | "past_due"
  | "trialing";

/** Subscription billing interval. */
export type SubscriptionInterval = "month" | "bimonth" | "quarter";

/** Coupon discount type. */
export type DiscountType = "percentage" | "fixed_amount" | "free_shipping";

/** Payment method used for an order. */
export type PaymentMethod = "stripe" | "paypal" | "other";

/** Product type: single supplement or kit/bundle. */
export type ProductType = "single" | "kit";

// ---------------------------------------------------------------------------
// Supplement Facts (JSONB structure)
// ---------------------------------------------------------------------------

export interface SupplementIngredient {
  name: string;
  amount: string;
  daily_value?: string;
}

export interface SupplementFacts {
  serving_size: string;
  servings_per_container: number;
  ingredients: SupplementIngredient[];
  other_ingredients?: string;
  allergen_warning?: string;
}

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category: string;
  product_type: ProductType;

  // Pricing (all in cents)
  price_cents: number;
  compare_at_price_cents: number | null;
  subscription_price_cents: number | null;
  subscription_interval: SubscriptionInterval | null;

  // Inventory
  sku: string | null;
  barcode: string | null;
  weight_oz: number | null;
  stock_quantity: number;
  low_stock_threshold: number;

  // Visibility & sorting
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;

  // Supplement data
  supplement_facts: SupplementFacts | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Media & taxonomy
  images: string[];
  tags: string[];

  // Stripe
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  stripe_subscription_price_id: string | null;

  created_at: string;
  updated_at: string;
}

/** A kit item — junction between kit product and included products. */
export interface KitItem {
  id: string;
  kit_id: string;
  product_id: string;
  quantity: number;
  sort_order: number;
}

/** Kit product with its included items resolved. */
export interface KitWithItems extends Product {
  kit_items: (KitItem & { product: Product })[];
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface CartItem {
  /** Product ID or pack identifier. */
  id: string;
  type: "product" | "kit";
  name: string;
  slug: string;
  price_cents: number;
  quantity: number;
  image: string | null;
  /** Pack tier for one-product store (1-bottle, 3-bottle, 6-bottle). */
  pack_tier?: "1-bottle" | "3-bottle" | "6-bottle";
  /** Number of bottles in this pack. */
  bottles?: number;
  /** Whether this is a subscription purchase. */
  is_subscription?: boolean;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  coupon_code: string | null;
  payment_method: PaymentMethod | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  shipping_address: Address | null;
  billing_address: Address | null;
  tracking_code: string | null;
  tracking_url: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  sku: string | null;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  image: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string | null;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  price_cents: number;
  quantity: number;
  stripe_subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_cents: number | null;
  max_uses: number | null;
  times_used: number;
  applicable_product_ids: string[] | null;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  rating: number; // 1-5
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  metadata: Record<string, unknown> | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Users / Profiles
// ---------------------------------------------------------------------------

export interface Profile {
  id: string; // matches auth.users.id
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  default_address_id: string | null;
  stripe_customer_id: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
