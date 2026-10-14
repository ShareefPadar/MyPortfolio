/**
 * ERA · 1995 — shared shell for every 1995 page: head, nav (current page pressed),
 * footer, Clippy, pixel cursor. Pages supply <main> and any page-only script.
 * Mirrors the live site, where every page carries Clippy and the cursor.
 */
import { headMeta } from '../_shared/head.mjs';
import { eraSwitchJS, eraRailJS, arriveHeadJS } from '../_shared/client.mjs';
import { eraItems } from '../_shared/eras.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const STYLES = ['styles/core.css', 'styles/eras/1995.css', 'styles/eras/1995.sprites.css'];

export function shell({ content: c, pageUrl = '/', study = null, assetBase = '', icons, css, portrait, sprites1995, title, current = '/', main, beforeFooter = '', pageScript = '', guideOpening = null, compactFooter = false }) {
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const brand = n => `<span class="brandic" aria-hidden="true">${icons.brands[n.toLowerCase()] ?? ''}</span>`;
  const p = c.person;
  return `<!DOCTYPE html>
<html lang="en" data-era="1995">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${headMeta({ content: c, pageUrl, study, assetBase })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js')</script>
${arriveHeadJS}
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="arrive" aria-hidden="true"></div>

<div class="nav" id="nav"><div class="wrap">
  <nav class="navbar frame-raised" aria-label="Main">
    <a class="brand t-statement-m" href="/">${esc(p.brand)}</a>
    <div class="eraswitch" data-era-switch>
      <span class="focusable"><button class="btn frame-control erabtn" data-fill="surface" type="button" data-era-toggle aria-expanded="false" aria-controls="eramenu"><span class="sr">${esc(c.eras.label)}: </span>${esc(eraItems(c, pageUrl, '1995').find(e => e.current).year)}${ic('chevron')}</button></span>
      <div class="eramenu frame-raised" id="eramenu" data-era-menu hidden>
        <p class="mono eramenu-h" aria-hidden="true">${esc(c.eras.label)}</p>
        <ul>
          ${eraItems(c, pageUrl, '1995').map(e => `<li><span class="focusable"><a class="btn frame-control" data-fill="surface" data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' data-state="pressed" aria-current="true"' : ''}><b>${esc(e.year)}</b><span class="mono">${esc(e.name)}</span></a></span></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
    <button class="burger" type="button" aria-label="${esc(c.ui.menu)}" aria-expanded="false" aria-controls="navlinks"><i></i><i></i><i></i></button>
    <div class="navlinks" id="navlinks">
      ${c.nav.map(n => `<span class="focusable"><a class="btn frame-control navbtn" data-fill="surface"${n.href === current ? ' data-state="pressed" aria-current="page"' : ''} href="${esc(n.href)}">${esc(n.label)}</a></span>`).join('\n      ')}
      <span class="focusable"><a class="btn frame-control" data-fill="action" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a></span>
    </div>
  </nav>
  <nav class="yearrail frame-raised" aria-label="${esc(c.eras.label)}" data-era-rail>
    <ul>
      ${eraItems(c, pageUrl, '1995').map(e => `<li><span class="focusable"><a class="btn frame-control" data-fill="surface" data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' data-state="pressed" aria-current="true"' : ''}><b>${esc(e.year)}</b></a></span></li>`).join('\n      ')}
    </ul>
  </nav>
</div></div>

