-- ══════════════════════════════════════════════════════════════════════════════
-- AfterSlim — Migration 002: Store Credit Ledger + Support Tickets
-- Generated: 2026-05-26
--
-- Idempotent: re-runnable without errors. Every CREATE uses IF NOT EXISTS
-- and policies are dropped before re-created.
--
-- Adds:
--   * customer_credit_transactions  (event-sourced 5%-back ledger)
--   * customer_credit_balance       (view: SUM of transactions per profile)
--   * support_tickets               (ST-XXXXXX, status, category)
--   * support_ticket_messages       (threaded customer ⇄ staff)
-- ══════════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════════
-- A. STORE CREDIT (5% BACK)
-- ══════════════════════════════════════════════════════════════════════════════
--
-- Event-sourced ledger: positive amount_cents = earn, negative = spend.
-- Balance is the SUM. Cleaner than caching a balance column because every
-- mutation has a row, so we always have a complete audit trail for refunds,
-- adjustments, and customer service.

CREATE TABLE IF NOT EXISTS public.customer_credit_transactions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents   INTEGER NOT NULL,                          -- + earn, - spend
  type           TEXT NOT NULL
                   CHECK (type IN ('earn', 'spend', 'adjust', 'expire')),
  order_id       UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  description    TEXT,                                      -- shown to customer
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_profile
  ON public.customer_credit_transactions(profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_tx_order
  ON public.customer_credit_transactions(order_id);

-- Balance view (live SUM, no caching)
CREATE OR REPLACE VIEW public.customer_credit_balance AS
SELECT
  profile_id,
  COALESCE(SUM(amount_cents), 0) AS balance_cents
FROM public.customer_credit_transactions
GROUP BY profile_id;


-- ══════════════════════════════════════════════════════════════════════════════
-- B. SUPPORT TICKETS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE SEQUENCE IF NOT EXISTS public.ticket_number_seq START 100001;

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number  TEXT UNIQUE,                                -- auto-filled
  profile_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject        TEXT NOT NULL,
  category       TEXT,                                       -- order_issue, subscription, refund, product, partnership, other
  status         TEXT NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
  order_id       UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  -- Assigned staff (admin profile). NULL until someone picks it up.
  assigned_to    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_profile
  ON public.support_tickets(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status
  ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order
  ON public.support_tickets(order_id);

DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-generate ticket_number on INSERT (ST-XXXXXX, mirrors AS-XXXXXX style)
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := 'ST-' || nextval('public.ticket_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_support_tickets_number ON public.support_tickets;
CREATE TRIGGER trg_support_tickets_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_number();

-- Ticket thread messages (customer + staff)
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id     UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_type   TEXT NOT NULL CHECK (author_type IN ('customer', 'staff')),
  author_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body          TEXT NOT NULL,
  -- Internal staff notes never visible to the customer
  is_internal   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket
  ON public.support_ticket_messages(ticket_id, created_at);


-- ══════════════════════════════════════════════════════════════════════════════
-- C. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════════════════

-- Helper: is the current JWT an admin role?  Mirrors what existing policies use.
-- (If you already have a public.is_admin() helper from migrations.sql, this is
-- a no-op.)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ─── customer_credit_transactions ──────────────────────────────────────────
ALTER TABLE public.customer_credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers see own credit transactions"
  ON public.customer_credit_transactions;
CREATE POLICY "Customers see own credit transactions"
  ON public.customer_credit_transactions FOR SELECT
  USING (auth.uid() = profile_id OR public.is_admin());

DROP POLICY IF EXISTS "Only admin writes credit transactions"
  ON public.customer_credit_transactions;
CREATE POLICY "Only admin writes credit transactions"
  ON public.customer_credit_transactions FOR INSERT
  WITH CHECK (public.is_admin());
-- (no UPDATE/DELETE policy: an event-sourced ledger should never be mutated;
-- mistakes get a compensating transaction)


-- ─── support_tickets ────────────────────────────────────────────────────────
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers see own tickets" ON public.support_tickets;
CREATE POLICY "Customers see own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = profile_id OR public.is_admin());

DROP POLICY IF EXISTS "Customers open own tickets" ON public.support_tickets;
CREATE POLICY "Customers open own tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Customers update own tickets" ON public.support_tickets;
CREATE POLICY "Customers update own tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = profile_id OR public.is_admin());


-- ─── support_ticket_messages ────────────────────────────────────────────────
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Customer can read non-internal messages on their tickets; admin sees all.
DROP POLICY IF EXISTS "View messages on own tickets"
  ON public.support_ticket_messages;
CREATE POLICY "View messages on own tickets"
  ON public.support_ticket_messages FOR SELECT
  USING (
    public.is_admin()
    OR (
      NOT is_internal
      AND ticket_id IN (
        SELECT id FROM public.support_tickets WHERE profile_id = auth.uid()
      )
    )
  );

-- Customer can add messages to their own tickets (always non-internal).
DROP POLICY IF EXISTS "Customers reply to own tickets"
  ON public.support_ticket_messages;
CREATE POLICY "Customers reply to own tickets"
  ON public.support_ticket_messages FOR INSERT
  WITH CHECK (
    author_type = 'customer'
    AND is_internal = false
    AND author_id = auth.uid()
    AND ticket_id IN (
      SELECT id FROM public.support_tickets WHERE profile_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- END Migration 002
-- ══════════════════════════════════════════════════════════════════════════════
