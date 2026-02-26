-- ============================================================================
-- AfterSlim Seed Data
-- Run this AFTER the schema migrations have been executed
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. PRODUCTS (8 products)
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO products (slug, name, short_description, description, category, product_type, price_cents, compare_at_price_cents, subscription_price_cents, subscription_interval, sku, weight_oz, stock_quantity, low_stock_threshold, is_active, is_featured, sort_order, supplement_facts, meta_title, meta_description, images, tags) VALUES

('afterslim-burn', 'AfterSlim Burn',
 'Thermogenic fat burner with green tea extract and L-carnitine to boost metabolism and support weight management.',
 '<p>AfterSlim Burn is our flagship thermogenic formula designed to support your weight management goals. Featuring a powerful blend of green tea extract (EGCG), caffeine anhydrous, L-carnitine, and cayenne pepper extract, this science-backed formula helps boost your metabolism and increase energy expenditure.</p><p>Enhanced with BioPerine for maximum absorption and chromium picolinate to support healthy blood sugar levels already within the normal range. Take 2 capsules daily with water, preferably before your morning workout for best results.</p>',
 'Weight Management', 'single', 4999, 5999, 4249, 'month', 'AS-BURN-60', 3.2, 245, 50, true, true, 1,
 '{"serving_size":"2 capsules","servings_per_container":30,"ingredients":[{"name":"Green Tea Extract (EGCG)","amount":"500 mg","daily_value":""},{"name":"Caffeine Anhydrous","amount":"200 mg","daily_value":""},{"name":"L-Carnitine","amount":"500 mg","daily_value":""},{"name":"Cayenne Pepper Extract","amount":"100 mg","daily_value":""},{"name":"Black Pepper Extract (BioPerine)","amount":"5 mg","daily_value":""},{"name":"Chromium (as Chromium Picolinate)","amount":"200 mcg","daily_value":"571%"}],"other_ingredients":"Vegetable cellulose (capsule), rice flour, magnesium stearate, silicon dioxide.","allergen_warning":"Manufactured in a facility that also processes milk, soy, eggs, wheat, peanuts, and tree nuts."}'::jsonb,
 'AfterSlim Burn - Thermogenic Fat Burner',
 'Boost your metabolism with AfterSlim Burn. Science-backed thermogenic formula with green tea extract, L-carnitine, and BioPerine.',
 '[]'::jsonb, ARRAY['weight-management','fat-burner','best-seller']),

('afterslim-cleanse', 'AfterSlim Cleanse',
 'Gentle 15-day detox support formula with milk thistle, dandelion root, and probiotics to support digestive wellness.',
 '<p>AfterSlim Cleanse provides gentle yet effective detox support with a carefully balanced blend of natural ingredients. Milk thistle and dandelion root work together to support liver function, while a 5-strain probiotic blend promotes healthy gut flora.</p><p>This 15-day cleanse program includes artichoke extract for digestive comfort and turmeric for its antioxidant properties.</p>',
 'Weight Management', 'single', 3999, NULL, 3399, 'month', 'AS-CLNS-30', 2.8, 180, 40, true, false, 2,
 '{"serving_size":"2 capsules","servings_per_container":15,"ingredients":[{"name":"Milk Thistle Extract (80% Silymarin)","amount":"250 mg","daily_value":""},{"name":"Dandelion Root Extract","amount":"200 mg","daily_value":""},{"name":"Artichoke Leaf Extract","amount":"150 mg","daily_value":""},{"name":"Turmeric Extract (95% Curcuminoids)","amount":"100 mg","daily_value":""},{"name":"Probiotic Blend (5 Billion CFU)","amount":"100 mg","daily_value":""},{"name":"Ginger Root Extract","amount":"50 mg","daily_value":""}],"other_ingredients":"Vegetable cellulose (capsule), rice flour, silicon dioxide.","allergen_warning":"Manufactured in a facility that also processes milk, soy, and tree nuts."}'::jsonb,
 'AfterSlim Cleanse - Gentle Detox Support',
 'Support your digestive wellness with AfterSlim Cleanse. A gentle 15-day detox formula with milk thistle, probiotics, and turmeric.',
 '[]'::jsonb, ARRAY['weight-management','detox','cleanse']),

