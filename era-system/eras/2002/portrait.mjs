/**
 * 2002 portrait: the real pixels drawn smooth over a sky gel, in a white frame with a reflection; a gloss sweep on hover.
 * Shared by every 2002 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → draws it (runs inside the layout's script, where P and decodePortrait exist)
 */
import { esc } from './layout.mjs';

export const portraitMarkup = portrait => `<div class="photo" tabindex="0" role="img" aria-label="${esc(portrait.alt)}">
          <canvas width="96" height="144" aria-hidden="true"></canvas>
          <span class="shine" aria-hidden="true"></span>
        </div>`;

export const portraitScript = `
  // ── portrait: real pixels, drawn smooth over a sky gel (background pixels stay clear) ──
  (() => {
    const D = decodePortrait(P, true), cv = document.querySelector('.photo canvas'), x = cv.getContext('2d'), im = x.createImageData(D.W, D.H);
    D.px.forEach((k, i) => { if (!D.clear[i]) im.data.set([...D.rgb[k], 255], i * 4); });
    x.putImageData(im, 0, 0);
  })();
`;
