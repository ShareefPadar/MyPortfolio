#!/usr/bin/env node
/**
 * The cross-era guard. Eras may look nothing alike, but every era page
 * must render every piece of shared content: all text, every link, the email.
 *
 * Text is checked exactly as written in content/site.json — so capitals
 * typed into markup fail (eras capitalise with CSS, never in content).
 *
 * Usage:  node scripts/check-content.mjs [dir]   (default design-reference/eras)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './lib/content.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const c = loadContent(root);
const dir = process.argv[2] ?? path.join(root, 'design-reference', 'eras');

// what every era must show
// every page: nav + footer basics. Full footer (connect block) everywhere except case studies, which use a compact one (as on live)
const chromeBase = { texts: [...c.nav.map(n => n.label), c.ctas.resume.label, c.footer.status, c.footer.credit, c.ui.backToTop,
                       c.eras.label, c.eras.shake.hint, c.eras.shake.enable, ...c.eras.items.flatMap(e => [e.year, e.name])],   // the era switcher is on every page
                     hrefs: [...c.nav.map(n => n.href), c.ctas.resume.href] };
const chromeFull = { texts: [c.footer.heading, c.footer.intro, c.footer.email, ...c.footer.socials.map(s => s.label), c.ui.copyEmail],
                     hrefs: [`mailto:${c.footer.email}`, ...c.footer.socials.map(s => s.href)] };
const A = c.about;
const strip = h => String(h ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const studySpec = st => {
  const H = st.head, texts = [H.number, H.label, H.title, ...H.meta.flatMap(m => [m.k, m.v]), strip(H.lead), H.statement && strip(H.statement)];
  if (H.outcome) texts.push(H.outcome.label, strip(H.outcome.text));
  const hrefs = [], images = [];
  for (const b of st.blocks) {
    if (['p', 'quote'].includes(b.type)) texts.push(strip(b.html));
    if (b.cite) texts.push(strip(b.cite));
    if (['h2', 'h3'].includes(b.type)) texts.push(b.text);
    if (b.type === 'pre') texts.push(strip(b.text));
    if (b.type === 'ul' || b.type === 'ol') texts.push(...b.items.map(strip));
    if (b.type === 'callout') texts.push(b.label, ...b.paras.map(strip));
    if (b.type === 'short') texts.push(b.tab, b.note, ...b.rows.flatMap(r => [r.k, strip(r.v)]));
    if (b.type === 'figure') { texts.push(strip(b.caption)); images.push(...b.images.map(i => i.src)); }
    if (b.type === 'gallery') { texts.push(strip(b.caption), ...b.items.flatMap(i => [i.label, i.badge])); images.push(...b.items.map(i => i.src)); }
    if (b.type === 'prototype') texts.push(b.label, b.url, b.caption);
    for (const m of [b.html, b.cite, ...(b.paras ?? []), ...(b.items ?? []), ...(b.rows ?? []).map(r => r.v)].join(' ').matchAll(/href="([^"]+)"/g)) hrefs.push(m[1]);
  }
  if (st.ending) { texts.push(st.ending.heading, st.ending.text, ...st.ending.links.map(l => l.label)); hrefs.push(...st.ending.links.map(l => l.href)); }
  texts.push(st.next.label, st.next.title); hrefs.push(st.next.href, '/work');
  return { texts: texts.filter(Boolean), hrefs, images };
};
const PAGES = {
  about: {
    texts: [A.heading, A.lead, ...A.body, A.principles.heading, ...A.principles.items.flatMap(i => [i.title, i.text]),
      A.experience.heading, ...A.experience.items.flatMap(i => [i.role, i.dates, i.company, i.text]), A.education, A.quote, A.contactLabel],
    hrefs: [],
    images: [],
  },
  home: {
    texts: [c.person.eyebrow, `${c.person.statement.before} ${c.person.statement.accent}`, c.person.lead, c.ctas.primary.label,
      c.guide.sections.hero, c.selectedWork.heading,
      ...c.selectedWork.items.flatMap(w => [w.domain, w.status, w.title, w.meta, w.summary]),
      c.nda.label, c.nda.text, c.nda.link.label, c.live.heading,
      ...c.live.items.flatMap(l => [l.tag, l.status, l.title, l.meta, l.summary]),
      c.ui.readCaseStudy, c.ui.caseStudy, c.ui.launchApp],
    hrefs: [c.ctas.primary.href, ...c.selectedWork.items.map(w => w.href), c.nda.link.href, ...c.live.items.flatMap(l => [l.caseStudy, l.launch])],
    images: c.selectedWork.items.map(w => w.image),
  },
  work: {
    texts: [c.workIndex.heading, c.workIndex.intro, c.workIndex.back.label, c.workIndex.allLabel, ...c.workIndex.filters,
      ...c.workIndex.groups.map(g => g.heading),
      ...c.workIndex.groups.flatMap(g => g.items.flatMap(p => [p.domain, p.status, p.title, p.meta, ...(g.compact ? [] : [p.summary])])),
      c.ui.readCaseStudy],
    hrefs: [c.workIndex.back.href, ...c.workIndex.groups.flatMap(g => g.items.map(p => p.href))],
    images: c.workIndex.groups.flatMap(g => g.items.filter(p => p.image).map(p => p.image)),
  },
};

// the era's easter-egg game, at the end of its home page (content.games[era]); 1995's is live's Dino Runner
const GAME_PENDING = [];
const gameSpec = era => {
  const g = c.games[era]; if (!g || GAME_PENDING.includes(era)) return [];
  const t = [g.title, g.start.pointer, g.start.touch, g.hint.keys, g.hint.touch];
  if (g.over) t.push(g.over, g.again.keys, g.again.touch);
  return t;
};

const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const visibleText = html => decode(html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ');

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html') : [];
if (!files.length) { console.error(`✕ no era pages in ${dir} — run build-eras.mjs`); process.exit(1); }

let failed = false;
for (const f of files) {
  const sm = f.match(/-study-([a-z0-9-]+)\.html$/);
  const kind = sm ? 'study' : f.endsWith('-work.html') ? 'work' : f.endsWith('-about.html') ? 'about' : f.includes('-') ? null : 'home';
  if (!kind) continue;
  const spec = sm ? studySpec(c.studies[sm[1]]) : PAGES[kind];
  const chrome = sm ? chromeBase : { texts: [...chromeBase.texts, ...chromeFull.texts], hrefs: [...chromeBase.hrefs, ...chromeFull.hrefs] };
  const era = f.replace(/-.*$/, '').replace('.html', ''), G = c.guides?.[era] ?? c.guide;
  const guideTexts = kind === 'home' ? [G.sections.hero] : [];   // the era's own helper opens the home page
  const texts = [...chrome.texts, ...spec.texts.filter(t => t !== c.guide.sections.hero), ...guideTexts, ...(kind === 'home' ? gameSpec(f.replace('.html', '')) : [])], hrefs = [...chrome.hrefs, ...spec.hrefs], images = spec.images;
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const text = visibleText(html);
  const missingText = texts.filter(t => !text.includes(t.replace(/\s+/g, ' ')));
  const missingHref = hrefs.filter(h => !html.includes(`href="${h.replace(/&/g, '&amp;')}"`) && !html.includes(`href="${h}"`));
  const missingImg = images.filter(i => !html.includes(i));
  // the helper's name: shown, or at least its label (2002's Clippy, like Office's, has no title on his balloon)
  if (kind === 'home' && !text.includes(G.name) && !html.includes(`aria-label="${G.name}"`)) { console.error(`  ✕ guide name: ${G.name}`); failed = true; }
  // era switcher: one link per year, each keeping this page's path
  const here = sm ? c.studies[sm[1]].url : { home: '/', work: '/work', about: '/about' }[kind];
  c.eras.items.filter(e => !html.includes(`href="${here}?era=${e.id}"`)).forEach(e => { console.error(`  ✕ era switcher: no link to ${here}?era=${e.id}`); failed = true; });
  // head: the page's own title, a description, a share image, the icon, the Person profile
  const st = sm ? c.studies[sm[1]] : null, want = st ? st.pageTitle : c.meta.pages[{ home: '/', work: '/work', about: '/about' }[kind]].title;
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '');
  const head = [[title === want, `title "${title}" ≠ "${want}"`], [/<meta name="description" content="[^"]+"/.test(html), 'description'],
    [/<meta property="og:image" content="https:[^"]+"/.test(html), 'og:image'], [/<link rel="icon"/.test(html), 'icon'], [html.includes('"@type":"Person"'), 'JSON-LD Person']];
  head.filter(([ok]) => !ok).forEach(([, what]) => { console.error(`  ✕ head: ${what}`); failed = true; });
  console.log(`\n${f.replace('.html', '')}  ${texts.length - missingText.length}/${texts.length} text · ${hrefs.length - missingHref.length}/${hrefs.length} links · ${images.length - missingImg.length}/${images.length} images`);
  missingText.forEach(t => { console.error(`  ✕ missing text: "${t.slice(0, 70)}"`); failed = true; });
  missingHref.forEach(h => { console.error(`  ✕ missing link: ${h}`); failed = true; });
  missingImg.forEach(i => { console.error(`  ✕ missing image: ${i}`); failed = true; });
}
console.log(failed ? '\n✕ Content check failed\n' : '\n✓ Every era renders all shared content\n');
process.exit(failed ? 1 : 0);
