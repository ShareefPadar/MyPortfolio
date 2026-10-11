/**
 * ERA · 1995 — Work index. Matches live /work: back link, title, intro,
 * single-select filter chips, "Start here" (full cards) and "Everything else" (compact).
 */
import { shell, esc, STYLES } from './layout.mjs';
export const meta = { id: '1995', title: '1995 — Work', styles: STYLES };

export default function render(args) {
  const { content: c, icons, assetBase = '' } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const w = c.workIndex;

  const card = (p, compact) => `
        <a class="card frame-raised" href="${esc(p.href)}" data-domain="${esc(p.domain)}">
          <span class="tab">${esc(p.domain)}</span>
          ${p.image
            ? `<div class="well frame-sunk"><img src="${assetBase}${esc(p.image)}" alt="" loading="lazy"></div>`
            : `<div class="well frame-sunk placeholder"><span class="mono">${esc(p.meta)}</span></div>`}
          <div class="body">
            <p class="mono">${esc(p.status)}</p>
            <h3>${esc(p.title)}</h3>
            <p class="mono">${esc(p.meta)}</p>
            ${!compact && p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ''}
            <span class="go">${esc(c.ui.readCaseStudy)} ${ic('arrowR')}</span>
          </div>
        </a>`;

  const main = `<main id="main" class="wrap workpage">
  <a class="back mono" href="${esc(w.back.href)}">${ic('arrowL')} ${esc(w.back.label)}</a>
  <h1 class="pagetitle">${esc(w.heading)}</h1>
  <p class="intro">${esc(w.intro)}</p>
  <div class="filters" role="group" aria-label="Filter projects">
    ${[w.allLabel, ...w.filters].map((f, i) => `<span class="focusable"><button type="button" class="btn frame-control chip" data-fill="surface" data-filter="${i ? esc(f) : '*'}" aria-pressed="${i === 0}"${i === 0 ? ' data-state="pressed"' : ''}>${esc(f)}</button></span>`).join('\n    ')}
  </div>
  ${w.groups.map((g, gi) => `
  <section class="group" aria-labelledby="g${gi}">
    <div class="marker"><span class="t-numeral">${String(gi + 1).padStart(2, '0')}</span><h2 id="g${gi}">${esc(g.heading)}</h2><i></i></div>
    <div class="cards">${g.items.map(p => card(p, g.compact)).join('')}</div>
  </section>`).join('')}
</main>`;

  // single-select filter; a group hides when none of its cards match (as on live)
  const pageScript = `
  const chips = document.querySelectorAll('[data-filter]');
  chips.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    chips.forEach(x => { const on = x === b; x.setAttribute('aria-pressed', on); if (on) x.dataset.state = 'pressed'; else delete x.dataset.state; });
    document.querySelectorAll('.workpage .card').forEach(card => { card.hidden = f !== '*' && card.dataset.domain !== f; });
    document.querySelectorAll('.workpage .group').forEach(g => { g.hidden = ![...g.querySelectorAll('.card')].some(x => !x.hidden); });
  }));`;

  return shell({ ...args, title: `${w.title} | ${c.person.name} — Senior Product Designer`, current: '/work', main, pageScript });
}
