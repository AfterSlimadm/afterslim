"""
AfterSlim LP Builder - English version
Applies: CSP, interceptor, CSS overrides, English copy (Seed→AfterSlim, probiotics→berberine)
3 offers: 1 bottle, 2 bottles, 3 bottles
"""
import re, glob

# ============================================================
# 1. HTML TEXT REPLACEMENTS (English → English rebrand)
# ============================================================
html_replacements = [
    # Hero
    ('A healthy gut can', 'A healthy metabolism can'),
    ('change your life.', 'change your body.'),
    ('Our capsule-in-capsule technology delivers the right probiotic strains to the right places to ease bloating, gas, and irregularity.*',
     'Premium Berberine HCl 1200mg formula that boosts your metabolism, controls appetite, and reduces body fat naturally and effectively.*'),

    # Hero CTAs
    ('Shop DS-01', 'Shop Now'),
    ('Take the Quiz', 'Learn More'),

    # Carousel
    ('Whole body health starts in the gut.', 'Choose the right plan for you.'),
    ('Formulations that provide sustained support using key scientifically and clinically-studied ingredients',
     'The more you buy, the more you save. Real results in 30, 60, or 90 days.'),

    # Product names (4 Seed → 3 AfterSlim bottles)
    ('Daily Synbiotic', 'Berberine 1200mg'),
    ('Daily Multivitamin', 'Berberine 1200mg'),
    ('Energy + Focus', 'Berberine 1200mg'),
    ('Sleep + Restore', 'Berberine 1200mg'),

    # Product codes
    ('DS\u201301', 'AS\u201301'),
    ('DM\u201302', '2 Bottles'),
    ('AM\u201302', '3 Bottles'),
    ('PM\u201302', '3 Bottles'),

    # Prices
    ('Starting at $49.99 per month', 'Starting at $59.99'),
    ('Starting at $39.99 per month', '$49.99 each | Save 15%'),
    ('Starting at $34.99 per month', '$39.99 each | Best Value'),

    # Bundle
    ('Bundle + Save 25%', 'Bundle + Save 25%'),
    ('Daily essentials for nutrition and digestive health.', 'Everything you need to transform your metabolism.'),
    ('Our clinically-studied daily synbiotic paired with our daily multivitamin reduces bloating, promotes healthy regularity and helps cover nutrient gaps.',
     'Our best-selling combo. Clinical-dose Berberine HCl 1200mg to boost metabolism, reduce belly fat, and naturally control appetite.'),
    ('Shop Daily Essentials Duo', 'Shop Bundle'),
    ('Daily Essentials Duo', 'AfterSlim Bundle'),

    # ViaCap section
    ("Most probiotics don't survive digestion", 'Most supplements lose potency during digestion'),
    ('DS-01\u00ae does.', 'AfterSlim\u00ae doesn\u2019t.'),
    ('Increases healthy bacteria', 'Boosts metabolism'),
    ('Lactobacillus spp.', 'Clinically-tested Berberine HCl'),
    ('Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics to stimulate the growth of beneficial bacteria.',
     'Shields Berberine from stomach acid, ensuring it reaches the intestine intact for maximum absorption and effectiveness.'),
    ("Delivers 24 live strains of probiotics to the colon, where they're needed most.",
     'Delivers 1200mg of pure Berberine HCl directly where your body needs it most for faster results.'),

    # Microbiome section → Metabolism section
    ('You are more than human.', 'Your body deserves more.'),
    ("Your body isn't yours alone\u2014it's home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health\u2014and how to maximize both.",
     'Your metabolism works 24/7. With Berberine 1200mg, you give your body the support it needs to burn fat, regulate blood sugar, and maintain energy all day long.'),
    ('SCIENCE /', 'SCIENCE /'),
    ('Microbiome 101', 'How It Works'),

    # Reviews
    ('Over 1 million health transformations (and counting).', 'Thousands of lives transformed (and counting).'),
    ('See how real people are changing their health with Seed.', 'See how real people are transforming their bodies with AfterSlim.'),
    ('Stories from scientists, innovators, and members like you.', 'Stories from real customers like you.'),

    # SeedLabs
    ('Lipari, Panarea', 'New York'),
    ('Italy', 'USA'),
    ('Because health is not just human.', 'Because health is more than appearance.'),

    # Final CTA
    ('Change your gut health for good.*', 'Transform your body for real.*'),
    ('Feel lasting relief in with DS-01', 'Feel the difference with AfterSlim Berberine'),

    # Footer
    ('Pioneering', 'Pioneering'),
    ('microbiome science [R+D]', 'premium supplementation [R+D]'),
    ('for human and planetary health', 'for your health and wellness'),
    ('since 2015.', 'since 2024.'),
    ('Science with Seed', 'AfterSlim news straight to your inbox'),
    ('nerdy reads for your inbox.', ''),
    ('By signing up you consent to receive Seed emails.', 'By signing up you consent to receive AfterSlim emails.'),
    ('Sign up for our Newsletter', 'Enter your email'),

    # Navbar JSON strings
    ('"Shop"', '"Shop"'),
    ('"Science"', '"Science"'),
    ('"Learn"', '"Learn"'),
    ('"Sign in"', '"Sign in"'),

    # Footer nav
    ('"Products"', '"Products"'),
    ('"About"', '"About"'),
    ('"Sustainability"', '"Sustainability"'),
    ('"Partner"', '"Partners"'),
    ('"Practitioners"', '"Practitioners"'),
    ('"Terms + Conditions"', '"Terms + Conditions"'),
    ('"Privacy Policy"', '"Privacy Policy"'),
    ('"Accessibility"', '"Accessibility"'),
    ('"Consent Preferences"', '"Cookie Preferences"'),
    ('"My Account"', '"My Account"'),

    # FDA disclaimer - keep as is (it's correct for supplements)

    # Copyright
    ('Seed (Seed Health, Inc.)', 'AfterSlim'),
    ('Seed Health, Inc.', 'AfterSlim'),

    # Brand references
    ('with Seed.', 'with AfterSlim.'),
    ('with Seed', 'with AfterSlim'),
    ('Seed emails', 'AfterSlim emails'),
]

