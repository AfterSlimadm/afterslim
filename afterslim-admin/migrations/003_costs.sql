-- Migration: Create costs table
-- Run this in Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL DEFAULT 'other',
  paid_by text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_costs_paid_by ON costs(paid_by);
CREATE INDEX IF NOT EXISTS idx_costs_date ON costs(date DESC);
CREATE INDEX IF NOT EXISTS idx_costs_category ON costs(category);
