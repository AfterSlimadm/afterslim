// Run with: node seed-data.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qutpbtazoxlaegievmew.supabase.co",
  // service_role key (bypasses RLS)
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dHBidGF6b3hsYWVnaWV2bWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEwNjY0NSwiZXhwIjoyMDg3NjgyNjQ1fQ.lRerHSZw-rjsKE0mXAjgxJG7RIEidNEsLWVjqiyY0d8"
);

async function seed() {
  console.log("Seeding AfterSlim database...\n");

  // ── 1. PRODUCTS ──────────────────────────────────────────────────────────
  console.log("1. Inserting products...");
  const products = [
    {
      slug: "afterslim-biotin", name: "AfterSlim Biotin",
      short_description: "Premium hair, skin, and nails formula with 3,600 mcg Biotin, Vitamin C, Zinc, and Horsetail Extract for radiant beauty from within.",
      description: "<p>AfterSlim Biotin is a comprehensive beauty supplement formulated to support healthy hair growth, glowing skin, and strong nails. With 3,600 mcg of Biotin (12,000% Daily Value) as the star ingredient, this formula delivers powerful results you can see and feel.</p><p>Enhanced with Vitamin C for collagen synthesis, Zinc for skin repair, Niacin for healthy circulation, and Horsetail Extract rich in natural silica. Take 2 capsules daily with an 8 oz. glass of water as part of your beauty routine.</p>",
      category: "Hair, Skin & Nails", product_type: "single", price_cents: 2499, compare_at_price_cents: 2999,
      subscription_price_cents: 2124, subscription_interval: "month", sku: "AS-BIOT-60", weight_oz: 2.4,
      stock_quantity: 200, low_stock_threshold: 40, is_active: true, is_featured: true, sort_order: 1,
      supplement_facts: {
        serving_size: "2 capsules", servings_per_container: 30,
        ingredients: [
          { name: "Vitamin C (as ascorbic acid)", amount: "136 mg", daily_value: "151%" },
          { name: "Niacin (as niacinamide)", amount: "27 mg", daily_value: "169%" },
          { name: "Vitamin B6 (as pyridoxine hydrochloride)", amount: "1.5 mg", daily_value: "118%" },
          { name: "Biotin", amount: "3,600 mcg", daily_value: "12,000%" },
          { name: "Pantothenic acid (as d-calcium pantothenate)", amount: "12 mg", daily_value: "240%" },
          { name: "Calcium (as dicalcium phosphate)", amount: "11 mg", daily_value: "1%" },
          { name: "Zinc (as zinc oxide)", amount: "11 mg", daily_value: "100%" },
          { name: "Horsetail (Equisetum arvense) Extract 10:1", amount: "24 mg", daily_value: "" },
        ],
        other_ingredients: "Microcrystalline Cellulose, Gelatin, Magnesium Stearate, Silicon Dioxide, Titanium Dioxide.",
      },
      meta_title: "AfterSlim Biotin - Hair, Skin & Nails Supplement",
      meta_description: "Support healthy hair, glowing skin, and strong nails with 3,600 mcg Biotin, Vitamin C, Zinc, and Horsetail Extract. 60 capsules.",
      images: [], tags: ["hair-skin-nails", "biotin", "beauty", "best-seller"],
    },
    {
      slug: "afterslim-nootropic", name: "AfterSlim Nootropic",
      short_description: "Advanced cognitive support with Bacopa Monnieri, Rhodiola Rosea, L-Theanine, BCAAs, and Panax Ginseng for focus and mental clarity.",
      description: "<p>AfterSlim Nootropic is a science-backed cognitive enhancement formula designed to support focus, memory, and mental clarity. Featuring Bacopa Monnieri for memory retention, Rhodiola Rosea (3% Salidroside) for stress resilience, and L-Theanine for calm focus without jitters.</p><p>Enhanced with Branched Chain Amino Acids (2:1:1 ratio) for brain fuel and Panax Ginseng for sustained mental energy. For best results, take 2 capsules 20-30 minutes before a meal with 8 oz. of water. Vegan-friendly capsule, contains no allergens.</p>",
      category: "Cognitive Health", product_type: "single", price_cents: 3499, compare_at_price_cents: 3999,
      subscription_price_cents: 2974, subscription_interval: "month", sku: "AS-NOOT-60", weight_oz: 2.6,
      stock_quantity: 180, low_stock_threshold: 40, is_active: true, is_featured: true, sort_order: 2,
      supplement_facts: {
        serving_size: "2 capsules", servings_per_container: 30,
        ingredients: [
          { name: "Branched Chain Amino Acids 2:1:1 (L-Leucine, L-Isoleucine, L-Valine)", amount: "540 mg", daily_value: "" },
          { name: "Bacopa Monnieri Extract", amount: "200 mg", daily_value: "" },
          { name: "Rhodiola Rosea Extract (3% Salidroside)", amount: "100 mg", daily_value: "" },
          { name: "L-Theanine", amount: "100 mg", daily_value: "" },
          { name: "Panax Ginseng Extract", amount: "90 mg", daily_value: "" },
        ],
        other_ingredients: "Microcrystalline Cellulose, Hydroxypropyl Methylcellulose (Capsule), Magnesium Stearate.",
      },
      meta_title: "AfterSlim Nootropic - Cognitive Support Supplement",
      meta_description: "Boost focus and mental clarity with Bacopa Monnieri, Rhodiola Rosea, L-Theanine, and Panax Ginseng. Vegan. 60 capsules.",
      images: [], tags: ["cognitive-health", "nootropic", "focus", "best-seller"],
    },
  ];

  const { data: prodData, error: prodError } = await supabase
    .from("products")
    .upsert(products, { onConflict: "slug" })
    .select("id, slug, sku");

  if (prodError) {
    console.error("  ERROR:", prodError.message);
  } else {
    console.log(`  OK: ${prodData.length} products upserted`);
  }

  // ── 2. KANBAN COLUMNS ────────────────────────────────────────────────────
  console.log("2. Inserting kanban columns...");
  const { data: colData, error: colError } = await supabase
    .from("kanban_columns")
    .upsert([
      { name: "To Do", slug: "todo", position: 0, color: "#3b82f6", wip_limit: null },
      { name: "In Progress", slug: "in-progress", position: 1, color: "#eab308", wip_limit: 5 },
      { name: "Review", slug: "review", position: 2, color: "#a855f7", wip_limit: 3 },
      { name: "Done", slug: "done", position: 3, color: "#22c55e", wip_limit: null },
    ], { onConflict: "slug" })
    .select("id, slug");

  if (colError) console.error("  ERROR:", colError.message);
  else console.log(`  OK: ${colData.length} kanban columns`);

  // ── 3. IDEAS ─────────────────────────────────────────────────────────────
  console.log("3. Inserting ideas...");
  const ideas = [
    { title: "Launch TikTok Ads Targeting 25-34", description: "Create vertical video ads highlighting Biotin hair transformation stories and Nootropic focus benefits for the 25-34 demographic on TikTok.", category: "marketing", priority: "high", status: "approved", source: "after", author: "Team Group", tags: ["tiktok", "ads", "growth"] },
    { title: "Biotin + Nootropic Bundle", description: "Create a discounted Beauty & Brains bundle combining Biotin and Nootropic for customers who want both beauty and cognitive benefits.", category: "product", priority: "medium", status: "under_review", source: "manual", author: "Vitor", tags: ["bundle", "biotin", "nootropic"] },
    { title: "Loyalty Points Program", description: "Implement a points-based reward system: 1 point per dollar, 100 points = $5 discount.", category: "tech", priority: "high", status: "new", source: "agent", author: "Management Agent", tags: ["loyalty", "rewards", "retention"] },
    { title: "Hair Growth Challenge", description: "30-day Hair Growth Challenge on Instagram with daily tips, Biotin product integration, and before/after UGC contest.", category: "marketing", priority: "high", status: "approved", source: "manual", author: "Vitor", tags: ["challenge", "biotin", "instagram", "ugc"] },
    { title: "Subscription Gift Option", description: "Allow customers to gift a subscription to someone else with a personalized message.", category: "tech", priority: "low", status: "new", source: "manual", author: "Vitor", tags: ["subscription", "gifting"] },
    { title: "Expand Product Line", description: "Research additional white-label products from FullStack Fulfillment catalog to expand beyond Biotin and Nootropic.", category: "product", priority: "medium", status: "under_review", source: "manual", author: "Vitor", tags: ["expansion", "fullstack", "new-products"] },
    { title: "Affiliate Program Launch", description: "Set up an affiliate program with tiered commissions (10-20%) for content creators and wellness bloggers.", category: "marketing", priority: "high", status: "new", source: "agent", author: "Marketing Agent", tags: ["affiliates", "creators", "growth"] },
    { title: "Eco-Friendly Packaging", description: "Switch to 100% recyclable packaging and biodegradable shipping materials. Get sustainability certification.", category: "operations", priority: "medium", status: "new", source: "manual", author: "Vitor", tags: ["sustainability", "packaging", "eco"] },
  ];

  const { data: ideaData, error: ideaError } = await supabase.from("ideas").insert(ideas).select("id");
  if (ideaError) console.error("  ERROR:", ideaError.message);
  else console.log(`  OK: ${ideaData.length} ideas`);

  // ── 4. PRODUCTS INVENTORY ────────────────────────────────────────────────
  console.log("4. Inserting products inventory...");
  if (prodData) {
    const inventoryMap = {
      "AS-BIOT-60": { unit_cost: 6.50, supplier: "FullStack Fulfillment" },
      "AS-NOOT-60": { unit_cost: 8.50, supplier: "FullStack Fulfillment" },
    };

    const inventoryRows = prodData.map((p) => {
      const prod = products.find((pr) => pr.slug === p.slug);
      const inv = inventoryMap[p.sku];
      return {
        product_id: p.id,
        sku: p.sku,
        name: prod.name,
        unit_cost: inv.unit_cost,
        selling_price: prod.price_cents / 100,
        stock_qty: prod.stock_quantity,
        reorder_point: prod.low_stock_threshold,
        supplier: inv.supplier,
        category: prod.category,
      };
    });

    const { data: invData, error: invError } = await supabase
      .from("products_inventory")
      .upsert(inventoryRows, { onConflict: "sku" })
      .select("id");

    if (invError) console.error("  ERROR:", invError.message);
    else console.log(`  OK: ${invData.length} inventory rows`);
  }

  // ── 5. CREATORS ──────────────────────────────────────────────────────────
  console.log("5. Inserting creators...");
  const creators = [
    { name: "Sarah Wellness", handle: "@sarahwellness", platform: "instagram", followers: 125000, engagement_rate: 4.2, niche: "Health & Fitness", contact_email: "sarah@wellness.com", tier: "micro", status: "active", notes: "Great engagement, consistent posting schedule" },
    { name: "FitMom Katie", handle: "@fitmomkatie", platform: "instagram", followers: 89000, engagement_rate: 5.1, niche: "Motherhood & Fitness", contact_email: "katie@fitmom.co", tier: "micro", status: "active", notes: "Authentic content, strong community trust" },
    { name: "Dr. Mike Supplements", handle: "@drmikesupps", platform: "tiktok", followers: 340000, engagement_rate: 3.8, niche: "Science & Supplements", contact_email: "mike@drmikesupps.com", tier: "macro", status: "negotiating", notes: "Science-based content, credibility boost" },
    { name: "Clean Eating Lisa", handle: "@cleaneatinglisa", platform: "instagram", followers: 52000, engagement_rate: 6.3, niche: "Nutrition & Recipes", contact_email: "lisa@cleaneating.com", tier: "nano", status: "active", notes: "High engagement rate, quality UGC" },
    { name: "Jake The Supplement Guy", handle: "@jakesuppguy", platform: "tiktok", followers: 210000, engagement_rate: 4.5, niche: "Supplements & Reviews", contact_email: "jake@suppguy.com", tier: "macro", status: "contacted", notes: "Honest reviews, male demographic reach" },
    { name: "Yoga With Priya", handle: "@yogawithpriya", platform: "instagram", followers: 178000, engagement_rate: 3.9, niche: "Yoga & Wellness", contact_email: "priya@yogawithpriya.com", tier: "micro", status: "prospect", notes: "Wellness lifestyle, aligned brand values" },
  ];

  const { data: crData, error: crError } = await supabase.from("creators").insert(creators).select("id");
  if (crError) console.error("  ERROR:", crError.message);
  else console.log(`  OK: ${crData.length} creators`);

  // ── 6. TRANSACTIONS ──────────────────────────────────────────────────────
  console.log("6. Inserting transactions...");
  const transactions = [
    { type: "income", category: "order_revenue", description: "Daily orders Feb 26", amount: 2147.50, currency: "USD", reference_type: "manual", date: "2026-02-26", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 25", amount: 1893.22, currency: "USD", reference_type: "manual", date: "2026-02-25", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 24", amount: 2456.80, currency: "USD", reference_type: "manual", date: "2026-02-24", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 23", amount: 1654.99, currency: "USD", reference_type: "manual", date: "2026-02-23", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 22", amount: 2089.15, currency: "USD", reference_type: "manual", date: "2026-02-22", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 21", amount: 1435.60, currency: "USD", reference_type: "manual", date: "2026-02-21", created_by: "system" },
    { type: "income", category: "order_revenue", description: "Daily orders Feb 20", amount: 1978.33, currency: "USD", reference_type: "manual", date: "2026-02-20", created_by: "system" },
    { type: "income", category: "shipping_revenue", description: "Shipping fees week 8", amount: 342.50, currency: "USD", reference_type: "manual", date: "2026-02-24", created_by: "system" },
    { type: "income", category: "shipping_revenue", description: "Shipping fees week 7", amount: 289.75, currency: "USD", reference_type: "manual", date: "2026-02-17", created_by: "system" },
    { type: "expense", category: "ad_spend", description: "Meta Ads Feb 20-26", amount: 1250.00, currency: "USD", reference_type: "manual", date: "2026-02-26", created_by: "system" },
    { type: "expense", category: "ad_spend", description: "Meta Ads Feb 13-19", amount: 980.00, currency: "USD", reference_type: "manual", date: "2026-02-19", created_by: "system" },
    { type: "expense", category: "ad_spend", description: "TikTok Ads Feb", amount: 450.00, currency: "USD", reference_type: "manual", date: "2026-02-26", created_by: "system" },
    { type: "expense", category: "ad_spend", description: "Google Ads Feb", amount: 320.00, currency: "USD", reference_type: "manual", date: "2026-02-26", created_by: "system" },
    { type: "expense", category: "supplier_payment", description: "FullStack Fulfillment - Biotin Feb order", amount: 1950.00, currency: "USD", reference_type: "manual", date: "2026-02-15", created_by: "system" },
    { type: "expense", category: "supplier_payment", description: "FullStack Fulfillment - Nootropic Feb order", amount: 1530.00, currency: "USD", reference_type: "manual", date: "2026-02-18", created_by: "system" },
    { type: "expense", category: "creator_payment", description: "Sarah Wellness - Spring campaign", amount: 800.00, currency: "USD", reference_type: "manual", date: "2026-02-20", created_by: "system" },
    { type: "expense", category: "creator_payment", description: "FitMom Katie - UGC Sprint", amount: 500.00, currency: "USD", reference_type: "manual", date: "2026-02-22", created_by: "system" },
    { type: "expense", category: "platform_fee", description: "Stripe processing fees Feb", amount: 487.33, currency: "USD", reference_type: "manual", date: "2026-02-26", created_by: "system" },
    { type: "expense", category: "platform_fee", description: "Vercel hosting Feb", amount: 20.00, currency: "USD", reference_type: "manual", date: "2026-02-01", created_by: "system" },
    { type: "expense", category: "operational", description: "Shipping supplies", amount: 156.80, currency: "USD", reference_type: "manual", date: "2026-02-10", created_by: "system" },
    { type: "expense", category: "operational", description: "Product photography", amount: 350.00, currency: "USD", reference_type: "manual", date: "2026-02-08", created_by: "system" },
    { type: "expense", category: "tax", description: "FL sales tax Q1 partial", amount: 412.50, currency: "USD", reference_type: "manual", date: "2026-02-25", created_by: "system" },
    { type: "expense", category: "refund", description: "Order AS-100015 refund", amount: 49.99, currency: "USD", reference_type: "manual", date: "2026-02-23", created_by: "system" },
    { type: "expense", category: "refund", description: "Order AS-100018 partial refund", amount: 34.99, currency: "USD", reference_type: "manual", date: "2026-02-25", created_by: "system" },
    { type: "expense", category: "other", description: "Software subscriptions (Canva, etc)", amount: 89.99, currency: "USD", reference_type: "manual", date: "2026-02-01", created_by: "system" },
  ];

  const { data: txData, error: txError } = await supabase.from("transactions").insert(transactions).select("id");
  if (txError) console.error("  ERROR:", txError.message);
  else console.log(`  OK: ${txData.length} transactions`);

  // ── 7. FINANCIAL GOALS ───────────────────────────────────────────────────
  console.log("7. Inserting financial goals...");
  const goals = [
    { name: "Monthly Revenue Target", metric: "revenue", target: 35000, current: 28450, period: "monthly", start_date: "2026-02-01", end_date: "2026-02-28", active: true },
    { name: "Q1 Revenue Goal", metric: "revenue", target: 100000, current: 67230, period: "quarterly", start_date: "2026-01-01", end_date: "2026-03-31", active: true },
    { name: "Monthly New Customers", metric: "orders", target: 400, current: 185, period: "monthly", start_date: "2026-02-01", end_date: "2026-02-28", active: true },
    { name: "Q1 Profit Margin Target", metric: "profit", target: 55, current: 51.2, period: "quarterly", start_date: "2026-01-01", end_date: "2026-03-31", active: true },
    { name: "Reduce Ad Spend Ratio", metric: "cogs_ratio", target: 15, current: 18.5, period: "monthly", start_date: "2026-02-01", end_date: "2026-02-28", active: true },
    { name: "Increase AOV", metric: "revenue", target: 45, current: 38.50, period: "monthly", start_date: "2026-02-01", end_date: "2026-02-28", active: true },
  ];

  const { data: goalData, error: goalError } = await supabase.from("financial_goals").insert(goals).select("id");
  if (goalError) console.error("  ERROR:", goalError.message);
  else console.log(`  OK: ${goalData.length} financial goals`);

  // ── 8. AGENT MEMORY ──────────────────────────────────────────────────────
  console.log("8. Inserting agent memories...");
  const memories = [
    { agent_id: "as-analytics", kind: "insight", content: "Instagram engagement peaks on Tuesdays and Thursdays between 6-8 PM EST. Recommend scheduling high-value posts during these windows." },
    { agent_id: "as-marketing", kind: "insight", content: "Competitor NatureMade Biotin at $12.99 has lower dosage (2500mcg vs our 3600mcg). Highlight our higher potency and complete vitamin blend as key differentiator." },
    { agent_id: "as-management", kind: "summary", content: "Week 8 Summary: Revenue $5,247 (+12% WoW), 72 orders, AOV $72.90. Top product: AfterSlim Biotin (45 units). Nootropic gaining traction (27 units)." },
    { agent_id: "as-after", kind: "classification", content: 'Message from team group classified as [idea]: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.' },
    { agent_id: "as-legal", kind: "alert", content: "FTC updated influencer disclosure guidelines effective March 2026. All creator contracts need updated disclosure language. Priority: HIGH." },
    { agent_id: "as-content", kind: "action", content: "Created content calendar for March 2026: 12 feed posts, 8 Reels, 4 Stories campaigns. Theme: Spring Renewal — hair growth & focus." },
    { agent_id: "as-engagement", kind: "insight", content: "Top 3 comment themes this week: 1) Shipping speed questions (38%), 2) Biotin results timeline (25%), 3) Nootropic ingredient inquiries (20%). Consider FAQ highlight reel." },
    { agent_id: "as-management", kind: "alert", content: "Profit margin dropped to 42% from 48% due to increased ad spend. Recommend reviewing Meta Ads ROI and pausing underperforming campaigns." },
  ];

  const { data: memData, error: memError } = await supabase.from("as_agent_memory").insert(memories).select("id");
  if (memError) console.error("  ERROR:", memError.message);
  else console.log(`  OK: ${memData.length} agent memories`);

  // ── 9. AGENT TASKS ───────────────────────────────────────────────────────
  console.log("9. Inserting agent tasks...");
  const tasks = [
    { agent_id: "as-after", task_type: "classify_message", input: { text: "Hey, we need to push the Nootropic launch harder" }, output: { classification: "idea", title: "Boost Nootropic marketing push" }, status: "completed", started_at: "2026-02-26T14:30:00Z", completed_at: "2026-02-26T14:30:05Z" },
    { agent_id: "as-marketing", task_type: "generate_ad_copy", input: { product: "AfterSlim Biotin", campaign: "spring" }, output: { variants: 5 }, status: "completed", started_at: "2026-02-26T13:00:00Z", completed_at: "2026-02-26T13:15:00Z" },
    { agent_id: "as-content", task_type: "generate_caption", input: { type: "daily_tip", topic: "morning routine" }, output: { caption: "Your morning routine just got an upgrade" }, status: "completed", started_at: "2026-02-26T11:30:00Z", completed_at: "2026-02-26T12:00:00Z" },
    { agent_id: "as-analytics", task_type: "weekly_report", input: { period: "2026-W08" }, output: null, status: "running", started_at: "2026-02-26T09:00:00Z", completed_at: null },
    { agent_id: "as-management", task_type: "daily_summary", input: { date: "2026-02-26" }, output: { orders: 18, revenue: 2147.50 }, status: "completed", started_at: "2026-02-26T08:00:00Z", completed_at: "2026-02-26T08:02:00Z" },
    { agent_id: "as-legal", task_type: "compliance_review", input: { product: "Nootropic", document: "label_draft" }, output: { issues: 0, status: "approved" }, status: "completed", started_at: "2026-02-25T15:00:00Z", completed_at: "2026-02-25T16:00:00Z" },
    { agent_id: "as-marketing", task_type: "competitor_analysis", input: { competitor: "all", period: "2026-02" }, output: null, status: "pending", started_at: null, completed_at: null },
    { agent_id: "as-engagement", task_type: "reply_comments", input: { batch_size: 8 }, output: { error: "Rate limit exceeded" }, status: "failed", started_at: "2026-02-25T14:00:00Z", completed_at: "2026-02-25T14:01:00Z" },
  ];

  const { data: taskData, error: taskError } = await supabase.from("as_agent_tasks").insert(tasks).select("id");
  if (taskError) console.error("  ERROR:", taskError.message);
  else console.log(`  OK: ${taskData.length} agent tasks`);

  // ── 10. MESSAGE LOG ──────────────────────────────────────────────────────
  console.log("10. Inserting message log...");
  const messages = [
    { source_channel: "whatsapp", source_group: "Team Group", sender_name: "Vitor", message_text: "Hey, we need to push the Nootropic marketing harder. Let's get some ad creatives ready.", message_type: "text", classification: "idea", processed: true, agent_response: 'Idea captured: "Boost Nootropic marketing push". Added to Ideas Bank with high priority.' },
    { source_channel: "whatsapp", source_group: "Team Group", sender_name: "Vitor", message_text: "Launch TikTok ads targeting 25-34 demographic", message_type: "text", classification: "idea", processed: true, agent_response: 'Idea captured: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.' },
    { source_channel: "whatsapp", source_group: "Customer", sender_name: "Customer", message_text: "Where is my order AS-100042? It's been 5 days.", message_type: "text", classification: "order_inquiry", processed: true, agent_response: "Order AS-100042 shipped on Feb 21 via USPS. Tracking: 9400111899223456789. Expected delivery: Feb 27." },
    { source_channel: "internal", sender_name: "as-marketing", message_text: "Generated 5 ad copy variants for AfterSlim Biotin spring campaign. Saved to tasks queue.", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-content", message_text: 'Published Instagram caption: "Your morning routine just got an upgrade" with 12 hashtags.', message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-analytics", message_text: "Weekly performance report: Instagram reach up 23%, engagement rate 4.8%, top post: Biotin hair transformation reel (45K views).", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-management", message_text: "Daily summary: 18 new orders ($2,147), 3 returns pending. Biotin (12 units) and Nootropic (6 units) sold today.", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-legal", message_text: "FDA compliance check: Both Biotin and Nootropic labels approved. FDA disclaimer and supplement facts verified.", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-engagement", message_text: "Replied to 15 Instagram comments. Flagged 2 negative mentions for review. Generated 3 DM templates.", message_type: "text", processed: true },
  ];

  const { data: msgData, error: msgError } = await supabase.from("as_message_log").insert(messages).select("id");
  if (msgError) console.error("  ERROR:", msgError.message);
  else console.log(`  OK: ${msgData.length} messages`);

  console.log("\nSeed complete!");
}

seed().catch(console.error);
