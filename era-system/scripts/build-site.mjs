#!/usr/bin/env node
/**
 * Builds the era pages the real site serves: every page of 1986, 2002, 2014 and Now as static HTML in
 * <repo>/public/_eras/<era>/, at the same paths as the live pages:
 *   /            → _eras/<era>/index.html
 *   /work        → _eras/<era>/work.html
 *   /about       → _eras/<era>/about.html
 *   /work/<slug> → _eras/<era>/work/<slug>.html
 * 1995 is not built here: 1995 IS the live Next.js site. proxy.ts (repo root) picks the era from the
 * `era` cookie (set by any ?era= link) and rewrites a page request to the file above; no cookie → 1995.
 *
 * Runs before `next dev` and `next build` (package.json predev / prebuild). Output is generated, not committed.
 * Usage:  node era-system/scripts/build-site.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInputs, renderPage } from './lib/render.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '..', 'public', '_eras');
const LIVE = '1995';
const I = loadInputs(root);

const fileFor = url => url === '/' ? 'index.html' : url.replace(/^\//, '') + '.html';
// Vercel Web Analytics for plain HTML pages, so era visits count like the live site's
const analytics = `<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script><script defer src="/_vercel/insights/script.js"></script>`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'captures'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'assets', 'captures'))) fs.copyFileSync(path.join(root, 'assets', 'captures', f), path.join(out, 'captures', f));

let n = 0;
for (const [era, pages] of Object.entries(I.eras)) {
  if (era === LIVE) continue;
  for (const page of pages) {
    const html = (await renderPage(I, era, page, { assetBase: '' }))
      .replaceAll('src="captures/', 'src="/_eras/captures/')   // prototype stills sit beside the eras, not beside each page
      .replace('</body>', analytics + '\n</body>');
    const file = path.join(out, era, fileFor(page.url));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    n++;
  }
}
console.log(`✓ era pages for the site: ${n} pages (${Object.keys(I.eras).filter(e => e !== LIVE).join(', ')}) → public/_eras/ · ${LIVE} is the live site · default ${I.content.eras.default}`);
