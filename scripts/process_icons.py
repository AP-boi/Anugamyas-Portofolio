import os
from PIL import Image, ImageFilter
from collections import deque

uploaded_dir = r"C:\Users\Neetu\.gemini\antigravity-ide\brain\dcf31eb3-d018-45f2-b201-d5af331c1e91\.user_uploaded"
output_dir = r"c:\Users\Neetu\Downloads\Anugamya's portofolio\public\icons"

os.makedirs(output_dir, exist_ok=True)

files = [
    ("media_1788358383479.png", "finder.png"),
    ("media_1788358425699.png", "camera.png"),
    ("media_1788358435928.png", "settings.png"),
    ("media_1788358458974.png", "safari.png")
]

for filename, out_name in files:
    img_path = os.path.join(uploaded_dir, filename)
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    
    # Step 1: Detect background from outer borders
    visited = [[False]*w for _ in range(h)]
    queue = deque()
    
    # Add border pixels that are near white / bright neutral
    for x in range(w):
        for y in [0, h-1]:
            r, g, b, a = pixels[x, y]
            if r > 210 and g > 210 and b > 210:
                visited[y][x] = True
                queue.append((x, y))
                
    for y in range(h):
        for x in [0, w-1]:
            if not visited[y][x]:
                r, g, b, a = pixels[x, y]
                if r > 210 and g > 210 and b > 210:
                    visited[y][x] = True
                    queue.append((x, y))
                    
    # Flood-fill outwards to the squircle edge
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, na = pixels[nx, ny]
                diff = max(abs(nr - ng), abs(ng - nb), abs(nr - nb))
                
                # Check if this pixel is part of the white / subtle shadow background
                # Note: Finder has saturated blue, Camera has dark camera body / chrome,
                # Settings has dark grey gears, Safari has saturated blue circle.
                # Background outside is pure white or very slight shadow (gray > 220, diff < 8).
                if (nr > 245 and ng > 245 and nb > 245) or (nr > 220 and ng > 220 and nb > 220 and diff <= 8):
                    visited[ny][nx] = True
                    queue.append((nx, ny))
                    
    # Create mask image (255 = keep, 0 = background)
    mask = Image.new("L", (w, h), 255)
    mask_pixels = mask.load()
    for y in range(h):
        for x in range(w):
            if visited[y][x]:
                mask_pixels[x, y] = 0
                
    # Smooth the mask edge slightly for flawless anti-aliasing
    # Feather mask by 1 pixel Gaussian blur
    feathered_mask = mask.filter(ImageFilter.GaussianBlur(radius=0.7))
    
    # Apply mask
    out_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            m_alpha = feathered_mask.getpixel((x, y))
            if m_alpha > 0:
                out_img.putpixel((x, y), (r, g, b, int(m_alpha)))
                
    # Crop to content bounding box with 4px padding
    bbox = out_img.getbbox()
    if bbox:
        # Maintain square aspect ratio
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
        
    out_path = os.path.join(output_dir, out_name)
    cropped_img.save(out_path, "PNG")
    print(f"Processed {out_name}: saved to {out_path} (size={cropped_img.size})")

print("All 4 icons processed successfully!")
