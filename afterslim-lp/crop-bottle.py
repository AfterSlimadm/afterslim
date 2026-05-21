"""Crop transparent/white edges from bottle PNG to remove internal whitespace."""
from PIL import Image, ImageChops

src = "images/afterslim-bottle-nobg.png"
dst = "images/afterslim-bottle-tight.png"

img = Image.open(src).convert("RGBA")
print(f"Original: {img.size}, mode: {img.mode}")

# Use alpha if available, otherwise diff against white
alpha = img.split()[-1]
if alpha.getextrema()[1] > 0 and alpha.getextrema()[0] < 255:
    # Has real alpha channel — use it for bbox
    bbox = alpha.getbbox()
    print(f"Using alpha channel bbox: {bbox}")
else:
    # No real transparency — find non-white pixels
    bg = Image.new("RGB", img.size, (255, 255, 255))
    rgb = img.convert("RGB")
    diff = ImageChops.difference(rgb, bg)
    # Threshold to ignore near-white antialiasing
    diff = diff.point(lambda p: 255 if p > 10 else 0)
    bbox = diff.getbbox()
    print(f"Using white-diff bbox: {bbox}")

if not bbox:
    raise SystemExit("No content found")

# Add small margin so bottle isn't touching edge
margin = 12
left, top, right, bottom = bbox
left = max(0, left - margin)
top = max(0, top - margin)
right = min(img.size[0], right + margin)
bottom = min(img.size[1], bottom + margin)

# Make output square by expanding the shorter dimension symmetrically
w = right - left
h = bottom - top
print(f"Content bbox: {w}x{h}")

if w > h:
    diff = w - h
    top = max(0, top - diff // 2)
    bottom = min(img.size[1], bottom + (diff - diff // 2))
elif h > w:
    diff = h - w
    left = max(0, left - diff // 2)
    right = min(img.size[0], right + (diff - diff // 2))

print(f"Final crop: ({left}, {top}, {right}, {bottom}) -> {right-left}x{bottom-top}")

cropped = img.crop((left, top, right, bottom))
cropped.save(dst, "PNG", optimize=True)
print(f"Saved: {dst} {cropped.size}")