# ============================================================
# 2. JS CHUNK REPLACEMENTS (English → English rebrand)
# ============================================================
js_replacements = [
    # Hero
    ('A healthy gut can', 'A healthy metabolism can'),
    ('change your life.', 'change your body.'),
    ('Our capsule-in-capsule', 'Premium Berberine HCl 1200mg formula that boosts your metabolism, controls appetite, and reduces body fat naturally and effectively.*'),
    ('technology delivers the right probiotic strains to the right places to ease bloating, gas, and irregularity.*', ''),

    # Hero CTAs
    ('Shop DS-01', 'Shop Now'),
    ('Take the Quiz', 'Learn More'),

    # Carousel
    ('Whole body health starts in the gut.', 'Choose the right plan for you.'),
    ('Formulations that provide sustained support using key scientifically and clinically-studied ingredients',
     'The more you buy, the more you save. Real results in 30, 60, or 90 days.'),
    ('Shop all', 'Shop All'),

    # Product names
    ('Daily Synbiotic', 'Berberine 1200mg'),
    ('Daily Multivitamin', 'Berberine 1200mg'),
    ('Energy + Focus', 'Berberine 1200mg'),
    ('Sleep + Restore', 'Berberine 1200mg'),
    ('DS\\u201301', 'AS\\u201301'),
    ('DM\\u201302', '2 Bottles'),
    ('AM\\u201302', '3 Bottles'),
    ('PM\\u201302', '3 Bottles'),

    # Badges
    ('Bestseller', 'Best Seller'),

    # Prices
    ('Starting at $49.99 per month', 'Starting at $59.99'),
    ('Starting at $39.99 per month', '$49.99 each | Save 15%'),
    ('Starting at $34.99 per month', '$39.99 each | Best Value'),

    # Shop Now - keep
    ('Shop Now', 'Shop Now'),

    # Bundle
    ('Daily essentials for nutrition and digestive health.', 'Everything you need to transform your metabolism.'),
    ('Our clinically-studied daily synbiotic paired with our daily multivitamin reduces bloating, promotes healthy regularity and helps cover nutrient gaps.',
     'Our best-selling combo. Clinical-dose Berberine HCl 1200mg to boost metabolism, reduce belly fat, and naturally control appetite.'),
    ('Shop Daily Essentials Duo', 'Shop Bundle'),
    ('Daily Essentials Duo', 'AfterSlim Bundle'),

    # ViaCap
    ("Most probiotics don't survive digestion", 'Most supplements lose potency during digestion'),
    ('DS-01\\xae does.', "AfterSlim\\xae doesn\\u2019t."),
    ('DS-01\\u00ae does.', "AfterSlim\\u00ae doesn\\u2019t."),
    ("don\\u2019t survive digestion\\u2014DS-01\\u00ae does", "lose potency during digestion. AfterSlim\\u00ae doesn\\u2019t"),
    ('Increases healthy bacteria', 'Boosts metabolism'),
    ('Lactobacillus spp.', 'Clinically-tested Berberine HCl'),
    ('OUTER CAPSULE', 'OUTER LAYER'),
    ('INNER CAPSULE', 'INNER LAYER'),
    ('Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics to stimulate the growth of beneficial bacteria.',
     'Shields Berberine from stomach acid, ensuring it reaches the intestine intact for maximum absorption and effectiveness.'),
    ("Delivers 24 live strains of probiotics to the colon, where they're needed most.",
     'Delivers 1200mg of pure Berberine HCl directly where your body needs it most for faster results.'),
    ("Delivers 24 live strains of probiotics to the colon, where they\\u2019re needed most.",
     'Delivers 1200mg of pure Berberine HCl directly where your body needs it most for faster results.'),

    # Microbiome section
    ('You are more than human.', 'Your body deserves more.'),
    ("Your body isn't yours alone", 'Your metabolism works 24/7'),
    ("Your body isn\\u2019t yours alone\\u2014it\\u2019s home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health\\u2014and how to maximize both.",
     'Your metabolism works 24/7. With Berberine 1200mg, you give your body the support it needs to burn fat, regulate blood sugar, and maintain energy all day long.'),
    ('Microbiome 101', 'How It Works'),

    # Reviews
    ('Over 1 million health transformations (and counting).', 'Thousands of lives transformed (and counting).'),
    ('See how real people are changing their health with Seed.', 'See how real people are transforming their bodies with AfterSlim.'),
    ('Stories from scientists, innovators, and members like you.', 'Stories from real customers like you.'),

    # SeedLabs
    ('Lipari, Panarea', 'New York'),
    ('Italy', 'USA'),
    ('Because health is not just human.', 'Because health is more than appearance.'),

    # Final CTA
    ('Change your gut health for good.*', 'Transform your body for real.*'),
    ('Feel lasting relief in with DS-01', 'Feel the difference with AfterSlim Berberine'),

    # Footer
    ('microbiome science [R+D]', 'premium supplementation [R+D]'),
    ('for human and planetary health', 'for your health and wellness'),
    ('since 2015.', 'since 2024.'),
    ('nerdy reads for your inbox.', ''),
    ('By signing up you consent to receive Seed emails.', 'By signing up you consent to receive AfterSlim emails.'),
    ('Sign up for our Newsletter', 'Enter your email'),

    # Navbar
    ('"Shop"', '"Shop"'),
    ('"Science"', '"Science"'),
    ('"Learn"', '"Learn"'),
    ('"Sign in"', '"Sign in"'),

    # Footer nav
    ('"Products"', '"Products"'),
    ('"About"', '"About"'),
    ('"Consent Preferences"', '"Cookie Preferences"'),

    # FDA -> keep as is
    ('Seed (Seed Health, Inc.)', 'AfterSlim'),
    ('Seed Health, Inc.', 'AfterSlim'),

    # DS-01 references
    ('DS-01', 'AfterSlim'),

    # Vaginal product → remove/rename
    ('Vaginal Synbiotic', '3 Bottles Bundle'),
    ('Vaginal Health', 'Weight Loss'),
    ('VS\\u201301', '3-Pack'),
]

