-- ============================================================================
-- AfterSlim Seed Data
-- Run this AFTER the schema migrations have been executed
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. PRODUCTS (2 products — white-label via FullStack Fulfillment)
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO products (slug, name, short_description, description, category, product_type, price_cents, compare_at_price_cents, subscription_price_cents, subscription_interval, sku, weight_oz, stock_quantity, low_stock_threshold, is_active, is_featured, sort_order, supplement_facts, meta_title, meta_description, images, tags) VALUES

('afterslim-biotin', 'AfterSlim Biotin',
 'Premium hair, skin, and nails formula with 3,600 mcg Biotin, Vitamin C, Zinc, and Horsetail Extract for radiant beauty from within.',
 '<p>AfterSlim Biotin is a comprehensive beauty supplement formulated to support healthy hair growth, glowing skin, and strong nails. With 3,600 mcg of Biotin (12,000% Daily Value) as the star ingredient, this formula delivers powerful results you can see and feel.</p><p>Enhanced with Vitamin C for collagen synthesis, Zinc for skin repair, Niacin for healthy circulation, and Horsetail Extract rich in natural silica. Take 2 capsules daily with an 8 oz. glass of water as part of your beauty routine.</p>',
 'Hair, Skin & Nails', 'single', 2499, 2999, 2124, 'month', 'AS-BIOT-60', 2.4, 200, 40, true, true, 1,
 '{"serving_size":"2 capsules","servings_per_container":30,"ingredients":[{"name":"Vitamin C (as ascorbic acid)","amount":"136 mg","daily_value":"151%"},{"name":"Niacin (as niacinamide)","amount":"27 mg","daily_value":"169%"},{"name":"Vitamin B6 (as pyridoxine hydrochloride)","amount":"1.5 mg","daily_value":"118%"},{"name":"Biotin","amount":"3,600 mcg","daily_value":"12,000%"},{"name":"Pantothenic acid (as d-calcium pantothenate)","amount":"12 mg","daily_value":"240%"},{"name":"Calcium (as dicalcium phosphate)","amount":"11 mg","daily_value":"1%"},{"name":"Zinc (as zinc oxide)","amount":"11 mg","daily_value":"100%"},{"name":"Horsetail (Equisetum arvense) Extract 10:1","amount":"24 mg","daily_value":""}],"other_ingredients":"Microcrystalline Cellulose, Gelatin, Magnesium Stearate, Silicon Dioxide, Titanium Dioxide."}'::jsonb,
 'AfterSlim Biotin - Hair, Skin & Nails Supplement',
 'Support healthy hair, glowing skin, and strong nails with 3,600 mcg Biotin, Vitamin C, Zinc, and Horsetail Extract. 60 capsules.',
 '[]'::jsonb, ARRAY['hair-skin-nails','biotin','beauty','best-seller']),

