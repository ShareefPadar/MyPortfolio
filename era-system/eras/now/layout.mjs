/**
 * ERA · now — shared shell for every Now page: Liquid Glass over a sky.
 * Three layers: the sky; the content, on glass panels the sky shows through; the controls, on a stronger glass, floating over both.
 * 1995 → Now translations:
 *   sprite nav buttons   → an iOS 26 tab bar floating at the bottom (Home · Work · About); it shrinks to the current tab
 *                          while you scroll down and comes back when you scroll up
 *   Résumé button        → a glass capsule, top right; the era switcher is the glass capsule top left, opening a glass popover
 *   Clippy               → a collaborator's cursor, as in a shared Figma file: it glides to what it's talking about and
 *                          says it in cursor chat; on phones it parks as a glass capsule
 *   pixel cursor         → the system cursor
 *   Copy → Copied        → the button fills with the lime tint and says Copied
 *   footer               → a glass panel like the rest of the content
 *   Dino Runner          → nothing: Now is the one era with no game (Shareef's call)
 *   page background      → a sky behind everything (sky.mjs): night or morning by the visitor's clock
 * Light by day, dark by night: the colours follow the sky. System font (SF Pro on Apple devices).
 * Pages supply <main> content (inside .page) and any page-only script.
 */
import { guideJS, eraSwitchJS, shakeJS, eraRailJS, arriveHeadJS } from '../_shared/client.mjs';
import { eraItems } from '../_shared/eras.mjs';
import { headMeta } from '../_shared/head.mjs';
import { skyHeadJS, skyMarkup, skyScript } from './sky.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// SF Symbols-style filled glyphs for the tab bar and the notification
const TAB = {
  '/': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2 3 10.3v9.4c0 .7.6 1.3 1.3 1.3H9v-6h6v6h4.7c.7 0 1.3-.6 1.3-1.3v-9.4z"/></svg>',
  '/work': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>',
  '/about': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z"/></svg>',
};
// iOS back button: a chevron and the previous page's name
export const BACK = '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5 2.5 10l7 7.5"/></svg>';

