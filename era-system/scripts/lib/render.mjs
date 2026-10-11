/**
 * What every build needs to render an era page, in one place:
 *   loadInputs(root)            → { content, icons, portrait, sprites1995, inlineSprites, eras }
 *   eraContent(content, era)    → content with that era's own helper (content.guides[era]) as `guide`; 1995 and 2002 keep content.guide
 *   renderPage(inputs, era, page, { assetBase })  → the page's full HTML
 * eras = { <era>: [{ file, suffix, url, args }] } — which pages each era has (home, work, about, every case study).
 * Used by build-eras.mjs (previews) and build-site.mjs (the real site).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadContent } from './content.mjs';

const PAGES = [['page.mjs', '', '/'], ['work.mjs', '-work', '/work'], ['about.mjs', '-about', '/about']];

export function loadInputs(root) {
  const content = loadContent(root);
  const portrait = JSON.parse(fs.readFileSync(path.join(root, 'content', 'portrait.json'), 'utf8'));
  const sprites1995 = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'sprites-1995.json'), 'utf8'));
  const icons = {};
  for (const f of fs.readdirSync(path.join(root, 'assets', 'icons')).filter(f => f.endsWith('.json'))) {
    const set = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'icons', f), 'utf8')), out = {};
    for (const [name, def] of Object.entries(set.icons)) {
      if (f === 'brands.json') out[name] = `<svg aria-hidden="true" viewBox="${def.viewBox}" fill="currentColor"><path d="${def.d}"/></svg>`;
      else if (set.type === 'stroke') out[name] = `<svg aria-hidden="true" viewBox="0 0 ${set.viewBox} ${set.viewBox}" fill="none" stroke="currentColor" stroke-width="${set.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${def}</svg>`;
      else { let r = ''; def.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === 'X') r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
        out[name] = `<svg aria-hidden="true" viewBox="0 0 8 8" shape-rendering="crispEdges" fill="currentColor">${r}</svg>`; }
    }
    icons[f.replace('.json', '')] = out;
  }
  const inlineSprites = t => t.replace(/url\((\/sprites\/[^)]+\.svg)\)/g, (_, u) =>
    `url("data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public', u)).toString('base64')}")`);
  const erasDir = path.join(root, 'eras'), eras = {};
  for (const id of fs.readdirSync(erasDir).filter(d => fs.existsSync(path.join(erasDir, d, 'page.mjs')))) {
    const pages = PAGES.filter(([f]) => fs.existsSync(path.join(erasDir, id, f))).map(([file, suffix, url]) => ({ file, suffix, url, args: {} }));
    if (fs.existsSync(path.join(erasDir, id, 'study.mjs')))
      for (const st of Object.values(content.studies)) pages.push({ file: 'study.mjs', suffix: `-study-${st.id}`, url: st.url, args: { study: st.id } });
    eras[id] = pages;
  }
  return { root, content, icons, portrait, sprites1995, inlineSprites, eras };
}

export const eraContent = (content, id) => content.guides?.[id] ? { ...content, guide: content.guides[id] } : content;

export async function renderPage(I, era, page, { assetBase = '' } = {}) {
  const dir = path.join(I.root, 'eras', era);
  const mod = await import(pathToFileURL(path.join(dir, page.file)).href);
  const extra = (mod.meta?.styles ?? []).map(f => `/* ── ${f} ── */\n` + fs.readFileSync(path.join(I.root, f), 'utf8'));
  const css = I.inlineSprites([...extra, fs.readFileSync(path.join(dir, 'style.css'), 'utf8')].join('\n'));
  return mod.default({ content: eraContent(I.content, era), icons: I.icons, css, assetBase, portrait: I.portrait, sprites1995: I.sprites1995, pageUrl: page.url, ...page.args });
}