('afterslim-nootropic', 'AfterSlim Nootropic',
 'Advanced cognitive support with Bacopa Monnieri, Rhodiola Rosea, L-Theanine, BCAAs, and Panax Ginseng for focus and mental clarity.',
 '<p>AfterSlim Nootropic is a science-backed cognitive enhancement formula designed to support focus, memory, and mental clarity. Featuring Bacopa Monnieri for memory retention, Rhodiola Rosea (3% Salidroside) for stress resilience, and L-Theanine for calm focus without jitters.</p><p>Enhanced with Branched Chain Amino Acids (2:1:1 ratio) for brain fuel and Panax Ginseng for sustained mental energy. For best results, take 2 capsules 20-30 minutes before a meal with 8 oz. of water. Vegan-friendly capsule, contains no allergens.</p>',
 'Cognitive Health', 'single', 3499, 3999, 2974, 'month', 'AS-NOOT-60', 2.6, 180, 40, true, true, 2,
 '{"serving_size":"2 capsules","servings_per_container":30,"ingredients":[{"name":"Branched Chain Amino Acids 2:1:1 (L-Leucine, L-Isoleucine, L-Valine)","amount":"540 mg","daily_value":""},{"name":"Bacopa Monnieri Extract","amount":"200 mg","daily_value":""},{"name":"Rhodiola Rosea Extract (3% Salidroside)","amount":"100 mg","daily_value":""},{"name":"L-Theanine","amount":"100 mg","daily_value":""},{"name":"Panax Ginseng Extract","amount":"90 mg","daily_value":""}],"other_ingredients":"Microcrystalline Cellulose, Hydroxypropyl Methylcellulose (Capsule), Magnesium Stearate."}'::jsonb,
 'AfterSlim Nootropic - Cognitive Support Supplement',
 'Boost focus and mental clarity with Bacopa Monnieri, Rhodiola Rosea, L-Theanine, and Panax Ginseng. Vegan. 60 capsules.',
 '[]'::jsonb, ARRAY['cognitive-health','nootropic','focus','best-seller'])

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price_cents = EXCLUDED.price_cents,
  compare_at_price_cents = EXCLUDED.compare_at_price_cents,
  subscription_price_cents = EXCLUDED.subscription_price_cents,
  subscription_interval = EXCLUDED.subscription_interval,
  sku = EXCLUDED.sku,
  weight_oz = EXCLUDED.weight_oz,
  stock_quantity = EXCLUDED.stock_quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  supplement_facts = EXCLUDED.supplement_facts,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  tags = EXCLUDED.tags,
  updated_at = now();

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. KANBAN COLUMNS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO kanban_columns (name, slug, position, color, wip_limit) VALUES
  ('To Do', 'todo', 0, '#3b82f6', NULL),
  ('In Progress', 'in-progress', 1, '#eab308', 5),
  ('Review', 'review', 2, '#a855f7', 3),
  ('Done', 'done', 3, '#22c55e', NULL)
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. SAMPLE IDEAS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO ideas (title, description, category, priority, status, source, author, tags) VALUES
  ('Launch TikTok Ads Targeting 25-34', 'Create vertical video ads highlighting Biotin hair transformation stories and Nootropic focus benefits for the 25-34 demographic on TikTok.', 'marketing', 'high', 'approved', 'after', 'Team Group', ARRAY['tiktok','ads','growth']),
  ('Biotin + Nootropic Bundle', 'Create a discounted Beauty & Brains bundle combining Biotin and Nootropic for customers who want both beauty and cognitive benefits.', 'product', 'medium', 'under_review', 'manual', 'Vitor', ARRAY['bundle','biotin','nootropic']),
  ('Loyalty Points Program', 'Implement a points-based reward system: 1 point per dollar, 100 points = $5 discount.', 'tech', 'high', 'new', 'agent', 'Management Agent', ARRAY['loyalty','rewards','retention']),
  ('Hair Growth Challenge', '30-day Hair Growth Challenge on Instagram with daily tips, Biotin product integration, and before/after UGC contest.', 'marketing', 'high', 'approved', 'manual', 'Vitor', ARRAY['challenge','biotin','instagram','ugc']),
  ('Subscription Gift Option', 'Allow customers to gift a subscription to someone else with a personalized message.', 'tech', 'low', 'new', 'manual', 'Vitor', ARRAY['subscription','gifting']),
  ('Expand Product Line', 'Research additional white-label products from FullStack Fulfillment catalog to expand beyond Biotin and Nootropic.', 'product', 'medium', 'under_review', 'manual', 'Vitor', ARRAY['expansion','fullstack','new-products']),
  ('Affiliate Program Launch', 'Set up an affiliate program with tiered commissions (10-20%) for content creators and wellness bloggers.', 'marketing', 'high', 'new', 'agent', 'Marketing Agent', ARRAY['affiliates','creators','growth']),
  ('Eco-Friendly Packaging', 'Switch to 100% recyclable packaging and biodegradable shipping materials. Get sustainability certification.', 'operations', 'medium', 'new', 'manual', 'Vitor', ARRAY['sustainability','packaging','eco'])
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. PRODUCTS INVENTORY (mirror products table for admin)
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO products_inventory (product_id, sku, name, unit_cost, selling_price, stock_qty, reorder_point, supplier, category)
SELECT
  p.id, p.sku, p.name,
  CASE p.sku
    WHEN 'AS-BIOT-60' THEN 6.50
    WHEN 'AS-NOOT-60' THEN 8.50
  END,
  p.price_cents / 100.0,
  p.stock_quantity,
  p.low_stock_threshold,
  'FullStack Fulfillment',
  p.category
