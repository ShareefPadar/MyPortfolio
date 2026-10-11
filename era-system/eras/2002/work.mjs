/**
 * ERA · 2002 — Work index as a Web 2.0 portfolio directory.
 * 1995 → 2002: back link → breadcrumb (Home » All work); filter chips → gel tag pills with a "showing N" count;
 * "Start here" → a panel of featured items with reflected thumbnails; "Everything else" → a striped directory list
 * (gel app icon when there's no screenshot). Sidebar: the contact widget from the shell.
 */
import { shell, esc } from './layout.mjs';
import { filterJS } from '../_shared/client.mjs';
export const meta = { id: '2002', title: '2002 — Work' };

const TINT = { Fintech: 'blue', Travel: 'teal', Navigation: 'green', Marketing: 'orange', Social: 'pink', 'Co-living': 'teal', Health: 'violet' };

export default function render(args) {
  const { content: c, icons, assetBase = '' } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.line[n]}</span>`;
  const w = c.workIndex;
  const total = w.groups.reduce((n, g) => n + g.items.length, 0);

  const featured = p => `
        <article class="item" data-domain="${esc(p.domain)}">
          <div class="thumb">${p.image ? `<img src="${assetBase}${esc(p.image)}" alt="" loading="lazy">` : ''}</div>
          <div>
            <span class="domain">${esc(p.domain)}</span>
            <p class="meta">${esc(p.status)}</p>
            <h3><a href="${esc(p.href)}">${esc(p.title)}</a></h3>
            <p class="meta">${esc(p.meta)}</p>
            ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
            <a class="more" href="${esc(p.href)}">${esc(c.ui.readCaseStudy)}</a>
          </div>
        </article>`;

  const row = p => `
          <li class="dir-row" data-domain="${esc(p.domain)}">
            ${p.image
              ? `<span class="dir-thumb"><img src="${assetBase}${esc(p.image)}" alt="" loading="lazy"></span>`
              : `<span class="dir-thumb gelicon ${TINT[p.domain] ?? 'blue'}" aria-hidden="true">${esc(p.domain.slice(0, 1))}</span>`}
            <div class="dir-text">
              <h3><a href="${esc(p.href)}">${esc(p.title)}</a></h3>
              <p class="meta">${esc(p.meta)} · ${esc(p.status)}</p>
            </div>
            <span class="domain">${esc(p.domain)}</span>
            <a class="more" href="${esc(p.href)}" aria-label="${esc(c.ui.readCaseStudy)}: ${esc(p.title)}">${esc(c.ui.readCaseStudy)}</a>
          </li>`;

  const main = `    <main class="main workpage" id="main">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(w.back.href)}">${esc(w.back.label)}</a><span aria-hidden="true"> » </span><span aria-current="page">${esc(w.heading)}</span></nav>
      <section class="b-intro" aria-labelledby="w-title">
        <h1 id="w-title">${esc(w.heading)}</h1>
        <p class="lead">${esc(w.intro)}</p>
      </section>

      <div class="tagbar">
        <div class="tags" role="group" aria-label="Filter projects">
          ${[w.allLabel, ...w.filters].map((f, i) => `<button type="button" class="tag" data-filter="${i ? esc(f) : '*'}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('\n          ')}
        </div>
        <p class="showing" aria-hidden="true">Showing <b id="shown">${total}</b> of ${total}</p>
      </div>

      ${w.groups.map((g, gi) => g.compact ? `
      <section class="panel" data-group aria-labelledby="g${gi}">
        <h2 class="panel-head" id="g${gi}">${esc(g.heading)}</h2>
        <ul class="dir">${g.items.map(row).join('')}
        </ul>
      </section>` : `
      <section class="panel" data-group aria-labelledby="g${gi}">
        <h2 class="panel-head" id="g${gi}">${esc(g.heading)}</h2>
        ${g.items.map(featured).join('')}
      </section>`).join('\n')}
    </main>`;

  const pageScript = `
  ${filterJS}
  const wp = document.querySelector('.workpage'), shown = document.getElementById('shown');
  wp.addEventListener('filter', e => { shown.textContent = e.detail.shown; });
  workFilter(wp);
`;
  return shell({ ...args, current: '/work', main, pageScript });
}
