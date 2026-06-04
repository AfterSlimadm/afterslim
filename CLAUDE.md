# AfterSlim Project

## Overview
AfterSlim is a US-market GLP-1 companion probiotic. Daily capsule designed for the gut side effects on Mounjaro, Ozempic, Wegovy, and Zepbound. The legal entity is VQ Group LLC (FL).

## Repos in this folder
- `afterslim-lp/` — Public landing page + customer account area. Plain HTML/CSS/JS, deployed to Vercel as a static site. The /account/ subtree is gated by Supabase Auth via the `js/supabase-client.js` helper. NOT Next.js.
- `afterslim-admin/` — Internal back-office (kept in a sibling repo, cloned at `../afterslimadm-real/afterslim-admin/`). Next.js 15 + Tailwind v4 + shadcn/ui. Hosts the /api/checkout route the LP calls into.
- `bottle3d/` — Blender pipeline for the 3D bottle render. Waiting on vector files from Eagle Labs.

## Auth
- **Google Sign In only.** Google Identity Services renders the One Tap prompt and the standard button on /account/login and /account/signup. Tokens go to Supabase via `signInWithIdToken`, no email/password, no Cloudflare Turnstile.
- Google Cloud project `afterslim`. OAuth Client ID `306360274988-8t7r8lb0hmqf6if4kdc0bl58ch9pbbf1.apps.googleusercontent.com`. Authorized JS origins: `https://www.afterslim.com`, `https://afterslim.com`. Redirect URI: `https://qutpbtazoxlaegievmew.supabase.co/auth/v1/callback`.
- Publishing status: **In Production** (no unverified-app warning).

## Supabase
- Project ID: `qutpbtazoxlaegievmew`
- URL: `https://qutpbtazoxlaegievmew.supabase.co`
- Custom SMTP wired to Resend (`smtp.resend.com:465`, user `resend`, sender `noreply@afterslim.com`, display name `AfterSlim`). Built-in service is disabled.
- Auth bot protection (Cloudflare Turnstile) is **off** in Attack Protection. Will be re-enabled with the Invisible widget once Cloudflare access is granted.
- All migrations are in `supabase-migrations.sql` + the `migrations/` folder in the admin repo.

## Email templates
Branded HTML stored directly in Supabase Auth > Emails > Templates. Updates currently shipped: Confirm sign up, Reset password, Magic link/OTP, Change email address. Each renders the AfterSlim logo, orange #ea580c CTA, VQ Group LLC footer.

## Analytics + ads
- Google Tag Manager `GTM-WVF2ZGCL` ships GA4 (`G-LCTNMWWXWB`) and the Google Ads conversion (id `18141752970`).
- TikTok Pixel `D8CTDJ3C77UBL2TTU6E0` on every page; server-side Events API dedup is wired in the admin checkout webhook.
- PostHog `phc_M05Y8p9sTGkPpIEjIqsczpA0dVMW4cvYtkMX7BVgLfS` for session replay and product analytics, project owner `afterslimtm@gmail.com`.

## OpenClaw VPS
- IP: 217.216.89.234
- Dedicated AfterSlim folder. **Do not touch other project files/agents.**
- Agent IDs: as-after, as-legal, as-marketing, as-management, as-content, as-engagement, as-analytics.

## Brand
- Color: **orange `#ea580c`** primary, `#c2410c` dark, `#fff3e6` tint. (Older docs mention emerald — that is wrong, ignore.)
- US English everywhere.
- USD currency, money stored in cents (integer) in the database.
- Order numbers: `AS-XXXXXX`.
- No em dashes in copy (admin or LP).
- DTC convention: "sale" not "promotion", direct Shopify-style language, not corporate.

## Deploys
- Vercel team `afterslim-9439's projects` is on the Hobby plan, which only deploys commits authored by `afterslim-9439 <afterslimtm@gmail.com>`. Configure git author before committing.

## Related projects (do not touch)
- `C:\Users\vitoo\OneDrive\Documentos\Digital\HERMES` — Handoff.ai
- `C:\Users\vitoo\OneDrive\Documentos\Digital\Approved Ideas` — CaseApproved
- vendacomleo
