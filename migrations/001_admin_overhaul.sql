-- ============================================================================
-- AfterSlim Admin Overhaul Migration
-- Run AFTER the base supabase-migrations.sql
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. ADMIN USERS (partner management with roles)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'admin'
                    CHECK (role IN ('owner', 'admin', 'viewer')),
  invited_by      UUID REFERENCES auth.users(id),
  invited_at      TIMESTAMPTZ,
  last_login_at   TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. AUDIT LOG (track all admin actions)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id),
  user_name       TEXT,
  action          TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       TEXT,
  old_value       JSONB,
  new_value       JSONB,
  metadata        JSONB DEFAULT '{}',
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. STORE SETTINGS (key-value config that actually persists)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.store_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key             TEXT NOT NULL UNIQUE,
  value           JSONB NOT NULL,
  updated_by      UUID REFERENCES auth.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default settings
INSERT INTO public.store_settings (key, value) VALUES
  ('store_name', '"AfterSlim"'),
  ('support_email', '"suporte@afterslim.com"'),
  ('currency', '"BRL"'),
  ('timezone', '"America/Sao_Paulo"'),
  ('free_shipping_threshold', '199'),
  ('default_tax_rate', '0'),
  ('maintenance_mode', 'false'),
  ('notifications', '{"new_orders": true, "low_stock": true, "agent_alerts": true, "weekly_summary": true}')
ON CONFLICT (key) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. IDEA COMMENTS (collaborative brainstorming)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id         UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  agent_id        TEXT,
  author_name     TEXT,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idea_comments_idea ON public.idea_comments(idea_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. RLS POLICIES
-- ──────────────────────────────────────────────────────────────────────────────

-- Helper: check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if current user is owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'owner' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_select" ON public.admin_users
  FOR SELECT USING (public.is_admin_user());
CREATE POLICY "admin_users_insert" ON public.admin_users
  FOR INSERT WITH CHECK (public.is_owner());
CREATE POLICY "admin_users_update" ON public.admin_users
  FOR UPDATE USING (public.is_owner());
CREATE POLICY "admin_users_delete" ON public.admin_users
  FOR DELETE USING (public.is_owner());

-- audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_select" ON public.audit_log
  FOR SELECT USING (public.is_admin_user());
CREATE POLICY "audit_log_insert" ON public.audit_log
  FOR INSERT WITH CHECK (public.is_admin_user());

-- store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "store_settings_select" ON public.store_settings
  FOR SELECT USING (public.is_admin_user());
CREATE POLICY "store_settings_upsert" ON public.store_settings
  FOR ALL USING (public.is_admin_user());

-- idea_comments
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "idea_comments_select" ON public.idea_comments
  FOR SELECT USING (public.is_admin_user());
CREATE POLICY "idea_comments_insert" ON public.idea_comments
  FOR INSERT WITH CHECK (public.is_admin_user());

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. UPDATE IDEAS TABLE - add source column if missing
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ideas' AND column_name = 'source'
  ) THEN
    ALTER TABLE public.ideas ADD COLUMN source TEXT DEFAULT 'manual'
      CHECK (source IN ('manual', 'agent', 'whatsapp'));
  END IF;
END $$;
