#!/usr/bin/env node
/**
 * Builds design-reference/all-eras.html — ONE self-contained file holding every
 * built era page, with a switcher and a phone-width toggle, for comparing eras.
 * A review tool: every page of every era (home, work, about, the 9 case studies) in one file, with era / page /
 * phone-width toggles. Links inside a page work too — nav, year switcher (with its arrival effect), case-study
 * links, next story — because the tool catches them and swaps the page, since a single file can't navigate.
 * Each era's <style> is stored once and put back when a page is shown, which keeps the file small.
 *
 * Usage:  node scripts/build-switcher.mjs   (run build-eras.mjs first)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'design-reference', 'eras');
const site = JSON.parse(fs.readFileSync(path.join(root, 'content', 'site.json'), 'utf8'));
const ORDER = site.eras.items.map(e => e.id);
const LABEL = Object.fromEntries(site.eras.items.map(e => [e.id, `${e.year} · ${e.name}`]));
// inside the tool, links don't navigate: site links (/, /work, /about, ?era=) are handed to the tool, which swaps the page
const CATCH = `<script>window.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(h.charAt(0)!=='/')return;var u=new URL(h,'https://x');e.preventDefault();e.stopImmediatePropagation();if(u.pathname==='/'&&u.hash&&!u.search){var t=document.querySelector(u.hash);if(t){t.scrollIntoView();return}}parent.postMessage({era:u.searchParams.get('era'),path:u.pathname},'*');},true);<\/script>`;
const ARRIVE = `<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('era-arrive');setTimeout(function(){document.documentElement.classList.remove('era-arrive')},1600)}<\/script>`;
const PAGES = [['/', '', 'Home'], ['/work', '-work', 'Work'], ['/about', '-about', 'About']];
const STUDIES = fs.readdirSync(path.join(root, 'content', 'studies')).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(root, 'content', 'studies', f), 'utf8')));
const ROUTES = [...PAGES.map(([p, suf]) => [p, suf]), ...STUDIES.map(st => [st.url, `-study-${st.id}`])];
const ids = ORDER.filter(id => fs.existsSync(path.join(dir, `${id}.html`)));
const pages = {}, styles = {};
for (const id of ids) for (const [, suf] of ROUTES) {
  const f = path.join(dir, `${id}${suf}.html`); if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8').replace('<body>', '<body>' + CATCH).replace(/src="captures\/([^"]+)"/g, 'src="@@cap:$1@@"');   // prototype stills: stored once below, so the file works on its own
  html = html.replace(/<style>([\s\S]*?)<\/style>/, (_, css) => {   // store each distinct stylesheet once
    let k = Object.keys(styles).find(k => styles[k] === css); if (!k) { k = 's' + Object.keys(styles).length; styles[k] = css; }
    return `<style data-css="${k}"></style>`; });
  pages[id + suf] = html;
}
const capDir = path.join(dir, 'captures'), caps = {};
if (fs.existsSync(capDir)) for (const f of fs.readdirSync(capDir).filter(f => f.endsWith('.png'))) caps[f] = 'data:image/png;base64,' + fs.readFileSync(path.join(capDir, f)).toString('base64');
const json = JSON.stringify({ pages, styles, caps }).replace(/<\//g, '<\\/');   // keep "</script>" inside pages from closing this script
const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>All eras — Shareef Padar</title>
<style>
*{box-sizing:border-box} body{margin:0;font:14px/1.4 system-ui,sans-serif;background:#111;color:#eee;height:100vh;display:flex;flex-direction:column}
.bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 12px;background:#1b1b1f;border-bottom:1px solid #333}
.bar b{margin:0 4px 0 8px;font-weight:600;color:#aaa}
.bar b:first-child{margin-left:0}
button{min-height:40px;padding:8px 14px;border-radius:8px;border:1px solid #444;background:#26262b;color:#eee;font:inherit;cursor:pointer}
button[aria-pressed=true]{background:#CDF22B;color:#111;border-color:#CDF22B;font-weight:700}
button:focus-visible{outline:3px solid #9FB0FF;outline-offset:2px}
.sp{flex:1}
.stage{flex:1;display:flex;justify-content:center;background:#2a2a2e;overflow:auto}
iframe{border:0;width:100%;height:100%;background:#fff}
.phone iframe{width:390px;border-left:1px solid #444;border-right:1px solid #444}
</style></head><body>
<div class="bar" role="toolbar" aria-label="Preview">
  <b>Era</b>
  ${ids.map(id => `<button data-era="${id}" aria-pressed="${id === site.eras.default}">${LABEL[id]}</button>`).join('\n  ')}
  <b>Page</b>
  ${PAGES.map(([p, suf, label]) => `<button data-page="${suf}" aria-pressed="${suf === ''}">${label}</button>`).join('\n  ')}
  <span class="sp"></span>
  <button id="w" aria-pressed="false">Phone width</button>
</div>
<div class="stage" id="stage"><iframe id="f" title="Era preview"></iframe></div>
<script type="application/json" id="pages">${json}</script>
<script>
const { pages, styles, caps } = JSON.parse(document.getElementById('pages').textContent), f = document.getElementById('f');
const SUF = ${JSON.stringify(Object.fromEntries(ROUTES))};
const build = k => pages[k].replace(new RegExp('<style data-css="(s\\\\d+)"></' + 'style>'), (_, s) => '<style>' + styles[s] + '</' + 'style>').replace(/@@cap:([^@]+)@@/g, (_, f) => caps[f] || '');
const ARRIVE = ${JSON.stringify(ARRIVE).replace(/<\//g, '<\\/')};
let era = ${JSON.stringify(site.eras.default)}, page = '';
function show(e, p, arrive) {
  if (!pages[e + p]) p = '';   // that era doesn't have the page yet → its home
  era = e; page = p;
  const html = build(e + p); f.srcdoc = arrive ? html.replace('<head>', '<head>' + ARRIVE) : html;
  document.querySelectorAll('[data-era]').forEach(b => b.setAttribute('aria-pressed', b.dataset.era === e));
  document.querySelectorAll('[data-page]').forEach(b => b.setAttribute('aria-pressed', b.dataset.page === p || (b.dataset.page === '-work' && p.startsWith('-study-'))));
}
document.querySelectorAll('[data-era]').forEach(b => b.addEventListener('click', () => show(b.dataset.era, page)));
document.querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => show(era, b.dataset.page)));
// links inside a page: its year switcher (with the arrival effect) and its nav
addEventListener('message', e => { if (e.source !== f.contentWindow || !e.data) return; const p = SUF[e.data.path];
  if (e.data.era) show(e.data.era, p ?? '', true); else if (p !== undefined) show(era, p); });
document.getElementById('w').addEventListener('click', e => { const on = document.getElementById('stage').classList.toggle('phone'); e.currentTarget.setAttribute('aria-pressed', on); });
show(era, '');
</script></body></html>`;
fs.writeFileSync(path.join(root, 'design-reference', 'all-eras.html'), html);
console.log(`✓ design-reference/all-eras.html — ${ids.length} eras, ${Object.keys(pages).length} pages, ${Object.keys(styles).length} stylesheets (${(html.length / 1024).toFixed(0)} KB)`);