('afterslim-probiotics-plus', 'AfterSlim Probiotics+',
 'Advanced 50 billion CFU probiotic with 16 strains and prebiotic fiber for optimal gut health and immune support.',
 '<p>AfterSlim Probiotics+ delivers 50 billion CFU of beneficial bacteria across 16 carefully selected strains. Each strain is chosen for its specific benefit to digestive health, immune function, and overall wellness.</p><p>Our delayed-release capsule technology ensures the probiotics survive stomach acid and reach your intestines alive. Enhanced with prebiotic fiber (FOS) to nourish the good bacteria already in your gut.</p>',
 'Supplements', 'single', 3499, 4199, 2974, 'month', 'AS-PROB-60', 2.5, 312, 60, true, true, 3,
 '{"serving_size":"1 capsule","servings_per_container":60,"ingredients":[{"name":"Probiotic Blend (16 Strains)","amount":"50 Billion CFU","daily_value":""},{"name":"Prebiotic Fiber (FOS)","amount":"200 mg","daily_value":""},{"name":"Lactobacillus acidophilus","amount":"12.5 Billion CFU","daily_value":""},{"name":"Bifidobacterium lactis","amount":"10 Billion CFU","daily_value":""},{"name":"Lactobacillus rhamnosus","amount":"7.5 Billion CFU","daily_value":""}],"other_ingredients":"Delayed-release vegetable capsule (HPMC, gellan gum), rice flour, silicon dioxide."}'::jsonb,
 'AfterSlim Probiotics+ - 50 Billion CFU Probiotic',
 'Support gut health with 50 billion CFU and 16 probiotic strains. Delayed-release capsule with prebiotic fiber.',
 '[]'::jsonb, ARRAY['supplements','probiotics','gut-health','best-seller']),

('afterslim-omega-3-ultra', 'AfterSlim Omega-3 Ultra',
 'Triple-strength fish oil with 2400 mg EPA/DHA per serving for heart, brain, and joint support.',
 '<p>AfterSlim Omega-3 Ultra delivers a potent 2400 mg of combined EPA and DHA per serving from sustainably sourced wild-caught fish. Our molecular distillation process ensures pharmaceutical-grade purity free from heavy metals and contaminants.</p><p>Each softgel features a natural lemon coating to eliminate fishy aftertaste. Supports cardiovascular health, cognitive function, and joint comfort.</p>',
 'Supplements', 'single', 2999, NULL, NULL, NULL, 'AS-OMG3-90', 5.6, 156, 30, true, false, 4,
 '{"serving_size":"3 softgels","servings_per_container":30,"ingredients":[{"name":"Fish Oil Concentrate","amount":"3600 mg","daily_value":""},{"name":"EPA (Eicosapentaenoic Acid)","amount":"1440 mg","daily_value":""},{"name":"DHA (Docosahexaenoic Acid)","amount":"960 mg","daily_value":""}],"other_ingredients":"Softgel (gelatin, glycerin, purified water), natural lemon flavor, mixed tocopherols.","allergen_warning":"Contains fish (anchovy, sardine, mackerel). Manufactured in a facility that processes shellfish."}'::jsonb,
 'AfterSlim Omega-3 Ultra - Triple Strength Fish Oil',
 'Triple-strength fish oil with 2400 mg EPA/DHA. Sustainably sourced, molecularly distilled for purity.',
 '[]'::jsonb, ARRAY['supplements','omega-3','heart-health']),

('afterslim-vitamin-d3-k2', 'AfterSlim Vitamin D3+K2',
 '5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption, bone strength, and immune support.',
 '<p>AfterSlim Vitamin D3+K2 combines 5000 IU of Vitamin D3 (cholecalciferol) with 100 mcg of Vitamin K2 (as MK-7) for synergistic bone and immune support. Vitamin K2 directs calcium to your bones where it belongs, rather than to your arteries.</p><p>Our formula uses organic coconut oil as a carrier for enhanced fat-soluble vitamin absorption. One small softgel daily is all you need.</p>',
 'Supplements', 'single', 2499, 2999, 2124, 'month', 'AS-VDK2-60', 1.8, 8, 25, true, false, 5,
 '{"serving_size":"1 softgel","servings_per_container":60,"ingredients":[{"name":"Vitamin D3 (Cholecalciferol)","amount":"125 mcg (5,000 IU)","daily_value":"625%"},{"name":"Vitamin K2 (as MK-7)","amount":"100 mcg","daily_value":"83%"}],"other_ingredients":"Organic coconut oil, softgel (bovine gelatin, glycerin, purified water)."}'::jsonb,
 'AfterSlim Vitamin D3+K2 - Bone & Immune Support',
 '5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption. Supports bone strength and immune health.',
 '[]'::jsonb, ARRAY['supplements','vitamins','bone-health']),

