/**
 * 1986 portrait: the real pixels at half resolution in four screen blues; hover / focus swaps to NES colours.
 * Shared by every 1986 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → draws it (runs inside the layout's script, where P and decodePortrait exist)
 */
import { esc } from './layout.mjs';

export const portraitMarkup = portrait => `<div class="portrait" tabindex="0" role="img" aria-label="${esc(portrait.alt)}">
        <canvas class="tones" width="48" height="72" aria-hidden="true"></canvas>
        <canvas class="nes" width="48" height="72" aria-hidden="true"></canvas>
        <span class="p1" aria-hidden="true">1P</span>
      </div>`;

export const portraitScript = `
  // ── portrait: half resolution, four tones of the screen's own blues; NES palette swap on hover ──
  (() => {
    const D = decodePortrait(P, true), w = D.W / 2, h = D.H / 2;
    const hex = x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4), 16)];
    const TONES = ['0C0C24', '34347A', 'A6A6E0', 'F2F2FF'].map(hex);
    const NES = ['000000','7C7C7C','BCBCBC','F8F8F8','A81000','E45C10','F8B800','FCE0A8','503000','AC7C00','F87858','0058F8','3CBCFC','00A800','B8F818','F8D878'].map(hex);
    const near = c => NES.reduce((b, p) => { const d = (p[0]-c[0])**2 + (p[1]-c[1])**2 + (p[2]-c[2])**2; return d < b[0] ? [d, p] : b; }, [1e9, NES[0]])[1];
    const cells = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let n = 0, r = 0, g = 0, b = 0;
      for (const [dx, dy] of [[0,0],[1,0],[0,1],[1,1]]) { const i = (y*2+dy) * D.W + x*2+dx; if (D.clear[i]) continue; const c = D.rgb[D.px[i]]; r += c[0]; g += c[1]; b += c[2]; n++; }
      cells.push(n < 2 ? null : [r/n, g/n, b/n]);
    }
    const draw = (sel, f) => { const cv = document.querySelector('.portrait ' + sel), x = cv.getContext('2d'), im = x.createImageData(w, h);
      cells.forEach((c, i) => { if (c) im.data.set([...f(c), 255], i * 4); }); x.putImageData(im, 0, 0); };
    draw('.tones', c => { const l = (.2126*c[0] + .7152*c[1] + .0722*c[2]) / 255; return TONES[l < .16 ? 0 : l < .4 ? 1 : l < .72 ? 2 : 3]; });
    draw('.nes', near);
  })();
`;
