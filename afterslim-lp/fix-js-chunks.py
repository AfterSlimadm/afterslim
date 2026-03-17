import os, glob

# Text replacements to apply across JS chunks
replacements = [
    # Hero
    ('A healthy gut can', 'Emagre\\xe7a de forma'),
    ('change your life.', 'natural e saud\\xe1vel.'),
    ('Our capsule-in-capsule', 'F\\xf3rmula premium de Berberina HCl 1200mg que acelera seu metabolismo, controla o apetite e reduz medidas de forma natural e comprovada.*'),
    # Remove old hero desc to avoid duplication
    ('technology delivers the right probiotic strains to the right places to ease bloating, gas, and irregularity.*', ''),

    # Hero CTAs
    ('Shop DS-01', 'Comprar Agora'),
    ('Take the Quiz', 'Saiba Mais'),

    # Carousel
    ('Whole body health starts in the gut.', 'Escolha o plano ideal para voc\\xea.'),
    ('Formulations that provide sustained support using key scientifically and clinically-studied ingredients', 'Quanto mais potes, maior o desconto. Resultados reais em 30, 60 ou 90 dias.'),
    ('Shop all', 'Ver Todos'),

    # Product names
    ('Daily Synbiotic', 'Berberina 1200mg'),
    ('Daily Multivitamin', 'Berberina 1200mg'),
    ('Energy + Focus', 'Berberina 1200mg'),
    ('Sleep + Restore', '3 Potes + Brinde'),
    ('DS\\u201301', 'AS\\u201301'),
    ('DM\\u201302', '2 Potes'),
    ('AM\\u201302', '3 Potes'),
    ('PM\\u201302', 'Kit Completo'),

    # Badges
    ('Bestseller', 'Mais Vendido'),

    # Prices
    ('Starting at $49.99 per month', 'Por apenas R$197'),
    ('Starting at $39.99 per month', 'R$167 cada | Economize 15%'),
    ('Starting at $34.99 per month', 'R$137 cada | Melhor Oferta'),

    # Shop Now
    ('Shop Now', 'Comprar'),

    # Bundle
    ('Bundle + Save 25%', 'Combo + Economize 25%'),
    ('Daily essentials for nutrition and digestive health.', 'O essencial para emagrecer com sa\\xfade.'),
    ('Our clinically-studied daily synbiotic paired with our daily multivitamin reduces bloating, promotes healthy regularity and helps cover nutrient gaps.', 'Nosso combo mais vendido. Berberina 1200mg em dose cl\\xednica para acelerar metabolismo, reduzir gordura abdominal e controlar o apetite de forma natural.'),
    ('Shop Daily Essentials Duo', 'Ver Combo'),
    ('Daily Essentials Duo', 'Combo AfterSlim'),

    # ViaCap
    ("Most probiotics don't survive digestion", 'A maioria dos suplementos perde efic\\xe1cia na digest\\xe3o'),
    ('DS-01\\xae does.', 'AfterSlim n\\xe3o.'),
    ('DS-01\\u00ae does.', 'AfterSlim n\\xe3o.'),
    ("don\\u2019t survive digestion\\u2014DS-01\\u00ae does", 'perde efic\\xe1cia na digest\\xe3o. AfterSlim n\\xe3o'),
    ('Increases healthy bacteria', 'Acelera o metabolismo'),
    ('Lactobacillus spp.', 'Berberina HCl clinicamente testada'),
    ('OUTER CAPSULE', 'CAMADA EXTERNA'),
    ('INNER CAPSULE', 'CAMADA INTERNA'),
    ('Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics to stimulate the growth of beneficial bacteria.', 'Protege a Berberina do \\xe1cido estomacal, garantindo que chegue intacta ao intestino onde \\xe9 absorvida com m\\xe1xima efici\\xeancia.'),
    ("Delivers 24 live strains of probiotics to the colon, where they're needed most.", 'Libera 1200mg de Berberina HCl pura diretamente onde seu corpo mais precisa para acelerar resultados.'),
    ("Delivers 24 live strains of probiotics to the colon, where they\\u2019re needed most.", 'Libera 1200mg de Berberina HCl pura diretamente onde seu corpo mais precisa para acelerar resultados.'),

    # Microbiome section
    ('You are more than human.', 'Seu corpo merece mais.'),
    ("Your body isn't yours alone", 'Seu metabolismo funciona 24h por dia'),
    ("Your body isn\\u2019t yours alone\\u2014it\\u2019s home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health\\u2014and how to maximize both.", 'Seu metabolismo funciona 24h por dia. Com a Berberina 1200mg, voc\\xea d\\xe1 ao seu corpo o suporte que ele precisa para queimar gordura, regular o a\\xe7\\xfacar e manter a energia o dia todo.'),
    ('Discover ', 'Descobrir '),
    ('SCIENCE /', 'CI\\xcaNCIA /'),
    ('Microbiome 101', 'Como Funciona'),

    # Reviews
    ('Over 1 million health transformations (and counting).', 'Milhares de vidas transformadas (e contando).'),
    ('See how real people are changing their health with Seed.', 'Veja como pessoas reais est\\xe3o mudando de vida com AfterSlim.'),
    ('Stories from scientists, innovators, and members like you.', 'Hist\\xf3rias de clientes reais como voc\\xea.'),

    # SeedLabs
    ('Lipari, Panarea', 'S\\xe3o Paulo'),
    ('Italy', 'Brasil'),
    ('Because health is not just human.', 'Porque sa\\xfade \\xe9 mais do que apar\\xeancia.'),
    ('Read More', 'Saiba Mais'),

    # Final CTA
    ('Change your gut health for good.*', 'Transforme seu corpo de verdade.*'),
    ('Feel lasting relief in with DS-01', 'Sinta a diferen\\xe7a com AfterSlim Berberina'),

    # Footer
    ('Pioneering', 'Pioneiros em'),
    ('microbiome science [R+D]', 'suplementa\\xe7\\xe3o premium [P+D]'),
    ('for human and planetary health', 'para sua sa\\xfade e bem-estar'),
    ('since 2015.', 'desde 2024.'),
    ('Science with Seed', 'Novidades AfterSlim direto no seu email'),
    ('nerdy reads for your inbox.', ''),
    ('By signing up you consent to receive Seed emails.', 'Ao se cadastrar voc\\xea aceita receber emails da AfterSlim.'),
    ('Sign up for our Newsletter', 'Seu melhor email'),

    # Navbar
    ('"Shop"', '"Loja"'),
    ('"Science"', '"Ci\\xeancia"'),
    ('"Learn"', '"Aprenda"'),
    ('"Sign in"', '"Entrar"'),
    ('Get Started', 'Comece Agora'),

    # Footer nav
    ('"Products"', '"Produtos"'),
    ('"About"', '"Sobre"'),
    ('"Inquire"', '"Contato"'),
    ('"Sustainability"', '"Sustentabilidade"'),
    ('"Partner"', '"Parceiros"'),
    ('"Practitioners"', '"Profissionais"'),
    ('"Terms + Conditions"', '"Termos e Condi\\xe7\\xf5es"'),
    ('"Privacy Policy"', '"Pol\\xedtica de Privacidade"'),
    ('"Accessibility"', '"Acessibilidade"'),
    ('"Consent Preferences"', '"Prefer\\xeancias de Cookies"'),
    ('"My Account"', '"Minha Conta"'),
    ('"International"', '"Internacional"'),

    # FDA -> ANVISA
    ('These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.', 'Estas declara\\xe7\\xf5es n\\xe3o foram avaliadas pela ANVISA. Este produto n\\xe3o se destina a diagnosticar, tratar, curar ou prevenir doen\\xe7as.'),

    # Copyright
    ('Seed (Seed Health, Inc.)', 'AfterSlim'),
    ('Seed Health, Inc.', 'AfterSlim'),
]

# Files to process
js_dir = '_next/static/chunks'
data_dir = '_next/data/KEp7Xi8lR63js6u0Pu_qS'

files = glob.glob(f'{js_dir}/**/*.js', recursive=True) + glob.glob(f'{data_dir}/*.json')

total_count = 0
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    file_count = 0
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            file_count += 1

    if file_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{filepath}: {file_count} replacements')
        total_count += file_count

print(f'\nTotal: {total_count} replacements across all JS chunks')
