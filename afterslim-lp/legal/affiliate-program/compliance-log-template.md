# AfterSlim Affiliate Program: Compliance Log Template

**Last Updated:** [INSERT EFFECTIVE DATE]
**Version:** 1.0
**Audience:** AfterSlim internal team only. **Do NOT share with Affiliates.**

> **NOTICE:** This document is not legal advice and is intended as a starting framework subject to legal review. It defines the structure of the operational records the AfterSlim team must keep to demonstrate good-faith administration of the Affiliate Program. If the FTC, FDA, a state attorney general, or a plaintiff's lawyer ever asks "how do you administer this program?", the answer is this log.

---

## Why This Exists

Two reasons:

1. **Defensibility.** A clean, consistent, contemporaneous log is the single most useful piece of evidence to show that AfterSlim does not turn a blind eye to affiliate misconduct. The FTC has specifically looked at whether brands have internal compliance programs as a factor in deciding how aggressively to act.

2. **Operational consistency.** Three people (Allan, Henrique, Vitor) plus future hires need to enforce the same rules the same way. Memory is not a system. Logs are.

---

## Storage and Access

- **Recommended storage:** A Supabase table or Notion database with audit trail, restricted access, and append-only history. A shared Google Sheet is acceptable for the validation phase but becomes risky at scale (revision history can be edited, no real access control).
- **Recommended access (write):** Allan, Henrique, Vitor.
- **Recommended access (read-only):** Designated advisors, future counsel, anyone preparing periodic audits.
- **Retention:** Minimum 7 years from the date of the last entry related to an affiliate (covers IRS recordkeeping and most statutes of limitations).
- **Backup:** Weekly export to a separate secure location (e.g., encrypted cloud storage outside the primary work account).

**Critical rule:** Once written, log entries should not be edited or deleted. To make a correction, add a new entry that supersedes the prior one, and reference the prior entry's ID. This preserves the audit trail.

---

## 1. Approval Log

Records every affiliate application decision. Lives at the application level, not the affiliate level (so re-applications by the same person create new rows).

| Field | Type | Required | Notes |
|---|---|---|---|
| `application_id` | UUID | Yes | Primary key. |
| `submitted_at` | Timestamp (ISO 8601) | Yes | When the application was submitted. |
| `applicant_name` | Text | Yes | Legal name as submitted. |
| `applicant_email` | Text | Yes | |
| `applicant_handle_primary` | Text | Yes | Main social handle they will promote on. |
| `applicant_country` | Text | Yes | Auto-populated from signup. |
| `requested_slug` | Text | Yes | The slug they proposed. |
| `decision` | Enum | Yes | `approved`, `rejected`, `deferred`. |
| `decision_at` | Timestamp | Yes | When the decision was made. |
| `decision_by` | Text | Yes | Name of decision-maker. |
| `decision_reason` | Text | Yes | One-line rationale even for approvals (e.g., "real audience, US-based, aligned vertical"). For rejections, the specific reason. |
| `notes` | Long text | No | Anything relevant for audit later. |
| `linked_affiliate_id` | UUID | No | Populated for approvals; the affiliate record this creates. |

**Required rationale for rejections:** Always document the rejection reason. Even though the Agreement allows rejection without cause, documenting cause protects against later claims of bias or arbitrariness.

**Example row (filled):**

```
application_id:           a1b2c3d4-...
submitted_at:             2026-06-12T14:23:11-04:00
applicant_name:           Jane Doe
applicant_email:          jane@example.com
applicant_handle_primary: @janedoe (Instagram)
applicant_country:        United States
requested_slug:           janedoe
decision:                 approved
decision_at:              2026-06-13T10:02:00-04:00
decision_by:              Vitor
decision_reason:          11.4k engaged followers, US-based, gut health vertical, W-9 received, no red flags in past content.
notes:                    Sent welcome kit + FTC guide. Confirmed FDA disclaimer understanding by reply.
linked_affiliate_id:      aff_9f8e7d6c-...
```

---

## 2. Content Review Log

Records periodic content reviews of active affiliates. Used to demonstrate proactive monitoring.

