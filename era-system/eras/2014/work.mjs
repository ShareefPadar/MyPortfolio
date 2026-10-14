/**
 * ERA · 2014 — Work index, Material style.
 * 1995 → 2014: page head → a flat blue band; filter chips → scrollable tabs with a lime indicator;
 * "Start here" → image-top paper cards; "Everything else" → a two-line Material list (letter tile when there's no screenshot).
 */
import { shell, esc } from './layout.mjs';
import { filterJS } from '../_shared/client.mjs';
export const meta = { id: '2014', title: '2014 — Work' };

const TILE = { Fintech: '#1668C4', Travel: '#00796B', Navigation: '#2E7D32', Marketing: '#EF6C00', Social: '#C2185B', 'Co-living': '#00838F', Health: '#6A4BC4' };

export default function render(args) {
  const { content: c, icons, assetBase = '' } = args;
  const ic = n => icons.line[n];
  const w = c.workIndex;

  const card = p => `
      <a class="card" href="${esc(p.href)}" data-domain="${esc(p.domain)}">
        <div class="thumb"><span class="chip${p.relevant ? ' rel' : ''}">${esc(p.domain)}</span>${p.image ? `<img src="${assetBase}${esc(p.image)}" alt="" loading="lazy">` : ''}</div>
        <div class="card-body">
          <p class="meta">${esc(p.status)}</p>
          <h3>${esc(p.title)}</h3>
          <p class="meta">${esc(p.meta)}</p>
          ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
          <div class="card-foot"><span class="go">${esc(c.ui.readCaseStudy)}</span></div>
        </div>
      </a>`;

  const item = p => `
        <li data-domain="${esc(p.domain)}"><a class="mitem" href="${esc(p.href)}">
          ${p.image
            ? `<span class="mavatar"><img src="${assetBase}${esc(p.image)}" alt="" loading="lazy"></span>`
            : `<span class="mavatar letter" style="background:${TILE[p.domain] ?? '#1668C4'}" aria-hidden="true">${esc(p.domain.slice(0, 1))}</span>`}
          <span class="mtext"><span class="mtitle">${esc(p.title)}</span><span class="msub">${esc(p.meta)} · ${esc(p.status)}</span></span>
          <span class="mact">${esc(c.ui.readCaseStudy)}</span>
        </a></li>`;

  const main = `<main id="main" class="workpage">
  <section class="hero dark pagehead" aria-labelledby="w-title"><div class="wrap">
    <a class="back" href="${esc(w.back.href)}">${ic('arrowL')} ${esc(w.back.label)}</a>
    <h1 id="w-title">${esc(w.heading)}</h1>
    <p class="lead">${esc(w.intro)}</p>
  </div>
  <div class="tabstrip"><div class="wrap">
    <div class="ftabs" role="group" aria-label="Filter projects">
      ${[w.allLabel, ...w.filters].map((f, i) => `<button type="button" class="ftab" data-filter="${i ? esc(f) : '*'}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('\n      ')}
      <span class="ink" aria-hidden="true"></span>
    </div>
  </div></div></section>

  ${w.groups.map((g, gi) => `
  <section class="band${gi % 2 ? ' grey' : ''}" data-group aria-labelledby="g${gi}"><div class="wrap">
    <div class="band-head"><span class="num" aria-hidden="true">${String(gi + 1).padStart(2, '0')}</span><h2 id="g${gi}">${esc(g.heading)}</h2></div>
    ${g.compact ? `<ul class="mlist">${g.items.map(item).join('')}
    </ul>` : `<div class="cards three">${g.items.map(card).join('')}</div>`}
  </div></section>`).join('')}
</main>`;

  const pageScript = `
  ${filterJS}
  // the tab indicator slides to the chosen tab, Material-style
  const wp = document.querySelector('.workpage'), ink = wp.querySelector('.ink');
  const moveInk = () => { const on = wp.querySelector('.ftab[aria-pressed="true"]'); if (!on) return;
    ink.style.width = on.offsetWidth + 'px'; ink.style.transform = 'translateX(' + on.offsetLeft + 'px)'; };
  wp.addEventListener('filter', () => { moveInk(); const on = wp.querySelector('.ftab[aria-pressed="true"]'); on && on.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
  addEventListener('resize', moveInk);
  workFilter(wp);
  document.fonts && document.fonts.ready.then(moveInk);
`;
  return shell({ ...args, current: '/work', main, pageScript });
}
