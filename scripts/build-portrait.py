"""
Generates the ASCII-portrait brightness matrix (spec §9).

Reads a source photo and emits a 46x38 grid of brightness levels quantised to
FOUR discrete steps. Four is the point: smooth interpolation turns the result
into a blur effect rather than a dither, which is the difference between a
portrait made of pixels and a photo with a filter on it.

The source lives in the gitignored assets/ folder and is deliberately NOT
committed — the derived matrix is, so the site builds from a clean clone
without publishing the original photograph.

Run:  python3 scripts/build-portrait.py
Out:  components/px/portrait.data.json  (~1.8 KB)
"""

import json
import pathlib

from PIL import Image, ImageOps

SRC = "assets/Gemini_Generated_Image_h6mmfih6mmfih6mm.webp"
OUT = "components/px/portrait.data.json"

COLS, ROWS = 46, 38
# Cells render 8px wide x 12px tall (both on the 4px ramp), so the grid's
# display aspect is (46*8)/(38*12) = 0.807. Crop the source to match, or the
# face stretches.
CELL_W, CELL_H = 8, 12
TARGET_ASPECT = (COLS * CELL_W) / (ROWS * CELL_H)

src = Image.open(SRC)

# The source has a busy, brightly-lit geometric background that competes with
# the subject: quantised to four levels it reads as noise and the face
# disappears. Cut the subject out first, then composite onto black so the
# silhouette itself carries the contrast.
try:
    from rembg import new_session, remove

    cut = remove(src.convert("RGBA"), session=new_session("u2net_human_seg"))

    # Crop to the subject before anything else. Left in the full frame the
    # figure occupies about a fifth of the pixels, so nearly every cell
    # quantises to black and the four levels stop doing any work.
    bbox = cut.getchannel("A").getbbox()
    if bbox:
        # Crop to head-and-shoulders, not the whole figure. A 46x38 grid is
        # ~1,700 cells; spending them on a full torso leaves the face a dozen
        # cells across and it stops reading as a person. The previous portrait
        # needed 90x59 precisely because it framed the whole body.
        x0, y0, x1, y1 = bbox
        cut = cut.crop((x0, y0, x1, y0 + int((y1 - y0) * 0.52)))

    alpha = cut.getchannel("A")
    lum = cut.convert("L")

    # Stretch contrast using ONLY the subject's pixels. Autocontrast over the
    # whole frame is dominated by the black background, which leaves the dark
    # shirt collapsed into level 0 and the figure reading as a silhouette with
    # a face floating on it.
    inside = [v for v, a in zip(lum.getdata(), alpha.getdata()) if a > 128]
    inside.sort()
    lo = inside[int(len(inside) * 0.02)]
    hi = inside[int(len(inside) * 0.98)]
    span = max(hi - lo, 1)

    # Rescale into 24..255 so the darkest part of the shirt still sits above
    # the background, then knock the background back to 0 via the mask.
    stretched = lum.point(lambda v: max(0, min(255, 24 + (v - lo) * 231 // span)))
    img = Image.new("L", cut.size, 0)
    img.paste(stretched, mask=alpha.point(lambda a: 255 if a > 128 else 0))
    print(f"  background removed, cropped to subject {cut.size}, subject range {lo}-{hi}")
except Exception as exc:  # noqa: BLE001
    print(f"  WARNING: rembg unavailable ({exc}); using the raw frame")
    img = src.convert("L")

# Pad to the display aspect rather than cropping: the subject is already
# tightly framed, so cropping again would cut the shoulders off.
w, h = img.size
if w / h < TARGET_ASPECT:
    pad = int(h * TARGET_ASPECT) - w
    padded = Image.new("L", (w + pad, h), 0)
    padded.paste(img, (pad // 2, 0))
    img = padded
w, h = img.size
if w / h > TARGET_ASPECT:
    new_w = int(h * TARGET_ASPECT)
    img = img.crop(((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h))
else:
    new_h = int(w / TARGET_ASPECT)
    top = int((h - new_h) * 0.35)
    img = img.crop((0, top, w, top + new_h))

# Normalise before quantising: an under-exposed source would otherwise collapse
# into two levels and lose the dither entirely.
# contrast already stretched within the subject mask above
img = img.resize((COLS, ROWS), Image.LANCZOS)

px = list(img.getdata())

# Quantise to exactly four levels (§9).
LEVELS = 4
rows = []
for r in range(ROWS):
    row = ""
    for c in range(COLS):
        v = px[r * COLS + c]
        row += str(min(LEVELS - 1, v * LEVELS // 256))
    rows.append(row)

hist = [0] * LEVELS
for row in rows:
    for ch in row:
        hist[int(ch)] += 1

pathlib.Path(OUT).write_text(
    json.dumps({"cols": COLS, "rows": ROWS, "cellW": CELL_W, "cellH": CELL_H, "grid": rows})
)

print(f"  {COLS}x{ROWS} grid -> {OUT} ({pathlib.Path(OUT).stat().st_size} bytes)")
print(f"  level histogram: {hist}  (all four must be non-zero)")
print("\n  preview:")
ramp = " .:#"
for row in rows:
    print("   ", "".join(ramp[int(ch)] for ch in row))
