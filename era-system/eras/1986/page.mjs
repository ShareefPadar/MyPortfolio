/**
 * ERA · 1986 — home. Title screen · level select · secret area · bonus stages.
 * Shell (menu, NPC guide, cursor, continue screen) in layout.mjs. Easter egg: SHIP THE BACKLOG (game.mjs) on top of the continue screen.
 * Portrait: the photo at one bit a pixel, an Atkinson dither of head and hand (portrait.mjs).
 * Flavour text ("LEVEL SELECT", "PRESS START") is aria-hidden ornament only.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
import { gameMarkup, gameScript } from './game.mjs';
import { gameJS } from '../_shared/client.mjs';
export const meta = { id: '1986', title: '1986 — 8-bit' };

export default function render(args) {
  const { content: c, icons, assetBase = '', portrait } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const p = c.person;

  const stages = c.selectedWork.items.map((w, i) => `
      <a class="box stage reveal" href="${esc(w.href)}">
        <div class="top"><span class="badge" aria-hidden="true">World 1-${i + 1}</span><span class="tag">${w.relevant ? '<span aria-hidden="true">★ </span>' : ''}${esc(w.domain)}</span></div>
        <div class="preview"><img src="${assetBase}${esc(w.image)}" alt="" loading="lazy"></div>
        <p class="meta">${esc(w.status)}</p>
        <h3>${esc(w.title)}</h3>
        <p class="meta">${esc(w.meta)}</p>
        <p class="summary">${esc(w.summary)}</p>
        <span class="enter"><span aria-hidden="true">▶ </span>${esc(c.ui.readCaseStudy)}</span>
      </a>`).join('');

  const bonus = c.live.items.map(l => `
      <article class="box alt stage reveal">
        <div class="top"><span class="badge">${esc(l.tag)}</span><span class="live-dot"><b class="led" aria-hidden="true"></b>${esc(l.status)}</span></div>
        <h3>${esc(l.title)}</h3>
        <p class="meta">${esc(l.meta)}</p>
        <p class="summary">${esc(l.summary)}</p>
        <div class="links">
          <a href="${esc(l.caseStudy)}">${esc(c.ui.caseStudy)}</a>
          <a href="${esc(l.launch)}" target="_blank" rel="noopener">${esc(c.ui.launchApp)}</a>
        </div>
      </article>`).join('');

  const main = `  <main id="main">
    <section class="title" data-guide-id="hero" aria-labelledby="hero-title">
      ${portraitMarkup(portrait)}
      <h1 id="hero-title">${esc(p.statement.before)} ${esc(p.statement.accent)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="press blink3" aria-hidden="true">Press start</div>
      <div class="cta-row">
        <a class="btn primary cursor" href="${esc(c.ctas.primary.href)}">${esc(c.ctas.primary.label)} ${ic('arrowD')}</a>
        <a class="btn" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
      </div>
      <p class="byline">${esc(p.eyebrow)}</p>
    </section>

    <section class="section" id="work" data-guide-id="work" aria-labelledby="w-h">
      <div class="section-head"><h2 id="w-h">${esc(c.selectedWork.heading)}</h2></div>
      <div class="stages">${stages}</div>
    </section>

    <div class="box secret reveal" data-guide-id="nda">
      <span class="flavour" aria-hidden="true">Secret area</span>
      <span class="lock">${ic('info')} ${esc(c.nda.label)}</span>
      <p>${esc(c.nda.text)}</p>
      <a class="btn cursor" href="${esc(c.nda.link.href)}">${esc(c.nda.link.label)}</a>
    </div>

    <section class="section" data-guide-id="live" aria-labelledby="l-h">
      <div class="section-head"><h2 id="l-h">${esc(c.live.heading)}</h2></div>
      <div class="stages">${bonus}</div>
    </section>
  </main>`;

  const pageScript = `
  ${portraitScript}
  ${gameJS}
  ${gameScript}

  // ── typed statement — visual only, the full text is in the DOM ──
  (function type(el, speed) {
    if (reduce) return;
    const chars = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) { const f = document.createDocumentFragment();
      for (const ch of n.data) { const sp = document.createElement('span'); sp.className = 'ch'; sp.textContent = ch; f.append(sp); chars.push(sp); } n.replaceWith(f); }
    el.classList.add('typing'); let i = 0;
    const id = setInterval(() => { chars[i++].classList.add('on'); if (i >= chars.length) { clearInterval(id); el.classList.remove('typing'); } }, speed);
  })(document.getElementById('hero-title'), 40);
`;
  return shell({ ...args, title: `${p.name}, Senior Product Designer`, current: '/', main, beforeFooter: gameMarkup(c), pageScript, guideOpening: c.guide.sections.hero });
}
