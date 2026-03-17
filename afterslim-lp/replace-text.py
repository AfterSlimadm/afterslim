import re
import sys

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # PAGE TITLE
    ('Seed \u2022 Whole Body Health Starts in the Gut', 'AfterSlim \u2022 Berberina Premium 1200mg'),

    # TOP BAR
    ('Is DS-01\u00ae Daily Synbiotic Right For You? \u279e', 'Descubra como a Berberina pode transformar sua saude \u279e'),

    # HERO - product badge
    ('class="sc-3fd0a620-0 bVnlWg">DS\u201301\u00ae</span><span class="sc-ff9056db-0 gwUyoS">Daily Synbiotic</span>',
     'class="sc-3fd0a620-0 bVnlWg">AS\u201301\u00ae</span><span class="sc-ff9056db-0 gwUyoS">Berberina 1200mg</span>'),

    # HERO headline
    ('A healthy gut can<br/>change your life.<br/>', 'Emagreca de forma<br/>natural e saudavel.<br/>'),

    # HERO description
    ('Our capsule-in-capsule\ufe0f technology delivers the right probiotic strains to the right places to ease bloating, gas, and irregularity.*',
     'Formula premium de Berberina HCl 1200mg que acelera seu metabolismo, controla o apetite e reduz medidas de forma natural e comprovada.*'),

    # HERO CTAs
    ('>Shop DS-01<sup paddingRight="0.1rem" class="sc-9317bf53-0 cBTRmd">\u00ae</sup>',
     '>Comprar Agora<sup paddingRight="0.1rem" class="sc-9317bf53-0 cBTRmd"></sup>'),
    ('>Take the Quiz<svg', '>Saiba Mais<svg'),

    # CAROUSEL
    ('Whole body health starts in the gut.', 'Escolha o plano ideal para voce.'),
    ('Formulations that provide sustained support using key scientifically and clinically-studied ingredients',
     'Quanto mais potes, maior o desconto. Resultados reais em 30, 60 ou 90 dias.'),
    ('>Shop all<svg', '>Ver Todos<svg'),

    # Product Card 1
    ('class="sc-3fd0a620-0 lpuDMx">DS\u201301<sup', 'class="sc-3fd0a620-0 lpuDMx">1 Pote<sup'),
    ('>Bestseller<', '>Mais Vendido<'),
    ('Starting at $49.99 per month', 'Por apenas $59.99'),

    # Product Card 2
    ('class="sc-3fd0a620-0 lpuDMx">DM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">2 Potes<sup'),
    ('Starting at $39.99 per month', '$49.99 cada | Economize 17%'),

    # Product Card 3
    ('class="sc-3fd0a620-0 lpuDMx">AM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">3 Potes<sup'),

    # Product Card 4
    ('class="sc-3fd0a620-0 lpuDMx">PM\u201302<sup', 'class="sc-3fd0a620-0 lpuDMx">Kit Completo<sup'),

    # Product names
    ('>Daily Synbiotic</p>', '>Berberina 1200mg</p>'),
    ('>Daily Multivitamin</p>', '>Berberina 1200mg</p>'),
    ('>Energy + Focus</p>', '>Berberina 1200mg</p>'),
    ('>Sleep + Restore</p>', '>3 Potes + Brinde</p>'),

    # Badges
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 iGBdRP bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 iGBdRP bMONEt">Economize<'),
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 hNJQHC bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 hNJQHC bMONEt">Melhor Oferta<'),
    ('class="sc-60b7c4e8-0 sc-baccdee5-3 iepVBv bMONEt">New<', 'class="sc-60b7c4e8-0 sc-baccdee5-3 iepVBv bMONEt">Exclusivo<'),

    # Shop Now buttons
    ('>Shop Now<', '>Comprar<'),

    # BUNDLE
    ('Bundle + Save 25%', 'Combo + Economize 25%'),
    ('Daily essentials for nutrition and digestive health.', 'O essencial para emagrecer com saude.'),
    ('Our clinically-studied daily synbiotic paired with our daily multivitamin reduces bloating, promotes healthy regularity and helps cover nutrient gaps.',
     'Nosso combo mais vendido. Berberina 1200mg em dose clinica para acelerar metabolismo, reduzir gordura abdominal e controlar o apetite de forma natural.'),
    ('>Shop Daily Essentials Duo<', '>Ver Combo<'),

    # Bundle image alts
    ('A jar of DS-10 and a jar of DM-02', 'Potes de AfterSlim Berberina'),
    ('Taking pill out of DM-02 jar', 'Capsulas de Berberina'),
    ('Unboxing products', 'Unboxing AfterSlim'),

    # VIACAP
    ("Most probiotics don&#x27;t survive digestion\u2014DS-01\u00ae does.",
     "A maioria dos suplementos perde eficacia na digestao. AfterSlim nao."),
    ('Increases healthy bacteria\u00b0', 'Acelera o metabolismo\u00b0'),
    ('\u00b0Lactobacillus spp.', '\u00b0Berberina HCl clinicamente testada'),
    ('OUTER CAPSULE', 'CAMADA EXTERNA'),
    ('Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics to stimulate the growth of beneficial bacteria.',
     'Protege a Berberina do acido estomacal, garantindo que chegue intacta ao intestino onde e absorvida com maxima eficiencia.'),
    ('INNER CAPSULE', 'CAMADA INTERNA'),
    ("Delivers 24 live strains of probiotics to the colon, where they&#x27;re needed most.",
     'Libera 1200mg de Berberina HCl pura diretamente onde seu corpo mais precisa para acelerar resultados.'),
    ('DS-01 3D 360\u00b0 Product Catalog Capsule', 'AfterSlim Capsula 3D'),

    # MICROBIOME SECTION
    ('You are more than human.', 'Seu corpo merece mais.'),
    ("Your body isn\u2019t yours alone\u2014it\u2019s home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health\u2014and how to maximize both.",
     "Seu metabolismo funciona 24h por dia. Com a Berberina 1200mg, voce da ao seu corpo o suporte que ele precisa para queimar gordura, regular o acucar e manter a energia o dia todo."),
    ('>Discover <svg', '>Descobrir <svg'),
    ('SCIENCE /', 'CIENCIA /'),
    ('Microbiome 101', 'Como Funciona'),

    # REVIEWS
    ('Over 1 million health transformations (and counting).', 'Milhares de vidas transformadas (e contando).'),
    ('See how real people are changing their health with Seed.', 'Veja como pessoas reais estao mudando de vida com AfterSlim.'),
    ('Stories from scientists, innovators, and members like you.', 'Historias de clientes reais como voce.'),

    # SEEDLABS
    ('\u25cf Lipari, Panarea \u2014 Italy', '\u25cf Sao Paulo, Brasil'),
    ('Because health is not just human.', 'Porque saude e mais do que aparencia.'),
    ('>Read More<', '>Saiba Mais<'),

    # FINAL CTA
    ('Change your gut health for good.*', 'Transforme seu corpo de verdade.*'),
    ('Feel lasting relief in with DS-01\u00ae*', 'Sinta a diferenca com AfterSlim Berberina*'),

    # FOOTER
    ('Pioneering', 'Pioneiros em'),
    ('microbiome science [R+D]', 'suplementacao premium [P+D]'),
    ('for human and planetary health', 'para sua saude e bem-estar'),
    ('since 2015.', 'desde 2024.'),
    ('Science with Seed\u2014nerdy reads for your inbox.', 'Novidades AfterSlim direto no seu email.'),
    ('By signing up you consent to receive Seed emails.', 'Ao se cadastrar voce aceita receber emails da AfterSlim.'),
    ('Sign up for our Newsletter', 'Seu melhor email'),
    ('\u00a9 2026 Seed (Seed Health, Inc.)', '\u00a9 2026 AfterSlim'),

    # Footer nav
    ('>Products<', '>Produtos<'),
    ('>About<', '>Sobre<'),
    ('>Inquire<', '>Contato<'),
    ('>Shop All<', '>Ver Todos<'),
    ('>Sustainability<', '>Sustentabilidade<'),
    ('>Partner<', '>Parceiros<'),
    ('>Practitioners<', '>Profissionais<'),
    ('>Terms + Conditions<', '>Termos e Condicoes<'),
    ('>Privacy Policy<', '>Politica de Privacidade<'),
    ('>Accessibility<', '>Acessibilidade<'),
    ('>Consent Preferences<', '>Preferencias de Cookies<'),
    ('>Refer<', '>Indique<'),
    ('>My Account<', '>Minha Conta<'),
    ('>International<', '>Internacional<'),

    # FDA → ANVISA
    ('*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.',
     '*Estas declaracoes nao foram avaliadas pela ANVISA. Este produto nao se destina a diagnosticar, tratar, curar ou prevenir doencas.'),

    # NAVBAR
    ('>Shop</button>', '>Loja</button>'),
    ('>Science</button>', '>Ciencia</button>'),
    ('>Learn</button>', '>Aprenda</button>'),
    ('>Sign in</button>', '>Entrar</button>'),
    ('>Get Started<', '>Comece Agora<'),

    # Logo
    ('>[logo]<', '>[AfterSlim]<'),
    ('>Home</span>', '>Inicio</span>'),

    # Image alts
    ('ds01 on bathroom sink', 'AfterSlim no banheiro'),
    ('dispensing two seed pills', 'capsulas de berberina'),
    ('ds-01 on a counter', 'AfterSlim na bancada'),
    ('woman wearing seed merchandise', 'cliente AfterSlim'),
]

count = 0
for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1
    else:
        print(f"WARNING: Not found: {old[:60].encode('ascii', 'replace').decode()}...")

# Handle remaining price for cards 3 and 4
html = html.replace('Starting at $34.99 per month', '$39.99 cada | Melhor Oferta', 1)
html = html.replace('Starting at $34.99 per month', '$119.97 | Frete Gratis', 1)

# Seed logo references that remain
html = html.replace('[logo]', '[AfterSlim]')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\nDone! {count} replacements applied successfully.")
