# AfterSlim Project

## Overview
AfterSlim is a US-market nutraceuticals/supplements e-commerce business with a complete internal management system and AI agent team.

## Architecture
- **afterslim-store/** — Public e-commerce storefront (Next.js 15 + Tailwind v4 + shadcn/ui)
- **afterslim-admin/** — Private management dashboard (Next.js 15 + Tailwind v4 + shadcn/ui)
- **afterslim-after/** — WhatsApp bot "After" (Node.js, planned)
- **shared/** — Shared TypeScript types (planned)
- Both apps share the SAME Supabase project (database + auth + storage)

## Tech Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Zustand 5 (state management)
- Stripe (payments, deferred)
- OpenClaw (AI agents on VPS 217.216.89.234, dedicated AfterSlim folder)
- @dnd-kit (Kanban), Recharts (charts), TanStack Table (data tables)
- MDX blog, Resend (email)

## Supabase
- Project ID: qutpbtazoxlaegievmew
- URL: https://qutpbtazoxlaegievmew.supabase.co
- All migrations in supabase-migrations.sql (already executed)

## OpenClaw VPS
- IP: 217.216.89.234
- Dedicated AfterSlim folder — DO NOT touch other project files/agents
- Agent IDs: as-after, as-legal, as-marketing, as-management, as-content, as-engagement, as-analytics

## Key Conventions
- All money values stored in CENTS (integer) in database
- US English everywhere (not Portuguese)
- USD currency formatting
- Order numbers: AS-XXXXXX (auto-generated via sequence)
- FDA compliance: supplement_facts JSONB on products, disclaimer on all product pages + footer
- Brand colors: Emerald green (#1B6B4A) primary, Amber (#F5A623) secondary, Off-white (#F8FAF9) surface

## Related Projects (DO NOT TOUCH)
- C:\Users\vitoo\OneDrive\Documentos\Digital\HERMES — Handoff.ai (different project)
- C:\Users\vitoo\OneDrive\Documentos\Digital\Approved Ideas — CaseApproved (different project)
- vendacomleo — different project

## Store runs on port 3000, Admin on port 3001
