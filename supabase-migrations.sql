-- ══════════════════════════════════════════════════════════════════════════════
-- AfterSlim — Full Supabase Migration
-- Generated: 2026-02-26
--
-- Run this entire file in the Supabase SQL Editor (one shot).
-- It is idempotent-safe: every CREATE uses IF NOT EXISTS / OR REPLACE.
--
-- Sections
--   0. Extensions & Helpers
--   1. Profiles & Addresses
--   2. Products & Kit Items
--   3. Carts & Cart Items
--   4. Orders & Order Items (with sequence + auto order_number)
--   5. Subscriptions
--   6. Coupons & Coupon Uses
--   7. Reviews
--   8. Leads
--   9. Customers (admin denormalized view)
--  10. Order Events (audit log)
--  11. Transactions (financial)
--  12. Financial Goals
--  13. Products Inventory
--  14. Sales Tax Records
--  15. Ideas Bank
--  16. Kanban (columns + cards)
--  17. Creators & Campaigns
--  18. AI Agent Tables (memory, message log, tasks)
--  19. RLS Policies
--  20. Seed Data
-- ══════════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════════
-- 0. EXTENSIONS & HELPER FUNCTIONS
-- ══════════════════════════════════════════════════════════════════════════════

-- UUID generation (usually enabled by default in Supabase, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Reusable updated_at trigger function ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper: attach the trigger to any table that has an updated_at column.
-- We call this at the bottom of each table section that needs it.


-- ══════════════════════════════════════════════════════════════════════════════
-- 1. PROFILES & ADDRESSES
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'admin')),
  stripe_customer_id  TEXT,
  default_address_id  UUID,              -- FK added after addresses table
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: keep updated_at fresh
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: auto-create a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── addresses ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label         TEXT,                     -- e.g. "Home", "Work"
  first_name    TEXT,
  last_name     TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  zip_code      TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'US',
  phone         TEXT,
  is_default    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_profile_id ON public.addresses(profile_id);

-- Now add the FK from profiles.default_address_id -> addresses.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_profiles_default_address'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT fk_profiles_default_address
      FOREIGN KEY (default_address_id) REFERENCES public.addresses(id)
      ON DELETE SET NULL;
  END IF;
END $$;


