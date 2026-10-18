/**
 * ERA · 2002 — shared shell for every 2002 page (glossy Web 2.0: pinstripes, gel, reflections).
 * 1995 → 2002 translations:
 *   sprite nav buttons   → glossy tabs on a gel masthead, current tab joins the page
 *   Clippy               → an instant-messenger conversation window: title bar, "is typing…" status, minimise to a buddy pill
 *   pixel cursor         → an Aqua-style arrow (CSS cursor, so it costs nothing)
 *   footer               → a sidebar "Let's connect" widget + a gel footer bar
 *   Copy → Copied        → the gel turns lime with a tick, the button "yellow-fades"
 *   home's easter egg    → BUBBLE POP over the pinstripes, its launcher sitting on the gel footer bar (game.mjs, passed as beforeFooter)
 * Pages supply <main>, optional `side` content (sits top-right on desktop, first on phones — e.g. the portrait), and any page-only script.
 * The IM window opens when Clippy talks and settles back into its buddy pill when he's quiet (unless you minimised it yourself).
 */
import { guideJS, eraSwitchJS, shakeJS, eraRailJS, arriveHeadJS } from '../_shared/client.mjs';
import { eraItems } from '../_shared/eras.mjs';
import { headMeta } from '../_shared/head.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Aqua-style arrow: black with a white keyline and a soft shadow
const AQUA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-opacity=".45"/></filter></defs><path filter="url(#s)" d="M4.5 2.5v16.2l4.1-3.9 2.7 6.2 2.9-1.3-2.7-6.1h5.8z" fill="#000" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const cursorCss = `html[data-era="2002"] { cursor: url("data:image/svg+xml,${encodeURIComponent(AQUA)}") 4 2, auto; }`;

export function shell({ content: c, pageUrl = '/', study = null, assetBase = '', icons, css, portrait, sprites1995, title, current = '/', main, side = '', beforeFooter = '', pageScript = '', guideOpening = null, compactFooter = false }) {
  const ic = n => `<span class="ic" aria-hidden="true">${icons.line[n]}</span>`;
  const p = c.person;
  const opening = guideOpening ?? '';
  const contact = compactFooter ? '' : `
      <section class="panel b-contact reveal" id="contact" aria-labelledby="c-h">
        <h2 class="panel-head" id="c-h">${esc(c.footer.heading)}</h2>
        <div class="panel-body">
          <p class="small">${esc(c.footer.status)}</p>
          <p class="intro">${esc(c.footer.intro)}</p>
          <a class="mail" href="mailto:${esc(c.footer.email)}">${esc(c.footer.email)}</a>
          <button class="gel gel-silver block copy" type="button" data-copy="${esc(c.footer.email)}"><span class="ic i-copy" aria-hidden="true">${icons.line.copy}</span><span class="ic i-done" aria-hidden="true">${icons.line.check}</span> <span class="label">${esc(c.ui.copyEmail)}</span></button>
          <span class="sr" aria-live="polite" id="copied"></span>
          ${c.footer.socials.map(s => `<a class="gel gel-silver block" href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('\n          ')}
        </div>
      </section>`;
  return `<!DOCTYPE html>
