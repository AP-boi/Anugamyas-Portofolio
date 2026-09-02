import os
from PIL import Image, ImageDraw, ImageFilter
from collections import deque

uploaded_dir = r"C:\Users\Neetu\.gemini\antigravity-ide\brain\dcf31eb3-d018-45f2-b201-d5af331c1e91\.user_uploaded"
output_dir = r"c:\Users\Neetu\Downloads\Anugamya's portofolio\public\icons"

os.makedirs(output_dir, exist_ok=True)

# 1. Process Games icon
img1_path = os.path.join(uploaded_dir, "media_1788359057650.png")
img1 = Image.open(img1_path).convert("RGBA")
w1, h1 = img1.size
pixels1 = img1.load()

# Background color in corners is approx (198, 213, 230)
corner_colors = [
    pixels1[0, 0], pixels1[w1-1, 0], pixels1[0, h1-1], pixels1[w1-1, h1-1],
    pixels1[2, 2], pixels1[w1-3, 2], pixels1[2, h1-3], pixels1[w1-3, h1-3]
]
bg_r = sum(c[0] for c in corner_colors) / len(corner_colors)
bg_g = sum(c[1] for c in corner_colors) / len(corner_colors)
bg_b = sum(c[2] for c in corner_colors) / len(corner_colors)

visited1 = [[False]*w1 for _ in range(h1)]
queue1 = deque()

for x in range(w1):
    for y in [0, h1-1]:
        r, g, b, a = pixels1[x, y]
        dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
        if dist < 45 or (r > 180 and g > 200 and b > 215):
            visited1[y][x] = True
            queue1.append((x, y))

for y in range(h1):
    for x in [0, w1-1]:
        if not visited1[y][x]:
            r, g, b, a = pixels1[x, y]
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            if dist < 45 or (r > 180 and g > 200 and b > 215):
                visited1[y][x] = True
                queue1.append((x, y))

while queue1:
    cx, cy = queue1.popleft()
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = cx + dx, cy + dy
        if 0 <= nx < w1 and 0 <= ny < h1 and not visited1[ny][nx]:
            nr, ng, nb, na = pixels1[nx, ny]
            dist = ((nr - bg_r)**2 + (ng - bg_g)**2 + (nb - bg_b)**2)**0.5
            # Outer background is bluish gray
            if dist < 35 or (nr > 180 and ng > 200 and nb > 215 and abs(ng - nr) > 10):
                visited1[ny][nx] = True
                queue1.append((nx, ny))

mask1 = Image.new("L", (w1, h1), 255)
mask_pixels1 = mask1.load()
for y in range(h1):
    for x in range(w1):
        if visited1[y][x]:
            mask_pixels1[x, y] = 0

feathered_mask1 = mask1.filter(ImageFilter.GaussianBlur(radius=0.7))
out_img1 = Image.new("RGBA", (w1, h1), (0, 0, 0, 0))
for y in range(h1):
    for x in range(w1):
        r, g, b, a = pixels1[x, y]
        m_alpha = feathered_mask1.getpixel((x, y))
        if m_alpha > 0:
            out_img1.putpixel((x, y), (r, g, b, int(m_alpha)))

bbox1 = out_img1.getbbox()
if bbox1:
    bw = bbox1[2] - bbox1[0]
    bh = bbox1[3] - bbox1[1]
    max_dim = max(bw, bh)
    cx = (bbox1[0] + bbox1[2]) // 2
    cy = (bbox1[1] + bbox1[3]) // 2
    sq_box1 = (
        max(0, cx - max_dim // 2 - 2),
        max(0, cy - max_dim // 2 - 2),
        min(w1, cx + (max_dim + 1) // 2 + 2),
        min(h1, cy + (max_dim + 1) // 2 + 2)
    )
    cropped_img1 = out_img1.crop(sq_box1)
else:
    cropped_img1 = out_img1

out1_path = os.path.join(output_dir, "games.png")
cropped_img1.save(out1_path, "PNG")
print(f"Saved games.png to {out1_path} (size={cropped_img1.size})")

# 2. Process Apple Intelligence / Siri icon
img2_path = os.path.join(uploaded_dir, "media_1788359088785.png")
img2 = Image.open(img2_path).convert("RGBA")
w2, h2 = img2.size

# Apple Intelligence icon is a standard macOS squircle with continuous curvature
# Create high-resolution macOS squircle mask (radius ~ 22.5% of dimension)
mask2 = Image.new("L", (w2, h2), 0)
draw2 = ImageDraw.Draw(mask2)
# Standard macOS squircle corner radius
radius = int(min(w2, h2) * 0.225)
draw2.rounded_rectangle([(4, 4), (w2 - 5, h2 - 5)], radius=radius, fill=255)
feathered_mask2 = mask2.filter(ImageFilter.GaussianBlur(radius=0.8))

out_img2 = Image.new("RGBA", (w2, h2), (0, 0, 0, 0))
for y in range(h2):
    for x in range(w2):
        r, g, b, a = img2.getpixel((x, y))
        m_alpha = feathered_mask2.getpixel((x, y))
        if m_alpha > 0:
            out_img2.putpixel((x, y), (r, g, b, int(m_alpha)))

out2_path = os.path.join(output_dir, "siri.png")
out_img2.save(out2_path, "PNG")
print(f"Saved siri.png to {out2_path} (size={out_img2.size})")
