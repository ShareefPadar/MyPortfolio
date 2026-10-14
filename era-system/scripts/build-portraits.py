"""
Builds the portraits that 1986, 2002 and 2014 draw from the real photograph (Shareef's call: the 8-bit portrait
belongs to 1995, and those three stopped borrowing it; Now shows no portrait at all).

  1986  assets/portraits/1986.json       96x144, one bit a pixel, Atkinson dither, plus the silhouette as a second
                                         bitmap: head and hand, cut out. The page draws it pale on a mid-blue silhouette.
  2002  assets/portraits/2002.webp       the photo as it is, background and all, 400x600, for the white frame.
  2014  assets/portraits/2014.webp       Shareef's vector illustration of himself (his file, assets/Stylized Vector
                                         Portrait with Glasses and Badge.png), a 640 square on head and hand.
        assets/portraits/2014-head.webp  its face, 128 square, for the chat head on every 2014 page.

The outputs are committed, so the site builds without the source photo, Pillow or rembg. Run this only when the
photo or a treatment changes:  python3 era-system/scripts/build-portraits.py   (from the repo root)

The source photo is the one scripts/build-portrait.py reads. It has an image-generator watermark in the bottom
right corner, and every crop here stops above it. 2002 uses the photo as it is (a cut-out photo looked wrong to
Shareef); 1986 is a drawing made from the cut-out, so it needs no backdrop. 2014 is Shareef's own illustration.
"""

import base64
import json
import pathlib

from PIL import Image, ImageChops, ImageEnhance, ImageFilter
from rembg import new_session, remove

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "assets" / "Gemini_Generated_Image_h6mmfih6mmfih6mm.webp"
OUT = ROOT / "era-system" / "assets" / "portraits"
OUT.mkdir(parents=True, exist_ok=True)

# ── the cut-out ────────────────────────────────────────────────────────────────────────────────
src = Image.open(SRC).convert("RGBA")
W, H = src.size
cut = remove(src, session=new_session("u2net_human_seg"))

# Pull the mask in a few pixels and feather it, or the backdrop rides along as a bright rim.
alpha = cut.getchannel("A").filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.6))

# The backdrop is blue behind the hair and shows between the curls. Turn anything bluer than hair or skin can be
# into shadow: anywhere above the hairline (nothing up there is blue but backdrop), and from there down to the chin
# only in a band about 40px deep around the head, so the blue light on the cheek stays. Below the chin the edge is
# a black shirt: leave it.
small = alpha.resize((W // 4, H // 4), Image.BILINEAR).point(lambda v: 255 if v > 128 else 0)
inner = small.filter(ImageFilter.MinFilter(21)).resize((W, H), Image.BILINEAR)
band = ImageChops.subtract(alpha.point(lambda v: 255 if v > 8 else 0), inner.point(lambda v: 255 if v > 128 else 0))
px, bd = cut.load(), band.load()
HAIRLINE = int(H * .237)
for y in range(0, int(H * .455)):
    for x in range(W):
        if bd[x, y] or y < HAIRLINE:
            r, g, b, a = px[x, y]
            if b > max(r, g) + 12:
                m = max(r, g)                                 # the brighter the blue, the more of it was backdrop
                k = .5 if b < 110 else .28
                px[x, y] = (int(r * k), int(g * k), int(m * k * 1.1), a)
cut.putalpha(alpha)

# 2:3 frames that stop above the watermark: the whole figure for 2002, head and hand for 1986's few pixels
FRAME = (84, 0, 1601, 2275)
FACE = (290, 0, 1390, 1650)
frame = cut.crop(FACE)


# ── 1986: one bit a pixel ───────────────────────────────────────────────────────────────────────
def atkinson(img):
    """Bill Atkinson's dither, the one MacPaint shipped with: it spreads only 6/8 of the error, which keeps
    highlights and shadows clean instead of peppering them."""
    w, h = img.size
    p = [[float(img.getpixel((x, y))) for x in range(w)] for y in range(h)]
    out = [[0] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            old = p[y][x]
            new = 255 if old > 127 else 0
            out[y][x] = 1 if new else 0
            e = (old - new) / 8
            for dx, dy in ((1, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (0, 2)):
                if 0 <= x + dx < w and y + dy < h:
                    p[y + dy][x + dx] += e
    return out


def pack(rows):
    bits = [b for row in rows for b in row]
    bits += [0] * (-len(bits) % 8)
    return base64.b64encode(bytes(int("".join(map(str, bits[i:i + 8])), 2) for i in range(0, len(bits), 8))).decode()


PW, PH = 96, 144
work = frame.resize((frame.width // 4, frame.height // 4), Image.LANCZOS)
wa, lum = work.getchannel("A"), work.convert("L")

# The photo is lit hard from one side. Dithered as it is, one half of the face burns out and the other fills in,
# so first pull every neighbourhood part of the way toward the same average brightness.
soft = lum.filter(ImageFilter.GaussianBlur(26))
lp, sp, ap = lum.load(), soft.load(), wa.load()
even = Image.new("L", work.size, 0)
ep = even.load()
for y in range(work.height):
    for x in range(work.width):
        if ap[x, y] > 40:
            ep[x, y] = max(0, min(255, int(lp[x, y] - .45 * (sp[x, y] - 96))))

# Stretch the contrast using the subject's pixels only, then sharpen: the dither needs edges to hold on to.
inside = sorted(v for v, m in zip(even.getdata(), wa.getdata()) if m > 128)
lo, hi = inside[int(len(inside) * .025)], inside[int(len(inside) * .99)]
even = even.point(lambda v: int(255 * (max(0., min(1., (v - lo) / max(hi - lo, 1))) ** 1.05)))
even = ImageEnhance.Sharpness(even).enhance(1.7)

ink = atkinson(even.resize((PW, PH), Image.LANCZOS))
ma = wa.resize((PW, PH), Image.LANCZOS).load()
mask = [[1 if ma[x, y] > 128 else 0 for x in range(PW)] for y in range(PH)]
ink = [[ink[y][x] & mask[y][x] for x in range(PW)] for y in range(PH)]
(OUT / "1986.json").write_text(json.dumps({
    "_note": "GENERATED by scripts/build-portraits.py from the photo. Row-major, one bit a pixel, most significant "
             "bit first, base64. mask = the silhouette; ink = the lit pixels of the Atkinson dither inside it.",
    "w": PW, "h": PH, "mask": pack(mask), "ink": pack(ink),
}, indent=1) + "\n")

# ── 2002: the photo as it is, for the white frame ───────────────────────────────────────────────
photo = Image.open(SRC).convert("RGB")
photo.crop(FRAME).resize((400, 600), Image.LANCZOS).save(OUT / "2002.webp", "WEBP", quality=85, method=6)

# ── 2014: Shareef's own vector illustration ─────────────────────────────────────────────────────
# He supplied it (1024x1536, on its own blue). A square on head and hand for the circle, the face for the chat head.
ILLUS = ROOT / "assets" / "Stylized Vector Portrait with Glasses and Badge.png"
art = Image.open(ILLUS).convert("RGB")
art.crop((90, 0, 990, 900)).resize((640, 640), Image.LANCZOS).save(OUT / "2014.webp", "WEBP", quality=88, method=6)
art.crop((250, 190, 810, 750)).resize((128, 128), Image.LANCZOS).save(OUT / "2014-head.webp", "WEBP", quality=86, method=6)

for f in sorted(OUT.iterdir()):
    print(f"  {f.name:16} {f.stat().st_size / 1024:6.1f} KB")
