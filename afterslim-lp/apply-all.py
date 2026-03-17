import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ============================================================
# 1. ADD CSP META TAG (block external connections, fail fast)
# ============================================================
csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob: data:; connect-src \'self\' blob: data:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob:; img-src \'self\' data: blob:; media-src \'self\' blob: data:; font-src \'self\' data:; style-src \'self\' \'unsafe-inline\';"/>'
html = html.replace('<head><meta charSet="utf-8"', f'<head>{csp}<meta charSet="utf-8"')

# Remove preconnect to external services
html = html.replace('<link rel="preconnect" href="https://api.segment.io"/><link rel="preconnect" href="https://cdn.segment.com"/>', '')

# Fix font paths (absolute -> relative)
html = html.replace('href="/fonts/SeedSans', 'href="fonts/SeedSans')

# ============================================================
# 2. ADD LOCAL-INTERCEPTOR SCRIPT (before Next.js loads)
# ============================================================
interceptor = '''<script id="local-interceptor">
(function(){
  // Force body visible
  setTimeout(function(){document.body.style.opacity='1';document.body.style.visibility='visible';},100);

  // Intercept fetch - block analytics, redirect seed.com
  var oFetch=window.fetch;
  window.fetch=function(url,opts){
    if(typeof url==='string'){
      if(url.startsWith('https://seed.com/'))url=url.replace('https://seed.com/','/');
      if(url.includes('segment.')||url.includes('optimizely.')||url.includes('sentry.')||url.includes('cookielaw.')||url.includes('google-analytics.')||url.includes('gtag'))
        return Promise.resolve(new Response('{}',{status:200,headers:{'Content-Type':'application/json'}}));
    }
    return oFetch.apply(this,arguments);
  };

  // Intercept XHR
  var oOpen=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,url){
    if(typeof url==='string'){
      if(url.startsWith('https://seed.com/'))url=url.replace('https://seed.com/','/');
      if(url.includes('segment.')||url.includes('optimizely.')||url.includes('sentry.')||url.includes('cookielaw.')||url.includes('ingest.sentry.io'))url='about:blank';
    }
    return oOpen.apply(this,[m,url].concat(Array.prototype.slice.call(arguments,2)));
  };

  // Suppress hydration + network errors
  window.addEventListener('error',function(e){
    if(e.message&&(e.message.includes('hydrat')||e.message.includes('Minified React error'))){e.preventDefault();document.body.style.opacity='1';}
  });
  window.addEventListener('unhandledrejection',function(e){
    if(e.reason&&e.reason.message&&(e.reason.message.includes('fetch')||e.reason.message.includes('network')))e.preventDefault();
  });

  // Stub OneTrust
  window.OneTrust={Init:function(){},LoadBanner:function(){},InsertHtml:function(){},getGeolocationData:function(){return{country:'US',state:'CA'};},InsertScript:function(){},IsAlertBoxClosedAndValid:function(){return true;}};
  window.OptanonWrapper=function(){};
  window.OptanonActiveGroups=',C0001,C0002,C0003,C0004,';

  // Stub Segment
  window.analytics={track:function(){},identify:function(){},page:function(){},group:function(){},alias:function(){},ready:function(){},reset:function(){},user:function(){return{};},on:function(){},off:function(){},load:function(){},_writeKey:'',SNIPPET_VERSION:'4.13.2'};
})();
</script>'''

# Insert after the CSS links, before Next.js scripts
html = html.replace('<noscript data-n-css=""></noscript>', f'<noscript data-n-css=""></noscript>{interceptor}')