('afterslim-collagen-peptides', 'AfterSlim Collagen Peptides',
 'Hydrolyzed multi-collagen peptides (Types I, II, III, V, X) for radiant skin, strong joints, and healthy hair.',
 '<p>AfterSlim Collagen Peptides provides 10g of hydrolyzed multi-collagen per serving from five collagen types (I, II, III, V, and X). Our advanced hydrolysis process breaks collagen into small peptides for rapid absorption and bioavailability.</p><p>Sourced from grass-fed, pasture-raised bovine, wild-caught fish, and cage-free chicken. Unflavored and dissolves easily in coffee, smoothies, or water.</p>',
 'Supplements', 'single', 4499, 5399, 3824, 'month', 'AS-COLL-30', 10.6, 98, 30, true, true, 6,
 '{"serving_size":"1 scoop (11g)","servings_per_container":30,"ingredients":[{"name":"Multi-Collagen Blend","amount":"10 g","daily_value":""},{"name":"Type I Collagen (Bovine)","amount":"5 g","daily_value":""},{"name":"Type II Collagen (Chicken)","amount":"2 g","daily_value":""},{"name":"Type III Collagen (Bovine)","amount":"1.5 g","daily_value":""},{"name":"Type V Collagen (Eggshell)","amount":"1 g","daily_value":""},{"name":"Type X Collagen (Chicken)","amount":"0.5 g","daily_value":""}],"other_ingredients":"None.","allergen_warning":"Contains eggs, fish. Manufactured in a facility that processes milk, soy, wheat, peanuts, and tree nuts."}'::jsonb,
 'AfterSlim Collagen Peptides - Multi-Collagen Protein',
 'Hydrolyzed multi-collagen peptides with Types I, II, III, V, X. Supports radiant skin, strong joints, and healthy hair.',
 '[]'::jsonb, ARRAY['supplements','collagen','skin-health','best-seller']),

('afterslim-sleep-formula', 'AfterSlim Sleep Formula',
 'Natural sleep support with melatonin, magnesium glycinate, L-theanine, and ashwagandha for restful recovery.',
 '<p>AfterSlim Sleep Formula combines the most effective natural sleep ingredients into one convenient capsule. Melatonin helps regulate your circadian rhythm, while magnesium glycinate relaxes muscles and calms the nervous system.</p><p>L-theanine promotes alpha brain waves for calm focus before bed, and ashwagandha (KSM-66) helps reduce occasional stress. Non-habit-forming formula you can trust.</p>',
 'Energy', 'single', 3299, NULL, 2804, 'month', 'AS-SLEP-60', 2.4, 67, 25, true, false, 7,
 '{"serving_size":"2 capsules","servings_per_container":30,"ingredients":[{"name":"Magnesium (as Magnesium Glycinate)","amount":"200 mg","daily_value":"48%"},{"name":"L-Theanine","amount":"200 mg","daily_value":""},{"name":"Ashwagandha Root Extract (KSM-66)","amount":"300 mg","daily_value":""},{"name":"GABA","amount":"100 mg","daily_value":""},{"name":"Melatonin","amount":"3 mg","daily_value":""}],"other_ingredients":"Vegetable cellulose (capsule), rice flour, magnesium stearate."}'::jsonb,
 'AfterSlim Sleep Formula - Natural Sleep Support',
 'Fall asleep faster with our natural sleep formula. Melatonin, magnesium, L-theanine, and ashwagandha. Non-habit-forming.',
 '[]'::jsonb, ARRAY['energy','sleep','recovery']),

