/**
 * ERA · 2002 — home. Intro, Selected work panel, yellow info box, Designed & live panel;
 * sidebar: the portrait in a glossy frame with a reflection, then the contact widget (layout.mjs).
 * Portrait: the real photo as it is, in the glossy frame, with a gloss sweep on hover (portrait.mjs).
 * Easter egg: BUBBLE POP (game.mjs) between the page and the footer bar.
 * Flavour ("New!", the » chevrons, the gel app icons) is aria-hidden ornament only.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
import { gameMarkup, gameScript } from './game.mjs';
import { gameJS } from '../_shared/client.mjs';
export const meta = { id: '2002', title: '2002 — Glossy' };

export default function render(args) {
  const { content: c, icons, assetBase = '', portrait } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.line[n]}</span>`;
  const p = c.person;

  const work = c.selectedWork.items.map((w, i) => `
        <article class="item">
          <div class="thumb"><img src="${assetBase}${esc(w.image)}" alt="" loading="lazy">${i === 0 ? '<span class="starburst" aria-hidden="true">New!</span>' : ''}</div>
          <div>
            <span class="domain">${esc(w.domain)}</span>
            <p class="meta">${esc(w.status)}</p>
            <h3><a href="${esc(w.href)}">${esc(w.title)}</a></h3>
            <p class="meta">${esc(w.meta)}</p>
            <p class="summary">${esc(w.summary)}</p>
            <a class="more" href="${esc(w.href)}">${esc(c.ui.readCaseStudy)}</a>
          </div>
        </article>`).join('');

  const live = c.live.items.map(l => {
    return `
        <article class="item app">
          <div>
            <span class="domain">${esc(l.tag)}</span>
            <div class="status"><i class="orb" aria-hidden="true"></i>${esc(l.status)}</div>
            <h3>${esc(l.title)}</h3>
            <p class="meta">${esc(l.meta)}</p>
            <p class="summary">${esc(l.summary)}</p>
            <div class="links">
              <a class="more" href="${esc(l.caseStudy)}">${esc(c.ui.caseStudy)}</a>
              <a class="more" href="${esc(l.launch)}" target="_blank" rel="noopener">${esc(c.ui.launchApp)}</a>
            </div>
          </div>
        </article>`; }).join('');

  const main = `    <main class="main" id="main">
      <section class="b-intro" data-guide-id="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">${esc(p.statement.before)} ${esc(p.statement.accent)}</h1>
        <p class="lead">${esc(p.lead)}</p>
        <div class="row">
          <a class="gel gel-blue" href="${esc(c.ctas.primary.href)}">${esc(c.ctas.primary.label)} ${ic('arrowD')}</a>
          <a class="gel gel-silver" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
        </div>
        <p class="byline">${esc(p.eyebrow)}</p>
      </section>

      <section class="panel b-work reveal" id="work" data-guide-id="work" aria-labelledby="w-h">
        <h2 class="panel-head" id="w-h">${esc(c.selectedWork.heading)}</h2>
        ${work}
      </section>

      <div class="note b-nda reveal" data-guide-id="nda">
        <span class="note-i" aria-hidden="true">i</span>
        <p><strong>${esc(c.nda.label)}.</strong> ${esc(c.nda.text)}</p>
        <a class="more" href="${esc(c.nda.link.href)}">${esc(c.nda.link.label)}</a>
      </div>

      <section class="panel b-live reveal" data-guide-id="live" aria-labelledby="l-h">
        <h2 class="panel-head" id="l-h">${esc(c.live.heading)}</h2>
        ${live}
      </section>
    </main>`;

  const side = `
      <div class="b-about">
        ${portraitMarkup(portrait)}
      </div>`;

  const pageScript = `
  ${portraitScript}
  ${gameJS}
  ${gameScript}
`;
  return shell({ ...args, title: `${p.name}, Senior Product Designer`, current: '/', main, side, beforeFooter: gameMarkup(c), pageScript, guideOpening: c.guide.sections.hero });
}
