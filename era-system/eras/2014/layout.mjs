/**
 * ERA · 2014 — shared shell for every 2014 page (flat / Material: colour bands, app bar, drawer, FAB).
 * 1995 → 2014 translations:
 *   sprite nav buttons   → app bar with an underline on the current item; navigation drawer under 900px
 *   Clippy               → a chat head: Shareef's round avatar floating on the screen edge (2013–14 messaging). It opens a bubble,
 *                          shows a red 1 for an unopened message, drags and snaps to a side, and the × target at the bottom sends it away.
 *                          The snackbar is left for "Copied"
 *   pixel cursor         → the system cursor (flat era: no custom cursor)
 *   Copy → Copied        → label swaps and the snackbar confirms
 * Pages supply <main> and any page-only script.
 */
import fs from 'node:fs';
import { guideJS, eraSwitchJS, eraRailJS, arriveHeadJS } from '../_shared/client.mjs';
import { eraItems } from '../_shared/eras.mjs';
import { headMeta } from '../_shared/head.mjs';
// the chat head's face: the photo, small (assets/portraits/2014-head.webp, from scripts/build-portraits.py). On every page, so it's 3 KB
const HEAD = 'data:image/webp;base64,' + fs.readFileSync(new URL('../../assets/portraits/2014-head.webp', import.meta.url)).toString('base64');
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function shell({ content: c, pageUrl = '/', study = null, assetBase = '', icons, css, portrait, title, current = '/', main, pageScript = '', headCss = '', guideOpening = null, compactFooter = false }) {
  const ic = n => icons.line[n];
  const p = c.person;
  const opening = guideOpening ?? '';
  return `<!DOCTYPE html>
<html lang="en" data-era="2014">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${headMeta({ content: c, pageUrl, study, assetBase })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&family=Oswald:wght@400&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js')</script>
${arriveHeadJS}
<style>
${css}
${headCss}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="arrive" aria-hidden="true"></div>

<header class="appbar on-blue"><div class="wrap">
  <button class="burger" type="button" aria-label="${esc(c.ui.menu)}" aria-controls="drawer" aria-expanded="false">${ic('menu')}</button>
  <a class="brand" href="/">${esc(p.shortName)}</a>
  <div class="eraswitch" data-era-switch>
    <button class="btn btn-bar yearbtn" type="button" data-era-toggle aria-expanded="false" aria-controls="yearmenu"><span class="sr">${esc(c.eras.label)}: </span>${esc(eraItems(c, pageUrl, '2014').find(e => e.current).year)} ${ic('chevron')}</button>
    <div class="yearmenu" id="yearmenu" data-era-menu hidden>
      <p class="yearmenu-h" aria-hidden="true">${esc(c.eras.label)}</p>
      <ul>
        ${eraItems(c, pageUrl, '2014').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b><span class="nm">${esc(e.name)}</span>${e.current ? `<span class="chk" aria-hidden="true">${ic('check')}</span>` : ''}</a></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <nav class="drawer" id="drawer" aria-label="Main">
    <div class="drawer-head" aria-hidden="true">${esc(p.shortName)}<small>${esc(p.name)}</small></div>
    ${c.nav.map(n => `<a class="link" href="${esc(n.href)}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n    ')}
    <button class="btn btn-ghost-d drawer-close" type="button">${esc(c.ui.closeMenu)}</button>
  </nav>
  <a class="btn btn-white resume" href="${esc(c.ctas.resume.href)}"><span class="lbl">${esc(c.ctas.resume.label)}</span> ${ic('download')}</a>
  <div class="scrim" aria-hidden="true"></div>   <!-- inside the app bar: the drawer's z-index only competes within the bar's stacking context -->
</div></header>
  <nav class="yearrail" aria-label="${esc(c.eras.label)}" data-era-rail>
    <ul>
      ${eraItems(c, pageUrl, '2014').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b></a></li>`).join('\n      ')}
    </ul>
  </nav>

${main}

${compactFooter ? `<footer class="foot dark compact"><div class="wrap">
  <span class="status">${esc(c.footer.status)}</span>
  <div class="credit"><span>${esc(c.footer.credit)}</span><a href="#main">${esc(c.ui.backToTop)} ${ic('arrowU')}</a></div>
</div></footer>` : `<footer class="foot dark" id="contact"><div class="wrap">
  <span class="status">${esc(c.footer.status)}</span>
  <h2>${esc(c.footer.heading)}</h2>
  <p class="intro">${esc(c.footer.intro)}</p>
  <a class="mail" href="mailto:${esc(c.footer.email)}">${esc(c.footer.email)}</a>
  <div class="row">
    <button class="btn btn-ghost-w" type="button" data-copy="${esc(c.footer.email)}">${ic('copy')} <span class="label">${esc(c.ui.copyEmail)}</span></button>
    ${c.footer.socials.map(s => `<a class="btn btn-ghost-w" href="${esc(s.href)}" target="_blank" rel="noopener"><span class="brandic" aria-hidden="true">${icons.brands[s.label.toLowerCase()] ?? ''}</span>${esc(s.label)}</a>`).join('\n    ')}
  </div>
  <div class="credit"><span>${esc(c.footer.credit)}</span><a href="#main">${esc(c.ui.backToTop)} ${ic('arrowU')}</a></div>
</div></footer>`}

<button class="fab" type="button" aria-label="${esc(c.ui.backToTop)}">${ic('arrowU')}</button>
<aside class="chead" id="chead" aria-label="${esc(c.guide.name)}" data-state="${opening ? 'talk' : 'idle'}" data-side="right">
  <button class="chbtn" id="head" type="button" aria-label="${esc(c.guide.name)}"><img src="${HEAD}" width="64" height="64" alt="" draggable="false"><span class="chbadge" aria-hidden="true">1</span></button>
  <div class="cbubble" id="cbubble"><b class="cname">${esc(c.guide.name)}</b><p class="ctext" id="ctext">${esc(opening)}</p><button class="chide" type="button" aria-label="${esc(c.ui.hideGuide)} ${esc(c.guide.name)}">${esc(c.ui.hideGuide)}</button></div>
</aside>
<div class="cdrop" id="cdrop" aria-hidden="true">${ic('close')}</div>
<aside class="snackbar" id="snack" aria-hidden="true"><p class="snack-text"><span id="snack-msg"></span></p></aside>
<span class="sr" aria-live="polite" id="copied"></span>

<script>
(() => {
  const body = document.body, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover: none)').matches;
  const G = ${JSON.stringify(c.guide)};
  ${guideJS}

  // ── page-only script ──
  ${pageScript}

  // ── era switcher ──
  ${eraSwitchJS}
  eraSwitch(document.querySelector('[data-era-switch]'));
  ${eraRailJS}
  eraRail(document.querySelector('[data-era-rail]'));

  // ── nav drawer: focus moves in on open, Escape and the scrim close it, focus returns to the button ──
  const burger = document.querySelector('.burger'), drawer = document.getElementById('drawer');
  function setOpen(open) {
    if (body.classList.contains('drawer-open') === open) return;
    body.classList.toggle('drawer-open', open);
    burger.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => drawer.querySelector('a.link').focus(), reduce ? 0 : 60); else burger.focus();
  }
  burger.addEventListener('click', () => setOpen(!body.classList.contains('drawer-open')));
  document.querySelector('.scrim').addEventListener('click', () => setOpen(false));
  drawer.querySelector('.drawer-close').addEventListener('click', () => setOpen(false));
  drawer.querySelectorAll('a.link').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) body.classList.remove('drawer-open'); burger.setAttribute('aria-expanded', false); });

  // ── material ripple ──
  if (!reduce) document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn, .snack-act'); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
    s.className = 'ripple'; s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    b.append(s); s.addEventListener('animationend', () => s.remove());
  });

  // ── grow-in reveals, once ──
  const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── FAB: back to top ──
  const fab = document.querySelector('.fab');
  addEventListener('scroll', () => fab.classList.toggle('show', scrollY > 700), { passive: true });
  fab.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // ── the guide: a chat head, the floating round avatar of 2014 messaging. It sits on the screen edge, opens a bubble
  //    when it has something to say, shows a red "1" when there's a message you haven't opened, can be dragged and
  //    snaps back to the nearest side, and dragging it onto the × at the bottom sends it away ──
  const ch = document.getElementById('chead'), head = document.getElementById('head'), ctext = document.getElementById('ctext'), drop = document.getElementById('cdrop');
  const small = touch || innerWidth < 700, S = 56;
  let settle, pos = { x: 0, y: 0 };
  // the right-hand resting place: the screen edge, or just inside the year rail when the rail is showing (1280px up),
  // so the chat head never parks on top of it
  const rightEdge = () => { const r = document.querySelector('[data-era-rail]')?.getBoundingClientRect(); return (r && r.width ? r.left : innerWidth) - S - 10; };
  const put = (x, y, snap) => { pos = { x, y }; ch.classList.toggle('snap', !!snap); ch.style.setProperty('--hx', x + 'px'); ch.style.setProperty('--hy', y + 'px'); };
  const toSide = () => { const right = pos.x + S / 2 > innerWidth / 2; ch.dataset.side = right ? 'right' : 'left';
    put(right ? rightEdge() : 10, Math.max(76, Math.min(pos.y, innerHeight - S - 96)), true); };
  put(rightEdge(), Math.round(innerHeight * .52), false);
  const open = () => { ch.dataset.state = 'talk'; ch.classList.remove('unread'); clearTimeout(settle); settle = setTimeout(() => { ch.dataset.state = 'idle'; }, 6500); };
  const ui = {
    say(text) { ctext.textContent = text; open(); return 6500; },
    hide() { clearTimeout(settle); ch.dataset.state = 'away'; },
    show() { ch.dataset.state = 'idle'; },
  };
  const brain = guideBrain(G, ui, { quiet: reduce || touch, said: ${JSON.stringify(opening)} });
  if (small && ch.dataset.state === 'talk') { ch.dataset.state = 'idle'; ch.classList.add('unread'); }   // phones: a red 1 instead of a bubble over the reading
  else if (ch.dataset.state === 'talk') settle = setTimeout(() => { ch.dataset.state = 'idle'; }, 7000);
  const tap = () => { if (ch.dataset.state === 'talk') { clearTimeout(settle); ch.dataset.state = 'idle'; } else if (ch.classList.contains('unread')) open(); else brain.poke(); };
  // drag: follow the finger, show the × target, snap to a side on release
  let drag = null, skipClick = false;
  head.addEventListener('pointerdown', e => { drag = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false }; head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; clearTimeout(settle); ch.dataset.state = 'idle'; drop.classList.add('on'); }
    put(drag.ox + dx, drag.oy + dy, false);
    const r = drop.getBoundingClientRect(); drop.classList.toggle('hot', Math.hypot(pos.x + S / 2 - (r.left + r.width / 2), pos.y + S / 2 - (r.top + r.height / 2)) < 70); });
  const end = () => { if (!drag) return; const moved = drag.moved; drag = null; skipClick = true; setTimeout(() => { skipClick = false; }, 0);
    if (!moved) { tap(); return; }
    const hot = drop.classList.contains('hot'); drop.classList.remove('on', 'hot'); toSide(); if (hot) brain.dismiss(); };
  head.addEventListener('pointerup', end); head.addEventListener('pointercancel', end);
  head.addEventListener('click', e => { if (skipClick) return; if (e.detail === 0) tap(); });   // keyboard
  ch.querySelector('.chide').addEventListener('click', () => brain.dismiss());
  addEventListener('resize', toSide);

  // ── snackbar: only the copy confirmation now, one line, as Material uses it ──
  const snack = document.getElementById('snack'), msg = document.getElementById('snack-msg');
  let out;
  const show = (text, ms) => {
    clearTimeout(out); msg.textContent = text;
    snack.removeAttribute('data-show'); void snack.offsetWidth; snack.setAttribute('data-show', '');
    body.classList.add('snack-up');
    out = setTimeout(() => { snack.removeAttribute('data-show'); body.classList.remove('snack-up'); }, ms);
  };

  // ── copy → copied ──
  const live = document.getElementById('copied');
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    b.querySelector('.label').textContent = ${JSON.stringify(c.ui.emailCopied)}; live.textContent = ${JSON.stringify(c.ui.copiedAnnouncement)};
    show(${JSON.stringify(c.ui.copiedAnnouncement)}, 2400);
    setTimeout(() => { b.querySelector('.label').textContent = ${JSON.stringify(c.ui.copyEmail)}; live.textContent = ''; }, 2000);
  }));
})();
</script>
</body>
</html>
`;
}
