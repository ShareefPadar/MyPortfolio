/**
 * ERA · 1986 — Work index as a STAGE SELECT.
 * 1995 → 1986: filter chips → category options with a ▶ cursor and a stage counter;
 * "Start here" → WORLD 1 (full stage cards); "Everything else" → WORLD 2 (small stages, a dithered card when there's no screenshot).
 * Flavour text ("Stage select", "World 1", "Stages") is aria-hidden ornament.
 */
import { shell, esc } from './layout.mjs';
import { filterJS } from '../_shared/client.mjs';
export const meta = { id: '1986', title: '1986 — Work' };

export default function render(args) {
  const { content: c, icons, assetBase = '' } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const w = c.workIndex;

  const stage = (p, world, i, compact) => `
        <a class="box stage${compact ? ' mini' : ''}" href="${esc(p.href)}" data-domain="${esc(p.domain)}">
          <div class="top"><span class="badge" aria-hidden="true">${world}-${i + 1}</span><span class="tag">${p.relevant ? '<span aria-hidden="true">★ </span>' : ''}${esc(p.domain)}</span></div>
          ${p.image
            ? `<div class="preview"><img src="${assetBase}${esc(p.image)}" alt="" loading="lazy"></div>`
            : `<div class="preview dither" aria-hidden="true"><span>${esc(p.domain)}</span></div>`}
          <p class="meta">${esc(p.status)}</p>
          <h3>${esc(p.title)}</h3>
          <p class="meta">${esc(p.meta)}</p>
          ${!compact && p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
          <span class="enter"><span aria-hidden="true">▶ </span>${esc(c.ui.readCaseStudy)}</span>
        </a>`;

  const main = `  <main id="main" class="workpage">
    <section class="title pagehead" aria-labelledby="w-title">
      <a class="back" href="${esc(w.back.href)}">${ic('arrowL')} ${esc(w.back.label)}</a>
      <h1 id="w-title">${esc(w.heading)}</h1>
      <p class="lead">${esc(w.intro)}</p>
    </section>

    <div class="box filters">
      <div class="opts" role="group" aria-label="Filter projects">
        ${[w.allLabel, ...w.filters].map((f, i) => `<button type="button" class="opt" data-filter="${i ? esc(f) : '*'}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('\n        ')}
      </div>
      <p class="count" aria-hidden="true">Stages <b id="stage-count">0${c.workIndex.groups.reduce((n, g) => n + g.items.length, 0)}</b></p>
    </div>

    ${w.groups.map((g, gi) => `
    <section class="section" data-group aria-labelledby="g${gi}">
      <div class="section-head"><h2 id="g${gi}">${esc(g.heading)}</h2></div>
      <div class="stages${g.compact ? ' minis' : ''}">${g.items.map((p, i) => stage(p, gi + 1, i, g.compact)).join('')}</div>
    </section>`).join('')}
  </main>`;

  const pageScript = `
  ${filterJS}
  const wp = document.querySelector('.workpage'), count = document.getElementById('stage-count');
  wp.addEventListener('filter', e => { count.textContent = String(e.detail.shown).padStart(2, '0'); });
  workFilter(wp);
`;
  return shell({ ...args, current: '/work', main, pageScript });
}