FROM products p
WHERE p.is_active = true
ON CONFLICT (sku) DO UPDATE SET
  stock_qty = EXCLUDED.stock_qty,
  unit_cost = EXCLUDED.unit_cost,
  selling_price = EXCLUDED.selling_price,
  updated_at = now();

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. SAMPLE CREATORS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO creators (name, handle, platform, followers, engagement_rate, niche, contact_email, tier, status, notes) VALUES
  ('Sarah Wellness', '@sarahwellness', 'instagram', 125000, 4.2, 'Health & Fitness', 'sarah@wellness.com', 'micro', 'active', 'Great engagement, consistent posting schedule'),
  ('FitMom Katie', '@fitmomkatie', 'instagram', 89000, 5.1, 'Motherhood & Fitness', 'katie@fitmom.co', 'micro', 'active', 'Authentic content, strong community trust'),
  ('Dr. Mike Supplements', '@drmikesupps', 'tiktok', 340000, 3.8, 'Science & Supplements', 'mike@drmikesupps.com', 'macro', 'negotiating', 'Science-based content, credibility boost'),
  ('Clean Eating Lisa', '@cleaneatinglisa', 'instagram', 52000, 6.3, 'Nutrition & Recipes', 'lisa@cleaneating.com', 'nano', 'active', 'High engagement rate, quality UGC'),
  ('Jake The Supplement Guy', '@jakesuppguy', 'tiktok', 210000, 4.5, 'Supplements & Reviews', 'jake@suppguy.com', 'macro', 'contacted', 'Honest reviews, male demographic reach'),
  ('Yoga With Priya', '@yogawithpriya', 'instagram', 178000, 3.9, 'Yoga & Wellness', 'priya@yogawithpriya.com', 'micro', 'prospect', 'Wellness lifestyle, aligned brand values')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. SAMPLE TRANSACTIONS (last 30 days)
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO transactions (type, category, description, amount, currency, reference_type, date, created_by) VALUES
  ('income', 'order_revenue', 'Daily orders Feb 26', 2147.50, 'USD', 'manual', '2026-02-26', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 25', 1893.22, 'USD', 'manual', '2026-02-25', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 24', 2456.80, 'USD', 'manual', '2026-02-24', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 23', 1654.99, 'USD', 'manual', '2026-02-23', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 22', 2089.15, 'USD', 'manual', '2026-02-22', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 21', 1435.60, 'USD', 'manual', '2026-02-21', 'system'),
  ('income', 'order_revenue', 'Daily orders Feb 20', 1978.33, 'USD', 'manual', '2026-02-20', 'system'),
  ('income', 'shipping_revenue', 'Shipping fees week 8', 342.50, 'USD', 'manual', '2026-02-24', 'system'),
  ('income', 'shipping_revenue', 'Shipping fees week 7', 289.75, 'USD', 'manual', '2026-02-17', 'system'),
  ('expense', 'ad_spend', 'Meta Ads Feb 20-26', 1250.00, 'USD', 'manual', '2026-02-26', 'system'),
  ('expense', 'ad_spend', 'Meta Ads Feb 13-19', 980.00, 'USD', 'manual', '2026-02-19', 'system'),
  ('expense', 'ad_spend', 'TikTok Ads Feb', 450.00, 'USD', 'manual', '2026-02-26', 'system'),
  ('expense', 'ad_spend', 'Google Ads Feb', 320.00, 'USD', 'manual', '2026-02-26', 'system'),
  ('expense', 'supplier_payment', 'FullStack Fulfillment - Biotin Feb order', 1950.00, 'USD', 'manual', '2026-02-15', 'system'),
  ('expense', 'supplier_payment', 'FullStack Fulfillment - Nootropic Feb order', 1530.00, 'USD', 'manual', '2026-02-18', 'system'),
  ('expense', 'creator_payment', 'Sarah Wellness - Spring campaign', 800.00, 'USD', 'manual', '2026-02-20', 'system'),
  ('expense', 'creator_payment', 'FitMom Katie - UGC Sprint', 500.00, 'USD', 'manual', '2026-02-22', 'system'),
  ('expense', 'platform_fee', 'Stripe processing fees Feb', 487.33, 'USD', 'manual', '2026-02-26', 'system'),
  ('expense', 'platform_fee', 'Vercel hosting Feb', 20.00, 'USD', 'manual', '2026-02-01', 'system'),
  ('expense', 'operational', 'Shipping supplies', 156.80, 'USD', 'manual', '2026-02-10', 'system'),
  ('expense', 'operational', 'Product photography', 350.00, 'USD', 'manual', '2026-02-08', 'system'),
  ('expense', 'tax', 'FL sales tax Q1 partial', 412.50, 'USD', 'manual', '2026-02-25', 'system'),
  ('expense', 'refund', 'Order AS-100015 refund', 49.99, 'USD', 'manual', '2026-02-23', 'system'),
  ('expense', 'refund', 'Order AS-100018 partial refund', 34.99, 'USD', 'manual', '2026-02-25', 'system'),
  ('expense', 'other', 'Software subscriptions (Canva, etc)', 89.99, 'USD', 'manual', '2026-02-01', 'system')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. FINANCIAL GOALS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO financial_goals (name, metric, target, current, period, start_date, end_date, active) VALUES
  ('Monthly Revenue Target', 'revenue', 35000, 28450, 'monthly', '2026-02-01', '2026-02-28', true),
  ('Q1 Revenue Goal', 'revenue', 100000, 67230, 'quarterly', '2026-01-01', '2026-03-31', true),
  ('Monthly New Customers', 'orders', 400, 185, 'monthly', '2026-02-01', '2026-02-28', true),
  ('Q1 Profit Margin Target', 'profit', 55, 51.2, 'quarterly', '2026-01-01', '2026-03-31', true),
  ('Reduce Ad Spend Ratio', 'cogs_ratio', 15, 18.5, 'monthly', '2026-02-01', '2026-02-28', true),
  ('Increase AOV', 'revenue', 45, 38.50, 'monthly', '2026-02-01', '2026-02-28', true)
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. SAMPLE AGENT MEMORIES
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO as_agent_memory (agent_id, kind, content) VALUES
  ('as-analytics', 'insight', 'Instagram engagement peaks on Tuesdays and Thursdays between 6-8 PM EST. Recommend scheduling high-value posts during these windows.'),
  ('as-marketing', 'insight', 'Competitor NatureMade Biotin at $12.99 has lower dosage (2500mcg vs our 3600mcg). Highlight our higher potency and complete vitamin blend as key differentiator.'),
  ('as-management', 'summary', 'Week 8 Summary: Revenue $5,247 (+12% WoW), 72 orders, AOV $72.90. Top product: AfterSlim Biotin (45 units). Nootropic gaining traction (27 units).'),
  ('as-after', 'classification', 'Message from team group classified as [idea]: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.'),
  ('as-legal', 'alert', 'FTC updated influencer disclosure guidelines effective March 2026. All creator contracts need updated disclosure language. Priority: HIGH.'),
  ('as-content', 'action', 'Created content calendar for March 2026: 12 feed posts, 8 Reels, 4 Stories campaigns. Theme: Spring Renewal — hair growth & focus.'),
  ('as-engagement', 'insight', 'Top 3 comment themes this week: 1) Shipping speed questions (38%), 2) Biotin results timeline (25%), 3) Nootropic ingredient inquiries (20%). Consider FAQ highlight reel.'),
  ('as-management', 'alert', 'Profit margin dropped to 42% from 48% due to increased ad spend. Recommend reviewing Meta Ads ROI and pausing underperforming campaigns.')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. SAMPLE AGENT TASKS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO as_agent_tasks (agent_id, task_type, input, output, status, started_at, completed_at) VALUES
  ('as-after', 'classify_message', '{"text":"Hey, we need to push the Nootropic launch harder"}'::jsonb, '{"classification":"idea","title":"Boost Nootropic marketing push"}'::jsonb, 'completed', '2026-02-26T14:30:00Z', '2026-02-26T14:30:05Z'),
  ('as-marketing', 'generate_ad_copy', '{"product":"AfterSlim Biotin","campaign":"spring"}'::jsonb, '{"variants":5}'::jsonb, 'completed', '2026-02-26T13:00:00Z', '2026-02-26T13:15:00Z'),
  ('as-content', 'generate_caption', '{"type":"daily_tip","topic":"morning routine"}'::jsonb, '{"caption":"Your morning routine just got an upgrade"}'::jsonb, 'completed', '2026-02-26T11:30:00Z', '2026-02-26T12:00:00Z'),
  ('as-analytics', 'weekly_report', '{"period":"2026-W08"}'::jsonb, NULL, 'running', '2026-02-26T09:00:00Z', NULL),
  ('as-management', 'daily_summary', '{"date":"2026-02-26"}'::jsonb, '{"orders":18,"revenue":2147.50}'::jsonb, 'completed', '2026-02-26T08:00:00Z', '2026-02-26T08:02:00Z'),
  ('as-legal', 'compliance_review', '{"product":"Nootropic","document":"label_draft"}'::jsonb, '{"issues":0,"status":"approved"}'::jsonb, 'completed', '2026-02-25T15:00:00Z', '2026-02-25T16:00:00Z'),
  ('as-marketing', 'competitor_analysis', '{"competitor":"all","period":"2026-02"}'::jsonb, NULL, 'pending', NULL, NULL),
  ('as-engagement', 'reply_comments', '{"batch_size":8}'::jsonb, '{"error":"Rate limit exceeded"}'::jsonb, 'failed', '2026-02-25T14:00:00Z', '2026-02-25T14:01:00Z')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. SAMPLE MESSAGE LOG
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO as_message_log (source_channel, source_group, sender_name, message_text, message_type, classification, processed, agent_response) VALUES
  ('whatsapp', 'Team Group', 'Vitor', 'Hey, we need to push the Nootropic marketing harder. Let''s get some ad creatives ready.', 'text', 'idea', true, 'Idea captured: "Boost Nootropic marketing push". Added to Ideas Bank with high priority.'),
  ('whatsapp', 'Team Group', 'Vitor', 'Launch TikTok ads targeting 25-34 demographic', 'text', 'idea', true, 'Idea captured: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.'),
  ('whatsapp', 'Customer', 'Customer', 'Where is my order AS-100042? It''s been 5 days.', 'text', 'order_inquiry', true, 'Order AS-100042 shipped on Feb 21 via USPS. Tracking: 9400111899223456789. Expected delivery: Feb 27.'),
  ('whatsapp', 'Team Group', 'Marketing Team', 'Instagram reach was up 23% this week, great job everyone!', 'text', 'info', true, NULL),
  ('internal', NULL, 'as-marketing', 'Generated 5 ad copy variants for AfterSlim Biotin spring campaign. Saved to tasks queue.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-content', 'Published Instagram caption: "Your morning routine just got an upgrade" with 12 hashtags.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-analytics', 'Weekly performance report: Instagram reach up 23%, engagement rate 4.8%, top post: Biotin hair transformation reel (45K views).', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-management', 'Daily summary: 18 new orders ($2,147), 3 returns pending. Biotin (12 units) and Nootropic (6 units) sold today.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-legal', 'FDA compliance check: Both Biotin and Nootropic labels approved. FDA disclaimer and supplement facts verified.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-engagement', 'Replied to 15 Instagram comments. Flagged 2 negative mentions for review. Generated 3 DM templates.', 'text', NULL, true, NULL)
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- Done! Verify counts
-- ──────────────────────────────────────────────────────────────────────────────

SELECT 'products' AS table_name, count(*) FROM products
UNION ALL SELECT 'kanban_columns', count(*) FROM kanban_columns
UNION ALL SELECT 'ideas', count(*) FROM ideas
UNION ALL SELECT 'products_inventory', count(*) FROM products_inventory
UNION ALL SELECT 'creators', count(*) FROM creators
UNION ALL SELECT 'transactions', count(*) FROM transactions
UNION ALL SELECT 'financial_goals', count(*) FROM financial_goals
UNION ALL SELECT 'as_agent_memory', count(*) FROM as_agent_memory
UNION ALL SELECT 'as_agent_tasks', count(*) FROM as_agent_tasks
UNION ALL SELECT 'as_message_log', count(*) FROM as_message_log;