# ============================================================
# 3. CSS OVERRIDES (Cognac + Gold Amber palette)
# ============================================================
CSS_OVERRIDES = '''<style id="local-overrides">
/* === AfterSlim Color Palette === */
/* Cognac #B8722D (text, headings, dark bg) | Gold Amber #C17F2E (buttons, CTAs, badges) */
:root {
  --color--seedgreen: #B8722D !important;
  --color--seedgreen-dark: #9A5F25 !important;
  --color--seedgreen-light: #D4944A !important;
  --color--seedgreen-rgb: 184, 114, 45 !important;
  --color--oatmilk: #FDF6ED !important;
  --color--oatmilk-rgb: 253, 246, 237 !important;
  --color--cream: #F5EDE0 !important;
  --color--cream-rgb: 245, 237, 224 !important;
  --color--matcha: #C17F2E !important;
  --color--matcha-rgb: 193, 127, 46 !important;
  --color--matcha-dark: #A66B22 !important;
  --color--matcha-dark-rgb: 166, 107, 34 !important;
  --color--blueberry: #8B5E3C !important;
  --color--blueberry-rgb: 139, 94, 60 !important;
  --color--charcoal: #3D2B1F !important;
  --color--charcoal-rgb: 61, 43, 31 !important;
  --color--snowwhite: #FCFCF7 !important;
  --bdrs-pill: 999px !important;
}
/* Buttons */
.sc-a5094583-2[color="seedgreen"],
a[color="seedgreen"],
button[color="seedgreen"] {
  background-color: #C17F2E !important;
  color: #FCFCF7 !important;
}
.sc-a5094583-2[color="seedgreen"]:hover,
a[color="seedgreen"]:hover {
  background-color: #A66B22 !important;
}
/* Pill badges */
.sc-3fd0a620-0[color="seedgreen"] {
  color: #B8722D !important;
  border-color: #B8722D !important;
}
/* Green backgrounds → Cognac */
.sc-dd5765e8-0, .sc-91f3b0c8-0 {
  background-color: #B8722D !important;
}
/* Top bar */
.sc-2f4b498e-0 {
  background-color: #3D2B1F !important;
}
/* Product cards hover */
.sc-bf485308-0:hover {
  border-color: #C17F2E !important;
}
/* Footer */
.sc-ba2bdb0f-1 {
  background-color: #B8722D !important;
}
/* Satoshi font */
@font-face {
  font-family: 'Satoshi';
  src: url('fonts/Satoshi-Variable.woff2') format('woff2');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
:root {
  --ff: 'Satoshi', 'Seed Sans', system-ui, sans-serif !important;
}
body, p, span, a, button, input, label, h1, h2, h3, h4, h5, h6, div {
  font-family: var(--ff) !important;
}
</style>'''

