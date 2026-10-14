/**
 * 1986 portrait: the photograph the way a 1986 screen could show it. One bit a pixel, Atkinson's dither (the one
 * MacPaint shipped with), 96×144 at 2×, head and hand: the lit pixels in the palest blue over the silhouette in the
 * screen's mid blue. No hover state (Shareef's call).
 * The bitmap is assets/portraits/1986.json, made from the photo by scripts/build-portraits.py. The 8-bit portrait
 * belongs to 1995; this era stopped borrowing it (Shareef's call).
 * Shared by every 1986 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → draws it (runs inside the layout's script)
 */
import fs from 'node:fs';
import { esc } from './layout.mjs';

const B = JSON.parse(fs.readFileSync(new URL('../../assets/portraits/1986.json', import.meta.url), 'utf8'));

export const portraitMarkup = portrait => `<div class="portrait" role="img" aria-label="${esc(portrait.alt)}">
        <canvas width="${B.w}" height="${B.h}" aria-hidden="true"></canvas>
        <span class="p1" aria-hidden="true">1P</span>
      </div>`;

export const portraitScript = `
  // ── portrait: one bit a pixel, pale ink over the silhouette in mid blue ──
  (() => {
    const W = ${B.w}, H = ${B.h}, bits = s => { const b = atob(s); return i => b.charCodeAt(i >> 3) >> (7 - (i & 7)) & 1; };
    const mask = bits('${B.mask}'), ink = bits('${B.ink}');
    const cv = document.querySelector('.portrait canvas'), x = cv.getContext('2d'), im = x.createImageData(W, H);
    for (let i = 0; i < W * H; i++) if (mask(i)) im.data.set(ink(i) ? [242, 242, 255, 255] : [52, 52, 122, 255], i * 4);
    x.putImageData(im, 0, 0);
  })();
`;