<html lang="en" data-era="2002">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${headMeta({ content: c, pageUrl, study, assetBase })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Nunito+Sans:wght@400;700;800&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js')</script>
${arriveHeadJS}
<style>
${css}
@media (hover: hover) and (prefers-reduced-motion: no-preference) { ${cursorCss} }
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="arrive" aria-hidden="true"></div>
<div class="page">

  <header class="masthead dark">
    <div class="mast-row">
      <a class="logo" href="/">${esc(p.shortName)}</a>
      <a class="gel gel-silver" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
    </div>
    <nav class="tabs" aria-label="Main">
      ${c.nav.map(n => `<a href="${esc(n.href)}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n      ')}
    </nav>
  </header>
  <div class="eraswitch" data-era-switch>
  <button class="gel gel-silver yeargel" type="button" data-era-toggle aria-expanded="false" aria-controls="yearmenu"><span class="sr">${esc(c.eras.label)}: </span>${esc(eraItems(c, pageUrl, '2002').find(e => e.current).year)} ${ic('chevron')}</button>
  <div class="yearmenu" id="yearmenu" data-era-menu hidden>
    <p class="yearmenu-h" aria-hidden="true">${esc(c.eras.label)}</p>
    <ul>
      ${eraItems(c, pageUrl, '2002').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><span class="tick" aria-hidden="true">${e.current ? '✓' : ''}</span><b>${esc(e.year)}</b><span class="nm">${esc(e.name)}</span></a></li>`).join('\n            ')}
    </ul>
    <div class="shake" data-shake hidden><p data-shake-hint>${esc(c.eras.shake.hint)}</p><button type="button" data-shake-ask hidden>${esc(c.eras.shake.enable)}</button></div>
  </div>
  </div>
  <nav class="yearrail" aria-label="${esc(c.eras.label)}" data-era-rail>
    <ul>
      ${eraItems(c, pageUrl, '2002').map(e => `<li><a data-era="${e.id}" href="${esc(e.href)}"${e.current ? ' aria-current="true"' : ''}><b>${esc(e.year)}</b></a></li>`).join('\n      ')}
    </ul>
  </nav>
  <div class="under-tabs" aria-hidden="true"></div>

  <div class="layout${compactFooter ? ' solo' : ''}${side && !compactFooter ? ' has-lead' : ''}">
${side && !compactFooter ? `    <div class="lead">${side}
    </div>` : ''}
${main}
${compactFooter ? '' : `    <div class="side">${contact}
    </div>`}
  </div>
${beforeFooter}
  <footer class="footbar dark">
    ${compactFooter ? `<span class="fstatus">${esc(c.footer.status)}</span>` : ''}
    <span>${esc(c.footer.credit)}</span>
    <a href="#main">${esc(c.ui.backToTop)} ${ic('arrowU')}</a>
  </footer>
</div>

<aside class="ast" id="ast" aria-label="${esc(c.guide.name)}" data-state="${opening ? 'talk' : 'idle'}">
  <div class="balloon" id="balloon">
    <p class="bl-msg" id="bl-msg">${esc(opening)}</p>
    <ul class="bl-opts">
      ${c.nav.filter(n => n.href !== current).map(n => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join('')}<li><a href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)}</a></li>
    </ul>
    <div class="bl-foot"><button class="bl-hide" type="button" aria-label="${esc(c.ui.hideGuide)} ${esc(c.guide.name)}">${esc(c.ui.hideGuide)}</button></div>
  </div>
  <button class="ast-char" id="ast-char" type="button" aria-label="${esc(c.guide.name)}"></button>
</aside>

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

  // ── panels blind down once on scroll-in ──
  const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── copy → copied: lime gel with a tick, then a yellow fade ──
  const live = document.getElementById('copied');
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    b.classList.add('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.emailCopied)}; live.textContent = ${JSON.stringify(c.ui.copiedAnnouncement)};
    setTimeout(() => { b.classList.remove('got'); b.querySelector('.label').textContent = ${JSON.stringify(c.ui.copyEmail)}; live.textContent = ''; }, 2000);
  }));

  // ── Clippy as the Office assistant of 2002: he stands bottom right with no window around him; his lines come
  //    in a pale yellow balloon with a few options and a Hide button. He fidgets while idle, like he did ──
  const ast = document.getElementById('ast'), who = document.getElementById('ast-char'), bmsg = document.getElementById('bl-msg');
  const SP = ${JSON.stringify(sprites1995.clippy)};
  const draw = g => '<svg viewBox="0 0 ' + g[0].length + ' ' + g.length + '" shape-rendering="crispEdges" aria-hidden="true">' +
    g.flatMap((row, y) => [...row].map((ch, x) => ch === '.' ? '' : '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + (ch === 'X' ? '#14140F' : '#F0EFF4') + '"/>')).join('') + '</svg>';
  const frame = f => { who.innerHTML = draw(SP.frames[f]); };
  frame('rest');
  const small = touch || innerWidth < 700;
  let settle, talking = false;
  const ui = {
    say(text) {
      clearTimeout(settle); bmsg.textContent = text; ast.dataset.state = 'talk'; talking = true;
      settle = setTimeout(() => { ast.dataset.state = 'idle'; talking = false; }, 7000);
      return 7000;
    },
    hide() { clearTimeout(settle); ast.dataset.state = 'away'; },
    show() { ast.dataset.state = 'idle'; },
  };
  if (!reduce) (function fidget() { setTimeout(() => { const seq = talking ? SP.talkSequence : SP.idleSequences[Math.floor(Math.random() * SP.idleSequences.length)]; let i = 0;
    (function step() { if (i >= seq.length) { frame('rest'); return fidget(); } const [f, ms] = seq[i++]; frame(f); setTimeout(step, ms); })(); }, talking ? 150 : 2400 + 3600 * Math.random()); })();
  const brain = guideBrain(G, ui, { quiet: reduce || touch, said: ${JSON.stringify(opening)} });
  who.addEventListener('click', () => ast.dataset.state === 'talk' && small ? (clearTimeout(settle), ast.dataset.state = 'idle', talking = false) : brain.poke());
  ast.querySelector('.bl-hide').addEventListener('click', () => brain.dismiss());
  if (small) ast.dataset.state = 'idle';   // phones: he stands quietly; tap him to talk
  else if (ast.dataset.state === 'talk') settle = setTimeout(() => { ast.dataset.state = 'idle'; talking = false; }, 8000);
})();
</script>
</body>
</html>
`;
}
