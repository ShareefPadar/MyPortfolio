/**
 * ERA · now — Work index, Liquid Glass the way Apple ships it.
 * Back button, large title, a segmented control for the filter (solid, as iOS draws it in content), "Start here" as big
 * screenshots with text under them, "Everything else" as a grouped list with a small thumbnail where there is one.
 */
import { shell, esc, BACK } from './layout.mjs';
import { filterJS } from '../_shared/client.mjs';
export const meta = { id: 'now', title: 'Now · Work' };

export default function render(args) {
  const { content: c, assetBase = '' } = args;
  const w = c.workIndex;
  const total = w.groups.reduce((n, g) => n + g.items.length, 0);

  const card = p => `
        <a class="work" href="${esc(p.href)}" data-domain="${esc(p.domain)}">
          <div class="shotwell">${p.image ? `<img src="${assetBase}${esc(p.image)}" alt="" loading="lazy">` : ''}</div>
          <p class="kicker">${esc(p.status)}</p>
          <h3>${esc(p.title)}</h3>
          <p class="meta">${esc(p.meta)}</p>
          ${p.summary ? `<p class="sum">${esc(p.summary)}</p>` : ''}
          <span class="sr">${esc(c.ui.readCaseStudy)}</span>
        </a>`;

  const row = p => `
        <a class="row" href="${esc(p.href)}" data-domain="${esc(p.domain)}">
          <span class="txt"><span class="kicker">${esc(p.status)}</span><span class="rt">${esc(p.title)}</span><span class="rm">${esc(p.meta)}</span><span class="sr">${esc(c.ui.readCaseStudy)}</span></span>
          ${p.image ? `<span class="thumb"><img src="${assetBase}${esc(p.image)}" alt="" loading="lazy"></span>` : ''}
        </a>`;

  const main = `  <div class="workpage">
    <section class="pagehead" aria-labelledby="w-title">
      <a class="back" href="${esc(w.back.href)}">${BACK}${esc(w.back.label)}</a>
      <h1 class="large" id="w-title">${esc(w.heading)}</h1>
      <p class="lead">${esc(w.intro)}</p>
      <div class="seg" role="group" aria-label="Filter projects">
        <span class="lens" aria-hidden="true"></span>
        ${[w.allLabel, ...w.filters].map((f, i) => `<button type="button" class="segbtn" data-filter="${i ? esc(f) : '*'}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('\n        ')}
      </div>
      <p class="count" aria-hidden="true"><b id="shown">${total}</b> of ${total}</p>
    </section>
    ${w.groups.map((g, gi) => `
    <section class="wgroup" data-group aria-labelledby="g${gi}">
      <h2 class="title2" id="g${gi}">${esc(g.heading)}</h2>
      ${g.compact
        ? `<div class="group wrows">${g.items.map(row).join('')}
      </div>`
        : `<div class="works">${g.items.map(card).join('')}
      </div>`}
    </section>`).join('')}
  </div>`;

  const pageScript = `
  ${filterJS}
  // the segmented control's thumb slides under the chosen segment
  const wp = document.querySelector('.workpage'), seg = wp.querySelector('.seg'), lens = wp.querySelector('.lens'), shown = document.getElementById('shown');
  const moveLens = () => { const on = seg.querySelector('[aria-pressed="true"]'); if (!on) return;
    lens.style.width = on.offsetWidth + 'px'; lens.style.transform = 'translateX(' + on.offsetLeft + 'px)'; };
  wp.addEventListener('filter', e => { shown.textContent = e.detail.shown; moveLens(); const on = seg.querySelector('[aria-pressed="true"]'); on && on.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
  addEventListener('resize', moveLens);
  workFilter(wp);
  moveLens();
`;
  return shell({ ...args, current: '/work', main, pageScript });
}