# ============================================================
# 4. CSP META TAG
# ============================================================
CSP_META = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob: data:; connect-src \'self\' blob: data: https://*.mux.com https://stream.mux.com; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob: https://www.gstatic.com; img-src \'self\' data: blob: https://res.cloudinary.com https://image.mux.com; media-src \'self\' blob: data: https://res.cloudinary.com https://stream.mux.com https://*.mux.com; font-src \'self\' data:; style-src \'self\' \'unsafe-inline\';">'

# ============================================================
# 5. LOCAL INTERCEPTOR SCRIPT
# ============================================================
INTERCEPTOR = '''<script id="local-interceptor">
// Block external analytics, redirect seed.com URLs, suppress hydration errors
(function(){
  var blocked=['segment.io','sentry.io','onetrust.com','litix.io','google-analytics','googletagmanager','cdn.segment','analytics'];
  var origFetch=window.fetch;
  window.fetch=function(url){
    var u=typeof url==='string'?url:(url&&url.url?url.url:'');
    for(var i=0;i<blocked.length;i++){if(u.indexOf(blocked[i])!==-1)return Promise.resolve(new Response('',{status:200}));}
    if(u.indexOf('seed.com')!==-1&&u.indexOf('localhost')===-1){
      u=u.replace(/https?:\\/\\/[^/]*seed\\.com/,'');
      return origFetch.call(this,u);
    }
    return origFetch.apply(this,arguments);
  };
  var origXHR=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,url){
    var u=typeof url==='string'?url:'';
    for(var i=0;i<blocked.length;i++){if(u.indexOf(blocked[i])!==-1){this._blocked=true;return;}}
    if(u.indexOf('seed.com')!==-1&&u.indexOf('localhost')===-1){
      u=u.replace(/https?:\\/\\/[^/]*seed\\.com/,'');
    }
    return origXHR.call(this,m,u);
  };
  var origSend=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send=function(){if(this._blocked)return;return origSend.apply(this,arguments);};
  // Stub OneTrust + Segment
  window.OneTrust={Init:function(){},ToggleInfoDisplay:function(){},LoadBanner:function(){}};
  window.OnetrustActiveGroups='C0001,C0002,C0003,C0004';
  window.analytics={track:function(){},identify:function(){},page:function(){},ready:function(cb){if(cb)cb();}};
  // Suppress hydration errors
  var origError=console.error;
  console.error=function(){
    var msg=arguments[0];
    if(typeof msg==='string'&&(msg.indexOf('Hydration')!==-1||msg.indexOf('hydrat')!==-1||msg.indexOf('Minified React')!==-1||msg.indexOf('did not match')!==-1)){
      console.warn('[Local Clone] Suppressed hydration error');return;
    }
    return origError.apply(console,arguments);
  };
})();
</script>'''

