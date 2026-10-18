/**
 * ERA · 1986 — shared shell for every 1986 page (the site as an 8-bit game).
 * 1995 → 1986 translations:
 *   sprite nav buttons      → a game menu with a ▶ cursor (arrow keys move it), START menu on phones
 *   Clippy                  → an NPC dialogue box that slides up from the bottom of the screen, types, ▼ when done
 *   pixel cursor (4px)      → a chunkier cursor: 3px pixels on an 8px grid; ▶ over anything clickable
 *   footer                  → the CONTINUE? screen
 *   home's easter egg       → SHIP THE BACKLOG, a brick breaker whose paddle rides the CONTINUE? box (game.mjs, passed as beforeFooter)
 * Pages supply <main>, optional beforeFooter (the game) and any page-only script.
 */
import { guideJS, eraSwitchJS, shakeJS, eraRailJS, arriveHeadJS } from '../_shared/client.mjs';
import { eraItems } from '../_shared/eras.mjs';
import { headMeta } from '../_shared/head.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 8×8 cursor sprites, drawn for this era. X = black edge, O = lime
const ARROW = ['XX......', 'XOX.....', 'XOOX....', 'XOOOX...', 'XOOOOX..', 'XOOXXX..', 'XXOOX...', '...XX...'];
const POINT = ['X.......', 'XX......', 'XOX.....', 'XOOX....', 'XOOX....', 'XOX.....', 'XX......', 'X.......'];
const sprite = g => `<svg viewBox="0 0 8 8" width="24" height="24" shape-rendering="crispEdges">${g.flatMap((r, y) => [...r].map((ch, x) =>
  ch === '.' ? '' : `<rect x="${x}" y="${y}" width="1" height="1" fill="${ch === 'X' ? '#000' : '#CDF22B'}"/>`)).join('')}</svg>`;