# ============================================================
# 3. CSS OVERRIDES (colors Cognac/Gold Amber + Satoshi font)
# ============================================================
css_overrides = '''<style id="local-overrides">
  body { opacity: 1 !important; visibility: visible !important; }
  #onetrust-consent-sdk, .onetrust-pc-dark-filter, #onetrust-banner-sdk { display: none !important; }
  .optanon-alert-box-wrapper { display: none !important; }
  .sc-e74ce85f-9 { opacity: 1 !important; transition: opacity 0.4s ease !important; }
  .sc-e74ce85f-1 { transform: none !important; }
  .sc-e74ce85f-7 { opacity: 1 !important; transform: none !important; }
  .sc-e74ce85f-13 { transform: none !important; }

  @font-face {
    font-family: 'Satoshi';
    src: url('fonts/Satoshi-Variable.woff2') format('woff2');
    font-weight: 100 900; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Satoshi';
    src: url('fonts/Satoshi-VariableItalic.woff2') format('woff2');
    font-weight: 100 900; font-style: italic; font-display: swap;
  }

  :root {
    --color--seedgreen: #B8722D !important;
    --color--seedgreen-active: #8A5520 !important;
    --color--seedgreen-hover: #C17F2E !important;
    --color--seedgreen-card: #C9883A !important;
    --color--seedgreen-pressed: #8A5520 !important;
    --color--seedgreen-faded: rgba(184,114,45,0.5) !important;
    --color--snowwhite: #FAF8F3 !important;
    --color--snowwhite-active: #F0EDE5 !important;
    --color--snowwhite-hover: #F5F2EB !important;
    --color--dmprimary: #C9883A !important;
    --color--dmprimary-dark: #8A5520 !important;
    --color--dmprimary-light: #F5EDE0 !important;
    --color--dmprimary-medium: #D4A05C !important;
    --color--dmprimary-highlight: #FFD699 !important;
    --color--amprimary: #C17F2E !important;
    --color--amprimary-dark: #8A5520 !important;
    --color--amprimary-light: #FFF3E0 !important;
    --color--amprimary-medium: #D4A05C !important;
    --color--amprimary-highlight: #FFD699 !important;
    --color--pmprimary: #B8722D !important;
    --color--pmprimary-dark: #8A5520 !important;
    --color--pmprimary-light: #F5EDE0 !important;
    --color--pmprimary-medium: #C9883A !important;
    --color--pmprimary-highlight: #E8C496 !important;
    --color-primary-seed-green: #B8722D !important;
    --color-primary-seed-green-t10: rgba(184,114,45,0.1) !important;
    --color-primary-seed-green-t15: rgba(184,114,45,0.15) !important;
    --color-primary-seed-green-t20: rgba(184,114,45,0.2) !important;
    --color-primary-seed-green-t5: rgba(184,114,45,0.05) !important;
    --color-primary-seed-green-t50: rgba(184,114,45,0.5) !important;
    --color-primary-seed-green-t70: rgba(184,114,45,0.7) !important;
    --color-primary-soft-green: #C17F2E !important;
    --color-primary-snow-white: #FAF8F3 !important;
    --color-primary-snow-white-t10: rgba(250,248,243,0.1) !important;
    --color-primary-snow-white-t20: rgba(250,248,243,0.2) !important;
    --color-primary-snow-white-t50: rgba(250,248,243,0.5) !important;
    --color-primary-snow-white-t70: rgba(250,248,243,0.7) !important;
    --color-neutral-foam-white: #F5EDE0 !important;
    --color-neutral-yellowish-white: #FFF8EE !important;
    --color-neutral-faded-green-20: #E8D5C0 !important;
    --color-neutral-faded-green-40: #C9A882 !important;
    --color-neutral-faded-green-60: #A07A50 !important;
    --color-neutral-frosted-glass-t35: rgba(140,100,60,0.35) !important;
    --color-neutral-frosted-glass-t8: rgba(140,100,60,0.08) !important;
    --extended-palette-duck-green: #C17F2E !important;
    --extended-palette-emerald-green: #D4A05C !important;
    --extended-palette-grass-green: #B8955A !important;
    --extended-palette-olive-green: #8A6B3D !important;
    --extended-palette-pistachio-green: #C9A040 !important;
    --extended-palette-verdigris-green: #D4A868 !important;
    --products-am-02-dark: #8A5520 !important;
    --products-am-02-highlight: #FFD699 !important;
    --products-am-02-light: #FFF3E0 !important;
    --products-am-02-primary: #C17F2E !important;
    --products-am-02-secondary: #E8C496 !important;
    --products-dm-02-dark: #8A5520 !important;
    --products-dm-02-highlight: #FFD699 !important;
    --products-dm-02-light: #F5EDE0 !important;
    --products-dm-02-primary: #C9883A !important;
    --products-dm-02-secondary: #D4A05C !important;
    --products-pm-02-dark: #8A5520 !important;
    --products-pm-02-highlight: #E8C496 !important;
    --products-pm-02-light: #F5EDE0 !important;
    --products-pm-02-primary: #B8722D !important;
    --products-pm-02-secondary: #C9883A !important;
    --container-seed-green: #B8722D !important;
    --container-soft-green: #C17F2E !important;
    --container-snow-white: #FAF8F3 !important;
    --container-foam-white: #F5EDE0 !important;
    --container-yellowish-white: #FFF8EE !important;
    --actions-primary: #B8722D !important;
    --actions-inverse: #FAF8F3 !important;
    --text-primary: #B8722D !important;
    --text-secondary: rgba(184,114,45,0.7) !important;
    --text-disabled: rgba(184,114,45,0.5) !important;
    --text-inverse-primary: #FAF8F3 !important;
    --text-inverse-secondary: rgba(250,248,243,0.7) !important;
    --outline-primary: #B8722D !important;
    --outline-neutral: #E8D5C0 !important;
    --outline-neutral-light: rgba(184,114,45,0.1) !important;
    --color-bg: #FAF8F3 !important;
    --color-text: #B8722D !important;
    --ff: 'Satoshi', system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    --ff-sans: 'Satoshi', system-ui, sans-serif !important;
    --ff-sans-medium: 'Satoshi', system-ui, sans-serif !important;
    --ff-sans-mono: 'Satoshi', monospace !important;
    --typography-font-brand: Satoshi !important;
    --typography-font-brand-mono: Satoshi !important;
    --flag-font-family: 'Satoshi', Helvetica, sans-serif !important;
  }

  rect[fill="#36542D"] { fill: #B8722D !important; }
  .ktsopc, .ktsopc:hover, .ktsopc:focus { color: #B8722D !important; }
  html:not(.with-little-scrolled) .btTDJG.theme-green { color: #B8722D !important; }
</style>'''