# ============================================================
# 6. POST-HYDRATION SCRIPT
# ============================================================
HYDRATION_FIX = '''<script id="afterslim-hydration-fix">
(function(){
  var T=[
    ['A healthy gut can','A healthy metabolism can'],['change your life.','change your body.'],
    ['Shop DS-01','Shop Now'],['Shop AfterSlim','Shop Now'],['Take the Quiz','Learn More'],
    ['The probiotic pioneering the future of gut health.','The berberine that is transforming lives.'],
    ['Whole body health starts in the gut.','Choose the right plan for you.'],
    ['Daily Synbiotic','Berberine 1200mg'],['Daily Multivitamin','Berberine 1200mg'],
    ['Energy + Focus','Berberine 1200mg'],['Sleep + Restore','Berberine 1200mg'],
    ['Vaginal Synbiotic','3 Bottles Bundle'],['Vaginal Health','Weight Loss'],
    ['Bestseller','Best Seller'],
    ['Starting at $49.99 per month','Starting at $59.99'],['Starting at $49.99','Starting at $59.99'],
    ['Starting at $39.99 per month','$49.99 each | Save 15%'],['Starting at $39.99','$49.99 each'],
    ['Starting at $34.99 per month','$39.99 each | Best Value'],['Starting at $34.99','$39.99 each'],
    ['Daily essentials for nutrition and digestive health.','Everything you need to transform your metabolism.'],
    ['Shop Daily Essentials Duo','Shop Bundle'],['Daily Essentials Duo','AfterSlim Bundle'],
    ["Most probiotics don\\u2019t survive digestion",'Most supplements lose potency during digestion'],
    ["Most probiotics don't survive digestion",'Most supplements lose potency during digestion'],
    ['DS-01\\u00ae does.','AfterSlim\\u00ae doesn\\u2019t.'],
    ['Increases healthy bacteria','Boosts metabolism'],
    ['Lactobacillus spp.','Clinically-tested Berberine HCl'],
    ['OUTER CAPSULE','OUTER LAYER'],['INNER CAPSULE','INNER LAYER'],
    ['You are more than human.','Your body deserves more.'],
    ["Your body isn\\u2019t yours alone",'Your metabolism works 24/7'],
    ["Your body isn't yours alone",'Your metabolism works 24/7'],
    ['Microbiome 101','How It Works'],
    ['Over 1 million health transformations','Thousands of lives transformed'],
    ['See how real people are changing their health with Seed.','See how real people are transforming their bodies with AfterSlim.'],
    ['Stories from scientists, innovators, and members like you.','Stories from real customers like you.'],
    ['Because health is not just human.','Because health is more than appearance.'],
    ['Change your gut health for good.*','Transform your body for real.*'],
    ['Feel lasting relief','Feel the difference with AfterSlim Berberine'],
    ['microbiome science [R+D]','premium supplementation [R+D]'],
    ['for human and planetary health','for your health and wellness'],['since 2015.','since 2024.'],
    ['By signing up you consent to receive Seed emails.','By signing up you consent to receive AfterSlim emails.'],
    ['Seed Health, Inc.','AfterSlim'],
    ["Seed's ",'AfterSlim\\u2019s '],['with Seed','with AfterSlim'],
    ['DS\\u201301','AS\\u201301'],['DS-01','AfterSlim'],
    ['Lipari, Panarea','New York'],['Italy','USA'],
  ];
  function fix(){
    document.title='AfterSlim \\u2022 Premium Berberine 1200mg';
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(w.nextNode()){
      var n=w.currentNode,txt=n.textContent;
      if(!txt||txt.length<2)continue;
      for(var i=0;i<T.length;i++){
        if(txt.indexOf(T[i][0])!==-1){txt=txt.split(T[i][0]).join(T[i][1]);}
      }
      if(txt!==n.textContent)n.textContent=txt;
    }
    var inp=document.querySelector('input[placeholder="Sign up for our Newsletter"]');
    if(inp)inp.placeholder='Enter your email';
    document.body.style.opacity='1';document.body.style.visibility='visible';
  }
  [500,1500,3000,5000].forEach(function(t){setTimeout(fix,t);});
})();
</script>'''

