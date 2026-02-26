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
      slug: "afterslim-burn", name: "AfterSlim Burn",
      short_description: "Thermogenic fat burner with green tea extract and L-carnitine to boost metabolism and support weight management.",
      description: "<p>AfterSlim Burn is our flagship thermogenic formula designed to support your weight management goals. Featuring a powerful blend of green tea extract (EGCG), caffeine anhydrous, L-carnitine, and cayenne pepper extract, this science-backed formula helps boost your metabolism and increase energy expenditure.</p><p>Enhanced with BioPerine for maximum absorption and chromium picolinate to support healthy blood sugar levels already within the normal range. Take 2 capsules daily with water, preferably before your morning workout for best results.</p>",
      category: "Weight Management", product_type: "single", price_cents: 4999, compare_at_price_cents: 5999,
      subscription_price_cents: 4249, subscription_interval: "month", sku: "AS-BURN-60", weight_oz: 3.2,
      stock_quantity: 245, low_stock_threshold: 50, is_active: true, is_featured: true, sort_order: 1,
      supplement_facts: {
        serving_size: "2 capsules", servings_per_container: 30,
        ingredients: [
          { name: "Green Tea Extract (EGCG)", amount: "500 mg", daily_value: "" },
          { name: "Caffeine Anhydrous", amount: "200 mg", daily_value: "" },
          { name: "L-Carnitine", amount: "500 mg", daily_value: "" },
          { name: "Cayenne Pepper Extract", amount: "100 mg", daily_value: "" },
          { name: "Black Pepper Extract (BioPerine)", amount: "5 mg", daily_value: "" },
          { name: "Chromium (as Chromium Picolinate)", amount: "200 mcg", daily_value: "571%" },
        ],
        other_ingredients: "Vegetable cellulose (capsule), rice flour, magnesium stearate, silicon dioxide.",
        allergen_warning: "Manufactured in a facility that also processes milk, soy, eggs, wheat, peanuts, and tree nuts.",
      },
      meta_title: "AfterSlim Burn - Thermogenic Fat Burner",
      meta_description: "Boost your metabolism with AfterSlim Burn. Science-backed thermogenic formula with green tea extract, L-carnitine, and BioPerine.",
      images: [], tags: ["weight-management", "fat-burner", "best-seller"],
    },
    {
      slug: "afterslim-cleanse", name: "AfterSlim Cleanse",
      short_description: "Gentle 15-day detox support formula with milk thistle, dandelion root, and probiotics to support digestive wellness.",
      description: "<p>AfterSlim Cleanse provides gentle yet effective detox support with a carefully balanced blend of natural ingredients. Milk thistle and dandelion root work together to support liver function, while a 5-strain probiotic blend promotes healthy gut flora.</p><p>This 15-day cleanse program includes artichoke extract for digestive comfort and turmeric for its antioxidant properties.</p>",
      category: "Weight Management", product_type: "single", price_cents: 3999, compare_at_price_cents: null,
      subscription_price_cents: 3399, subscription_interval: "month", sku: "AS-CLNS-30", weight_oz: 2.8,
      stock_quantity: 180, low_stock_threshold: 40, is_active: true, is_featured: false, sort_order: 2,
      supplement_facts: {
        serving_size: "2 capsules", servings_per_container: 15,
        ingredients: [
          { name: "Milk Thistle Extract (80% Silymarin)", amount: "250 mg", daily_value: "" },
          { name: "Dandelion Root Extract", amount: "200 mg", daily_value: "" },
          { name: "Artichoke Leaf Extract", amount: "150 mg", daily_value: "" },
          { name: "Turmeric Extract (95% Curcuminoids)", amount: "100 mg", daily_value: "" },
          { name: "Probiotic Blend (5 Billion CFU)", amount: "100 mg", daily_value: "" },
          { name: "Ginger Root Extract", amount: "50 mg", daily_value: "" },
        ],
        other_ingredients: "Vegetable cellulose (capsule), rice flour, silicon dioxide.",
        allergen_warning: "Manufactured in a facility that also processes milk, soy, and tree nuts.",
      },
      meta_title: "AfterSlim Cleanse - Gentle Detox Support",
      meta_description: "Support your digestive wellness with AfterSlim Cleanse. A gentle 15-day detox formula with milk thistle, probiotics, and turmeric.",
      images: [], tags: ["weight-management", "detox", "cleanse"],
    },
    {
      slug: "afterslim-probiotics-plus", name: "AfterSlim Probiotics+",
      short_description: "Advanced 50 billion CFU probiotic with 16 strains and prebiotic fiber for optimal gut health and immune support.",
      description: "<p>AfterSlim Probiotics+ delivers 50 billion CFU of beneficial bacteria across 16 carefully selected strains. Each strain is chosen for its specific benefit to digestive health, immune function, and overall wellness.</p><p>Our delayed-release capsule technology ensures the probiotics survive stomach acid and reach your intestines alive. Enhanced with prebiotic fiber (FOS) to nourish the good bacteria already in your gut.</p>",
      category: "Supplements", product_type: "single", price_cents: 3499, compare_at_price_cents: 4199,
      subscription_price_cents: 2974, subscription_interval: "month", sku: "AS-PROB-60", weight_oz: 2.5,
      stock_quantity: 312, low_stock_threshold: 60, is_active: true, is_featured: true, sort_order: 3,
      supplement_facts: {
        serving_size: "1 capsule", servings_per_container: 60,
        ingredients: [
          { name: "Probiotic Blend (16 Strains)", amount: "50 Billion CFU", daily_value: "" },
          { name: "Prebiotic Fiber (FOS)", amount: "200 mg", daily_value: "" },
          { name: "Lactobacillus acidophilus", amount: "12.5 Billion CFU", daily_value: "" },
          { name: "Bifidobacterium lactis", amount: "10 Billion CFU", daily_value: "" },
          { name: "Lactobacillus rhamnosus", amount: "7.5 Billion CFU", daily_value: "" },
        ],
        other_ingredients: "Delayed-release vegetable capsule (HPMC, gellan gum), rice flour, silicon dioxide.",
      },
      meta_title: "AfterSlim Probiotics+ - 50 Billion CFU Probiotic",
      meta_description: "Support gut health with 50 billion CFU and 16 probiotic strains. Delayed-release capsule with prebiotic fiber.",
      images: [], tags: ["supplements", "probiotics", "gut-health", "best-seller"],
    },
    {
      slug: "afterslim-omega-3-ultra", name: "AfterSlim Omega-3 Ultra",
      short_description: "Triple-strength fish oil with 2400 mg EPA/DHA per serving for heart, brain, and joint support.",
      description: "<p>AfterSlim Omega-3 Ultra delivers a potent 2400 mg of combined EPA and DHA per serving from sustainably sourced wild-caught fish. Our molecular distillation process ensures pharmaceutical-grade purity free from heavy metals and contaminants.</p><p>Each softgel features a natural lemon coating to eliminate fishy aftertaste. Supports cardiovascular health, cognitive function, and joint comfort.</p>",
      category: "Supplements", product_type: "single", price_cents: 2999, compare_at_price_cents: null,
      subscription_price_cents: null, subscription_interval: null, sku: "AS-OMG3-90", weight_oz: 5.6,
      stock_quantity: 156, low_stock_threshold: 30, is_active: true, is_featured: false, sort_order: 4,
      supplement_facts: {
        serving_size: "3 softgels", servings_per_container: 30,
        ingredients: [
          { name: "Fish Oil Concentrate", amount: "3600 mg", daily_value: "" },
          { name: "EPA (Eicosapentaenoic Acid)", amount: "1440 mg", daily_value: "" },
          { name: "DHA (Docosahexaenoic Acid)", amount: "960 mg", daily_value: "" },
        ],
        other_ingredients: "Softgel (gelatin, glycerin, purified water), natural lemon flavor, mixed tocopherols.",
        allergen_warning: "Contains fish (anchovy, sardine, mackerel). Manufactured in a facility that processes shellfish.",
      },
      meta_title: "AfterSlim Omega-3 Ultra - Triple Strength Fish Oil",
      meta_description: "Triple-strength fish oil with 2400 mg EPA/DHA. Sustainably sourced, molecularly distilled for purity.",
      images: [], tags: ["supplements", "omega-3", "heart-health"],
    },
    {
      slug: "afterslim-vitamin-d3-k2", name: "AfterSlim Vitamin D3+K2",
      short_description: "5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption, bone strength, and immune support.",
      description: "<p>AfterSlim Vitamin D3+K2 combines 5000 IU of Vitamin D3 (cholecalciferol) with 100 mcg of Vitamin K2 (as MK-7) for synergistic bone and immune support. Vitamin K2 directs calcium to your bones where it belongs, rather than to your arteries.</p><p>Our formula uses organic coconut oil as a carrier for enhanced fat-soluble vitamin absorption. One small softgel daily is all you need.</p>",
      category: "Supplements", product_type: "single", price_cents: 2499, compare_at_price_cents: 2999,
      subscription_price_cents: 2124, subscription_interval: "month", sku: "AS-VDK2-60", weight_oz: 1.8,
      stock_quantity: 8, low_stock_threshold: 25, is_active: true, is_featured: false, sort_order: 5,
      supplement_facts: {
        serving_size: "1 softgel", servings_per_container: 60,
        ingredients: [
          { name: "Vitamin D3 (Cholecalciferol)", amount: "125 mcg (5,000 IU)", daily_value: "625%" },
          { name: "Vitamin K2 (as MK-7)", amount: "100 mcg", daily_value: "83%" },
        ],
        other_ingredients: "Organic coconut oil, softgel (bovine gelatin, glycerin, purified water).",
      },
      meta_title: "AfterSlim Vitamin D3+K2 - Bone & Immune Support",
      meta_description: "5000 IU Vitamin D3 with K2 (MK-7) for optimal calcium absorption. Supports bone strength and immune health.",
      images: [], tags: ["supplements", "vitamins", "bone-health"],
    },
    {
      slug: "afterslim-collagen-peptides", name: "AfterSlim Collagen Peptides",
      short_description: "Hydrolyzed multi-collagen peptides (Types I, II, III, V, X) for radiant skin, strong joints, and healthy hair.",
      description: "<p>AfterSlim Collagen Peptides provides 10g of hydrolyzed multi-collagen per serving from five collagen types (I, II, III, V, and X). Our advanced hydrolysis process breaks collagen into small peptides for rapid absorption and bioavailability.</p><p>Sourced from grass-fed, pasture-raised bovine, wild-caught fish, and cage-free chicken. Unflavored and dissolves easily in coffee, smoothies, or water.</p>",
      category: "Supplements", product_type: "single", price_cents: 4499, compare_at_price_cents: 5399,
      subscription_price_cents: 3824, subscription_interval: "month", sku: "AS-COLL-30", weight_oz: 10.6,
      stock_quantity: 98, low_stock_threshold: 30, is_active: true, is_featured: true, sort_order: 6,
      supplement_facts: {
        serving_size: "1 scoop (11g)", servings_per_container: 30,
        ingredients: [
          { name: "Multi-Collagen Blend", amount: "10 g", daily_value: "" },
          { name: "Type I Collagen (Bovine)", amount: "5 g", daily_value: "" },
          { name: "Type II Collagen (Chicken)", amount: "2 g", daily_value: "" },
          { name: "Type III Collagen (Bovine)", amount: "1.5 g", daily_value: "" },
          { name: "Type V Collagen (Eggshell)", amount: "1 g", daily_value: "" },
          { name: "Type X Collagen (Chicken)", amount: "0.5 g", daily_value: "" },
        ],
        other_ingredients: "None.",
        allergen_warning: "Contains eggs, fish. Manufactured in a facility that processes milk, soy, wheat, peanuts, and tree nuts.",
      },
      meta_title: "AfterSlim Collagen Peptides - Multi-Collagen Protein",
      meta_description: "Hydrolyzed multi-collagen peptides with Types I, II, III, V, X. Supports radiant skin, strong joints, and healthy hair.",
      images: [], tags: ["supplements", "collagen", "skin-health", "best-seller"],
    },
    {
      slug: "afterslim-sleep-formula", name: "AfterSlim Sleep Formula",
      short_description: "Natural sleep support with melatonin, magnesium glycinate, L-theanine, and ashwagandha for restful recovery.",
      description: "<p>AfterSlim Sleep Formula combines the most effective natural sleep ingredients into one convenient capsule. Melatonin helps regulate your circadian rhythm, while magnesium glycinate relaxes muscles and calms the nervous system.</p><p>L-theanine promotes alpha brain waves for calm focus before bed, and ashwagandha (KSM-66) helps reduce occasional stress. Non-habit-forming formula you can trust.</p>",
      category: "Energy", product_type: "single", price_cents: 3299, compare_at_price_cents: null,
      subscription_price_cents: 2804, subscription_interval: "month", sku: "AS-SLEP-60", weight_oz: 2.4,
      stock_quantity: 67, low_stock_threshold: 25, is_active: true, is_featured: false, sort_order: 7,
      supplement_facts: {
        serving_size: "2 capsules", servings_per_container: 30,
        ingredients: [
          { name: "Magnesium (as Magnesium Glycinate)", amount: "200 mg", daily_value: "48%" },
          { name: "L-Theanine", amount: "200 mg", daily_value: "" },
          { name: "Ashwagandha Root Extract (KSM-66)", amount: "300 mg", daily_value: "" },
          { name: "GABA", amount: "100 mg", daily_value: "" },
          { name: "Melatonin", amount: "3 mg", daily_value: "" },
        ],
        other_ingredients: "Vegetable cellulose (capsule), rice flour, magnesium stearate.",
      },
      meta_title: "AfterSlim Sleep Formula - Natural Sleep Support",
      meta_description: "Fall asleep faster with our natural sleep formula. Melatonin, magnesium, L-theanine, and ashwagandha. Non-habit-forming.",
      images: [], tags: ["energy", "sleep", "recovery"],
    },
    {
      slug: "afterslim-immunity-shield", name: "AfterSlim Immunity Shield",
      short_description: "Comprehensive immune support with Vitamin C, zinc, elderberry, and echinacea to keep your defenses strong.",
      description: "<p>AfterSlim Immunity Shield is your daily defense against seasonal challenges. This comprehensive formula combines Vitamin C (1000 mg), zinc bisglycinate, elderberry extract, and echinacea to support a robust immune response.</p><p>Enhanced with quercetin and selenium for powerful antioxidant protection. Perfect for daily use or increased dosing during times when extra immune support is needed.</p>",
      category: "Supplements", product_type: "single", price_cents: 2799, compare_at_price_cents: 3359,
      subscription_price_cents: null, subscription_interval: null, sku: "AS-IMMU-90", weight_oz: 3.0,
      stock_quantity: 203, low_stock_threshold: 40, is_active: true, is_featured: false, sort_order: 8,
      supplement_facts: {
        serving_size: "1 capsule", servings_per_container: 90,
        ingredients: [
          { name: "Vitamin C (as Ascorbic Acid)", amount: "1000 mg", daily_value: "1111%" },
          { name: "Zinc (as Zinc Bisglycinate)", amount: "25 mg", daily_value: "227%" },
          { name: "Elderberry Extract", amount: "250 mg", daily_value: "" },
          { name: "Echinacea purpurea Extract", amount: "200 mg", daily_value: "" },
          { name: "Quercetin", amount: "100 mg", daily_value: "" },
          { name: "Selenium (as Selenomethionine)", amount: "55 mcg", daily_value: "100%" },
        ],
        other_ingredients: "Vegetable cellulose (capsule), rice flour, silicon dioxide, magnesium stearate.",
        allergen_warning: "Manufactured in a facility that also processes milk, soy, and tree nuts.",
      },
      meta_title: "AfterSlim Immunity Shield - Immune Support Complex",
      meta_description: "Strengthen your immune defenses with Vitamin C, zinc, elderberry, and echinacea.",
      images: [], tags: ["supplements", "immune-support", "vitamins"],
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
    { title: "Launch TikTok Ads Targeting 25-34", description: "Create vertical video ads highlighting transformation stories and product benefits for the 25-34 demographic on TikTok.", category: "marketing", priority: "high", status: "approved", source: "after", author: "Team Group", tags: ["tiktok", "ads", "growth"] },
    { title: "Collagen + Probiotic Bundle", description: "Create a discounted kit combining Collagen Peptides and Probiotics+ for gut-skin axis benefits.", category: "product", priority: "medium", status: "under_review", source: "manual", author: "Vitor", tags: ["bundle", "collagen", "probiotics"] },
    { title: "Loyalty Points Program", description: "Implement a points-based reward system: 1 point per dollar, 100 points = $5 discount.", category: "tech", priority: "high", status: "new", source: "agent", author: "Management Agent", tags: ["loyalty", "rewards", "retention"] },
    { title: "Spring Detox Challenge", description: "30-day Spring Detox Challenge on Instagram with daily tips, Cleanse product integration, and UGC contest.", category: "marketing", priority: "high", status: "approved", source: "manual", author: "Vitor", tags: ["challenge", "detox", "instagram", "ugc"] },
    { title: "Subscription Gift Option", description: "Allow customers to gift a subscription to someone else with a personalized message.", category: "tech", priority: "low", status: "new", source: "manual", author: "Vitor", tags: ["subscription", "gifting"] },
    { title: "CBD Sleep Gummies", description: "Research feasibility of a CBD-infused sleep gummy line. Need legal review for multi-state compliance.", category: "product", priority: "medium", status: "under_review", source: "manual", author: "Vitor", tags: ["cbd", "sleep", "gummies", "legal"] },
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
      "AS-BURN-60": { unit_cost: 12.50, supplier: "NutraLab USA" },
      "AS-CLNS-30": { unit_cost: 9.75, supplier: "NutraLab USA" },
      "AS-PROB-60": { unit_cost: 8.50, supplier: "BioFlora Labs" },
      "AS-OMG3-90": { unit_cost: 7.25, supplier: "OceanPure" },
      "AS-VDK2-60": { unit_cost: 5.50, supplier: "NutraLab USA" },
      "AS-COLL-30": { unit_cost: 14.00, supplier: "PureCollagen Co" },
      "AS-SLEP-60": { unit_cost: 8.00, supplier: "NutraLab USA" },
      "AS-IMMU-90": { unit_cost: 6.75, supplier: "BioFlora Labs" },
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
    { type: "expense", category: "supplier_payment", description: "NutraLab USA - Feb order", amount: 3200.00, currency: "USD", reference_type: "manual", date: "2026-02-15", created_by: "system" },
    { type: "expense", category: "supplier_payment", description: "BioFlora Labs - Feb order", amount: 1450.00, currency: "USD", reference_type: "manual", date: "2026-02-18", created_by: "system" },
    { type: "expense", category: "supplier_payment", description: "PureCollagen Co - Feb order", amount: 840.00, currency: "USD", reference_type: "manual", date: "2026-02-12", created_by: "system" },
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
    { agent_id: "as-marketing", kind: "insight", content: "Competitor GreenSupps launched a collagen line at $39.99. Our Collagen Peptides at $44.99 has better ingredient profile but we should highlight the value proposition." },
    { agent_id: "as-management", kind: "summary", content: "Week 8 Summary: Revenue $8,247 (+12% WoW), 72 orders, AOV $114.54. Top product: AfterSlim Burn (28 units). Low stock alert: Vitamin D3+K2." },
    { agent_id: "as-after", kind: "classification", content: 'Message from team group classified as [idea]: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.' },
    { agent_id: "as-legal", kind: "alert", content: "FTC updated influencer disclosure guidelines effective March 2026. All creator contracts need updated disclosure language. Priority: HIGH." },
    { agent_id: "as-content", kind: "action", content: "Created content calendar for March 2026: 12 feed posts, 8 Reels, 4 Stories campaigns. Theme: Spring Renewal." },
    { agent_id: "as-engagement", kind: "insight", content: "Top 3 comment themes this week: 1) Shipping speed questions (38%), 2) Product comparisons (25%), 3) Ingredient inquiries (20%). Consider FAQ highlight reel." },
    { agent_id: "as-management", kind: "alert", content: "Profit margin dropped to 42% from 48% due to increased ad spend. Recommend reviewing Meta Ads ROI and pausing underperforming campaigns." },
  ];

  const { data: memData, error: memError } = await supabase.from("as_agent_memory").insert(memories).select("id");
  if (memError) console.error("  ERROR:", memError.message);
  else console.log(`  OK: ${memData.length} agent memories`);

  // ── 9. AGENT TASKS ───────────────────────────────────────────────────────
  console.log("9. Inserting agent tasks...");
  const tasks = [
    { agent_id: "as-after", task_type: "classify_message", input: { text: "Hey, we need to launch the new Sleep Formula ASAP" }, output: { classification: "idea", title: "Rush Sleep Formula launch" }, status: "completed", started_at: "2026-02-26T14:30:00Z", completed_at: "2026-02-26T14:30:05Z" },
    { agent_id: "as-marketing", task_type: "generate_ad_copy", input: { product: "AfterSlim Burn", campaign: "spring" }, output: { variants: 5 }, status: "completed", started_at: "2026-02-26T13:00:00Z", completed_at: "2026-02-26T13:15:00Z" },
    { agent_id: "as-content", task_type: "generate_caption", input: { type: "daily_tip", topic: "morning routine" }, output: { caption: "Your morning routine just got an upgrade" }, status: "completed", started_at: "2026-02-26T11:30:00Z", completed_at: "2026-02-26T12:00:00Z" },
    { agent_id: "as-analytics", task_type: "weekly_report", input: { period: "2026-W08" }, output: null, status: "running", started_at: "2026-02-26T09:00:00Z", completed_at: null },
    { agent_id: "as-management", task_type: "daily_summary", input: { date: "2026-02-26" }, output: { orders: 18, revenue: 2147.50 }, status: "completed", started_at: "2026-02-26T08:00:00Z", completed_at: "2026-02-26T08:02:00Z" },
    { agent_id: "as-legal", task_type: "compliance_review", input: { product: "Sleep Formula", document: "label_draft" }, output: { issues: 2, status: "needs_revision" }, status: "completed", started_at: "2026-02-25T15:00:00Z", completed_at: "2026-02-25T16:00:00Z" },
    { agent_id: "as-marketing", task_type: "competitor_analysis", input: { competitor: "all", period: "2026-02" }, output: null, status: "pending", started_at: null, completed_at: null },
    { agent_id: "as-engagement", task_type: "reply_comments", input: { batch_size: 8 }, output: { error: "Rate limit exceeded" }, status: "failed", started_at: "2026-02-25T14:00:00Z", completed_at: "2026-02-25T14:01:00Z" },
  ];

  const { data: taskData, error: taskError } = await supabase.from("as_agent_tasks").insert(tasks).select("id");
  if (taskError) console.error("  ERROR:", taskError.message);
  else console.log(`  OK: ${taskData.length} agent tasks`);

  // ── 10. MESSAGE LOG ──────────────────────────────────────────────────────
  console.log("10. Inserting message log...");
  const messages = [
    { source_channel: "whatsapp", source_group: "Team Group", sender_name: "Vitor", message_text: "Hey, we need to launch the new Sleep Formula ASAP. Can someone get the label designs ready?", message_type: "text", classification: "idea", processed: true, agent_response: 'Idea captured: "Rush Sleep Formula label design". Added to Ideas Bank with high priority.' },
    { source_channel: "whatsapp", source_group: "Team Group", sender_name: "Vitor", message_text: "Launch TikTok ads targeting 25-34 demographic", message_type: "text", classification: "idea", processed: true, agent_response: 'Idea captured: "Launch TikTok ads targeting 25-34 demographic". Forwarded to Ideas Bank.' },
    { source_channel: "whatsapp", source_group: "Customer", sender_name: "Customer", message_text: "Where is my order AS-100042? It's been 5 days.", message_type: "text", classification: "order_inquiry", processed: true, agent_response: "Order AS-100042 shipped on Feb 21 via USPS. Tracking: 9400111899223456789. Expected delivery: Feb 27." },
    { source_channel: "internal", sender_name: "as-marketing", message_text: "Generated 5 ad copy variants for AfterSlim Burn spring campaign. Saved to tasks queue.", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-content", message_text: 'Published Instagram caption: "Your morning routine just got an upgrade" with 12 hashtags.', message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-analytics", message_text: "Weekly performance report: Instagram reach up 23%, engagement rate 4.8%, top post: Collagen Peptides reel (45K views).", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-management", message_text: "Daily summary: 18 new orders ($2,147), 3 returns pending, inventory alert on Vitamin D3+K2 (low stock).", message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-legal", message_text: 'FDA compliance check: Sleep Formula label - "clinically proven" should be changed to "clinically studied".', message_type: "text", processed: true },
    { source_channel: "internal", sender_name: "as-engagement", message_text: "Replied to 15 Instagram comments. Flagged 2 negative mentions for review. Generated 3 DM templates.", message_type: "text", processed: true },
  ];

  const { data: msgData, error: msgError } = await supabase.from("as_message_log").insert(messages).select("id");
  if (msgError) console.error("  ERROR:", msgError.message);
  else console.log(`  OK: ${msgData.length} messages`);

  console.log("\nSeed complete!");
}

seed().catch(console.error);