${main}
${beforeFooter}
${compactFooter ? `<footer class="foot foot-compact bookend"><div class="wrap">
  <div class="statusrow mono"><b aria-hidden="true"></b>${esc(c.footer.status)}</div>
  <div class="credit mono"><span>${esc(c.footer.credit)}</span><a href="#main">${ic('arrowU')} ${esc(c.ui.backToTop)}</a></div>
</div></footer>` : `<footer class="foot bookend" id="contact"><div class="wrap">
  <div class="statusrow mono"><b aria-hidden="true"></b>${esc(c.footer.status)}</div>
  <h2>${esc(c.footer.heading)}</h2>
  <p class="intro">${esc(c.footer.intro)}</p>
  <div class="mailrow">
    <a class="mail" href="mailto:${esc(c.footer.email)}">${esc(c.footer.email)}</a>
    <span class="focusable"><button class="btn frame-control copybtn" data-fill="surface" type="button" data-copy="${esc(c.footer.email)}"><span class="ic" aria-hidden="true">${icons.pixel.copy}</span><span class="label">${esc(c.ui.copyEmail)}</span></button></span>
    <span class="sr" aria-live="polite" id="copied"></span>
  </div>
  <div class="socials">
    ${c.footer.socials.map(s => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${brand(s.label)}${esc(s.label)} ${ic('external')}</a>`).join('\n    ')}
  </div>
  <div class="credit mono"><span>${esc(c.footer.credit)}</span><a href="#main">${ic('arrowU')} ${esc(c.ui.backToTop)}</a></div>
