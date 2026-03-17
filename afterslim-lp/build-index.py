#!/usr/bin/env python3
"""
Build the local index.html from the real seed.com source.
Replaces remote image URLs with local paths, removes OneTrust,
and keeps all JS intact.
"""
import re

with open('C:/tmp/seed-source2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === IMAGE URL REPLACEMENTS ===
# Cloudinary URLs -> local images/
replacements = {
    # Mux thumbnails
    'https://image.mux.com/87tnV011w6GkwNzl7dxntQSNhpcVSJNgSQaqlj3iLTK00/thumbnail.webp': 'images/mux-thumb-87tnV011w6Gk.webp',
    'https://image.mux.com/B7ii9VEdNofKFscQjX1KWamismdYkNjaHKZEfC5zADE/thumbnail.webp': 'images/mux-thumb-B7ii9VEdNofK.webp',
    'https://image.mux.com/iM00sNT9JitDRoL3sKGoI7wWXDmYwx7eAw5ialhbLBOk/thumbnail.webp': 'images/mux-thumb-iM00sNT9JitD.webp',
    'https://image.mux.com/oB02r9BUIqkJHUxbfyWLh00yK5GO6GqRQReiSskS5SRL4/thumbnail.webp': 'images/mux-thumb-oB02r9BUIqkJ.webp',
    'https://image.mux.com/ulw3ww5UZIgdyYqXJgZq1rqt4GxjG631zzxeGLdN9Co/thumbnail.webp': 'images/mux-thumb-ulw3ww5UZIgd.webp',

    # Cloudinary - scroller
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752249339/library/scroller/Frame_1739333317.png': 'images/scroller-Frame_1739333317.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752252570/library/scroller/Frame_1739333318.png': 'images/scroller-Frame_1739333318.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752252937/library/scroller/blobs.png': 'images/scroller-blobs.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752261552/library/scroller/Frame_1739333320.png': 'images/scroller-Frame_1739333320.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1753366891/library/scroller/ugc-5.png': 'images/scroller-ugc-5.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1753366892/library/scroller/ugc-8.png': 'images/scroller-ugc-8.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1753371915/library/scroller/Frame_1739333315.png': 'images/scroller-Frame_1739333315.png',

    # Cloudinary - footer
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752265586/library/footer/footer-fpo.jpg': 'images/footer-fpo.jpg',

    # Cloudinary - bookend
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1752512630/library/bookend/image_164.png': 'images/bookend-image_164.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1753460833/library/bookend/5f4e9939ee3b96921d9af4d502cbdd3edf2a3d2a.jpg': 'images/bookend-5f4e9939.jpg',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1753995020/library/bookend/force-life.png': 'images/force-life.png',

    # Cloudinary - highlight
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758053476/library/highlight/cd4fcd333d2d2c517ca600e6ee9efbbaf896fded.png': 'images/highlight-cd4fcd333d2d2c517ca600e6ee9efbbaf896fded.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758117774/library/highlight/2_1.png': 'images/highlight-2_1.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758117791/library/highlight/1de23b9c19a1b7098203106cb8647453916e1416.png': 'images/highlight-1de23b9c19a1b7098203106cb8647453916e1416.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758127083/library/highlight/Frame_1739333908_2.png': 'images/highlight-Frame_1739333908_2.png',

    # Cloudinary - viacap
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1755552501/library/viacap/viacapbg.png': 'images/viacapbg.png',

    # Cloudinary - hero
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/library/hero/science_and_tech_desktop.png': 'images/science_and_tech_desktop.png',

    # Cloudinary - product images
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758832017/AM_400x400.png': 'images/AM_400x400.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758832017/BUNDLE_400x400.png': 'images/BUNDLE_400x400.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758832017/DM_400x400.png': 'images/DM_400x400.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1758832017/PM_400x400.png': 'images/PM_400x400.png',

    # Cloudinary - carousel
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1762362130/library/carousel/am02-carousel-poster.png': 'images/carousel-am02-carousel-poster.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1762362130/library/carousel/pm02-carousel-poster.png': 'images/carousel-pm02-carousel-poster.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1762362131/library/carousel/dm02-carousel-poster.png': 'images/carousel-dm02-carousel-poster.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1762362135/library/carousel/ds01-carousel-poster.png': 'images/carousel-ds01-carousel-poster.png',

    # Cloudinary - misc
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1592529132/favicon.png': 'images/favicon.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1687555392/seed-circle.png': 'images/seed-circle.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/v1602755987/press/seed.png': 'images/press-seed.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/v1610439853/daily-synbiotic/Seed_PDP_01_Hero_Mobile_2.png': 'images/daily-synbiotic-Seed_PDP_01_Hero_Mobile_2.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/v1610475400/daily-synbiotic/Seed_PDP_01_Hero_Mobile_1_NEW.jpg': 'images/daily-synbiotic-Seed_PDP_01_Hero_Mobile_1_NEW.jpg',
    'https://res.cloudinary.com/dljz0lko8/image/upload/v1649362831/PDS%20PDP/pds08_pdp_hero.png': 'images/PDS_PDP-pds08_pdp_hero.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/v1752675841/library/reviews/alice_thumbnail.png': 'images/reviews-alice_thumbnail.png',
    'https://res.cloudinary.com/dljz0lko8/image/upload/f_auto,q_auto/v1759517361/structured-data/og-homepage.png': 'images/og-homepage.png',
}

for remote_url, local_path in replacements.items():
    count = html.count(remote_url)
    if count > 0:
        html = html.replace(remote_url, local_path)
        print(f"  Replaced {count}x: ...{remote_url[-50:]} -> {local_path}")
    else:
        print(f"  NOT FOUND: {remote_url[-60:]}")

# === REMOVE ONETRUST ===
# Remove OneTrust script tags
html = re.sub(r'<script[^>]*onetrust[^>]*>.*?</script>', '', html, flags=re.IGNORECASE|re.DOTALL)
html = re.sub(r'<script[^>]*optanon[^>]*>.*?</script>', '', html, flags=re.IGNORECASE|re.DOTALL)
html = re.sub(r'<script[^>]*cdn\.cookielaw\.org[^>]*>.*?</script>', '', html, flags=re.IGNORECASE|re.DOTALL)
# Remove OneTrust link tags
html = re.sub(r'<link[^>]*cookielaw[^>]*/>', '', html, flags=re.IGNORECASE)
html = re.sub(r'<link[^>]*onetrust[^>]*/>', '', html, flags=re.IGNORECASE)

# === REMOVE OPTIMIZELY ===
html = re.sub(r'<script[^>]*optimizely[^>]*>.*?</script>', '', html, flags=re.IGNORECASE|re.DOTALL)

# === ENSURE BODY IS VISIBLE AND SCROLLABLE ===
# Force body/html styles
html = html.replace('<html lang="en-US">', '<html lang="en-US" style="overflow:auto!important;">')
if '<html lang="en">' in html:
    html = html.replace('<html lang="en">', '<html lang="en" style="overflow:auto!important;">')

# Add style tag to force visibility
force_styles = """
<style id="local-overrides">
  html, body { overflow: auto !important; height: auto !important; }
  body { opacity: 1 !important; visibility: visible !important; }
  #onetrust-consent-sdk, .onetrust-pc-dark-filter, #onetrust-banner-sdk { display: none !important; }
  .optanon-alert-box-wrapper { display: none !important; }
</style>
"""
html = html.replace('</head>', force_styles + '</head>')

# === FIX SCRIPT PATHS ===
# The source uses /_next/static/ (absolute) but we need relative paths for local serving
html = html.replace('src="/_next/', 'src="_next/')
html = html.replace('href="/_next/', 'href="_next/')

# === NEUTRALIZE API CALLS THAT MIGHT FAIL ===
# We'll handle this by serving the mock files - Python http.server should serve them

# === WRITE OUTPUT ===
with open('C:/tmp/seed-new/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\n=== Done! index.html written ===")
print(f"Size: {len(html)} bytes")
