#!/usr/bin/env node
/**
 * Generates design-reference/era-preview.html — a self-contained page that
 * renders the same markup in every built era, styled ONLY by the real files:
 *
 *   styles/core.css + styles/eras/<era>.css + styles/eras/<era>.sprites.css
 *   public/sprites/**  (inlined as data URIs)
 *   assets/icons/pixel.json (inlined as SVG)
 *
 * The page's own layout CSS uses core spacing tokens only. If the preview
 * looks wrong, a token is wrong — fix the era file and rebuild, never the preview.
 *
 * Usage:  node scripts/build-preview.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');
const erasDir = path.join(root, 'styles', 'eras');

const ORDER = ['1986', '1995', '2002', '2014', 'now'];
const eras = ORDER.filter(e => fs.existsSync(path.join(erasDir, `${e}.css`)));

const inlineSprites = css => css.replace(/url\((\/sprites\/[^)]+\.svg)\)/g, (_, u) => {
  const svg = fs.readFileSync(path.join(root, 'public', u));
  return `url("data:image/svg+xml;base64,${svg.toString('base64')}")`;
});

let css = read('styles', 'core.css') + '\n';
for (const e of eras) {
  css += `\n/* ═════ ${e} ═════ */\n` + read('styles', 'eras', `${e}.css`) + '\n';
  const sp = path.join(erasDir, `${e}.sprites.css`);
  if (fs.existsSync(sp)) css += inlineSprites(fs.readFileSync(sp, 'utf8')) + '\n';
}

// every icon set, pre-rendered; the page swaps sets when --icon-set changes
const iconSets = {};
for (const f of fs.readdirSync(path.join(root, 'assets', 'icons')).filter(f => f.endsWith('.json'))) {
  const set = JSON.parse(read('assets', 'icons', f)), out = {};
  for (const [name, def] of Object.entries(set.icons)) {
    if (set.type === 'stroke') {
      out[name] = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 ${set.viewBox} ${set.viewBox}" fill="none" stroke="currentColor" stroke-width="${set.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${def}</svg>`;
    } else {
      let rects = '';
      def.forEach((row, y) => [...row].forEach((c, x) => { if (c === 'X') rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
      out[name] = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 8 8" shape-rendering="crispEdges" fill="currentColor">${rects}</svg>`;
    }
  }
  iconSets[f.replace('.json', '')] = out;
}
const icon = name => `<span class="pv-ic" data-icon="${name}"></span>`;

const html = `<!DOCTYPE html>
<html lang="en" data-era="${eras.includes('1995') ? '1995' : eras[0]}" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Era preview — generated from real tokens</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@400;500;600&family=Montserrat:wght@300;600&family=Oswald:wght@400&family=Open+Sans:wght@400;500;600&family=Nunito:wght@700;800&family=Nunito+Sans:wght@400;500;600;700&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500;600&family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&display=swap" rel="stylesheet">
<style>
@font-face { font-family: 'Departure Mono'; font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2409-1@1.0/DepartureMono-Regular.woff2') format('woff2'); }
${css}

/* ═════ preview layout — core tokens only ═════ */
* { box-sizing: border-box; }
body { margin: 0; }
.pv-wrap { max-width: 1100px; margin: 0 auto; padding: 0 var(--s16); }
.pv-switch { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: var(--s8); align-items: center;
  padding: var(--s12) var(--s16); background: var(--bg-inverse); color: var(--text-inverse); border-bottom: var(--border-w) solid var(--outline); }
.pv-switch .t-micro { color: var(--text-inverse-muted); margin-right: var(--s8); }
.pv-nav { display: flex; align-items: center; gap: var(--s16); padding: var(--s8) var(--s12); margin: var(--s16) 0; }
.pv-nav .t-statement-m { margin-right: auto; }
.pv-nav a.t-label { color: var(--text); text-decoration: none; padding: var(--s8); }
.pv-nav a.is-current { background: var(--surface-sunk); box-shadow: var(--shadow-sunk); }
.pv-hero { padding: var(--s64) 0; }
.pv-hero-grid { display: grid; gap: var(--s32); align-items: center; }
@media (min-width: 900px) { .pv-hero-grid { grid-template-columns: 1.1fr .9fr; } }
.pv-hero h1 { margin: var(--s16) 0 var(--s24); }
.pv-hero em { font-style: normal; color: var(--accent); }
.pv-hero .t-lead { color: var(--text-inverse-muted); margin: 0 0 var(--s32); }
.pv-row { display: flex; flex-wrap: wrap; gap: var(--s12); align-items: center; }
.pv-portrait { margin: 0 auto; font-family: var(--font-label); line-height: 1; white-space: pre; user-select: none; }
.pv-section { padding: var(--s48) 0; }
.pv-section .marker { margin-bottom: var(--s24); }
.pv-grid { display: grid; gap: var(--s48) var(--s24); }
@media (min-width: 760px) { .pv-grid { grid-template-columns: 1fr 1fr; } }
.card { display: block; text-decoration: none; color: var(--text); margin-top: var(--s24); }
.pv-well { margin: var(--s12); aspect-ratio: 16 / 10; }
.pv-screen { width: 100%; height: 100%; background: #EEEDF8; display: grid; place-items: center; color: #6A6A8A;
  font: 12px system-ui, sans-serif; }            /* a product screenshot — content, not era styling */
.pv-body { background: var(--bg); border: var(--border-w) solid var(--outline); border-radius: var(--radius); margin: 0 var(--s12) var(--s12); padding: var(--s16); }
.pv-ic { display: inline-flex; }
.pv-nav a.t-label { border-radius: var(--radius); }
.pv-photo { display: block; margin: 0 auto; border-radius: calc(var(--radius) * 2); box-shadow: var(--shadow-raised); }
.pv-body .t-h3 { margin: var(--s8) 0 var(--s12); }
.pv-go { display: inline-flex; align-items: center; gap: var(--s8); color: var(--action); }
.pv-field { max-width: 380px; margin-bottom: var(--s24); }
.pv-bubbles { display: flex; flex-direction: column; gap: var(--s32); align-items: flex-start; }
.pv-bubbles .is-visitor { align-self: flex-end; }
.pv-sub { display: block; margin: var(--s32) 0 var(--s12); }
.callout .t-micro { color: var(--on-accent); display: block; margin-bottom: var(--s8); }
.callout p { margin: 0; font-size: 18px; font-weight: 500; line-height: 1.4; }
.pv-foot { padding: var(--s64) var(--s16); text-align: center; }
.pv-foot .t-statement-l { margin: var(--s16) 0; }
.pv-foot a { color: var(--accent); font-family: var(--font-label); font-size: var(--size-label); }
.pv-note { max-width: 60ch; margin: var(--s16) auto 0; color: var(--text-inverse-muted); }
</style>
</head>
<body>

<nav class="pv-switch bookend" aria-label="Change era">
  <span class="t-micro">ERA</span>
  ${eras.map(e => `<button class="btn frame-control" data-fill="surface" data-era-btn="${e}" aria-pressed="false">${e === "now" ? "Now" : e}</button>`).join('\n  ')}
</nav>

<div class="pv-wrap">
  <header class="pv-nav frame-raised">
    <span class="t-statement-m">Shareef</span>
    <a class="t-label is-current" href="#0">Work</a>
    <a class="t-label" href="#0">About</a>
    <span class="focusable"><a class="btn frame-control" data-fill="action" href="#0">Résumé ${icon('download')}</a></span>
  </header>
</div>

<section class="bookend pv-hero">
  <div class="pv-wrap pv-hero-grid">
    <div>
      <div class="t-micro">I'm Shareef Padar</div>
      <h1 class="t-statement-xl" id="hero">Senior product<br>designer who <em>ships.</em></h1>
      <p class="t-lead">Six years in B2B UX, from research to shipped interface. Based in Dubai.</p>
      <div class="pv-row">
        <span class="focusable"><a class="btn frame-control" data-fill="action" data-size="lg" href="#0">View work ${icon('arrowD')}</a></span>
        <span class="focusable"><a class="btn frame-control" data-fill="surface" href="#0">About</a></span>
      </div>
    </div>
    <pre class="pv-portrait" id="portrait" aria-hidden="true"></pre>
  </div>
</section>

<main class="pv-wrap">
  <section class="pv-section">
    <div class="marker reveal"><span class="t-numeral">01</span><span class="t-micro">Selected work</span><i></i></div>
    <div class="pv-grid">
      <a class="card frame-raised reveal" href="#0">
        <span class="tab is-relevant">Fintech</span>
        <div class="pv-well frame-sunk"><div class="pv-screen">[ Sanad screenshot ]</div></div>
        <div class="pv-body">
          <div class="t-label">Sanad · KYB onboarding</div>
          <div class="t-h3">Onboarding that feels fast without cutting corners</div>
          <span class="pv-go t-statement-m">Read ${icon('arrowR')}</span>
        </div>
      </a>
      <a class="card frame-raised reveal" href="#0">
        <span class="tab">Marketplace</span>
        <div class="pv-well frame-sunk"><div class="pv-screen">[ Cargoz screenshot ]</div></div>
        <div class="pv-body">
          <div class="t-label">Cargoz Connect</div>
          <div class="t-h3">Booking warehouse space in under 24 hours</div>
          <span class="pv-go t-statement-m">Read ${icon('arrowR')}</span>
        </div>
      </a>
    </div>
  </section>

  <section class="pv-section">
    <div class="marker reveal"><span class="t-numeral">02</span><span class="t-micro">Controls</span><i></i></div>
    <div class="pv-row">
      <span class="focusable"><button class="btn frame-control" data-fill="action">Primary</button></span>
      <span class="focusable"><button class="btn frame-control" data-fill="surface">Secondary</button></span>
      <span class="focusable"><button class="btn-tertiary">Tertiary</button></span>
      <button class="btn frame-control" data-fill="disabled" disabled>Disabled</button>
    </div>
    <span class="pv-sub t-micro">Pressed state</span>
    <div class="pv-row">
      <button class="btn frame-control" data-fill="action" data-state="pressed" tabindex="-1">Primary</button>
      <button class="btn frame-control" data-fill="surface" data-state="pressed" tabindex="-1">Secondary</button>
    </div>

    <span class="pv-sub t-micro">Fields</span>
    <div class="pv-field">
      <label class="field-label" for="f1">Your name</label>
      <span class="focusable" style="display:block"><input class="field frame-control" data-fill="field" id="f1" placeholder="Jane Okafor"></span>
    </div>
    <div class="pv-field">
      <label class="field-label" for="f2">Email</label>
      <span class="focusable" style="display:block"><input class="field frame-control" data-fill="error" id="f2" value="jane@meridian"></span>
      <div class="field-error">That address is missing a domain</div>
    </div>
  </section>

  <section class="pv-section">
    <div class="marker reveal"><span class="t-numeral">03</span><span class="t-micro">Conversation &amp; prose</span><i></i></div>
    <div class="pv-bubbles">
      <div class="bubble frame-control" data-fill="accent">Hey — I'm Shareef. Senior product designer, and I ship the code too.<span class="frame-tail" data-fill="accent"></span></div>
      <div class="bubble frame-control is-visitor" data-fill="surface">Show me the fintech work.<span class="frame-tail is-right" data-fill="surface"></span></div>
      <div class="bubble frame-control" data-fill="action">System · 2 case studies matched<span class="frame-tail" data-fill="action"></span></div>
    </div>

    <span class="pv-sub t-micro">Callout</span>
    <div class="callout reveal"><span class="t-micro">The reframe</span><p>How do you make a legally rigid process feel fast without weakening what it must do?</p></div>

    <span class="pv-sub t-micro">Prose</span>
    <p class="t-body prose">Research covered <a href="#0">Mercury's live flow</a>, where a rejected document showed <span class="ui">Verification failed</span> — an accusation and a dead end.</p>
  </section>
</main>

<footer class="bookend pv-foot">
  <div class="t-micro">Dubai · GMT+4 · usually replies within a day</div>
  <div class="t-statement-l">Let's connect</div>
  <a href="#0">shareefpadar@gmail.com</a>
  <p class="pv-note t-cap" style="border:0;padding:0">Generated by scripts/build-preview.mjs from the real token files. Same markup in every era — only data-era changes.</p>
</footer>

<script>
const ICONS = ${JSON.stringify(iconSets)};
const root = document.documentElement;
const tok = n => getComputedStyle(root).getPropertyValue('--' + n).trim();

/* statement reveal — visual only (core.md §5 rule 10): 'type' or 'words' */
const hero = document.getElementById('hero');
const heroHTML = hero.innerHTML;
let revealTimer;
function revealStatement(el) {
  clearInterval(revealTimer); clearTimeout(revealTimer);
  el.innerHTML = heroHTML;
  el.classList.remove('is-typing', 'is-wording');
  el.classList.remove('is-fading');
  const mode = tok('statement-reveal');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (mode === 'fade') { void el.offsetWidth; el.classList.add('is-fading'); revealTimer = setTimeout(() => el.classList.remove('is-fading'), 700); return; }
  if (!['type', 'words'].includes(mode)) return;
  const speed = parseFloat(tok('type-speed')) || 45;
  const units = [], nodes = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) {
    const f = document.createDocumentFragment();
    const parts = mode === 'type' ? [...n.data] : n.data.split(/(\\s+)/);
    for (const part of parts) {
      if (mode === 'words' && /^\\s*$/.test(part)) { f.append(part); continue; }
      const sp = document.createElement('span'); sp.className = mode === 'type' ? 'ch' : 'w'; sp.textContent = part;
      f.append(sp); units.push(sp);
    }
    n.replaceWith(f);
  }
  if (!units.length) return;
  const cls = mode === 'type' ? 'is-typing' : 'is-wording';
  el.classList.add(cls);
  let i = 0;
  revealTimer = setInterval(() => {
    if (mode === 'type') units[i - 1]?.classList.remove('is-caret');
    units[i].classList.add('on', ...(mode === 'type' ? ['is-caret'] : []));
    if (++i >= units.length) {
      clearInterval(revealTimer);
      if (mode === 'type') units[i - 1].classList.remove('is-caret');
      setTimeout(() => el.classList.remove(cls), mode === 'words' ? 520 : 0);
    }
  }, speed);
}

/* icons — swap to the era's set */
function renderIcons() {
  const set = ICONS[tok('icon-set')] || ICONS.pixel;
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = set[el.dataset.icon] || ''; });
}

/* portrait — technique chosen by --portrait */
const portrait = document.getElementById('portrait');
function bust(cols, rows) {
  const c = document.createElement('canvas'); c.width = cols; c.height = rows;
  const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, cols, rows);
  const g = x.createRadialGradient(cols * .44, rows * .30, 1, cols * .5, rows * .34, cols * .32);
  g.addColorStop(0, '#fff'); g.addColorStop(1, '#4a4a4a');
  x.fillStyle = g; x.beginPath(); x.ellipse(cols * .5, rows * .32, cols * .17, rows * .22, 0, 0, 7); x.fill();
  x.fillStyle = '#6a6a6a'; x.beginPath(); x.ellipse(cols * .5, rows * .20, cols * .19, rows * .13, 0, 0, 7); x.fill();
  x.fillStyle = '#8a8a8a'; x.fillRect(cols * .44, rows * .48, cols * .12, rows * .09);
  const s = x.createLinearGradient(0, rows * .55, 0, rows); s.addColorStop(0, '#d8d8d8'); s.addColorStop(1, '#2a2a2a');
  x.fillStyle = s; x.beginPath(); x.moveTo(cols * .14, rows); x.quadraticCurveTo(cols * .20, rows * .60, cols * .42, rows * .55);
  x.lineTo(cols * .58, rows * .55); x.quadraticCurveTo(cols * .80, rows * .60, cols * .86, rows); x.closePath(); x.fill();
  const d = x.getImageData(0, 0, cols, rows).data, out = [];
  for (let r = 0; r < rows; r++) { out[r] = []; for (let q = 0; q < cols; q++) { const i = (r * cols + q) * 4; out[r][q] = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; } }
  return out;
}
function renderPortrait() {
  const kind = tok('portrait');
  portrait.removeAttribute('style');
  if (kind === 'photo') {
    // stand-in for a real photograph: the same bust, drawn smooth instead of quantised
    const W = 280, H = 320, c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2;
    c.className = 'pv-photo'; c.style.width = W + 'px'; c.style.height = H + 'px';
    const x = c.getContext('2d'); x.scale(2, 2);
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#26262D'); bg.addColorStop(1, '#101014');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const face = x.createRadialGradient(W * .44, H * .30, 4, W * .5, H * .34, W * .32);
    face.addColorStop(0, '#C9C9D2'); face.addColorStop(1, '#5A5A66');
    x.fillStyle = '#3A3A44'; x.beginPath(); x.ellipse(W * .5, H * .26, W * .2, H * .15, 0, 0, 7); x.fill();
    x.fillStyle = face; x.beginPath(); x.ellipse(W * .5, H * .34, W * .16, H * .19, 0, 0, 7); x.fill();
    const body = x.createLinearGradient(0, H * .58, 0, H); body.addColorStop(0, '#4A4A56'); body.addColorStop(1, '#1C1C22');
    x.fillStyle = body; x.beginPath(); x.moveTo(W * .12, H); x.quadraticCurveTo(W * .2, H * .6, W * .42, H * .56);
    x.lineTo(W * .58, H * .56); x.quadraticCurveTo(W * .8, H * .6, W * .88, H); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,255,255,.55)'; x.font = '11px ' + tok('font-label'); x.fillText('YOUR PHOTO', 14, H - 14);
    portrait.innerHTML = ''; portrait.append(c);
    return;
  }
  if (kind === 'illustration') {
    // flat avatar with a LONG SHADOW — the 2014 flat-design signature
    const S = 280, c = document.createElement('canvas'); c.width = S * 2; c.height = S * 2;
    c.className = 'pv-photo'; c.style.width = S + 'px'; c.style.height = S + 'px';
    const x = c.getContext('2d'); x.scale(2, 2);
    x.save(); x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, 7); x.clip();
    x.fillStyle = tok('action'); x.fillRect(0, 0, S, S);
    x.fillStyle = 'rgba(0,0,0,.18)';                          // long shadow, 45°
    x.beginPath(); x.moveTo(S * .30, S * .78); x.lineTo(S * .70, S * .78); x.lineTo(S * 1.3, S * 1.4); x.lineTo(S * .9, S * 1.4); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(S * .36, S * .30); x.lineTo(S * .64, S * .52); x.lineTo(S * 1.3, S * 1.2); x.lineTo(S * .9, S * 1.3); x.closePath(); x.fill();
    x.fillStyle = tok('bg-inverse'); x.beginPath(); x.moveTo(S * .22, S); x.quadraticCurveTo(S * .26, S * .62, S * .5, S * .6); x.quadraticCurveTo(S * .74, S * .62, S * .78, S); x.closePath(); x.fill();
    x.fillStyle = tok('surface'); x.beginPath(); x.arc(S * .5, S * .42, S * .15, 0, 7); x.fill();
    x.fillStyle = tok('text'); x.beginPath(); x.arc(S * .5, S * .36, S * .155, Math.PI, 0); x.fill();
    x.fillStyle = tok('accent'); x.fillRect(S * .38, S * .41, S * .24, S * .035);
    x.restore();
    portrait.innerHTML = ''; portrait.append(c);
    return;
  }
  if (kind === 'blocks') {
    const cols = 24, rows = 22, B = bust(cols, rows);
    const lv = [tok('bg-inverse'), tok('surface'), tok('text-muted'), tok('text')];
    portrait.style.fontSize = '12px'; portrait.style.letterSpacing = '0';
    portrait.innerHTML = B.map(row => row.map(v => {
      const q = Math.min(3, Math.floor(v * 4));
      const col = v > .9 ? tok('accent') : lv[q];
      return '<span style="color:' + col + '">██</span>';
    }).join('')).join('\\n');
  } else {
    const cols = 46, rows = 38, B = bust(cols, rows);
    const ramp = [' ', '·', '░', '░', '▒', '▒', '▓', '▓', '█', '█', '█'];
    portrait.style.fontSize = '7px'; portrait.style.letterSpacing = '.5px';
    portrait.style.color = tok('text-inverse-muted');
    portrait.innerHTML = B.map(row => row.map(v => {
      const idx = Math.round((Math.min(3, Math.floor(v * 4)) / 3) * (ramp.length - 1));
      return idx >= ramp.length - 2 ? '<span style="color:' + tok('accent') + '">' + ramp[idx] + '</span>' : ramp[idx];
    }).join('')).join('\\n');
  }
}

/* reveals — once on scroll-in */
const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } }), { threshold: .15 });
function armReveals() { document.querySelectorAll('.reveal').forEach(el => { el.classList.remove('is-in'); void el.offsetWidth; io.observe(el); }); }

/* era switch */
function setEra(e) {
  root.dataset.era = e;
  document.querySelectorAll('[data-era-btn]').forEach(b => {
    const on = b.dataset.eraBtn === e;
    b.setAttribute('aria-pressed', on); b.dataset.fill = on ? 'accent' : 'surface';
  });
  requestAnimationFrame(() => { revealStatement(hero); renderIcons(); renderPortrait(); armReveals(); });
}
document.querySelectorAll('[data-era-btn]').forEach(b => b.addEventListener('click', () => setEra(b.dataset.eraBtn)));
document.fonts.ready.then(() => setEra(root.dataset.era));
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'design-reference', 'era-preview.html'), html);
console.log(`✓ design-reference/era-preview.html — eras: ${eras.join(', ')}`);