</div></footer>`}

<aside class="clippy" id="clippy" aria-label="${esc(c.guide.name)}">
  <button class="sprite" type="button" aria-label="${esc(c.guide.name)}" id="clippy-sprite"></button>
  <div class="guide-bubble${guideOpening ? '' : ' is-idle'}" id="bubble">
    <span class="guide-name" aria-hidden="true">${esc(c.guide.name)}</span>
    <span id="msg">${guideOpening ? esc(guideOpening) : ''}</span>
    <button class="guide-close" type="button" aria-label="${esc(c.ui.hideGuide)} ${esc(c.guide.name)}">×</button>
  </div>
</aside>
<div class="px-cursor" id="pxc" aria-hidden="true"></div>

<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover: none)').matches;
  const tok = n => getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim();
  const P = ${JSON.stringify(portrait)}, S = ${JSON.stringify(sprites1995)}, G = ${JSON.stringify(c.guide)};
  const snap = v => 4 * Math.round(v / 4);

  // ── page-only script (runs before Clippy, which exits early on touch / reduced motion) ──
  ${pageScript}

  // ── era switcher ──
  ${eraSwitchJS}
  eraSwitch(document.querySelector('[data-era-switch]'));
  ${eraRailJS}
  eraRail(document.querySelector('[data-era-rail]'));

  // ── reveals, nav, burger ──
  const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const nav = document.getElementById('nav'), burger = nav.querySelector('.burger');
  addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 24), { passive: true });
  burger.addEventListener('click', () => { const open = nav.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', open); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('menu-open')) { nav.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); burger.focus(); } });

  // ── copy → copied ──
  const live = document.getElementById('copied');
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    b.querySelector('.label').textContent = ${JSON.stringify(c.ui.emailCopied)}; live.textContent = ${JSON.stringify(c.ui.copiedAnnouncement)};
    setTimeout(() => { b.querySelector('.label').textContent = ${JSON.stringify(c.ui.copyEmail)}; live.textContent = ''; }, 2000);
  }));

  // ── sprite → svg ──
  const svg = (g, fill) => '<svg viewBox="0 0 ' + g[0].length + ' ' + g.length + '" width="' + g[0].length * 2 + '" height="' + g.length * 2 + '" shape-rendering="crispEdges">' +
    g.flatMap((row, y) => [...row].map((ch, x) => ch === '.' ? '' : '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + (ch === 'X' ? '#14140F' : ch === 'W' ? '#F0EFF4' : fill) + '"/>')).join('') + '</svg>';

  // ── pixel cursor: 4px snap, arrow / hand / hidden — off for touch and reduced motion ──
  if (!touch && !reduce) {
    const cur = document.getElementById('pxc'); document.documentElement.classList.add('has-px-cursor');
    const arrow = svg(S.cursor.arrow, '#FFFFFF'), hand = svg(S.cursor.hand, '#FFFFFF'); let mode = '', pos = { x: -100, y: -100 }, dirty = false;
    cur.innerHTML = arrow;
    addEventListener('pointermove', e => { pos = { x: snap(e.clientX), y: snap(e.clientY) }; dirty = true; }, { passive: true });
    addEventListener('pointerover', e => { const t = e.target, m = t.closest(':disabled,[aria-disabled="true"]') ? 'hidden'
      : t.closest('a[href],button:not(:disabled),[role="button"],input,select,textarea,label[for],summary,[tabindex="0"]') ? 'hand' : 'arrow';
      if (m === mode) return; mode = m; cur.style.opacity = m === 'hidden' ? '0' : '1'; cur.innerHTML = m === 'hand' ? hand : arrow; }, { passive: true });
    (function loop() { requestAnimationFrame(loop); if (dirty) { dirty = false; cur.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)'; } })();
  }

  // ── Clippy: section messages, idle chatter, typing, wandering, replies ──
  const box = document.getElementById('clippy'), sprite = document.getElementById('clippy-sprite'), bubble = document.getElementById('bubble'), msg = document.getElementById('msg');
  const frame = f => { sprite.innerHTML = svg(S.clippy.frames[f], '#F0EFF4'); };
  frame('rest');
  // live parks Clippy just above-right of the section's heading: hero → (heading left + 278, heading top − 112)
  const anchor = el => { if (!el) return { x: snap(innerWidth * .25), y: snap(Math.min(576, innerHeight - 220)) };   // pages without guide sections: live parks Clippy lower
    const h = el.querySelector('h1, h2, p') || el, r = h.getBoundingClientRect();
    return { x: snap(Math.max(24, Math.min(r.left + 278, innerWidth - 340))), y: snap(Math.max(96, Math.min(r.top - 112, innerHeight - 220))) }; };
  const at = anchor(document.querySelector('[data-guide-id="hero"]')), target = { ...at };
  const place = () => { box.style.transform = 'translate3d(' + at.x + 'px,' + at.y + 'px,0)'; };
  place();
  if (reduce || touch) return;   // static Clippy with the hero line, like live

  let talking = false, timers = [], hiddenCount = 0;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function say(text) {
    timers.forEach(clearTimeout); timers = []; talking = true;
    bubble.classList.remove('is-idle'); msg.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    later(() => { msg.textContent = '';
      for (let i = 1; i <= text.length; i++) later(() => { msg.textContent = text.slice(0, i); }, 26 * i);
      later(() => { talking = false; bubble.classList.add('is-idle'); }, 26 * text.length + 4200);
    }, 700);
  }
  (function idle() { setTimeout(() => { const seq = talking ? S.clippy.talkSequence : pick(S.clippy.idleSequences); let i = 0;
    (function step() { if (i >= seq.length) { frame('rest'); return idle(); } const [f, ms] = seq[i++]; frame(f); setTimeout(step, ms); })(); }, talking ? 120 : 2200 + 3600 * Math.random()); })();
  const sections = Object.entries(G.sections).map(([id, text]) => ({ id, text, el: document.querySelector('[data-guide-id="' + id + '"]') })).filter(s => s.el);
  let current = null;
  setInterval(() => {
    const mid = innerHeight / 2; let best = null, d = Infinity;
    for (const s of sections) { const r = s.el.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= innerHeight) continue;
      const k = Math.abs(r.top + r.height / 2 - mid); if (k < d) { d = k; best = s; } }
    if (best && best !== current && !box.hidden) { current = best; say(best.text);
      Object.assign(target, anchor(best.el)); }
  }, 300);
  setInterval(() => { if (!talking && !box.hidden) say(pick(G.idle)); }, 11000);
  setInterval(() => { if (!talking) { target.x = snap(24 + Math.random() * Math.max(80, innerWidth - 348)); target.y = snap(96 + Math.random() * Math.max(80, innerHeight - 280)); } }, 4000);
  setInterval(() => { for (const k of ['x', 'y']) { const n = target[k] - at[k]; if (Math.abs(n) > 4) at[k] += Math.sign(n) * Math.max(4, snap(Math.min(.24 * Math.abs(n), 48))); else at[k] = target[k]; } place(); }, 60);
  sprite.addEventListener('click', () => say(G.replies[3]));
  bubble.querySelector('.guide-close').addEventListener('click', () => {
    say(G.replies[0]); hiddenCount++;
    later(() => { box.hidden = true; setTimeout(() => { box.hidden = false; say(G.replies[hiddenCount > 1 ? 2 : 1]); }, 15000); }, 2600);
  });
})();
</script>
</body>
</html>
`;
}
