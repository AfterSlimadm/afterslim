-- Migration: Create documents table
-- Run this in Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'contract',
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
