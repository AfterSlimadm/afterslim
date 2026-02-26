-- ══════════════════════════════════════════════════════════════════════════════
-- Migration: Rename "hermes" to "after" in ideas.source CHECK constraint
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Drop old constraint
ALTER TABLE public.ideas DROP CONSTRAINT IF EXISTS ideas_source_check;

-- 2. Add updated constraint
ALTER TABLE public.ideas ADD CONSTRAINT ideas_source_check
  CHECK (source IN ('manual', 'after', 'agent'));

-- 3. Update any existing rows that still have 'hermes'
UPDATE public.ideas SET source = 'after' WHERE source = 'hermes';

-- 4. Update any seed data agent IDs
UPDATE public.as_agent_memory SET agent_id = 'as-after' WHERE agent_id = 'as-hermes';
UPDATE public.as_agent_tasks  SET agent_id = 'as-after' WHERE agent_id = 'as-hermes';
UPDATE public.as_message_log  SET sender_name = 'as-after' WHERE sender_name = 'as-hermes';
