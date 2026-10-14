/**
 * 2002 portrait: the real photograph as it is, background and all, in a white frame with a reflection; a gloss
 * sweep on hover. The glossy photo thumbnail of the Web 2.0 years. (A cut-out over the sky gel looked wrong: Shareef.)
 * The image is assets/portraits/2002.webp, made from the photo by scripts/build-portraits.py, and goes into the page
 * as a data URI like the sprites do, so an era page stays one file. The 8-bit portrait belongs to 1995; this era
 * stopped borrowing it (Shareef's call).
 * Shared by every 2002 page that shows the portrait (home, about).
 *   portraitMarkup(portrait) → the element; portraitScript → nothing to draw now that it's an image
 */
import fs from 'node:fs';
import { esc } from './layout.mjs';

const PHOTO = 'data:image/webp;base64,' + fs.readFileSync(new URL('../../assets/portraits/2002.webp', import.meta.url)).toString('base64');

export const portraitMarkup = portrait => `<div class="photo" tabindex="0" role="img" aria-label="${esc(portrait.photoAlt)}">
          <img src="${PHOTO}" width="400" height="600" alt="">
          <span class="shine" aria-hidden="true"></span>
        </div>`;

export const portraitScript = '';