# Insert before </head>
html = html.replace('<link rel="stylesheet" href="styled-components.css"/>', f'<link rel="stylesheet" href="styled-components.css"/>{css_overrides}')

# If styled-components.css link doesn't exist, add before </head>
if 'local-overrides' not in html:
    html = html.replace('</head>', f'{css_overrides}</head>')

# ============================================================
# 4. TEXT REPLACEMENTS (Portuguese BR)
# ============================================================
text_replacements = [
    ('Seed \u2022 Whole Body Health Starts in the Gut', 'AfterSlim \u2022 Berberina Premium 1200mg'),
    ('Is DS-01\u00ae Daily Synbiotic Right For You? \u279e', 'Descubra como a Berberina pode transformar sua saude \u279e'),
    ('class="sc-3fd0a620-0 bVnlWg">DS\u201301\u00ae</span><span class="sc-ff9056db-0 gwUyoS">Daily Synbiotic</span>',
     'class="sc-3fd0a620-0 bVnlWg">AS\u201301\u00ae</span><span class="sc-ff9056db-0 gwUyoS">Berberina 1200mg</span>'),
    ('A healthy gut can<br/>change your life.<br/>', 'Emagre\u00e7a de forma<br/>natural e saud\u00e1vel.<br/>'),
    ('Our capsule-in-capsule\ufe0f technology delivers the right probiotic strains to the right places to ease bloating, gas, and irregularity.*',
     'F\u00f3rmula premium de Berberina HCl 1200mg que acelera seu metabolismo, controla o apetite e reduz medidas de forma natural e comprovada.*'),
    ('>Shop DS-01<sup paddingRight="0.1rem" class="sc-9317bf53-0 cBTRmd">\u00ae</sup>',
     '>Comprar Agora<sup paddingRight="0.1rem" class="sc-9317bf53-0 cBTRmd"></sup>'),
    ('>Take the Quiz<svg', '>Saiba Mais<svg'),
    ('Whole body health starts in the gut.', 'Escolha o plano ideal para voc\u00ea.'),
    ('Formulations that provide sustained support using key scientifically and clinically-studied ingredients',
     'Quanto mais potes, maior o desconto. Resultados reais em 30, 60 ou 90 dias.'),
    ('>Shop all<svg', '>Ver Todos<svg'),
    ('class="sc-3fd0a620-0 lpuDMx">DS\u201301<sup', 'class="sc-3fd0a620-0 lpuDMx">1 Pote<sup'),
    ('>Bestseller<', '>Mais Vendido<'),
    ('Starting at $49.99 per month', 'Por apenas R$197'),
    ('class="sc-3fd0a620-0 lpuDMx">DM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">2 Potes<sup'),
    ('Starting at $39.99 per month', 'R$167 cada | Economize 15%'),
    ('class="sc-3fd0a620-0 lpuDMx">AM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">3 Potes<sup'),
    ('class="sc-3fd0a620-0 lpuDMx">PM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">Kit Completo<sup'),
    ('>Daily Synbiotic</p>', '>Berberina 1200mg</p>'),
    ('>Daily Multivitamin</p>', '>Berberina 1200mg</p>'),
    ('>Energy + Focus</p>', '>Berberina 1200mg</p>'),
    ('>Sleep + Restore</p>', '>3 Potes + Brinde</p>'),
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 iGBdRP bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 iGBdRP bMONEt">Economize<'),
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 hNJQHC bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 hNJQHC bMONEt">Melhor Oferta<'),
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 iepVBv bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 iepVBv bMONEt">Exclusivo<'),
    ('>Shop Now<', '>Comprar<'),
    ('Bundle + Save 25%', 'Combo + Economize 25%'),
    ('Daily essentials for nutrition and digestive health.', 'O essencial para emagrecer com sa\u00fade.'),
    ('Our clinically-studied daily synbiotic paired with our daily multivitamin reduces bloating, promotes healthy regularity and helps cover nutrient gaps.',
     'Nosso combo mais vendido. Berberina 1200mg em dose cl\u00ednica para acelerar metabolismo, reduzir gordura abdominal e controlar o apetite de forma natural.'),
    ('>Shop Daily Essentials Duo<', '>Ver Combo<'),
    ('A jar of DS-10 and a jar of DM-02', 'Potes de AfterSlim Berberina'),
    ('Taking pill out of DM-02 jar', 'C\u00e1psulas de Berberina'),
    ('Unboxing products', 'Unboxing AfterSlim'),
    ("Most probiotics don&#x27;t survive digestion\u2014DS-01\u00ae does.",
     "A maioria dos suplementos perde efic\u00e1cia na digest\u00e3o. AfterSlim n\u00e3o."),
    ('Increases healthy bacteria\u00b0', 'Acelera o metabolismo\u00b0'),
    ('\u00b0Lactobacillus spp.', '\u00b0Berberina HCl clinicamente testada'),
    ('OUTER CAPSULE', 'CAMADA EXTERNA'),
    ('Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics to stimulate the growth of beneficial bacteria.',
     'Protege a Berberina do \u00e1cido estomacal, garantindo que chegue intacta ao intestino onde \u00e9 absorvida com m\u00e1xima efici\u00eancia.'),
    ('INNER CAPSULE', 'CAMADA INTERNA'),
    ("Delivers 24 live strains of probiotics to the colon, where they&#x27;re needed most.",
     'Libera 1200mg de Berberina HCl pura diretamente onde seu corpo mais precisa para acelerar resultados.'),
    ('DS-01 3D 360\u00b0 Product Catalog Capsule', 'AfterSlim Capsula 3D'),
    ('You are more than human.', 'Seu corpo merece mais.'),
    ("Your body isn\u2019t yours alone\u2014it\u2019s home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health\u2014and how to maximize both.",
     "Seu metabolismo funciona 24h por dia. Com a Berberina 1200mg, voc\u00ea d\u00e1 ao seu corpo o suporte que ele precisa para queimar gordura, regular o a\u00e7\u00facar e manter a energia o dia todo."),
    ('>Discover <svg', '>Descobrir <svg'),
    ('SCIENCE /', 'CI\u00caNCIA /'),
    ('Microbiome 101', 'Como Funciona'),
    ('Over 1 million health transformations (and counting).', 'Milhares de vidas transformadas (e contando).'),
    ('See how real people are changing their health with Seed.', 'Veja como pessoas reais est\u00e3o mudando de vida com AfterSlim.'),
    ('Stories from scientists, innovators, and members like you.', 'Hist\u00f3rias de clientes reais como voc\u00ea.'),
    ('\u25cf Lipari, Panarea \u2014 Italy', '\u25cf S\u00e3o Paulo, Brasil'),
    ('Because health is not just human.', 'Porque sa\u00fade \u00e9 mais do que apar\u00eancia.'),
    ('>Read More<', '>Saiba Mais<'),
    ('Change your gut health for good.*', 'Transforme seu corpo de verdade.*'),
    ('Feel lasting relief in with DS-01\u00ae*', 'Sinta a diferen\u00e7a com AfterSlim Berberina*'),
    ('Pioneering', 'Pioneiros em'),
    ('microbiome science [R+D]', 'suplementa\u00e7\u00e3o premium [P+D]'),
    ('for human and planetary health', 'para sua sa\u00fade e bem-estar'),
    ('since 2015.', 'desde 2024.'),
    ('Science with Seed\u2014nerdy reads for your inbox.', 'Novidades AfterSlim direto no seu email.'),
    ('By signing up you consent to receive Seed emails.', 'Ao se cadastrar voc\u00ea aceita receber emails da AfterSlim.'),
    ('Sign up for our Newsletter', 'Seu melhor email'),
    ('>Products<', '>Produtos<'),
    ('>About<', '>Sobre<'),
    ('>Inquire<', '>Contato<'),
    ('>Shop All<', '>Ver Todos<'),
    ('>Sustainability<', '>Sustentabilidade<'),
    ('>Partner<', '>Parceiros<'),
    ('>Practitioners<', '>Profissionais<'),
    ('>Terms + Conditions<', '>Termos e Condi\u00e7\u00f5es<'),
    ('>Privacy Policy<', '>Pol\u00edtica de Privacidade<'),
    ('>Accessibility<', '>Acessibilidade<'),
    ('>Consent Preferences<', '>Prefer\u00eancias de Cookies<'),
    ('>Refer<', '>Indique<'),
    ('>My Account<', '>Minha Conta<'),
    ('>International<', '>Internacional<'),
    ('*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.',
     '*Estas declara\u00e7\u00f5es n\u00e3o foram avaliadas pela ANVISA. Este produto n\u00e3o se destina a diagnosticar, tratar, curar ou prevenir doen\u00e7as.'),
    ('>Shop</button>', '>Loja</button>'),
    ('>Science</button>', '>Ci\u00eancia</button>'),
    ('>Learn</button>', '>Aprenda</button>'),
    ('>Sign in</button>', '>Entrar</button>'),
    ('>Get Started<', '>Comece Agora<'),
    ('>[logo]<', '>[AfterSlim]<'),
    ('>Home</span>', '>In\u00edcio</span>'),
    ('ds01 on bathroom sink', 'AfterSlim no banheiro'),
    ('dispensing two seed pills', 'c\u00e1psulas de berberina'),
    ('ds-01 on a counter', 'AfterSlim na bancada'),
    ('woman wearing seed merchandise', 'cliente AfterSlim'),
]

