/**
 * 2014 portrait: five flat colours, a circle crop, and a 45° long shadow cast by the silhouette.
 * Shared by every 2014 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → draws it (runs inside the layout's script, where P and decodePortrait exist)
 */
import { esc } from './layout.mjs';

export const portraitMarkup = portrait => `<div class="avatar" role="img" aria-label="${esc(portrait.alt)}"><canvas width="128" height="128" aria-hidden="true"></canvas></div>`;

export const portraitScript = `
  // ── portrait: five flat colours, a circle crop, and a long shadow cast by the silhouette ──
  (() => {
    const D = decodePortrait(P, true), cv = document.querySelector('.avatar canvas'), x = cv.getContext('2d'), S = cv.width;
    const FLAT = { ink: [38, 50, 56], hair: [62, 39, 35], shade: [191, 106, 52], skin: [244, 168, 96], light: [255, 224, 178] };
    const flat = ([r, g, b]) => { const l = (.2126*r + .7152*g + .0722*b) / 255, sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (l < .1) return FLAT.ink; if (l < .3) return sat > 30 ? FLAT.hair : FLAT.ink; if (l < .55) return FLAT.shade; if (l < .8) return FLAT.skin; return FLAT.light; };
    const ox = Math.round((S - D.W) / 2), oy = 10;   // head-and-shoulders crop
    const im = x.createImageData(S, S);
    const put = (X, Y, c) => { if (X < 0 || Y < 0 || X >= S || Y >= S) return; im.data.set([...c, 255], (Y * S + X) * 4); };
    for (let k = 140; k >= 1; k--) for (let i = 0; i < D.W * D.H; i++) if (!D.clear[i]) put(ox + i % D.W + k, oy + Math.floor(i / D.W) + k, [15, 88, 171]);
    for (let i = 0; i < D.W * D.H; i++) if (!D.clear[i]) put(ox + i % D.W, oy + Math.floor(i / D.W), flat(D.rgb[D.px[i]]));
    x.putImageData(im, 0, 0);
  })();
`;