| Field | Type | Required | Notes |
|---|---|---|---|
| `review_id` | UUID | Yes | Primary key. |
| `reviewed_at` | Timestamp | Yes | When the review happened. |
| `reviewer` | Text | Yes | Who did the review. |
| `affiliate_id` | UUID | Yes | FK to affiliate. |
| `platform` | Enum | Yes | `instagram`, `tiktok`, `youtube`, `blog`, `email`, `other`. |
| `content_url` | Text | Yes | Direct URL to the post. |
| `content_archived_url` | Text | No | archive.org/save URL or path to local screenshot. |
| `screenshot_ref` | Text | Yes | Path or filename of saved screenshot. |
| `claim_assessment` | Enum | Yes | `compliant`, `borderline`, `non_compliant`. |
| `disclosure_assessment` | Enum | Yes | `compliant`, `borderline`, `non_compliant`. |
| `disclaimer_assessment` | Enum | Yes | `compliant`, `borderline`, `non_compliant`, `not_applicable`. |
| `action_taken` | Enum | Yes | `none`, `note_only`, `informal_message`, `escalated_to_violation_level_1+`. |
| `violation_id` | UUID | No | If escalated, FK to Violation Log. |
| `notes` | Long text | No | |

**Cadence:**

- **Random sample:** Vitor reviews **at least 10%** of active affiliates' recent posts each month, with no affiliate excluded for more than one cycle.
- **Targeted:** Any affiliate with prior Level 1+ incidents is reviewed at **2x** baseline frequency for the next 6 months.
- **New affiliate:** Every approved affiliate's first 30 days of content are reviewed once during week 1 and once during week 4.

---

## 3. Violation Log

Records every confirmed compliance incident, regardless of severity.

| Field | Type | Required | Notes |
|---|---|---|---|
| `violation_id` | UUID | Yes | Primary key. |
| `detected_at` | Timestamp | Yes | When the issue was first identified. |
| `detected_by` | Text | Yes | Who identified it (team member, automated scan, customer complaint). |
| `source` | Enum | Yes | `internal_review`, `customer_complaint`, `platform_takedown`, `automated_monitor`, `external_inquiry`. |
| `affiliate_id` | UUID | Yes | FK to affiliate. |
| `platform` | Text | Yes | |
| `content_url` | Text | Yes | URL of violating content. |
| `archived_url` | Text | Yes (if public URL) | archive.org/save copy. |
| `screenshot_ref` | Text | Yes | Path to screenshot bundle. |
| `agreement_section` | Text | Yes | Specific clause(s) violated (e.g., "Agreement §10.2(b), Guidelines §2.2"). |
| `severity` | Enum | Yes | `level_1`, `level_2`, `level_3`, `level_4`. |
| `severity_set_by` | Text | Yes | Decision-maker (and co-decision-maker if Level 2+). |
| `severity_set_at` | Timestamp | Yes | |
| `email_sent_at` | Timestamp | Yes | When the notice was sent. |
| `email_template_used` | Text | Yes | Reference the template version. |
| `cure_window_ends_at` | Timestamp | Yes (L1, L2) | When the affiliate must have corrected by. |
| `affiliate_response_at` | Timestamp | No | When the affiliate replied. |
| `affiliate_response_summary` | Long text | No | |
| `resolution` | Enum | Yes | `cured`, `escalated`, `terminated`, `appealed`, `appeal_upheld`, `appeal_overturned`, `pending`. |
| `resolution_at` | Timestamp | When resolved | |
| `payout_hold_amount` | Currency | No | If applicable. |
| `payout_clawback_amount` | Currency | No | If applicable. |
| `notes` | Long text | No | |

**Important:** Every violation gets a row, even if it self-cures. The history matters for tracking repeat offenders and for showing the FTC consistent administration.

---

## 4. Communication Log

Records every compliance-related communication to or from affiliates. Optional for casual messages; required for any formal notice.

| Field | Type | Required | Notes |
|---|---|---|---|
| `comm_id` | UUID | Yes | Primary key. |
| `sent_at` | Timestamp | Yes | |
| `direction` | Enum | Yes | `outbound`, `inbound`. |
| `from_party` | Text | Yes | "AfterSlim Compliance" or affiliate name. |
| `to_party` | Text | Yes | |
| `subject` | Text | Yes | Exact subject line. |
| `body_ref` | Text | Yes | Path to full saved copy (PDF, EML, or screenshot of email thread). |
| `linked_violation_id` | UUID | No | If related to a violation. |
| `linked_appeal_id` | UUID | No | If related to an appeal. |
| `team_recipient_cc` | Text | No | Who was CC'd internally. |
| `notes` | Long text | No | |

**Storage tip:** Save the original email (.eml or .pdf) in a structured folder: `/legal/compliance/comms/{affiliate_id}/{YYYY-MM-DD}_{subject_slug}.pdf`. Reference that path in `body_ref`.

---

## 5. Training & Onboarding Log

Records that every affiliate received and acknowledged compliance materials. This is what answers the FTC question: "How do you make sure affiliates know the rules?"

