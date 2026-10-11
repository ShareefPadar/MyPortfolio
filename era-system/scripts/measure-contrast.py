#!/usr/bin/env python3
"""
Measures contrast from RENDERED PIXELS behind every piece of visible text.

Token checks (check-contrast.mjs) compare flat colours. Glass, gel, gradients
and images put text on backgrounds no token describes — this is the only check
that sees what a reader sees. Written after 2002's gel and Now's glass both
passed every token check and still failed on screen.

For each text element: scroll it into view, hide its text, screenshot, sample
the pixels behind its glyph boxes (not the whole element — icons and dots are
excluded), and compare with its computed colour. Done twice: pointer away, and
pointer hovering it (hover states and specular highlights change backgrounds).

Usage:  python3 scripts/measure-contrast.py design-reference/eras/now.html [width] [--prelude "js"] [--only ".selector"]
        e.g. an off-canvas drawer:  … 390 --prelude "document.querySelector('.burger').click()" --only ".drawer"
Needs:  pip install playwright pillow && playwright install chromium
"""
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image

def lum(rgb):
    c = [v / 255 for v in rgb[:3]]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    x, y = sorted([lum(a), lum(b)], reverse=True)
    return (x + 0.05) / (y + 0.05)

# every visible element that directly owns text; large text (>=24px, or >=18.66px bold) needs 3:1
DISCOVER = """(only) => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT','STYLE','SVG','svg','text'].includes(el.tagName)) continue;
    if (only && !el.closest(only)) continue;
    if (el.closest('.skip, .toast, svg, [aria-hidden="true"]')) continue;   // decorative content isn't read
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.data.trim());
    if (!own) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || cs.display === 'none' || r.width <= 1 || r.height <= 1) continue;   // incl. visually-hidden labels
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    el.dataset.mcId = out.length;
    out.push({ id: out.length, large: size >= 24 || (size >= 18.66 && bold), txt: el.textContent.trim().slice(0, 34) });
  }
  return out;
}"""

RECTS = """(id) => {
  const el = document.querySelector(`[data-mc-id="${id}"]`);
  if (!el) return { rects: [], col: '' };
  el.scrollIntoView({ block: 'center' });
  const rects = [];
  for (const n of el.childNodes) {
    if (n.nodeType !== 3 || !n.data.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const q of r.getClientRects()) rects.push([q.x, q.y, q.width, q.height]);
  }
  return { rects, col: getComputedStyle(el).color };
}"""

BLOCK = "h1,h2,h3,h4,h5,h6,p,li,figcaption,blockquote,button,a,label,dt,dd"
HIDE = """(id) => { const el = document.querySelector(`[data-mc-id="${id}"]`); if (!el) return;
  const blk = el.closest('""" + BLOCK + """') || el;
  [blk, ...blk.querySelectorAll('*')].forEach(k => k.style.setProperty('color', 'transparent', 'important')); }"""
SHOW = """(id) => { const el = document.querySelector(`[data-mc-id="${id}"]`); if (!el) return;
  const blk = el.closest('""" + BLOCK + """') || el;
  [blk, ...blk.querySelectorAll('*')].forEach(k => k.style.removeProperty('color')); }"""

async def main(page, width, prelude=None, only=None):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': width, 'height': 900})
        await pg.goto('file://' + os.path.abspath(page))
        await pg.wait_for_timeout(2500)
        # settle the page: no smooth scroll, reveals finished, background frozen
        # measure the STEADY state: a colour transition mid-fade leaves the label half-visible when it's hidden
        await pg.add_style_tag(content='*, *::before, *::after { transition: none !important; }')
        await pg.evaluate("""document.documentElement.style.scrollBehavior='auto';
          document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in','is-in'));
          document.querySelectorAll('*').forEach(e=>{ if (getComputedStyle(e).animationIterationCount==='infinite') e.style.animation='none'; })""")
        # trigger every scroll-driven script (typing, reveals) before measuring, then let it finish
        h = await pg.evaluate("document.documentElement.scrollHeight")
        for y in range(0, h + 900, 600):
            await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(120)
        await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(2500)
        if prelude:
            await pg.evaluate(prelude); await pg.wait_for_timeout(900)
        items = await pg.evaluate(DISCOVER, only)
        results = []
        for it in items:
            worst = {}
            for mode in ('away', 'over'):
                info = await pg.evaluate(RECTS, it['id'])
                if not info['rects']: break
                x, y, w, h = info['rects'][0]
                await pg.mouse.move(*((x + w / 2, y + h / 2) if mode == 'over' else (1, 899)))
                await pg.wait_for_timeout(120)
                # hide the whole text block, not just this element: with tight display leading,
                # a word's glyph box overlaps the lines above and below it
                await pg.evaluate(HIDE, it['id'])
                await pg.wait_for_timeout(40)
                await pg.screenshot(path='/tmp/_mc.png')
                await pg.evaluate(SHOW, it['id'])
                im = Image.open('/tmp/_mc.png').convert('RGB')
                fg = tuple(int(float(v)) for v in info['col'].replace('rgba(', '').replace('rgb(', '').replace(')', '').split(',')[:3])
                vals = [ratio(fg, im.getpixel((xx, yy)))
                        for (rx, ry, rw, rh) in info['rects']
                        for yy in range(max(0, int(ry)), min(im.height, int(ry + rh)), 2)
                        for xx in range(max(0, int(rx)), min(im.width, int(rx + rw)), 2)]
                if vals: worst[mode] = min(vals)
            if worst: results.append((it, worst))
        await b.close()
        return results

if __name__ == '__main__':
    args = sys.argv[1:]
    def opt(flag):
        if flag not in args: return None
        i = args.index(flag); val = args[i + 1]; del args[i:i + 2]
        return val
    prelude = opt('--prelude'); only = opt('--only')
    page = args[0]; width = int(args[1]) if len(args) > 1 else 1280
    res = asyncio.run(main(page, width, prelude, only))
    fails = 0; low = None
    for it, w in res:
        m = min(w.values()); need = 3 if it['large'] else 4.5
        if low is None or m - need < low[0]: low = (m - need, it['txt'], m, need)
        if m < need:
            fails += 1
            print(f"✕ {it['txt']:34s} away {w.get('away', 0):5.2f} · hover {w.get('over', 0):5.2f}  (need {need})")
    print(f"{os.path.basename(page)} @ {width}px — {len(res)} text elements, {fails} failing"
          + (f" · tightest: \"{low[1]}\" {low[2]:.2f}:1 (need {low[3]})" if low else ''))
    sys.exit(1 if fails else 0)
