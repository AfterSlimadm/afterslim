# AfterSlim — Landing Page Repo

This GitHub repo (`AfterSlimadm/afterslim`) is the source of truth for the public
landing page deployed at **afterslim.com**.

## Deploy targets

| What                 | Where                   | Vercel project | This repo |
| -------------------- | ----------------------- | -------------- | --------- |
| Landing page         | afterslim.com           | `afterslim`    | YES — `afterslim-lp/` |
| Admin dashboard      | admin.afterslim.com     | `adm.afterslim`| **NO** — separate repo `AfterSlim/afterslimadm` |

Any commit touching `afterslim-lp/` here triggers a Vercel deploy of afterslim.com.

## What used to be in `afterslim-admin/`

The folder existed in early dev but was never the deploy source. The real admin
codebase lives in the `AfterSlim/afterslimadm` repo. The stale copy here was
removed on 2026-05-31 to avoid confusion (developers thought edits here would
ship to admin.afterslim.com — they would not).

If you need to change the admin, clone `AfterSlim/afterslimadm`.

## Repo contents

- `afterslim-lp/` — the actual landing page (HTML/JS/CSS, deployed to Vercel)
- `content-engine/` — content automation tools (not deployed; local use)
- `migrations/` + `supabase-migrations*.sql` — Supabase migration history
- `design-system.html` — design reference (static)
- `seed*` — development seed data
- `CLAUDE.md` — agent / AI working notes
- `TIKTOK-PIXEL-SETUP.md` — TikTok Pixel + Events API integration doc

## Quick links

- LP local dev: open `afterslim-lp/index.html` in a browser, or serve the folder
- Production: https://www.afterslim.com
- Vercel: https://vercel.com/afterslim-9439s-projects/afterslim
- Admin (other repo): https://github.com/AfterSlim/afterslimadm