('afterslim-immunity-shield', 'AfterSlim Immunity Shield',
 'Comprehensive immune support with Vitamin C, zinc, elderberry, and echinacea to keep your defenses strong.',
 '<p>AfterSlim Immunity Shield is your daily defense against seasonal challenges. This comprehensive formula combines Vitamin C (1000 mg), zinc bisglycinate, elderberry extract, and echinacea to support a robust immune response.</p><p>Enhanced with quercetin and selenium for powerful antioxidant protection. Perfect for daily use or increased dosing during times when extra immune support is needed.</p>',
 'Supplements', 'single', 2799, 3359, NULL, NULL, 'AS-IMMU-90', 3.0, 203, 40, true, false, 8,
 '{"serving_size":"1 capsule","servings_per_container":90,"ingredients":[{"name":"Vitamin C (as Ascorbic Acid)","amount":"1000 mg","daily_value":"1111%"},{"name":"Zinc (as Zinc Bisglycinate)","amount":"25 mg","daily_value":"227%"},{"name":"Elderberry Extract","amount":"250 mg","daily_value":""},{"name":"Echinacea purpurea Extract","amount":"200 mg","daily_value":""},{"name":"Quercetin","amount":"100 mg","daily_value":""},{"name":"Selenium (as Selenomethionine)","amount":"55 mcg","daily_value":"100%"}],"other_ingredients":"Vegetable cellulose (capsule), rice flour, silicon dioxide, magnesium stearate.","allergen_warning":"Manufactured in a facility that also processes milk, soy, and tree nuts."}'::jsonb,
 'AfterSlim Immunity Shield - Immune Support Complex',
 'Strengthen your immune defenses with Vitamin C, zinc, elderberry, and echinacea.',
 '[]'::jsonb, ARRAY['supplements','immune-support','vitamins'])

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
  ('Launch TikTok Ads Targeting 25-34', 'Create vertical video ads highlighting transformation stories and product benefits for the 25-34 demographic on TikTok.', 'marketing', 'high', 'approved', 'after', 'Team Group', ARRAY['tiktok','ads','growth']),
  ('Collagen + Probiotic Bundle', 'Create a discounted kit combining Collagen Peptides and Probiotics+ for gut-skin axis benefits.', 'product', 'medium', 'under_review', 'manual', 'Vitor', ARRAY['bundle','collagen','probiotics']),
  ('Loyalty Points Program', 'Implement a points-based reward system: 1 point per dollar, 100 points = $5 discount.', 'tech', 'high', 'new', 'agent', 'Management Agent', ARRAY['loyalty','rewards','retention']),
  ('Spring Detox Challenge', '30-day Spring Detox Challenge on Instagram with daily tips, Cleanse product integration, and UGC contest.', 'marketing', 'high', 'approved', 'manual', 'Vitor', ARRAY['challenge','detox','instagram','ugc']),
  ('Subscription Gift Option', 'Allow customers to gift a subscription to someone else with a personalized message.', 'tech', 'low', 'new', 'manual', 'Vitor', ARRAY['subscription','gifting']),
  ('CBD Sleep Gummies', 'Research feasibility of a CBD-infused sleep gummy line. Need legal review for multi-state compliance.', 'product', 'medium', 'under_review', 'manual', 'Vitor', ARRAY['cbd','sleep','gummies','legal']),
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
    WHEN 'AS-BURN-60' THEN 12.50
    WHEN 'AS-CLNS-30' THEN 9.75
    WHEN 'AS-PROB-60' THEN 8.50
    WHEN 'AS-OMG3-90' THEN 7.25
    WHEN 'AS-VDK2-60' THEN 5.50
    WHEN 'AS-COLL-30' THEN 14.00
    WHEN 'AS-SLEP-60' THEN 8.00
    WHEN 'AS-IMMU-90' THEN 6.75
  END,
  p.price_cents / 100.0,
  p.stock_quantity,
  p.low_stock_threshold,
  CASE
    WHEN p.sku IN ('AS-BURN-60','AS-CLNS-30','AS-VDK2-60','AS-SLEP-60') THEN 'NutraLab USA'
    WHEN p.sku IN ('AS-PROB-60','AS-IMMU-90') THEN 'BioFlora Labs'
    WHEN p.sku = 'AS-OMG3-90' THEN 'OceanPure'
    WHEN p.sku = 'AS-COLL-30' THEN 'PureCollagen Co'
  END,
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
  ('expense', 'supplier_payment', 'NutraLab USA - Feb order', 3200.00, 'USD', 'manual', '2026-02-15', 'system'),
  ('expense', 'supplier_payment', 'BioFlora Labs - Feb order', 1450.00, 'USD', 'manual', '2026-02-18', 'system'),
  ('expense', 'supplier_payment', 'PureCollagen Co - Feb order', 840.00, 'USD', 'manual', '2026-02-12', 'system'),
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
  ('as-marketing', 'insight', 'Competitor GreenSupps launched a collagen line at $39.99. Our Collagen Peptides at $44.99 has better ingredient profile but we should highlight the value proposition.'),
  ('as-management', 'summary', 'Week 8 Summary: Revenue $8,247 (+12% WoW), 72 orders, AOV $114.54. Top product: AfterSlim Burn (28 units). Low stock alert: Vitamin D3+K2.'),
  ('as-after', 'classification', 'Message from team group classified as [idea]: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.'),
  ('as-legal', 'alert', 'FTC updated influencer disclosure guidelines effective March 2026. All creator contracts need updated disclosure language. Priority: HIGH.'),
  ('as-content', 'action', 'Created content calendar for March 2026: 12 feed posts, 8 Reels, 4 Stories campaigns. Theme: Spring Renewal.'),
  ('as-engagement', 'insight', 'Top 3 comment themes this week: 1) Shipping speed questions (38%), 2) Product comparisons (25%), 3) Ingredient inquiries (20%). Consider FAQ highlight reel.'),
  ('as-management', 'alert', 'Profit margin dropped to 42% from 48% due to increased ad spend. Recommend reviewing Meta Ads ROI and pausing underperforming campaigns.')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. SAMPLE AGENT TASKS
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO as_agent_tasks (agent_id, task_type, input, output, status, started_at, completed_at) VALUES
  ('as-after', 'classify_message', '{"text":"Hey, we need to launch the new Sleep Formula ASAP"}'::jsonb, '{"classification":"idea","title":"Rush Sleep Formula launch"}'::jsonb, 'completed', '2026-02-26T14:30:00Z', '2026-02-26T14:30:05Z'),
  ('as-marketing', 'generate_ad_copy', '{"product":"AfterSlim Burn","campaign":"spring"}'::jsonb, '{"variants":5}'::jsonb, 'completed', '2026-02-26T13:00:00Z', '2026-02-26T13:15:00Z'),
  ('as-content', 'generate_caption', '{"type":"daily_tip","topic":"morning routine"}'::jsonb, '{"caption":"Your morning routine just got an upgrade"}'::jsonb, 'completed', '2026-02-26T11:30:00Z', '2026-02-26T12:00:00Z'),
  ('as-analytics', 'weekly_report', '{"period":"2026-W08"}'::jsonb, NULL, 'running', '2026-02-26T09:00:00Z', NULL),
  ('as-management', 'daily_summary', '{"date":"2026-02-26"}'::jsonb, '{"orders":18,"revenue":2147.50}'::jsonb, 'completed', '2026-02-26T08:00:00Z', '2026-02-26T08:02:00Z'),
  ('as-legal', 'compliance_review', '{"product":"Sleep Formula","document":"label_draft"}'::jsonb, '{"issues":2,"status":"needs_revision"}'::jsonb, 'completed', '2026-02-25T15:00:00Z', '2026-02-25T16:00:00Z'),
  ('as-marketing', 'competitor_analysis', '{"competitor":"all","period":"2026-02"}'::jsonb, NULL, 'pending', NULL, NULL),
  ('as-engagement', 'reply_comments', '{"batch_size":8}'::jsonb, '{"error":"Rate limit exceeded"}'::jsonb, 'failed', '2026-02-25T14:00:00Z', '2026-02-25T14:01:00Z')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. SAMPLE MESSAGE LOG
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO as_message_log (source_channel, source_group, sender_name, message_text, message_type, classification, processed, agent_response) VALUES
  ('whatsapp', 'Team Group', 'Vitor', 'Hey, we need to launch the new Sleep Formula ASAP. Can someone get the label designs ready?', 'text', 'idea', true, 'Idea captured: "Rush Sleep Formula label design". Added to Ideas Bank with high priority.'),
  ('whatsapp', 'Team Group', 'Vitor', 'Launch TikTok ads targeting 25-34 demographic', 'text', 'idea', true, 'Idea captured: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.'),
  ('whatsapp', 'Customer', 'Customer', 'Where is my order AS-100042? It''s been 5 days.', 'text', 'order_inquiry', true, 'Order AS-100042 shipped on Feb 21 via USPS. Tracking: 9400111899223456789. Expected delivery: Feb 27.'),
  ('whatsapp', 'Team Group', 'Marketing Team', 'Instagram reach was up 23% this week, great job everyone!', 'text', 'info', true, NULL),
  ('internal', NULL, 'as-marketing', 'Generated 5 ad copy variants for AfterSlim Burn spring campaign. Saved to tasks queue.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-content', 'Published Instagram caption: "Your morning routine just got an upgrade" with 12 hashtags.', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-analytics', 'Weekly performance report: Instagram reach up 23%, engagement rate 4.8%, top post: Collagen Peptides reel (45K views).', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-management', 'Daily summary: 18 new orders ($2,147), 3 returns pending, inventory alert on Vitamin D3+K2 (low stock).', 'text', NULL, true, NULL),
  ('internal', NULL, 'as-legal', 'FDA compliance check: Sleep Formula label - "clinically proven" should be changed to "clinically studied".', 'text', NULL, true, NULL),
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
