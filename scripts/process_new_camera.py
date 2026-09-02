import os
from PIL import Image, ImageFilter
from collections import deque

uploaded_dir = r"C:\Users\Neetu\.gemini\antigravity-ide\brain\dcf31eb3-d018-45f2-b201-d5af331c1e91\.user_uploaded"
output_dir = r"c:\Users\Neetu\Downloads\Anugamya's portofolio\public\icons"

img_path = os.path.join(uploaded_dir, "media_1788359233834.png")
img = Image.open(img_path).convert("RGBA")
w, h = img.size
pixels = img.load()

# Background color in corners is approx (248, 248, 248)
corner_colors = [
    pixels[0, 0], pixels[w-1, 0], pixels[0, h-1], pixels[w-1, h-1],
    pixels[1, 1], pixels[w-2, 1], pixels[1, h-2], pixels[w-2, h-2]
]
bg_r = sum(c[0] for c in corner_colors) / len(corner_colors)
bg_g = sum(c[1] for c in corner_colors) / len(corner_colors)
bg_b = sum(c[2] for c in corner_colors) / len(corner_colors)
print(f"Detected background: ({bg_r:.1f}, {bg_g:.1f}, {bg_b:.1f})")

visited = [[False]*w for _ in range(h)]
queue = deque()

for x in range(w):
    for y in [0, h-1]:
        r, g, b, a = pixels[x, y]
        dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
        if dist < 40 or (r > 230 and g > 230 and b > 230):
            visited[y][x] = True
            queue.append((x, y))

for y in range(h):
    for x in [0, w-1]:
        if not visited[y][x]:
            r, g, b, a = pixels[x, y]
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            if dist < 40 or (r > 230 and g > 230 and b > 230):
                visited[y][x] = True
                queue.append((x, y))

while queue:
    cx, cy = queue.popleft()
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = cx + dx, cy + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
            nr, ng, nb, na = pixels[nx, ny]
            dist = ((nr - bg_r)**2 + (ng - bg_g)**2 + (nb - bg_b)**2)**0.5
            diff = max(abs(nr - ng), abs(ng - nb), abs(nr - nb))
            if dist < 30 or (nr > 235 and ng > 235 and nb > 235 and diff <= 6):
                visited[ny][nx] = True
                queue.append((nx, ny))

mask = Image.new("L", (w, h), 255)
mask_pixels = mask.load()
for y in range(h):
    for x in range(w):
        if visited[y][x]:
            mask_pixels[x, y] = 0

feathered_mask = mask.filter(ImageFilter.GaussianBlur(radius=0.7))

out_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        m_alpha = feathered_mask.getpixel((x, y))
        if m_alpha > 0:
            out_img.putpixel((x, y), (r, g, b, int(m_alpha)))

bbox = out_img.getbbox()
if bbox:
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    max_dim = max(bw, bh)
    cx = (bbox[0] + bbox[2]) // 2
    cy = (bbox[1] + bbox[3]) // 2
    sq_box = (
        max(0, cx - max_dim // 2 - 2),
        max(0, cy - max_dim // 2 - 2),
        min(w, cx + (max_dim + 1) // 2 + 2),
        min(h, cy + (max_dim + 1) // 2 + 2)
    )
    cropped_img = out_img.crop(sq_box)
else:
    cropped_img = out_img

out_path = os.path.join(output_dir, "camera.png")
cropped_img.save(out_path, "PNG")
print(f"Saved new camera.png to {out_path} (size={cropped_img.size})")