-- ══════════════════════════════════════════════════════════════════════════════
-- 2. PRODUCTS & KIT ITEMS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.products (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                      TEXT NOT NULL UNIQUE,
  name                      TEXT NOT NULL,
  short_description         TEXT,
  description               TEXT,                  -- rich text / HTML
  category                  TEXT NOT NULL DEFAULT 'supplement',
  product_type              TEXT NOT NULL DEFAULT 'single'
                              CHECK (product_type IN ('single', 'kit')),

  -- Pricing (all in cents)
  price_cents               INTEGER NOT NULL,
  compare_at_price_cents    INTEGER,
  subscription_price_cents  INTEGER,
  subscription_interval     TEXT
                              CHECK (subscription_interval IN ('month', 'bimonth', 'quarter')),

  -- Inventory
  sku                       TEXT UNIQUE,
  barcode                   TEXT,
  weight_oz                 NUMERIC(8,2),
  stock_quantity            INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold       INTEGER NOT NULL DEFAULT 10,

  -- Visibility & sorting
  is_active                 BOOLEAN NOT NULL DEFAULT true,
  is_featured               BOOLEAN NOT NULL DEFAULT false,
  sort_order                INTEGER NOT NULL DEFAULT 0,

  -- Supplement-specific structured data
  supplement_facts          JSONB,
  -- Expected shape:
  -- {
  --   "serving_size": "2 capsules",
  --   "servings_per_container": 30,
  --   "ingredients": [
  --     { "name": "Vitamin D3", "amount": "2000 IU", "daily_value": "250%" }
  --   ],
  --   "other_ingredients": "...",
  --   "allergen_warning": "..."
  -- }

  -- SEO
  meta_title                TEXT,
  meta_description          TEXT,

  -- Media & taxonomy
  images                    JSONB NOT NULL DEFAULT '[]',
  tags                      TEXT[] NOT NULL DEFAULT '{}',

  -- Stripe integration
  stripe_product_id         TEXT,
  stripe_price_id           TEXT,
  stripe_subscription_price_id TEXT,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug       ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active  ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category   ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_tags       ON public.products USING GIN(tags);

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── kit_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kit_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kit_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (kit_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_kit_items_kit_id ON public.kit_items(kit_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 3. CARTS & CART ITEMS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.carts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id  TEXT,                        -- for anonymous / guest carts
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'converted', 'abandoned')),
  coupon_code TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carts_profile_id ON public.carts(profile_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON public.carts(session_id);

DROP TRIGGER IF EXISTS trg_carts_updated_at ON public.carts;
CREATE TRIGGER trg_carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.cart_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id               UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id            UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity              INTEGER NOT NULL CHECK (quantity > 0),
  is_subscription       BOOLEAN NOT NULL DEFAULT false,
  subscription_interval TEXT
                          CHECK (subscription_interval IN ('month', 'bimonth', 'quarter')),
  price_at_add_cents    INTEGER,
  UNIQUE (cart_id, product_id, is_subscription)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 4. ORDERS & ORDER ITEMS
-- ══════════════════════════════════════════════════════════════════════════════

-- Sequence for human-friendly order numbers: AS-100001, AS-100002, ...
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 100001;

CREATE TABLE IF NOT EXISTS public.orders (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number                TEXT UNIQUE,       -- auto-filled by trigger
  profile_id                  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email                       TEXT,

  status                      TEXT NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending','paid','processing','shipped',
                                  'delivered','cancelled','refunded'
                                )),

  -- Money (all in cents)
  subtotal_cents              INTEGER NOT NULL DEFAULT 0,
  discount_cents              INTEGER NOT NULL DEFAULT 0,
  shipping_cents              INTEGER NOT NULL DEFAULT 0,
  tax_cents                   INTEGER NOT NULL DEFAULT 0,
  total_cents                 INTEGER NOT NULL DEFAULT 0,

  -- Shipping
  shipping_address            JSONB,
  shipping_method             TEXT,
  tracking_number             TEXT,
  tracking_url                TEXT,
  shipped_at                  TIMESTAMPTZ,
  delivered_at                TIMESTAMPTZ,

  -- Stripe
  stripe_checkout_session_id  TEXT,
  stripe_payment_intent_id    TEXT,

  -- Coupon
  coupon_code                 TEXT,
  coupon_id                   UUID,              -- FK added after coupons table

  notes                       TEXT,
  metadata                    JSONB DEFAULT '{}',
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_profile_id   ON public.orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: auto-generate order_number on INSERT
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'AS-' || nextval('public.order_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_order_number ON public.orders;
CREATE TRIGGER trg_orders_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- ─── order_items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name          TEXT NOT NULL,
  product_image         TEXT,
  quantity              INTEGER NOT NULL DEFAULT 1,
  unit_price_cents      INTEGER NOT NULL,
  is_subscription       BOOLEAN NOT NULL DEFAULT false,
  subscription_interval TEXT
                          CHECK (subscription_interval IN ('month', 'bimonth', 'quarter'))
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 5. SUBSCRIPTIONS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id              UUID REFERENCES public.products(id) ON DELETE SET NULL,

  status                  TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'paused', 'cancelled', 'past_due')),
  interval                TEXT NOT NULL
                            CHECK (interval IN ('month', 'bimonth', 'quarter')),
  price_cents             INTEGER NOT NULL,
  quantity                INTEGER NOT NULL DEFAULT 1,

  -- Stripe
  stripe_subscription_id  TEXT UNIQUE,
  stripe_customer_id      TEXT,

  -- Billing period
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,

  shipping_address        JSONB,
  metadata                JSONB DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_profile_id ON public.subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status     ON public.subscriptions(status);

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- 6. COUPONS & COUPON USES
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.coupons (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                    TEXT NOT NULL UNIQUE,
  description             TEXT,
  discount_type           TEXT NOT NULL
                            CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value          INTEGER NOT NULL,          -- percentage (0-100) or cents
  min_order_cents         INTEGER,
  max_uses                INTEGER,
  used_count              INTEGER NOT NULL DEFAULT 0,
  max_uses_per_customer   INTEGER NOT NULL DEFAULT 1,
  applies_to              TEXT NOT NULL DEFAULT 'all'
                            CHECK (applies_to IN ('all', 'specific_products', 'specific_categories')),
  applicable_product_ids  UUID[],
  applicable_categories   TEXT[],
  is_active               BOOLEAN NOT NULL DEFAULT true,
  starts_at               TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now add the deferred FK from orders.coupon_id -> coupons.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_orders_coupon'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT fk_orders_coupon
      FOREIGN KEY (coupon_id) REFERENCES public.coupons(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.coupon_uses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id   UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  used_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_uses_coupon_id  ON public.coupon_uses(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_uses_profile_id ON public.coupon_uses(profile_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 7. REVIEWS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.reviews (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id            UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  profile_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name           TEXT,
  rating                INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title                 TEXT,
  body                  TEXT,
  is_verified_purchase  BOOLEAN NOT NULL DEFAULT false,
  is_approved           BOOLEAN NOT NULL DEFAULT false,
  helpful_count         INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id  ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);


-- ══════════════════════════════════════════════════════════════════════════════
-- 8. LEADS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               TEXT,
  phone               TEXT,                          -- WhatsApp number
  source              TEXT
                        CHECK (source IN ('popup', 'footer', 'blog', 'checkout_abandon')),
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  consent_marketing   BOOLEAN NOT NULL DEFAULT false,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique partial index: one row per email (where email is not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_unique
  ON public.leads(email) WHERE email IS NOT NULL;


-- ══════════════════════════════════════════════════════════════════════════════
-- 9. CUSTOMERS (denormalized admin view)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  default_address JSONB,
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent     INTEGER NOT NULL DEFAULT 0,       -- cents
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- 10. ORDER EVENTS (audit log)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.order_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL
                CHECK (event_type IN (
                  'status_changed','note_added','tracking_updated','refund_issued'
                )),
  old_value   TEXT,
  new_value   TEXT,
  actor       TEXT,                       -- user email or 'system'
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events(order_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 11. TRANSACTIONS (financial)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category        TEXT,
  description     TEXT,
  amount          NUMERIC(10,2) NOT NULL CHECK (amount > 0),  -- always positive
  currency        TEXT NOT NULL DEFAULT 'USD',
  reference_id    UUID,
  reference_type  TEXT CHECK (reference_type IN ('order', 'refund', 'manual')),
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);


-- ══════════════════════════════════════════════════════════════════════════════
-- 12. FINANCIAL GOALS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.financial_goals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  metric      TEXT NOT NULL
                CHECK (metric IN ('revenue', 'profit', 'cogs_ratio', 'orders')),
  target      NUMERIC(10,2) NOT NULL,
  period      TEXT NOT NULL
                CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════════════════════
-- 13. PRODUCTS INVENTORY
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.products_inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,
  sku             TEXT UNIQUE,
  name            TEXT,
  unit_cost       NUMERIC(10,2),
  selling_price   NUMERIC(10,2),
  stock_qty       INTEGER NOT NULL DEFAULT 0,
  reorder_point   INTEGER NOT NULL DEFAULT 10,
  supplier        TEXT,
  category        TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_products_inventory_updated_at ON public.products_inventory;
CREATE TRIGGER trg_products_inventory_updated_at
  BEFORE UPDATE ON public.products_inventory
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- 14. SALES TAX RECORDS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.sales_tax_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  state           TEXT,                    -- US state code, e.g. 'CA'
  tax_rate        NUMERIC(6,4),            -- e.g. 0.0825 for 8.25%
  taxable_amount  NUMERIC(10,2),
  tax_amount      NUMERIC(10,2),
  period          TEXT,                    -- e.g. '2026-03'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_tax_records_period ON public.sales_tax_records(period);
CREATE INDEX IF NOT EXISTS idx_sales_tax_records_state  ON public.sales_tax_records(state);


-- ══════════════════════════════════════════════════════════════════════════════
-- 15. IDEAS BANK
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.ideas (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL DEFAULT 'general'
                      CHECK (category IN ('general', 'product', 'marketing', 'operations', 'tech')),
  priority          TEXT NOT NULL DEFAULT 'medium'
                      CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status            TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'under_review', 'approved', 'discarded')),
  tags              TEXT[] DEFAULT '{}',
  source            TEXT NOT NULL DEFAULT 'manual'
                      CHECK (source IN ('manual', 'after', 'agent')),
  source_message_id TEXT,
  author            TEXT,
  reviewed_by       TEXT,
  reviewed_at       TIMESTAMPTZ,
  votes             INTEGER NOT NULL DEFAULT 0,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ideas_status   ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);

DROP TRIGGER IF EXISTS trg_ideas_updated_at ON public.ideas;
CREATE TRIGGER trg_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- 16. KANBAN (columns + cards)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  position    INTEGER NOT NULL DEFAULT 0,
  color       TEXT NOT NULL DEFAULT '#6B7280',
  wip_limit   INTEGER,                   -- NULL = unlimited
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kanban_cards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id       UUID REFERENCES public.kanban_columns(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  assignee        TEXT,
  priority        TEXT NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  deadline        DATE,
  tags            TEXT[] DEFAULT '{}',
  position        INTEGER NOT NULL DEFAULT 0,
  idea_id         UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  estimated_hours NUMERIC(6,2),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kanban_cards_column_id ON public.kanban_cards(column_id);

DROP TRIGGER IF EXISTS trg_kanban_cards_updated_at ON public.kanban_cards;
CREATE TRIGGER trg_kanban_cards_updated_at
  BEFORE UPDATE ON public.kanban_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- 17. CREATORS & CAMPAIGNS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.creators (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  handle          TEXT,
  platform        TEXT
                    CHECK (platform IN ('instagram', 'tiktok', 'youtube')),
  followers       INTEGER,
  engagement_rate NUMERIC(6,4),            -- e.g. 0.035 = 3.5%
  niche           TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  tier            TEXT
                    CHECK (tier IN ('nano', 'micro', 'macro', 'mega')),
  status          TEXT NOT NULL DEFAULT 'prospect'
                    CHECK (status IN (
                      'prospect','contacted','negotiating','active','paused','ended'
                    )),
  notes           TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_creators_updated_at ON public.creators;
CREATE TRIGGER trg_creators_updated_at
  BEFORE UPDATE ON public.creators
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'planning'
                    CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  start_date      DATE,
  end_date        DATE,
  budget          NUMERIC(10,2),
  actual_spend    NUMERIC(10,2) DEFAULT 0,
  target_metric   TEXT,
  target_value    NUMERIC(10,2),
  actual_value    NUMERIC(10,2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.creator_campaigns (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id          UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  campaign_id         UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  fee                 NUMERIC(10,2),
  content_type        TEXT,
  deliverables        TEXT,
  contract_status     TEXT NOT NULL DEFAULT 'draft'
                        CHECK (contract_status IN ('draft', 'sent', 'signed', 'completed')),
  contract_url        TEXT,
  impressions         INTEGER,
  clicks              INTEGER,
  conversions         INTEGER,
  revenue_attributed  NUMERIC(10,2),
  roi                 NUMERIC(8,4),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_campaigns_creator_id  ON public.creator_campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_campaigns_campaign_id ON public.creator_campaigns(campaign_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- 18. AI AGENT TABLES
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── as_agent_memory ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.as_agent_memory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id    TEXT NOT NULL,
  kind        TEXT NOT NULL
                CHECK (kind IN ('insight', 'action', 'summary', 'alert', 'classification')),
  content     TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_as_agent_memory_agent_id ON public.as_agent_memory(agent_id);

-- ─── as_message_log ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.as_message_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_channel  TEXT,
  source_group    TEXT,
  sender_name     TEXT,
  sender_id       TEXT,
  message_text    TEXT,
  message_type    TEXT NOT NULL DEFAULT 'text'
                    CHECK (message_type IN ('text', 'image', 'audio', 'video')),
  classification  TEXT
                    CHECK (classification IN ('idea', 'task', 'question', 'info', 'order_inquiry')),
  processed       BOOLEAN NOT NULL DEFAULT false,
  target_module   TEXT,
  target_id       UUID,
  agent_response  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_as_message_log_processed ON public.as_message_log(processed);
CREATE INDEX IF NOT EXISTS idx_as_message_log_classification ON public.as_message_log(classification);

-- ─── as_agent_tasks ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.as_agent_tasks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id      TEXT NOT NULL,
  task_type     TEXT,
  input         JSONB DEFAULT '{}',
  output        JSONB DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_as_agent_tasks_agent_id ON public.as_agent_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_as_agent_tasks_status   ON public.as_agent_tasks(status);


-- ══════════════════════════════════════════════════════════════════════════════
-- 19. ROW LEVEL SECURITY (RLS) POLICIES
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_uses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_tax_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_campaigns  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.as_agent_memory    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.as_message_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.as_agent_tasks     ENABLE ROW LEVEL SECURITY;

-- ─── Helper: check if current user is admin ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Users can read their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.is_admin());


-- ─── ADDRESSES ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "addresses_select_own" ON public.addresses;
CREATE POLICY "addresses_select_own" ON public.addresses
  FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "addresses_insert_own" ON public.addresses;
CREATE POLICY "addresses_insert_own" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "addresses_update_own" ON public.addresses;
CREATE POLICY "addresses_update_own" ON public.addresses
  FOR UPDATE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "addresses_delete_own" ON public.addresses;
CREATE POLICY "addresses_delete_own" ON public.addresses
  FOR DELETE USING (auth.uid() = profile_id);


-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
-- Anyone (incl. anon) can read active products
DROP POLICY IF EXISTS "products_select_active" ON public.products;
CREATE POLICY "products_select_active" ON public.products
  FOR SELECT USING (is_active = true);

-- Admins can do everything
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (public.is_admin());


-- ─── KIT ITEMS ───────────────────────────────────────────────────────────────
-- Readable by anyone (product detail pages need this)
DROP POLICY IF EXISTS "kit_items_select_all" ON public.kit_items;
CREATE POLICY "kit_items_select_all" ON public.kit_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "kit_items_admin_all" ON public.kit_items;
CREATE POLICY "kit_items_admin_all" ON public.kit_items
  FOR ALL USING (public.is_admin());


-- ─── CARTS & CART ITEMS ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "carts_select_own" ON public.carts;
CREATE POLICY "carts_select_own" ON public.carts
  FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "carts_insert_own" ON public.carts;
CREATE POLICY "carts_insert_own" ON public.carts
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);

DROP POLICY IF EXISTS "carts_update_own" ON public.carts;
CREATE POLICY "carts_update_own" ON public.carts
  FOR UPDATE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "carts_delete_own" ON public.carts;
CREATE POLICY "carts_delete_own" ON public.carts
  FOR DELETE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own" ON public.cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own" ON public.cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own" ON public.cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own" ON public.cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.profile_id = auth.uid()
    )
  );


-- ─── ORDERS & ORDER ITEMS ────────────────────────────────────────────────────
-- Users can read their own orders
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = profile_id);

-- Admins can read/manage all orders
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all" ON public.orders
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "order_items_admin_all" ON public.order_items;
CREATE POLICY "order_items_admin_all" ON public.order_items
  FOR ALL USING (public.is_admin());


-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "subscriptions_admin_all" ON public.subscriptions;
CREATE POLICY "subscriptions_admin_all" ON public.subscriptions
  FOR ALL USING (public.is_admin());


-- ─── COUPONS ─────────────────────────────────────────────────────────────────
-- Anyone can read active coupons (needed for code validation on storefront)
DROP POLICY IF EXISTS "coupons_select_active" ON public.coupons;
CREATE POLICY "coupons_select_active" ON public.coupons
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "coupons_admin_all" ON public.coupons;
CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "coupon_uses_admin_all" ON public.coupon_uses;
CREATE POLICY "coupon_uses_admin_all" ON public.coupon_uses
  FOR ALL USING (public.is_admin());


-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
-- Anyone can read approved reviews
DROP POLICY IF EXISTS "reviews_select_approved" ON public.reviews;
CREATE POLICY "reviews_select_approved" ON public.reviews
  FOR SELECT USING (is_approved = true);

-- Users can create reviews (for their own profile)
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Admins manage all reviews
DROP POLICY IF EXISTS "reviews_admin_all" ON public.reviews;
CREATE POLICY "reviews_admin_all" ON public.reviews
  FOR ALL USING (public.is_admin());


-- ─── LEADS ───────────────────────────────────────────────────────────────────
-- Anon can insert (signup forms)
DROP POLICY IF EXISTS "leads_insert_anon" ON public.leads;
CREATE POLICY "leads_insert_anon" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Only admins / service_role can read
DROP POLICY IF EXISTS "leads_admin_all" ON public.leads;
CREATE POLICY "leads_admin_all" ON public.leads
  FOR ALL USING (public.is_admin());


-- ─── ADMIN-ONLY TABLES ──────────────────────────────────────────────────────
-- customers, order_events, transactions, financial_goals,
-- products_inventory, sales_tax_records, kanban_columns, kanban_cards,
-- creators, campaigns, creator_campaigns,
-- as_agent_memory, as_message_log, as_agent_tasks
-- Service role bypasses RLS. Authenticated admins get explicit policies.

-- customers
DROP POLICY IF EXISTS "customers_admin_all" ON public.customers;
CREATE POLICY "customers_admin_all" ON public.customers
  FOR ALL USING (public.is_admin());

-- order_events
DROP POLICY IF EXISTS "order_events_admin_all" ON public.order_events;
CREATE POLICY "order_events_admin_all" ON public.order_events
  FOR ALL USING (public.is_admin());

-- transactions
DROP POLICY IF EXISTS "transactions_admin_all" ON public.transactions;
CREATE POLICY "transactions_admin_all" ON public.transactions
  FOR ALL USING (public.is_admin());

-- financial_goals
DROP POLICY IF EXISTS "financial_goals_admin_all" ON public.financial_goals;
CREATE POLICY "financial_goals_admin_all" ON public.financial_goals
  FOR ALL USING (public.is_admin());

-- products_inventory
DROP POLICY IF EXISTS "products_inventory_admin_all" ON public.products_inventory;
CREATE POLICY "products_inventory_admin_all" ON public.products_inventory
  FOR ALL USING (public.is_admin());

-- sales_tax_records
DROP POLICY IF EXISTS "sales_tax_records_admin_all" ON public.sales_tax_records;
CREATE POLICY "sales_tax_records_admin_all" ON public.sales_tax_records
  FOR ALL USING (public.is_admin());

-- kanban_columns
DROP POLICY IF EXISTS "kanban_columns_admin_all" ON public.kanban_columns;
CREATE POLICY "kanban_columns_admin_all" ON public.kanban_columns
  FOR ALL USING (public.is_admin());

-- kanban_cards
DROP POLICY IF EXISTS "kanban_cards_admin_all" ON public.kanban_cards;
CREATE POLICY "kanban_cards_admin_all" ON public.kanban_cards
  FOR ALL USING (public.is_admin());

-- creators
DROP POLICY IF EXISTS "creators_admin_all" ON public.creators;
CREATE POLICY "creators_admin_all" ON public.creators
  FOR ALL USING (public.is_admin());

-- campaigns
DROP POLICY IF EXISTS "campaigns_admin_all" ON public.campaigns;
CREATE POLICY "campaigns_admin_all" ON public.campaigns
  FOR ALL USING (public.is_admin());

-- creator_campaigns
DROP POLICY IF EXISTS "creator_campaigns_admin_all" ON public.creator_campaigns;
CREATE POLICY "creator_campaigns_admin_all" ON public.creator_campaigns
  FOR ALL USING (public.is_admin());

-- as_agent_memory
DROP POLICY IF EXISTS "as_agent_memory_admin_all" ON public.as_agent_memory;
CREATE POLICY "as_agent_memory_admin_all" ON public.as_agent_memory
  FOR ALL USING (public.is_admin());

-- as_message_log
DROP POLICY IF EXISTS "as_message_log_admin_all" ON public.as_message_log;
CREATE POLICY "as_message_log_admin_all" ON public.as_message_log
  FOR ALL USING (public.is_admin());

-- as_agent_tasks
DROP POLICY IF EXISTS "as_agent_tasks_admin_all" ON public.as_agent_tasks;
CREATE POLICY "as_agent_tasks_admin_all" ON public.as_agent_tasks
  FOR ALL USING (public.is_admin());

-- ─── IDEAS: public read for approved (roadmap) + admin full ──────────────────
DROP POLICY IF EXISTS "ideas_select_approved" ON public.ideas;
CREATE POLICY "ideas_select_approved" ON public.ideas
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "ideas_admin_all" ON public.ideas;
CREATE POLICY "ideas_admin_all" ON public.ideas
  FOR ALL USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════════════════════
-- 20. SEED DATA
-- ══════════════════════════════════════════════════════════════════════════════

-- Kanban default columns (idempotent via ON CONFLICT)
INSERT INTO public.kanban_columns (name, slug, position, color)
VALUES
  ('Backlog',     'backlog',     0, '#6B7280'),
  ('To Do',       'todo',        1, '#3B82F6'),
  ('In Progress', 'in-progress', 2, '#F59E0B'),
  ('Done',        'done',        3, '#10B981')
ON CONFLICT (slug) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- Done! All tables, indexes, triggers, RLS policies, and seed data are ready.
-- ══════════════════════════════════════════════════════════════════════════════