| Field | Type | Required | Notes |
|---|---|---|---|
| `training_id` | UUID | Yes | Primary key. |
| `affiliate_id` | UUID | Yes | FK to affiliate. |
| `event_type` | Enum | Yes | `welcome_kit_sent`, `agreement_accepted`, `guidelines_acknowledged`, `ftc_guide_sent`, `policy_update_sent`. |
| `event_at` | Timestamp | Yes | |
| `delivery_method` | Enum | Yes | `signup_flow`, `welcome_email`, `dashboard_modal`, `direct_message`. |
| `acknowledgment_received` | Boolean | Yes | True if the affiliate clicked-through, replied, or otherwise confirmed. |
| `acknowledgment_at` | Timestamp | If `true` | |
| `version_ref` | Text | Yes | Version of the document delivered (e.g., "agreement-v1.0", "guidelines-v1.0"). |
| `notes` | Long text | No | |

**Required onboarding events:**

- `agreement_accepted` (captured during signup, with clickwrap signature timestamp).
- `welcome_kit_sent` (within 24 hours of approval, includes Content Guidelines and FTC Disclosure Guide).
- `guidelines_acknowledged` (reply or dashboard click confirming review).

**Critical:** Save the actual version of the Agreement that each affiliate signed. If the Agreement is later updated, the affiliate's original acceptance is to v1.0, not to v1.1. Use the `version_ref` field to keep track.

---

## 6. Periodic Audit Checklist

Run this checklist at least **monthly**. Record completion in the audit log (Section 7). Quarterly audits should include all items; monthly audits may rotate.

### Affiliate health
- [ ] Number of affiliates by status: Active, Pending, Rejected, Revoked, Banned.
- [ ] Active affiliates with no posts in the past 60 days. (Possible cleanup target.)
- [ ] Active affiliates with no W-9 on file. (Should be 0; if not, flag for backup withholding setup.)
- [ ] Active affiliates whose handle/audience has materially changed since approval.

