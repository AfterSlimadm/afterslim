# AfterSlim Partner Program — Source of truth

> Final rules for the two-tier partner program. Both the LP repo
> (`afterslim/afterslim-lp/`) and the admin repo (`afterslim-admin/`)
> read from this file. Any chat (LP, admin, design, legal) updates here
> when a decision changes. Latest revision wins.

Last revised: 2026-06-06.

## Tier 1 — Ambassadors (creators / influencers)

**Who.** Approved creators with audience reach: weight-loss, GLP-1,
gut health, women 35+, nurses / dietitians / telehealth coaches.

**How they apply.** Manual application via
`https://www.afterslim.com/partner-with-us/ambassadors`. Form posts to
`/api/affiliate/apply` on the admin. Admin reviews by hand. No
automatic approvals.

**Commission.** **40% of the net price paid** by the buyer (after
discount, excluding shipping and tax) **for the first 6 months** from
the ambassador's `approved_at` timestamp.

**After 6 months.** Reviewed individually in the admin. Ambassadors
who delivered real volume keep 40%. The rest drop to 25%. Communicated
in the contract and the landing copy as "Founding Ambassador rate" so
there is no surprise.

**Discount their audience gets.** Each ambassador is issued a unique
Stripe Coupon code (e.g. `JANE10`) that gives the buyer **10% off** at
checkout. Every order using that code attributes commission to the
ambassador. The Stripe Coupon is created via a single API call at the
moment of approval (not in batch).

**Referral link.** Same ambassador also gets a referral link
(`?ref=CODE`) that tracks via a 90-day cookie, matching the AfterSlim
90-day satisfaction guarantee. Both code and link attribute to the
same ambassador.

**Payout.** Monthly, in USD, paid after the order clears the 90-day
refund window. **MVP payout: ACH manual.** Admin lists pending payouts
in a dashboard tab, exports a CSV, the bookkeeper pushes them. Stripe
Connect (with KYC, 1099, AML onboarding) is parked until volume
justifies the build.

## Tier 2 — Resellers (customer referrals)

**Who.** Any signed-in AfterSlim customer. **Open enrollment, no
approval needed.** Reseller row is created automatically on profile
creation (trigger on `profiles`, not `auth.users`).

**Why no approval.** Credit is paid on real paid orders, not on
clicks or signups. To abuse this at scale a fraudster would have to
orchestrate dozens of real purchases on different cards every month,
which costs more than the credit they earn.

**Where they see it.** Inline on the `/account` dashboard. A "Refer a
friend" card shows their unique link, unique referral code, current
store-credit balance, and a feed of orders that paid out.

**Commission.** **15% of the net price paid** by the referred buyer
(after discount, excluding shipping and tax), credited as **store
credit** in the existing ledger (same table that powers the 5%
cashback). Not cash. Never converts to cash.

**Discount the friend gets.** **10% off** at checkout, applied
automatically when the referral link or code is used. Stripe Coupon
for resellers can be a single global code (e.g. `REFER10`) with
attribution carried by the `referral_code` column on the order, since
no unique discount per reseller is needed.

**Monthly cap.** **$100 of store credit per reseller per month.**
Anything credited above $100 in a single calendar month is **dropped,
not queued**. Reseller real almost never hits the cap; the cap exists
purely to neuter sock-puppet farms.

**Anti-abuse.**
- Block self-referral by matching email + payment fingerprint + IP/24.
- Cookie window for attribution: 90 days, matches the guarantee.
- Refund inverts the credit (debits the reseller).

## Order-side attribution

A single optional field, `referral_code`, on `/api/checkout` carries
everything. The admin server:

1. Looks up `creators.coupon_code` (ambassador) and
   `customer_referrals.referral_code` (reseller).
2. Applies the 10% Stripe Coupon (per-ambassador for tier 1, global
   `REFER10` for tier 2).
3. Persists `referrer_type` + `referrer_id` + `referral_code` on the
   order so the commission trigger fires when the order clears.

LP captures the code from `?ref=`, drops it in a 90-day cookie, and
passes it to `/api/checkout`.

## Refund handling

When an order is refunded:
- **Ambassador.** Pending commission is voided. If the commission was
  already paid out, debit the next payout balance.
- **Reseller.** Store credit already granted is reversed in the
  ledger. If the reseller already spent the credit, the balance goes
  negative until earned back.

## Architecture (split of work)

**LP repo** (`afterslim-lp/`) — handled by the LP chat:
- `/partner-with-us` — hub with two cards (Ambassador + Reseller).
- `/partner-with-us/ambassadors` — landing focused on the creator
  pitch + apply form.
- `/partner-with-us/resellers` — landing focused on customer-refers-a-
  friend pitch + explainer.
- `/account` — inline "Refer a friend" card (depends on
  `/api/referrals/me`).
- Footer keeps a single "Partner with us" link.

**Admin repo** (`afterslim-admin/`) — handled by the admin chat:
- Store credit ledger (the missing piece — prerequisite for the 5%
  cashback and the reseller 15%, shared table).
- Two tables: `creators` extended with `commission_window_ends_at`
  for tier 1; new `customer_referrals` for tier 2.
- Trigger on `profiles` that auto-creates a `customer_referrals` row
  on signup.
- Commission trigger on paid orders (calculates rate, respects cap,
  reverses on refund).
- Admin pages: `/admin/ambassadors`, `/admin/resellers`,
  `/admin/payouts`.
- Endpoints: `/api/affiliate/apply` (apply), `/api/referrals/me`
  (LP fetch), `/api/checkout` (accept `referral_code`).
- Stripe Coupon created on Approve.

## Open questions

None at the time of this writing. Update this section if either chat
hits a fork that needs a decision.
