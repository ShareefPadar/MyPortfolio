/**
 * 2014 portrait: Shareef's own vector illustration of himself, in a circle with a faint ring and Material's paper
 * shadow: the flat-design avatar of 2014. (He supplied it after a long-shadow cut-out, the plain photo and a traced
 * drawing all missed.) Hidden below 768px, like every era's portrait.
 * The image is assets/portraits/2014.webp, cropped from his file by scripts/build-portraits.py, and goes into the
 * page as a data URI like the sprites do. The 8-bit portrait
 * belongs to 1995; this era stopped borrowing it (Shareef's call). The chat head's small face is in layout.mjs.
 * Shared by every 2014 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → nothing to draw now that it's an image
 */
import fs from 'node:fs';
import { esc } from './layout.mjs';

const AVATAR = 'data:image/webp;base64,' + fs.readFileSync(new URL('../../assets/portraits/2014.webp', import.meta.url)).toString('base64');

export const portraitMarkup = portrait => `<div class="avatar" role="img" aria-label="${esc(portrait.photoAlt)}"><img src="${AVATAR}" width="640" height="640" alt=""></div>`;

export const portraitScript = '';
