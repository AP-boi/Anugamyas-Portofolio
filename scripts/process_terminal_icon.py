import os
from PIL import Image, ImageDraw, ImageFilter

uploaded_dir = r"C:\Users\Neetu\.gemini\antigravity-ide\brain\dcf31eb3-d018-45f2-b201-d5af331c1e91\.user_uploaded"
output_dir = r"c:\Users\Neetu\Downloads\Anugamya's portofolio\public\icons"

fname = "media_1788359687097.png"
img = Image.open(os.path.join(uploaded_dir, fname)).convert("RGBA")
w, h = img.size

# Square crop first
dim = min(w, h)
cx, cy = w // 2, h // 2
img_sq = img.crop((cx - dim // 2, cy - dim // 2, cx + (dim + 1) // 2, cy + (dim + 1) // 2))
sq_w, sq_h = img_sq.size

# Create high-precision squircle mask
mask = Image.new("L", (sq_w, sq_h), 0)
draw = ImageDraw.Draw(mask)
radius = int(sq_w * 0.22)
draw.rounded_rectangle([(3, 3), (sq_w - 4, sq_h - 4)], radius=radius, fill=255)
feathered_mask = mask.filter(ImageFilter.GaussianBlur(radius=0.7))

out_img = Image.new("RGBA", (sq_w, sq_h), (0, 0, 0, 0))
for y in range(sq_h):
    for x in range(sq_w):
        r, g, b, a = img_sq.getpixel((x, y))
        m_alpha = feathered_mask.getpixel((x, y))
        if m_alpha > 0:
            out_img.putpixel((x, y), (r, g, b, int(m_alpha)))

out_path = os.path.join(output_dir, "terminal.png")
out_img.save(out_path, "PNG")
print(f"Saved terminal.png to {out_path} (size={out_img.size}, corner alpha={out_img.getpixel((0,0))[3]})")