# ============================================================
# APPLY ALL
# ============================================================
print('=== AfterSlim LP Builder (English) ===')

# Read fresh HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add CSP meta tag
html = html.replace('<meta charSet="utf-8"/>', f'<meta charSet="utf-8"/>\n{CSP_META}')
print('[1] CSP meta tag added')

# 2. Add interceptor after opening <head>
html = html.replace('<head>', f'<head>\n{INTERCEPTOR}')
print('[2] Interceptor script added')

# 3. Remove segment/analytics preconnects
html = re.sub(r'<link rel="preconnect"[^>]*segment[^>]*/>', '', html)
html = re.sub(r'<link rel="preconnect"[^>]*sentry[^>]*/>', '', html)
print('[3] Removed analytics preconnects')

# 4. Fix font paths (absolute → relative)
html = html.replace('href="/fonts/', 'href="fonts/')
html = html.replace('"/fonts/Seed', '"fonts/Seed')
print('[4] Fixed font paths')

# 5. Add CSS overrides before </head>
html = html.replace('</head>', f'{CSS_OVERRIDES}\n</head>')
print('[5] CSS overrides added')

# 6. Apply HTML text replacements
count = 0
for old, new in html_replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1
print(f'[6] {count} HTML text replacements')

# 7. Add post-hydration script before </body>
html = html.replace('</body>', f'{HYDRATION_FIX}\n</body>')
print('[7] Post-hydration script added')

# 8. Write HTML
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('[8] index.html written')

# 9. JS chunk replacements
js_dir = '_next/static/chunks'
data_dir = '_next/data/KEp7Xi8lR63js6u0Pu_qS'
files = glob.glob(f'{js_dir}/**/*.js', recursive=True) + glob.glob(f'{data_dir}/*.json')

total = 0
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    file_count = 0
    for old, new in js_replacements:
        if old in content:
            content = content.replace(old, new)
            file_count += 1
    if file_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  {filepath}: {file_count} replacements')
        total += file_count

print(f'[9] {total} JS chunk replacements')
print('\n=== Done! ===')