count = 0
for old, new in text_replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1

# Handle remaining prices for cards 3 and 4
html = html.replace('Starting at $34.99 per month', 'R$137 cada | Melhor Oferta', 1)
html = html.replace('Starting at $34.99 per month', 'R$117 cada | Frete Gr\u00e1tis', 1)

# Remaining logo references
html = html.replace('[logo]', '[AfterSlim]')

# Fix copyright
html = html.replace('\u00a9 2026 Seed (Seed Health, Inc.)', '\u00a9 2026 AfterSlim')
# Also try with HTML entities
html = html.replace('© 2026 Seed (Seed Health, Inc.)', '© 2026 AfterSlim')

# ============================================================
# 5. POST-HYDRATION TEXT SCRIPT (lightweight, setTimeout only)
# ============================================================
post_hydration = '''<script id="afterslim-hydration-fix">
// Lightweight post-hydration fix - re-apply text after React renders
// Uses simple setTimeout, NO MutationObserver
(function(){
  var R=[
    ['.bVnlWg','AS\\u201301\\u00ae'],
    ['.gwUyoS','Berberina 1200mg'],
    ['.iWtWuW','Emagre\\u00e7a de forma<br/>natural e saud\\u00e1vel.<br/>',1],
    ['.gklpgC','F\\u00f3rmula premium de Berberina HCl 1200mg que acelera seu metabolismo, controla o apetite e reduz medidas de forma natural e comprovada.*'],
  ];
  function fix(){
    document.title='AfterSlim \\u2022 Berberina Premium 1200mg';
    R.forEach(function(r){
      var el=document.querySelector(r[0]);
      if(el){if(r[2])el.innerHTML=r[1];else el.textContent=r[1];}
    });
    // Logo
    var logo=document.querySelector('.seed-logo');
    if(logo){var n=logo.childNodes;for(var i=0;i<n.length;i++){if(n[i].nodeType===3&&n[i].textContent.trim()==='[logo]')n[i].textContent='[AfterSlim]';}}
    document.body.style.opacity='1';document.body.style.visibility='visible';
  }
  // Run at 500ms, 1.5s, 3s - enough to catch React hydration
  [500,1500,3000].forEach(function(t){setTimeout(fix,t);});
})();
</script>'''

# Insert before </body>
html = html.replace('</body>', f'{post_hydration}</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'\nDone! {count} text replacements applied.')
print('CSP, interceptor, CSS overrides, and post-hydration script added.')