### Content compliance
- [ ] Random sample of recent posts from at least 10% of active affiliates reviewed in [Content Review Log](#2-content-review-log).
- [ ] % of reviewed posts assessed `compliant` on disclosure.
- [ ] % of reviewed posts assessed `compliant` on FDA disclaimer (where applicable).
- [ ] % of reviewed posts assessed `compliant` on Approved Claims usage.
- [ ] Any patterns or repeat issues identified, summarized.

### Violations
- [ ] Number of violations opened this month, by level.
- [ ] Number of violations resolved this month, by resolution type.
- [ ] Number of open violations beyond their cure window. (Should be 0; if not, escalate.)
- [ ] Any appeals filed, status of each.

### Payouts
- [ ] Total payouts processed this month (count and amount).
- [ ] Number of payouts on hold for compliance, with reasons.
- [ ] Number of payouts subject to 24% backup withholding.
- [ ] 1099-NEC year-to-date tracker: count of affiliates approaching or past $2,000 USD year-to-date.

### Brand integrity
- [ ] Manual check for paid ads bidding on "AfterSlim" (search "afterslim" + variants on Google, Bing, Meta Ads Library).
- [ ] Manual check for fake review patterns on Amazon (`amazon.com/dp/B0H2K44KBT`).
- [ ] Manual check for fake review patterns on Trustpilot, Google, Site reviews.
- [ ] Manual check for misuse of Brand Assets in unauthorized contexts.

### Process integrity
- [ ] Every Level 2+ incident this month was reviewed by a second team member.
- [ ] Every termination this month was issued by Allan or Henrique jointly.
- [ ] Every appeal this month was reviewed by a non-issuing decision-maker.
- [ ] Document retention check: are screenshots, archived URLs, and emails saved in the right folders?

### Policy currency
- [ ] Affiliate Agreement reviewed for needed updates this quarter? (Y/N)
- [ ] Content Guidelines reviewed this quarter? (Y/N)
- [ ] Approved Claims list current? (Y/N)
- [ ] Last counsel review date: [DATE].

---

## 7. Audit Log

Records the completion of each periodic audit. The lightweight "we did the audit" trail.

| Field | Type | Required | Notes |
|---|---|---|---|
| `audit_id` | UUID | Yes | Primary key. |
| `audit_period_start` | Date | Yes | First day of the period covered. |
| `audit_period_end` | Date | Yes | Last day of the period covered. |
| `performed_by` | Text | Yes | |
| `performed_at` | Timestamp | Yes | |
| `checklist_ref` | Text | Yes | Path to filled-out checklist (PDF or Markdown copy). |
| `findings_summary` | Long text | Yes | Headline numbers and any concerns. |
| `actions_taken` | Long text | No | Follow-ups created from this audit. |
| `next_audit_due` | Date | Yes | |

---

## 8. External Inquiry Log

Records every inquiry from external parties (FTC, FDA, state AG, journalist, platform, plaintiff lawyer, third-party complaint). Rare events, very high consequences. Capture in detail.

| Field | Type | Required | Notes |
|---|---|---|---|
| `inquiry_id` | UUID | Yes | Primary key. |
| `received_at` | Timestamp | Yes | |
| `received_by` | Text | Yes | Who in the AfterSlim team received it. |
| `external_party_type` | Enum | Yes | `ftc`, `fda`, `state_ag`, `journalist`, `platform`, `attorney`, `consumer`, `other`. |
| `external_party_identity` | Text | Yes | Name and organization. |
| `inquiry_topic` | Text | Yes | What it's about. |
| `affiliate_id` | UUID | No | If a specific affiliate is involved. |
| `documents_attached` | Text | No | Paths to any attached documents. |
| `counsel_engaged` | Boolean | Yes | |
| `counsel_engaged_at` | Timestamp | If `true` | |
| `litigation_hold_initiated` | Boolean | Yes | |
| `response_strategy` | Long text | Yes | Per counsel direction. |
| `response_sent_at` | Timestamp | When sent | |
| `outcome` | Long text | When resolved | |

**Critical rule:** No external inquiry response is sent without counsel review, except a neutral receipt acknowledgment ("Thank you. We are reviewing your message and will respond as appropriate.")

---

## 9. Schema Suggestion (Supabase)

For when the team is ready to move out of spreadsheets:

```sql
-- Reference. Not production-ready. To be reviewed by Daemon and Vitor.

create table affiliate_applications (
  application_id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  applicant_name text not null,
  applicant_email text not null,
  applicant_handle_primary text,
  applicant_country text,
  requested_slug text,
  decision text not null check (decision in ('approved','rejected','deferred')),
  decision_at timestamptz,
  decision_by text,
  decision_reason text,
  notes text,
  linked_affiliate_id uuid
);

create table compliance_violations (
  violation_id uuid primary key default gen_random_uuid(),
  detected_at timestamptz not null default now(),
  detected_by text not null,
  source text not null,
  affiliate_id uuid not null,
  platform text not null,
  content_url text not null,
  archived_url text,
  screenshot_ref text not null,
  agreement_section text not null,
  severity text not null check (severity in ('level_1','level_2','level_3','level_4')),
  severity_set_by text not null,
  severity_set_at timestamptz not null default now(),
  email_sent_at timestamptz,
  email_template_used text,
  cure_window_ends_at timestamptz,
  affiliate_response_at timestamptz,
  affiliate_response_summary text,
  resolution text not null default 'pending',
  resolution_at timestamptz,
  payout_hold_amount numeric(10,2),
  payout_clawback_amount numeric(10,2),
  notes text
);

-- Add similar tables for content_reviews, communications, training_log,
-- audits, and external_inquiries following Sections 2, 4, 5, 7, and 8.

-- RLS recommendation: enable row-level security and restrict writes to
-- Allan, Henrique, and Vitor. Read-only access for any future counsel role.
```

---

## 10. Worked Example: One Affiliate, One Incident, End-to-End

Useful as a mental model.

**Timeline:**

1. **2026-07-01:** Jane Doe applies. Approval Log row created.
2. **2026-07-02:** Approved by Vitor. Welcome kit sent. Training & Onboarding Log row created (`welcome_kit_sent`).
3. **2026-07-02:** Jane signs Agreement v1.0 via clickwrap. Training row created (`agreement_accepted`, `version_ref: agreement-v1.0`).
4. **2026-07-15:** Vitor performs week-1 content review. Content Review Log row created. All compliant.
5. **2026-08-04:** Random monthly review. Vitor finds a Reels post where `#ad` is in the hashtag block at the end, not the start. Content Review Log row created (`disclosure_assessment: non_compliant`). Action: escalate to Level 1.
6. **2026-08-04:** Violation Log row created. Level 1. Email sent. Communication Log row created.
7. **2026-08-05:** Jane edits the caption to add `#ad` at the start. Replies confirming. Violation Log updated to `resolution: cured`.
8. **2026-09-12:** Audit Log row created summarizing August: 1 Level 1 violation, cured. Process integrity green.

End. Five tables touched. No verbal explanation needed if anyone ever asks.

---

## Reminder

This log is only as valuable as it is **contemporaneous**. Write the entry when the thing happens, not in a backfill the day before an audit. Backfilled records are easier to attack and less persuasive to a regulator.

---

## Contact

Questions about the log structure or storage decisions: Allan (primary), Daemon (technical implementation), Vitor (operational use).

---

*This document is published internally by VQ Group LLC d/b/a AfterSlim, a Florida limited liability company. Do not distribute outside the AfterSlim core team.*
