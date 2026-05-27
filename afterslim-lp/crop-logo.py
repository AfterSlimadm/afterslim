"""Crop transparent/near-transparent padding from logo PNG, using alpha threshold."""
from PIL import Image

src = "images/logo-afterslim.png"
dst = "images/logo-afterslim-tight.png"

img = Image.open(src).convert("RGBA")
print(f"original: {img.size}")

alpha = img.split()[-1]
mask = alpha.point(lambda a: 255 if a > 64 else 0)
bbox = mask.getbbox()
print(f"alpha>64 bounding box: {bbox}")

if bbox:
    cropped = img.crop(bbox)
    print(f"after crop: {cropped.size}")
    pad_x = max(8, int(cropped.width * 0.03))
    pad_y = max(8, int(cropped.height * 0.05))
    canvas = Image.new("RGBA", (cropped.width + pad_x * 2, cropped.height + pad_y * 2), (0, 0, 0, 0))
    canvas.paste(cropped, (pad_x, pad_y), cropped)
    canvas.save(dst, optimize=True)
    print(f"final with padding: {canvas.size}")
    print(f"aspect ratio: {canvas.width / canvas.height:.2f} (wider is better for a wordmark)")
    print(f"saved: {dst}")
