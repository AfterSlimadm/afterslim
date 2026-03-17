#!/usr/bin/env python3
"""Recolor green Seed capsule images to AfterSlim cognac/amber palette."""
from PIL import Image
import numpy as np
import os

def recolor_green_to_amber(img_path, out_path=None):
    """Replace dark green hues with cognac/amber tones."""
    if out_path is None:
        out_path = img_path

    img = Image.open(img_path).convert('RGBA')
    data = np.array(img, dtype=np.float64)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Detect green-ish pixels (Seed green is around #36542D / #2D4A27 range)
    # Green channel dominant, low red, low blue
    is_dark_green = (
        (g > r * 0.8) &      # green is significant relative to red
        (g > b * 1.1) &      # green > blue
        (r < 150) &          # not too bright
        (g > 30) &           # not too dark
        (g < 200) &          # not white/bright
        (b < g * 0.9) &      # blue less than green
        (a > 50)             # not transparent
    )

    # For dark greens, shift to cognac (#B8722D) / amber (#C17F2E)
    # Map: green intensity -> cognac intensity
    green_intensity = g[is_dark_green] / 255.0

    # Cognac base: R=184, G=114, B=45
    # Darker: R=61, G=43, B=31 (#3D2B1F)
    # Lighter: R=193, G=127, B=46 (#C17F2E)

    new_r = np.clip(60 + green_intensity * 140, 0, 255)  # 60-200
    new_g = np.clip(35 + green_intensity * 95, 0, 255)   # 35-130
    new_b = np.clip(20 + green_intensity * 35, 0, 255)   # 20-55

    data[is_dark_green, 0] = new_r
    data[is_dark_green, 1] = new_g
    data[is_dark_green, 2] = new_b

    result = Image.fromarray(data.astype(np.uint8), 'RGBA')
    result.save(out_path, 'PNG', optimize=True)

    pixel_count = np.sum(is_dark_green)
    total = is_dark_green.size
    pct = pixel_count / total * 100
    print(f"  [OK] {os.path.basename(img_path)}: {pixel_count}/{total} pixels recolored ({pct:.1f}%)")
    return pixel_count > 0

# Images to recolor
images_dir = 'images'
targets = [
    'science_and_tech_desktop.png',    # Hero capsule (green caps)
    'seed-circle.png',                  # Seed logo circle
    'favicon.png',                      # Favicon
]

# Also check for any other green-heavy images
for f in os.listdir(images_dir):
    if f.endswith('.png') and f not in targets and 'afterslim' not in f.lower():
        targets.append(f)

print("Recoloring images (green -> cognac/amber)...\n")

for fname in targets:
    fpath = os.path.join(images_dir, fname)
    if os.path.exists(fpath):
        try:
            recolor_green_to_amber(fpath)
        except Exception as e:
            print(f"  [SKIP] {fname}: {e}")
    else:
        print(f"  [SKIP] {fname}: not found")

print("\nDone!")
