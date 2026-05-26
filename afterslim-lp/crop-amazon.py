"""Crop the transparent/white margins from amazon-logo.png."""
from PIL import Image, ImageChops

src = "images/amazon-logo.png"
dst = "images/amazon-logo-tight.png"

img = Image.open(src).convert("RGBA")
print(f"Original: {img.size}, mode: {img.mode}")

alpha = img.split()[-1]
lo, hi = alpha.getextrema()
if hi > 0 and lo < 255:
    bbox = alpha.getbbox()
    print(f"Alpha bbox: {bbox}")
else:
    bg = Image.new("RGB", img.size, (255, 255, 255))
    rgb = img.convert("RGB")
    diff = ImageChops.difference(rgb, bg).point(lambda p: 255 if p > 10 else 0)
    bbox = diff.getbbox()
    print(f"White-diff bbox: {bbox}")

if not bbox:
    raise SystemExit("No content found")

# Small 4px margin
m = 4
left, top, right, bottom = bbox
left = max(0, left - m)
top = max(0, top - m)
right = min(img.size[0], right + m)
bottom = min(img.size[1], bottom + m)

print(f"Final crop: ({left}, {top}, {right}, {bottom}) -> {right-left}x{bottom-top}")
cropped = img.crop((left, top, right, bottom))
cropped.save(dst, "PNG", optimize=True)
print(f"Saved: {dst} {cropped.size}")
