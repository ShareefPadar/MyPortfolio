/**
 * ERA · now — home, Liquid Glass the way Apple ships it.
 * The page itself is solid content: a large title, the portrait in a well, big screenshots with plain text under them,
 * Settings-style grouped panels for the NDA note and the live products. Glass is only the controls (layout.mjs).
 * Easter egg: GLASS MERGE (game.mjs), sitting flush on the footer panel, which is the jar's floor.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
import { gameMarkup, gameScript } from './game.mjs';
import { gameJS } from '../_shared/client.mjs';
export const meta = { id: 'now', title: 'Now · Liquid Glass' };

export default function render(args) {
  const { content: c, assetBase = '', portrait } = args;
  const p = c.person;

  const work = c.selectedWork.items.map(w => `
      <a class="work" href="${esc(w.href)}">
        <div class="shotwell"><img src="${assetBase}${esc(w.image)}" alt="" loading="lazy"></div>
        <p class="kicker">${esc(w.status)}</p>
        <h3>${esc(w.title)}</h3>
        <p class="meta">${esc(w.meta)}</p>
        <p class="sum">${esc(w.summary)}</p>
        <span class="more">${esc(c.ui.readCaseStudy)}</span>
      </a>`).join('');

  const live = c.live.items.map(l => `
      <article class="row">
        <p class="kicker">${esc(l.tag)} · ${esc(l.status)}</p>
        <h3>${esc(l.title)}</h3>
        <p class="meta">${esc(l.meta)}</p>
        <p>${esc(l.summary)}</p>
        <div class="links"><a href="${esc(l.caseStudy)}">${esc(c.ui.caseStudy)}</a><a href="${esc(l.launch)}" target="_blank" rel="noopener">${esc(c.ui.launchApp)}</a></div>
      </article>`).join('');

  const main = `  <section class="hero" data-guide-id="hero" aria-labelledby="hero-title">
    <div>
      <h1 class="large" id="hero-title">${esc(p.statement.before)} ${esc(p.statement.accent)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="actions">
        <a class="btn prominent" href="${esc(c.ctas.primary.href)}">${esc(c.ctas.primary.label)}</a>
        <a class="btn bordered" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)}</a>
      </div>
      <p class="byline">${esc(p.eyebrow)}</p>
    </div>
    ${portraitMarkup(portrait)}
  </section>

  <section id="work" data-guide-id="work" aria-labelledby="work-h">
    <h2 class="title2" id="work-h">${esc(c.selectedWork.heading)}</h2>
    <div class="works">${work}
    </div>
  </section>

  <section class="group note" data-guide-id="nda" aria-labelledby="nda-h">
    <h2 id="nda-h">${esc(c.nda.label)}</h2>
    <p>${esc(c.nda.text)}</p>
    <a href="${esc(c.nda.link.href)}">${esc(c.nda.link.label)}</a>
  </section>

  <section data-guide-id="live" aria-labelledby="live-h">
    <h2 class="title2" id="live-h">${esc(c.live.heading)}</h2>
    <div class="group">${live}
    </div>
  </section>
${gameMarkup(c)}`;

  const pageScript = `
  ${portraitScript}
  ${gameJS}
  ${gameScript}
`;
  return shell({ ...args, title: `${p.name}, Senior Product Designer`, current: '/', main, pageScript, guideOpening: c.guide.sections.hero });
}
