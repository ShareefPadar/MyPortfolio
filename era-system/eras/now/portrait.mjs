/**
 * Now portrait: the real pixels, crisp, standing in a glass well like the other content panels.
 * Shared by every now page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → draws it (runs inside the layout's script, where P and decodePortrait exist)
 */
import { esc } from './layout.mjs';

export const portraitMarkup = portrait => `<figure class="portrait" role="img" aria-label="${esc(portrait.alt)}">
      <canvas width="96" height="144" aria-hidden="true"></canvas>
    </figure>`;

export const portraitScript = `
  // ── portrait: the real pixels, crisp ──
  (() => {
    const D = decodePortrait(P, true);
    for (const cv of document.querySelectorAll('.portrait canvas')) {
      cv.width = D.W; cv.height = D.H;
      const x = cv.getContext('2d'), im = x.createImageData(D.W, D.H);
      D.px.forEach((k, i) => { if (!D.clear[i]) im.data.set([...D.rgb[k], 255], i * 4); });
      x.putImageData(im, 0, 0);
    }
  })();
`;
