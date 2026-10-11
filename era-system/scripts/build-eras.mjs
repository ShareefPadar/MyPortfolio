#!/usr/bin/env node
/**
 * Renders every page of every era from shared content:
 *   eras/<id>/page.mjs  → design-reference/eras/<id>.html        (home)
 *   eras/<id>/work.mjs  → design-reference/eras/<id>-work.html   (work index)
 *   (about.mjs, study.mjs follow the same pattern)
 *
 * Each era owns its layout and components; content/site.json is the only shared input
 * (resolved by scripts/lib/content.mjs). check-content.mjs proves nothing was dropped.
 *
 * Previews keep real site URLs in the HTML (href="/work") and add a small router so
 * links move between the built preview pages.
 *
 * Usage:  node scripts/build-eras.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInputs, renderPage } from './lib/render.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const I = loadInputs(root), content = I.content;
const assetBase = 'https://www.shareefpadar.com';   // previews load images from the live site
const outDir = path.join(root, 'design-reference', 'eras');
fs.mkdirSync(path.join(outDir, 'captures'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'assets', 'captures'))) fs.copyFileSync(path.join(root, 'assets', 'captures', f), path.join(outDir, 'captures', f));   // prototype stills
const ERAS = Object.fromEntries(Object.entries(I.eras).map(([id, pages]) => [id, pages.map(p => [p.file, p.suffix, p.url, p.args, p])]));
const ALL = Object.fromEntries(Object.entries(ERAS).map(([id, pages]) => [id, Object.fromEntries(pages.map(([, suf, url]) => [url, `${id}${suf}.html`]))]));

// preview-only router: real URLs stay in the HTML ("/work", "/work?era=1986"). Same-era links go to that era's
// page; ?era= links go to the same page in the other era, or to its home if that page isn't built there yet.
const router = id => `<script>/* preview router */(()=>{const A=${JSON.stringify(ALL)},here=${JSON.stringify(id)};
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');if(!h.startsWith('/'))return;
const u=new URL(h,'https://x'),era=u.searchParams.get('era'),R=A[era||here]||{};let t=R[u.pathname];if(!t&&era)t=R['/'];
if(t){e.preventDefault();location.href=t+(u.hash||'');}});})();</script>`;

const built = [];
for (const [id, pages] of Object.entries(ERAS)) {
  for (const [, suf, , , page] of pages) {
    const html = (await renderPage(I, id, page, { assetBase })).replace('</body>', router(id) + '\n</body>');
    fs.writeFileSync(path.join(outDir, `${id}${suf}.html`), html);
    built.push(`${id}${suf}`);
  }
}

// index.html: where a visit lands — the year you picked last time, else the default era
fs.writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html><meta charset="utf-8"><title>${content.person.name}</title>
<script>var e;try{e=localStorage.getItem('era')}catch(_){}var ok=${JSON.stringify(Object.keys(ERAS))};
location.replace((ok.indexOf(e)>-1?e:${JSON.stringify(content.eras.default)})+'.html');</script>
<noscript><a href="${content.eras.default}.html">${content.person.name}</a></noscript>
`);
const studies = built.filter(b => b.includes('-study-')).length;
console.log(`✓ built ${built.length} page(s) + index.html (default: ${content.eras.default}): ${built.filter(b => !b.includes('-study-')).join(', ')}${studies ? ` + ${studies} case studies` : ''} → design-reference/eras/`);