export function shell({ content: c, pageUrl = '/', study = null, assetBase = '', icons, css, portrait, title, current = '/', main, beforeFooter = '', pageScript = '', guideOpening = null, compactFooter = false }) {
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const p = c.person;
  const opening = guideOpening ?? '';
  return `<!DOCTYPE html>
<html lang="en" data-era="1986">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${headMeta({ content: c, pageUrl, study, assetBase })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js')</script>
${arriveHeadJS}
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="arrive" aria-hidden="true"><i></i></div>
<div class="screen-wrap"><div class="screen">

  <nav class="box menu" id="menu" aria-label="Main">
    <a class="brand" href="/">${esc(p.shortName)}</a>
    <button class="btn start" type="button" aria-expanded="false" aria-controls="menu-items"><span aria-hidden="true">▶ </span>${esc(c.ui.menu)}</button>
    <div class="menu-items" id="menu-items">
      ${c.nav.map(n => `<a class="item" href="${esc(n.href)}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n      ')}
      <a class="btn primary resume" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
    </div>
  </nav>
  <div class="eraswitch" data-era-switch>
  <button class="btn yearbtn" type="button" data-era-toggle aria-expanded="false" aria-controls="yearmenu"><span class="sr">${esc(c.eras.label)}: </span><span class="arr" aria-hidden="true">◀</span>${esc(eraItems(c, pageUrl, '1986').find(e => e.current).year)}<span class="arr" aria-hidden="true">▶</span></button>
  <div class="yearmenu" id="yearmenu" data-era-menu hidden>
  <p class="yearmenu-h" aria-hidden="true">${esc(c.eras.label)}</p>
  <ul>
    ${eraItems(c, pageUrl, '1986').map(e => `<li><a class="yr" data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b><span>${esc(e.name)}</span></a></li>`).join('\n          ')}
  </ul>
    <div class="shake" data-shake hidden><p data-shake-hint>${esc(c.eras.shake.hint)}</p></div>
  </div>
  </div>
  <nav class="yearrail" aria-label="${esc(c.eras.label)}" data-era-rail>
    <ul>
      ${eraItems(c, pageUrl, '1986').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b></a></li>`).join('\n      ')}
    </ul>
  </nav>

${main}
${beforeFooter}
${compactFooter ? `  <footer class="box continue compact">
    <div class="status">${esc(c.footer.status)}</div>
    <div class="credit"><span>${esc(c.footer.credit)}</span><a href="#main">${ic('arrowU')} ${esc(c.ui.backToTop)}</a></div>
  </footer>` : `  <footer class="box continue reveal" id="contact">
    <div class="status">${esc(c.footer.status)}</div>
    <h2>${esc(c.footer.heading)}</h2>
    <p class="intro">${esc(c.footer.intro)}</p>
    <a class="mail" href="mailto:${esc(c.footer.email)}">${esc(c.footer.email)}</a>
    <div class="row">
      <button class="btn copy" type="button" data-copy="${esc(c.footer.email)}">${ic('copy')} <span class="label">${esc(c.ui.copyEmail)}</span></button>
      ${c.footer.socials.map(s => `<a class="btn" href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('\n      ')}
    </div>
    <span class="sr" aria-live="polite" id="copied"></span>
    <div class="credit"><span>${esc(c.footer.credit)}</span><a href="#main">${ic('arrowU')} ${esc(c.ui.backToTop)}</a></div>
  </footer>`}

</div></div>

<aside class="npc" id="npc" aria-label="${esc(c.guide.name)}"${opening ? '' : ' data-state="away"'}>
  <div class="box npc-box">
    <button class="npc-name" type="button" id="npc-name">${esc(c.guide.name)}</button>
    <p class="npc-line" id="npc-line">${esc(opening)}</p>
    <span class="npc-more" aria-hidden="true">▼</span>
    ${c.guide.commands ? `<form class="npc-cmd" id="npc-cmd"><span aria-hidden="true">&gt;</span><input id="npc-in" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" aria-label="${esc(c.guide.commands.label)}" placeholder="${esc(c.guide.commands.label)}"></form>` : ''}
    <button class="npc-close" type="button" aria-label="${esc(c.ui.hideGuide)} ${esc(c.guide.name)}">×</button>
  </div>
</aside>
<div class="px-cursor" id="pxc" aria-hidden="true"><span class="a">${sprite(ARROW)}</span><span class="h">${sprite(POINT)}</span></div>

<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover: none)').matches;
  const G = ${JSON.stringify(c.guide)};
  ${guideJS}

  // ── page-only script ──
  ${pageScript}

  // ── era switcher ──
  ${eraSwitchJS}
  eraSwitch(document.querySelector('[data-era-switch]'));
  ${shakeJS}
  eraShake(document.querySelector('[data-era-menu]'));
  ${eraRailJS}
  eraRail(document.querySelector('[data-era-rail]'));

  // ── reveals: palette fade, once ──
  const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── menu: START opens it on phones; ↑ ↓ move the ▶ cursor like a game menu ──
  const menu = document.getElementById('menu'), start = menu.querySelector('.start');
  start.addEventListener('click', () => { const o = menu.classList.toggle('open'); start.setAttribute('aria-expanded', o); if (o) menu.querySelector('.item').focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); start.setAttribute('aria-expanded', false); start.focus(); } });
  const items = [...menu.querySelectorAll('.item, .resume')];
  menu.addEventListener('keydown', e => { const i = items.indexOf(document.activeElement); if (i < 0) return;
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault(); items[(i + d + items.length) % items.length].focus(); });

  // ── copy → copied ──
  const live = document.getElementById('copied');
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    b.classList.add('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.emailCopied)}; live.textContent = ${JSON.stringify(c.ui.copiedAnnouncement)};
    setTimeout(() => { b.classList.remove('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.copyEmail)}; live.textContent = ''; }, 2000);
  }));

  // ── chunky cursor: 8px grid, ▶ over clickables — off for touch and reduced motion ──
  if (!touch && !reduce) {
    const cur = document.getElementById('pxc'); document.documentElement.classList.add('has-px-cursor');
    let pos = { x: -64, y: -64 }, dirty = false, mode = '';
    addEventListener('pointermove', e => { pos = { x: 8 * Math.round(e.clientX / 8), y: 8 * Math.round(e.clientY / 8) }; dirty = true; }, { passive: true });
    addEventListener('pointerover', e => { const m = e.target.closest('a[href],button:not(:disabled),[role="button"],input,select,textarea,summary,[tabindex="0"]') ? 'hand' : 'arrow';
      if (m !== mode) { mode = m; cur.dataset.mode = m; } }, { passive: true });
    (function loop() { requestAnimationFrame(loop); if (dirty) { dirty = false; cur.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)'; } })();
  }

  // ── NPC dialogue: slides up, types with ▼, tucks itself away after a while ──
  const npc = document.getElementById('npc'), line = document.getElementById('npc-line');
  let tick = [], away;
  const quiet = reduce || touch;
  const ui = {
    say(text) {
      tick.forEach(clearTimeout); tick = []; clearTimeout(away);
      npc.dataset.state = 'talking'; line.textContent = reduce ? text : '';
      if (!reduce) for (let i = 1; i <= text.length; i++) tick.push(setTimeout(() => { line.textContent = text.slice(0, i); }, 28 * i));
      const typed = reduce ? 0 : 28 * text.length;
      tick.push(setTimeout(() => { npc.dataset.state = 'waiting'; }, typed));
      away = setTimeout(() => { if (document.activeElement !== document.getElementById('npc-in')) npc.dataset.state = 'tucked'; }, typed + 5200);
      return typed + 5200;
    },
    hide() { npc.dataset.state = 'away'; },
    show() { npc.dataset.state = 'waiting'; },
  };
  const brain = guideBrain(G, ui, { quiet, said: ${JSON.stringify(opening)} });
  document.getElementById('npc-name').addEventListener('click', () => brain.poke());
  npc.querySelector('.npc-close').addEventListener('click', () => brain.dismiss());
  if (${JSON.stringify(!!opening)} && !reduce) ui.say(${JSON.stringify(opening)});

  // ── the parser: a text adventure takes commands. LOOK, WORK, ABOUT, RESUME, INVENTORY, HELP ──
  const form = document.getElementById('npc-cmd');
  if (form && G.commands) {
    const C = G.commands, input = document.getElementById('npc-in');
    const walk = (href, blank) => { brain.tell(C.going); const a = document.createElement('a'); a.href = href; if (blank) { a.target = '_blank'; a.rel = 'noopener'; }
      a.hidden = true; document.body.append(a); setTimeout(() => { a.click(); a.remove(); }, reduce ? 0 : 650); };
    const VERBS = {
      help: () => brain.tell(C.help), look: () => brain.look(), l: () => brain.look(),
      inventory: () => brain.tell(C.inventory), inv: () => brain.tell(C.inventory), i: () => brain.tell(C.inventory),
      work: () => walk('/work'), about: () => walk('/about'), home: () => walk('/'),
      resume: () => walk(${JSON.stringify(c.ctas.resume.href)}, true), 'résumé': () => walk(${JSON.stringify(c.ctas.resume.href)}, true), cv: () => walk(${JSON.stringify(c.ctas.resume.href)}, true),
    };
    form.addEventListener('submit', e => { e.preventDefault();
      const v = input.value.trim().toLowerCase().replace(/^(go|walk|enter|open|read)( to)? /, ''); input.value = '';
      if (v) (VERBS[v] ?? (() => brain.tell(C.unknown)))(); });
    input.addEventListener('focus', () => { clearTimeout(away); if (npc.dataset.state === 'tucked') npc.dataset.state = 'waiting'; });   // stays open while you type
    input.addEventListener('blur', () => { away = setTimeout(() => { if (document.activeElement !== input) npc.dataset.state = 'tucked'; }, 5200); });
  }
})();
</script>
</body>
</html>
`;
}