export function shell({ content: c, pageUrl = '/', study = null, assetBase = '', icons, css, title, current = '/', main, pageScript = '', guideOpening = null, compactFooter = false, quietSky = false }) {
  const ic = n => icons.line[n];
  const opening = guideOpening ?? '';
  const now = eraItems(c, pageUrl, 'now').find(e => e.current);
  return `<!DOCTYPE html>
<html lang="en" data-era="now">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
${headMeta({ content: c, pageUrl, study, assetBase })}
<script>document.documentElement.classList.add('js')</script>
${arriveHeadJS}
${skyHeadJS}
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="arrive" aria-hidden="true"></div>
${skyMarkup(quietSky)}

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="lens" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="1" seed="3" result="n"/>
    <feGaussianBlur in="n" stdDeviation="2" result="nb"/>
    <feDisplacementMap in="SourceGraphic" in2="nb" scale="18" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>

<div class="edge" aria-hidden="true"></div>
<header class="topbar">
  <a class="cap glass" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
</header>
  <div class="eraswitch" data-era-switch>
  <button class="cap glass" type="button" data-era-toggle aria-expanded="false" aria-controls="yearmenu"><span class="sr">${esc(c.eras.label)}: </span>${esc(now.year)} <span class="nm">${esc(now.name)}</span>${ic('chevron')}</button>
  <div class="yearmenu glass" id="yearmenu" data-era-menu hidden>
  <p class="yearmenu-h" aria-hidden="true">${esc(c.eras.label)}</p>
  <ul>
  ${eraItems(c, pageUrl, 'now').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b><span class="nm">${esc(e.name)}</span>${e.current ? `<span class="chk" aria-hidden="true">${ic('check')}</span>` : ''}</a></li>`).join('\n        ')}
  </ul>
    <div class="shake" data-shake hidden><p data-shake-hint>${esc(c.eras.shake.hint)}</p></div>
  </div>
  </div>
  <nav class="yearrail glass" aria-label="${esc(c.eras.label)}" data-era-rail>
    <ul>
      ${eraItems(c, pageUrl, 'now').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b></a></li>`).join('\n      ')}
    </ul>
  </nav>

<main id="main" class="page">
${main}

${compactFooter ? `  <footer class="footer compact">
    <div class="credit"><span>${esc(c.footer.status)}</span><span>${esc(c.footer.credit)}</span><a href="#main">${esc(c.ui.backToTop)}</a></div>
  </footer>` : `  <footer class="footer" id="contact">
    <p class="where">${esc(c.footer.status)}</p>
    <h2>${esc(c.footer.heading)}</h2>
    <p class="intro">${esc(c.footer.intro)}</p>
    <div class="mailrow">
      <a class="mail" href="mailto:${esc(c.footer.email)}">${esc(c.footer.email)}</a>
      <button class="btn bordered small copy" type="button" data-copy="${esc(c.footer.email)}"><span class="label">${esc(c.ui.copyEmail)}</span></button>
    </div>
    <span class="sr" aria-live="polite" id="copied"></span>
    <div class="socials">${c.footer.socials.map(s => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>
    <div class="credit"><span>${esc(c.footer.credit)}</span><a href="#main">${esc(c.ui.backToTop)}</a></div>
  </footer>`}
</main>

<nav class="tabbar glass" id="tabbar" aria-label="Main">
  ${c.nav.map(n => `<a class="tab" href="${esc(n.href)}"${n.href === current ? ' aria-current="page"' : ''}>${TAB[n.href] ?? ''}${esc(n.label)}</a>`).join('\n  ')}
</nav>

<aside class="collab" id="collab" aria-label="${esc(c.guide.name)}" data-state="${opening ? 'talk' : 'quiet'}">
  <div class="cur" id="cur">
    <svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2.2 17.2 8.4l-6.6 2.1-2.1 6.7z"/></svg>
    <div class="tag">
      <button class="who" type="button" id="who">${esc(c.guide.name)}</button>
      <p class="said" id="said">${esc(opening)}</p>
      <button class="cclose" type="button" aria-label="${esc(c.ui.hideGuide)} ${esc(c.guide.name)}">${ic('close')}</button>
    </div>
  </div>
  <button class="cpill glass" type="button" id="cpill"><span class="av" aria-hidden="true">${esc(c.guide.name.slice(0, 1))}</span>${esc(c.guide.name)}</button>
</aside>

<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover: none)').matches;
  const G = ${JSON.stringify(c.guide)};
  ${guideJS}
  ${skyScript}

  // ── page-only script ──
  ${pageScript}

  // ── era switcher ──
  ${eraSwitchJS}
  eraSwitch(document.querySelector('[data-era-switch]'));
  ${shakeJS}
  eraShake(document.querySelector('[data-era-menu]'));
  ${eraRailJS}
  eraRail(document.querySelector('[data-era-rail]'));

  // ── the tab bar shrinks to the current tab while you scroll down, comes back when you scroll up ──
  const bar = document.getElementById('tabbar'); let lastY = scrollY;
  addEventListener('scroll', () => { const y = scrollY; if (Math.abs(y - lastY) > 6) { bar.classList.toggle('min', y > lastY && y > 120); lastY = y; } }, { passive: true });

  // ── copy → copied: the button fills with the tint ──
  const live = document.getElementById('copied');
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    b.classList.add('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.emailCopied)}; live.textContent = ${JSON.stringify(c.ui.copiedAnnouncement)};
    setTimeout(() => { b.classList.remove('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.copyEmail)}; live.textContent = ''; }, 2000);
  }));

  // ── scroll: panels, cards and section headings rise into place the first time you reach them (after gauravi.design).
  //    Only what starts below the fold is hidden, so nothing waits at first paint, and the classes come off again once
  //    the thing has arrived. Things that enter together follow each other by 70ms. Article paragraphs are never touched ──
  if (!reduce && 'IntersectionObserver' in window) {
    const arrive = new IntersectionObserver(seen => { let i = 0; for (const s of seen) { if (!s.isIntersecting) continue; const el = s.target; arrive.unobserve(el);
      el.style.transitionDelay = (i++ * 70) + 'ms'; el.classList.add('in');
      el.addEventListener('transitionend', function done(e) { if (e.target !== el || e.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', done); el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; }); } }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of document.querySelectorAll('.title2, .work, .group, .pull, .footer, .stats, .soutcome, .sstatement, .sfig, .sgal, .sproto, .scallout, .sshort, .sending, .snext')) {
      if (el.parentElement.closest('.group, .footer')) continue;
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('rv'); arrive.observe(el); }
    }
  }

  // ── the guide as a collaborator's cursor, like a teammate in the same Figma file:
  //    it glides to whatever it's talking about and says it in cursor chat; phones park it as a capsule ──
  const box = document.getElementById('collab'), cur = document.getElementById('cur'), said = document.getElementById('said');
  const parked = touch || innerWidth < 700; box.classList.toggle('parked', parked);
  let settle, base = [0, 0], lastAt = null, scrolled;
  const place = (x, y, slow) => {
    x = Math.max(scrollX + 8, Math.min(x, scrollX + innerWidth - 28));   // never past the edge, so the page never scrolls sideways
    if (!slow) base = [x, y];
    cur.classList.toggle('flip', x - scrollX + 300 > innerWidth);
    cur.style.transitionDuration = reduce ? '0s' : slow ? '2.4s' : '';
    cur.style.setProperty('--x', Math.round(x) + 'px'); cur.style.setProperty('--y', Math.round(y) + 'px');
  };
  const wander = () => [scrollX + innerWidth * (.56 + Math.random() * .18), scrollY + innerHeight * (.3 + Math.random() * .24)];
  const seen = r => r.bottom > 56 && r.top < innerHeight - 90;
  const EXTRA = { resume: () => document.querySelector('.topbar > a.cap'), contact: () => document.querySelector('.footer .mail') };
  function spot(at) {   // a point on the page (document coords) next to what the line is about, or null when it's off screen
    const sec = document.querySelector('[data-guide-id="' + at + '"]'), el = EXTRA[at]?.() ?? (sec && (sec.querySelector('h1, h2') || sec));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (el.closest('.topbar')) return [scrollX + r.left + r.width * .4, scrollY + r.bottom - 8];
    if (seen(r)) { const rg = document.createRange(); rg.selectNodeContents(el); const rs = rg.getClientRects(), l = rs[rs.length - 1] || r;
      return [scrollX + Math.min(l.right + 10, innerWidth - 60), scrollY + l.top + l.height * .55]; }
    if (sec) { const q = sec.getBoundingClientRect(); if (seen(q)) return [scrollX + q.left + q.width * .5, scrollY + Math.max(90, Math.min(q.top + 40, innerHeight * .45))]; }
    return null;
  }
  const ui = {
    say(text, at) {
      const extra = at && !(at in G.sections), p = parked ? null : at ? spot(at) : null;
      if (extra && !p) return 0;   // "right here" lines only make sense when it can point at the thing
      clearTimeout(settle);
      said.textContent = text; box.dataset.state = 'talk';
      lastAt = at; if (!parked) place(...(p ?? wander()));
      settle = setTimeout(() => { box.dataset.state = 'quiet'; }, 6500);
      return 6500;
    },
    hide() { clearTimeout(settle); box.dataset.state = 'away'; },
    show() { box.dataset.state = 'quiet'; if (!parked) place(...wander()); },
  };
  // arrival: glides in from the right edge to the headline
  if (!parked) {
    place(scrollX + innerWidth, scrollY + innerHeight * .62); cur.style.transitionDuration = '0s';
    setTimeout(() => place(...((box.dataset.state === 'talk' && spot('hero')) || wander())), reduce ? 0 : 450);
  }
  // when the page stops scrolling with the cursor left off screen mid-sentence, it follows you
  addEventListener('scroll', () => { clearTimeout(scrolled); scrolled = setTimeout(() => {
    if (parked || box.dataset.state !== 'talk') return; const y = base[1] - scrollY;
    if (y < 56 || y > innerHeight - 90) place(...((lastAt && spot(lastAt)) || wander()));
  }, 160); }, { passive: true });
  // while it's quiet it drifts a little, the way a hand on a mouse does
  setInterval(() => { if (!parked && !reduce && box.dataset.state === 'quiet') place(base[0] + (Math.random() - .5) * 32, base[1] + (Math.random() - .5) * 22, true); }, 2600);
  const brain = guideBrain(G, ui, { quiet: reduce || touch, said: ${JSON.stringify(opening)} });
  if (parked) box.dataset.state = box.dataset.state === 'talk' ? 'quiet' : box.dataset.state;   // phones: never open over the headline
  else if (box.dataset.state === 'talk') settle = setTimeout(() => { box.dataset.state = 'quiet'; }, 7000);
  document.getElementById('who').addEventListener('click', () => brain.poke());
  document.getElementById('cpill').addEventListener('click', () => box.dataset.state === 'away' ? brain.wake() : brain.poke());
  box.querySelector('.cclose').addEventListener('click', () => brain.dismiss());
})();
</script>
</body>
</html>
`;
}
