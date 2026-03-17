#!/usr/bin/env python3
"""Replace 4 Seed product cards with 3 AfterSlim bottle cards."""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the product carousel cards container
# It starts with <div class="sc-b3035f6c-2 jKlSPw"> and contains 4 <a> cards
old_cards_pattern = r'(<div class="sc-b3035f6c-2 jKlSPw">).*?(</div></section>)'

# The 3 new cards
card_1_bottle = '''<a class="sc-baccdee5-0 jXIGTY card " href="#buy-1"><span color="seedgreen" class="sc-60b7c4e8-0 sc-baccdee5-3 gGAMkK bMONEt">Try It</span><div class="sc-baccdee5-1 bCwiXP block-top" hoverColor="snowwhite" stackSize="xSmall"><div class="sc-baccdee5-2 fMLtWv"><span color="snowwhite" lineHeight="8px" font-weight="350" class="sc-3fd0a620-0 lpuDMx">1 Bottle</span></div><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-6 OIZSz dmRLuy">30-Day Supply</p></div><div class="bottle-spin"><img src="images/afterslim-bottle-nobg.png" alt="AfterSlim Berberine 1200mg bottle" loading="lazy"/></div><div hoverColor="snowwhite" class="sc-baccdee5-1 lhwQgV block-bottom"><button color="seedgreen" type="button" class="sc-a5094583-1 ewPaTi" tabindex="0">Shop Now<span class="sc-a5094583-0 evVzdr" style="opacity:0;width:0px;margin-left:0px;transform:translateX(-8px)"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11" style="width:12px;height:12px"><path fill="var(--color-primary-seed-green)" fill-rule="evenodd" d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z" clip-rule="evenodd"></path></svg></span></button><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-12 sc-baccdee5-4 OIZSz egNwcf boCEsu">$59.99</p></div></a>'''

card_2_bottles = '''<a class="sc-baccdee5-0 jXIGTY card " href="#buy-2"><span color="seedgreen" class="sc-60b7c4e8-0 sc-baccdee5-3 gGAMkK bMONEt">Popular</span><div class="sc-baccdee5-1 bCwiXP block-top" hoverColor="snowwhite" stackSize="xSmall"><div class="sc-baccdee5-2 fMLtWv"><span color="snowwhite" lineHeight="8px" font-weight="350" class="sc-3fd0a620-0 lpuDMx">3 Bottles</span></div><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-6 OIZSz dmRLuy">90-Day Supply</p></div><div class="bottle-spin"><img src="images/afterslim-bottle-nobg.png" alt="AfterSlim Berberine 1200mg - 3 bottles" loading="lazy"/></div><div hoverColor="snowwhite" class="sc-baccdee5-1 lhwQgV block-bottom"><button color="seedgreen" type="button" class="sc-a5094583-1 ewPaTi" tabindex="0">Shop Now<span class="sc-a5094583-0 evVzdr" style="opacity:0;width:0px;margin-left:0px;transform:translateX(-8px)"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11" style="width:12px;height:12px"><path fill="var(--color-primary-seed-green)" fill-rule="evenodd" d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z" clip-rule="evenodd"></path></svg></span></button><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-12 sc-baccdee5-4 OIZSz egNwcf boCEsu">$49.99/ea · Save 17%</p></div></a>'''

card_3_bottles = '''<a class="sc-baccdee5-0 jXIGTY card " href="#buy-3"><span color="seedgreen" class="sc-60b7c4e8-0 sc-baccdee5-3 gGAMkK bMONEt">Best Value</span><div class="sc-baccdee5-1 bCwiXP block-top" hoverColor="snowwhite" stackSize="xSmall"><div class="sc-baccdee5-2 fMLtWv"><span color="snowwhite" lineHeight="8px" font-weight="350" class="sc-3fd0a620-0 lpuDMx">6 Bottles</span></div><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-6 OIZSz dmRLuy">180-Day Supply</p></div><div class="bottle-spin"><img src="images/afterslim-bottle-nobg.png" alt="AfterSlim Berberine 1200mg - 6 bottles" loading="lazy"/></div><div hoverColor="snowwhite" class="sc-baccdee5-1 lhwQgV block-bottom"><button color="seedgreen" type="button" class="sc-a5094583-1 ewPaTi" tabindex="0">Shop Now<span class="sc-a5094583-0 evVzdr" style="opacity:0;width:0px;margin-left:0px;transform:translateX(-8px)"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11" style="width:12px;height:12px"><path fill="var(--color-primary-seed-green)" fill-rule="evenodd" d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z" clip-rule="evenodd"></path></svg></span></button><p color="snowwhite" class="sc-413e5ea6-0 sc-413e5ea6-12 sc-baccdee5-4 OIZSz egNwcf boCEsu">$39.99/ea · Save 33%</p></div></a>'''

new_cards = f'''{card_1_bottle}{card_2_bottles}{card_3_bottles}'''

match = re.search(old_cards_pattern, html, re.DOTALL)
if match:
    old_section = match.group(0)
    new_section = f'<div class="sc-b3035f6c-2 jKlSPw">{new_cards}</div></section>'
    html = html.replace(old_section, new_section)
    print(f"[OK] Replaced product cards section ({len(old_section)} chars -> {len(new_section)} chars)")
else:
    print("[FAIL] Could not find product cards section")

# Also fix the carousel header text
html = html.replace(
    'Choose the right plan for you.',
    'Choose your supply.'
)
html = html.replace(
    'The more you buy, the more you save. Real results in 30, 60, or 90 days.',
    'Clinical-dose Berberine HCl 1200mg. The more you buy, the more you save.'
)
html = html.replace(
    '<a id="carousel-button-link" color="snowwhite" align="center" transform="lower" class="sc-53616bdf-0 eBnxQF" href="/products">Shop all<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 11 11" style="width:8px;height:8px"><path fill="var(--color--snowwhite)" fill-rule="evenodd" d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z" clip-rule="evenodd"></path></svg></a>',
    ''
)
print("[OK] Updated carousel header text")

# Fix "38 trillion microbes" text
html = html.replace(
    "Your body isn&#x27;t yours alone—it&#x27;s home to 38 trillion microbes that power your digestion, immunity and more. Take a few minutes to learn how their health impacts your health—and how to maximize both.",
    "Your metabolism controls everything from energy levels to weight management. Clinical studies show that Berberine HCl activates AMPK, the enzyme that regulates how your body burns fat and processes sugar. Learn how AfterSlim works at the cellular level."
)
print("[OK] Fixed 38 trillion microbes text")

# Fix mobile grid - hide last child rule for 3 cards (was hiding 4th on mobile)
html = html.replace(
    '@media (max-width: 59.9375em){.jAPhxV{--span:3;}.jAPhxV .card:last-child{display:none;}}',
    '@media (max-width: 59.9375em){.jAPhxV{--span:3;}}'
)
print("[OK] Fixed mobile grid (removed hide last child)")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\nDone! All changes applied.")
