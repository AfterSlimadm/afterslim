import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the script block via regex
m = re.search(r'<script id="afterslim-hydration-fix">.*?</script>', content, re.DOTALL)
if not m:
    print('ERROR: script block not found')
    exit(1)

print(f'Found script block at position {m.start()}, length {len(m.group(0))}')

new_script = r'''<script id="afterslim-hydration-fix">
(function(){
  var T=[
    ['Shop','Loja'],['Science','Ci\u00eancia'],['Learn','Aprenda'],['Sign in','Entrar'],['Get Started','Comece Agora'],
    ['A healthy gut can','Emagre\u00e7a de forma'],['change your life.','natural e saud\u00e1vel.'],
    ['Shop DS-01','Comprar Agora'],['Take the Quiz','Saiba Mais'],
    ['The probiotic pioneering the future of gut health.','A berberina que est\u00e1 transformando vidas.'],
    ['Whole body health starts in the gut.','Escolha o plano ideal para voc\u00ea.'],
    ['Shop all','Ver Todos'],
    ['Daily Synbiotic','Berberina 1200mg'],['Daily Multivitamin','Berberina 1200mg'],
    ['Energy + Focus','Berberina 1200mg'],['Sleep + Restore','3 Potes + Brinde'],
    ['Vaginal Synbiotic','Kit Completo'],['Vaginal Health','Kit Completo'],
    ['Bestseller','Mais Vendido'],
    ['Starting at $49.99 per month','Por apenas R$197'],['Starting at $49.99','Por apenas R$197'],
    ['Starting at $39.99 per month','R$167 cada | Economize 15%'],['Starting at $39.99','R$167 cada'],
    ['Starting at $34.99 per month','R$137 cada | Melhor Oferta'],['Starting at $34.99','R$137 cada'],
    ['Shop Now','Comprar'],
    ['Bundle + Save 25%','Combo + Economize 25%'],
    ['Daily essentials for nutrition and digestive health.','O essencial para emagrecer com sa\u00fade.'],
    ['Shop Daily Essentials Duo','Ver Combo'],['Daily Essentials Duo','Combo AfterSlim'],
    ["Most probiotics don\u2019t survive digestion",'A maioria dos suplementos perde efic\u00e1cia na digest\u00e3o'],
    ["Most probiotics don't survive digestion",'A maioria dos suplementos perde efic\u00e1cia na digest\u00e3o'],
    ['DS-01\u00ae does.','AfterSlim n\u00e3o.'],
    ['Increases healthy bacteria','Acelera o metabolismo'],
    ['Lactobacillus spp.','Berberina HCl clinicamente testada'],
    ['OUTER CAPSULE','CAMADA EXTERNA'],['INNER CAPSULE','CAMADA INTERNA'],
    ['You are more than human.','Seu corpo merece mais.'],
    ["Your body isn\u2019t yours alone",'Seu metabolismo funciona 24h por dia'],
    ["Your body isn't yours alone",'Seu metabolismo funciona 24h por dia'],
    ['Microbiome 101','Como Funciona'],['SCIENCE /','CI\u00caNCIA /'],
    ['Whole Body Health','Sa\u00fade Completa'],
    ['Over 1 million health transformations','Milhares de vidas transformadas'],
    ['See how real people are changing their health with Seed.','Veja como pessoas reais est\u00e3o mudando de vida com AfterSlim.'],
    ['Stories from scientists, innovators, and members like you.','Hist\u00f3rias de clientes reais como voc\u00ea.'],
    ['Because health is not just human.','Porque sa\u00fade \u00e9 mais do que apar\u00eancia.'],
    ['Read More','Saiba Mais'],
    ['Change your gut health for good.*','Transforme seu corpo de verdade.*'],
    ['Feel lasting relief','Sinta a diferen\u00e7a com AfterSlim Berberina'],
    ['Pioneering','Pioneiros em'],['microbiome science [R+D]','suplementa\u00e7\u00e3o premium [P+D]'],
    ['for human and planetary health','para sua sa\u00fade e bem-estar'],['since 2015.','desde 2024.'],
    ['By signing up you consent to receive Seed emails.','Ao se cadastrar voc\u00ea aceita receber emails da AfterSlim.'],
    ['Products','Produtos'],['About','Sobre'],['Inquire','Contato'],
    ['Sustainability','Sustentabilidade'],['Practitioners','Profissionais'],
    ['Terms + Conditions','Termos e Condi\u00e7\u00f5es'],['Privacy Policy','Pol\u00edtica de Privacidade'],
    ['Accessibility','Acessibilidade'],['Consent Preferences','Prefer\u00eancias de Cookies'],
    ['My Account','Minha Conta'],['International','Internacional'],
    ['Seed Health, Inc.','AfterSlim'],
    ["Seed's ",'AfterSlim '],['with Seed','com AfterSlim'],
    ['Help','Ajuda'],['Contact','Contato'],['Join','Junte-se'],['Press','Imprensa'],
  ];
  function fix(){
    document.title='AfterSlim \u2022 Berberina Premium 1200mg';
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(w.nextNode()){
      var n=w.currentNode,txt=n.textContent;
      if(!txt||txt.length<2)continue;
      for(var i=0;i<T.length;i++){
        if(txt.indexOf(T[i][0])!==-1){
          txt=txt.split(T[i][0]).join(T[i][1]);
        }
      }
      if(txt!==n.textContent)n.textContent=txt;
    }
    var inp=document.querySelector('input[placeholder="Sign up for our Newsletter"]');
    if(inp)inp.placeholder='Seu melhor email';
    var inp2=document.querySelector('input[placeholder="Enter your email"]');
    if(inp2)inp2.placeholder='Seu melhor email';
    document.body.style.opacity='1';document.body.style.visibility='visible';
  }
  [500,1500,3000].forEach(function(t){setTimeout(fix,t);});
})();
</script>'''

content = content[:m.start()] + new_script + content[m.end():]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Post-hydration script replaced successfully')
