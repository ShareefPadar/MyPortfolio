/**
 * ERA · 2014 — Flat / Material home. Blue hero band, image-top paper cards, a lime NDA band,
 * tinted live cards with long-shadow badges. Shell (app bar, drawer, snackbar guide, FAB) in layout.mjs.
 * Portrait: Shareef's vector illustration of himself in a circle, a faint ring and Material's paper shadow (portrait.mjs).
 * Easter egg: PAPER PLANE (game.mjs), the last band before the footer — its pillars grow out of the footer.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
import { gameMarkup, gameScript } from './game.mjs';
import { gameJS } from '../_shared/client.mjs';
export const meta = { id: '2014', title: '2014 — Flat' };

// a long shadow is just many 1px steps at 45°; the card header clips it
const longShadow = (color, len = 140) => Array.from({ length: len }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(',');

export default function render(args) {
  const { content: c, icons, assetBase = '', portrait } = args;
  const ic = n => icons.line[n];
  const p = c.person;

  const work = c.selectedWork.items.map(w => `
      <a class="card reveal" href="${esc(w.href)}">
        <div class="thumb"><span class="chip${w.relevant ? ' rel' : ''}">${esc(w.domain)}</span><img src="${assetBase}${esc(w.image)}" alt="" loading="lazy"></div>
        <div class="card-body">
          <p class="meta">${esc(w.status)}</p>
          <h3>${esc(w.title)}</h3>
          <p class="meta">${esc(w.meta)}</p>
          <p class="summary">${esc(w.summary)}</p>
          <div class="card-foot"><span class="go">${esc(c.ui.readCaseStudy)}</span></div>
        </div>
      </a>`).join('');

  const tints = ['tint-teal', 'tint-purple'];
  const live = c.live.items.map((l, i) => `
      <article class="card on-grey tinted ${tints[i % 2]} reveal">
        <div class="card-body">
          <span class="chip live">${esc(l.tag)} · ${esc(l.status)}</span>
          <p class="meta">${esc(l.meta)}</p>
          <h3>${esc(l.title)}</h3>
          <p class="summary">${esc(l.summary)}</p>
          <div class="card-foot">
            <a class="btn btn-flat" href="${esc(l.caseStudy)}">${esc(c.ui.caseStudy)}</a>
            <a class="btn btn-flat" href="${esc(l.launch)}" target="_blank" rel="noopener">${esc(c.ui.launchApp)}</a>
          </div>
        </div>
      </article>`).join('');

  const headCss = `
.tint-teal .badge { box-shadow: ${longShadow('#005F54')}; }
.tint-purple .badge { box-shadow: ${longShadow('#4E3597')}; }`;

  const main = `<main id="main">
  <section class="hero dark" data-guide-id="hero" aria-labelledby="hero-title"><div class="wrap">
    <div>
      <h1 id="hero-title">${esc(p.statement.before)} ${esc(p.statement.accent)}</h1>
      <p class="lead">${esc(p.lead)}</p>
      <div class="row">
        <a class="btn btn-lime" href="${esc(c.ctas.primary.href)}">${esc(c.ctas.primary.label)} ${ic('arrowD')}</a>
        <a class="btn btn-ghost-w" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a>
      </div>
      <p class="byline">${esc(p.eyebrow)}</p>
    </div>
    <div class="avatar-col">
      ${portraitMarkup(portrait)}
    </div>
  </div></section>

  <section class="band" id="work" data-guide-id="work" aria-labelledby="w-h"><div class="wrap">
    <div class="band-head reveal"><span class="num" aria-hidden="true">01</span><h2 id="w-h">${esc(c.selectedWork.heading)}</h2></div>
    <div class="cards">${work}</div>
  </div></section>

  <section class="nda reveal" data-guide-id="nda"><div class="wrap">
    <p><strong>${esc(c.nda.label)}.</strong> ${esc(c.nda.text)}</p>
    <a class="btn btn-ghost-d" href="${esc(c.nda.link.href)}">${esc(c.nda.link.label)}</a>
  </div></section>

  <section class="band grey" data-guide-id="live" aria-labelledby="l-h"><div class="wrap">
    <div class="band-head reveal"><span class="num" aria-hidden="true">02</span><h2 id="l-h">${esc(c.live.heading)}</h2></div>
    <div class="cards">${live}</div>
  </div></section>
${gameMarkup(c)}
</main>`;

  const pageScript = `
  ${portraitScript}
  ${gameJS}
  ${gameScript}
`;
  return shell({ ...args, title: `${p.name}, Senior Product Designer`, current: '/', main, pageScript, headCss, guideOpening: c.guide.sections.hero });
}
