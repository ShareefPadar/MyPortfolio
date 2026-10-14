/**
 * ERA · 1995 — case study. Matches live /work/<slug>: top row (All work + reading progress),
 * overview header (label, title, meta grid, lead, outcome), statement quote, then the body blocks
 * from content/studies/<id>.json, an optional "See it live" ending, and Next story.
 *
 * Block types: p · h2 · h3 · hr · quote · callout · short · figure · prototype · ul · ol · pre
 * Prototype: the real site mounts the live React prototype; previews show a capture.
 */
import { shell, esc, STYLES } from './layout.mjs';
export const meta = { id: '1995', title: '1995 — Case study', styles: STYLES };

export default function render(args) {
  const { content: c, icons, assetBase = '', study } = args;
  const st = c.studies[study], H = st.head;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const src = s => /^https?:/.test(s) ? s : assetBase + s;
  const label = (num, text, id) => `<div class="slabel"><span class="snum">${esc(num)}</span><h2 class="sname"${id ? ` id="${id}"` : ''}>${esc(text)}</h2></div>`;

  const block = b => {
    switch (b.type) {
      case 'p': return `<p class="sp">${b.html}</p>`;
      case 'h2': return `<h2 class="sh2">${esc(b.text)}</h2>`;
      case 'h3': return `<h3 class="sh3">${esc(b.text)}</h3>`;
      case 'hr': return `<hr class="shr">`;
      case 'quote': return `<blockquote class="squote rule-${b.rule}"><p>${b.html}</p>${b.cite ? `<p class="scite">${b.cite}</p>` : ''}</blockquote>`;
      case 'callout': return `<aside class="scallout rule-${b.rule}">${b.label ? `<p class="smono">${esc(b.label)}</p>` : ''}<div>${b.paras.map(h => `<p>${h}</p>`).join('')}</div></aside>`;
      case 'ul': case 'ol': return `<${b.type} class="slist">${b.items.map(i => `<li>${i}</li>`).join('')}</${b.type}>`;
      case 'pre': return `<pre class="spre"><code>${esc(b.text)}</code></pre>`;
      case 'short': return `<aside class="sshort">
        <span class="sshort-tab">${esc(b.tab)}</span>
        <div class="sshort-body">
          <p class="smono">${esc(b.note)}</p>
          <dl>${b.rows.map(r => `<div><dt>${esc(r.k)}</dt><dd>${r.v}</dd></div>`).join('')}</dl>
        </div>
      </aside>`;
      case 'figure': return `<figure class="sfig">${b.images.map(i => b.zoom
          ? `<button type="button" class="sfig-zoom" data-full="${esc(src(i.src))}" aria-label="View ${esc(i.alt)} full size"><img src="${esc(src(i.src))}" alt="${esc(i.alt)}" loading="lazy"><span class="sfig-hint smono" aria-hidden="true">View full size</span></button>`
          : `<img src="${esc(src(i.src))}" alt="${esc(i.alt)}" loading="lazy">`).join('')}
        ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
      case 'gallery': return `<figure class="sgal">
        <div class="sgal-grid" style="grid-template-columns:repeat(${b.cols}, minmax(0, 1fr))${b.maxWidth ? `;max-width:${b.maxWidth}px` : ''}">${b.items.map(i => `<div>
          <button type="button" class="sgal-btn sfig-zoom" data-full="${esc(src(i.src))}" aria-label="View ${esc(i.label)} full size"><img src="${esc(src(i.src))}" alt="${esc(i.alt)}" loading="lazy">${i.badge ? `<span class="sgal-badge" aria-hidden="true">${esc(i.badge)}</span>` : ''}<span class="sgal-hint" aria-hidden="true">View full size</span></button>
          <span class="sgal-label">${esc(i.label)}</span></div>`).join('')}</div>
        ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
      case 'prototype': return `<figure class="sproto">
        <div class="sproto-label smono"><span class="led-dot" aria-hidden="true"></span><span>${esc(b.label)}</span></div>
        <div class="sproto-frame">
          <div class="sproto-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="smono">${esc(b.url)}</span><span aria-hidden="true"></span></div>
          <div class="sproto-screen"><img src="captures/${esc(st.id)}-prototype.png" alt="${esc(b.label)}"></div>
        </div>
        <figcaption>${esc(b.caption)}</figcaption></figure>`;
      default: return '';
    }
  };

  const main = `<main id="main" class="study">
  <div class="wrap study-top">
    <a class="back mono" href="/work">${ic('arrowL')} All work</a>
    <div class="progress" role="progressbar" aria-label="Reading progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">${'<span></span>'.repeat(st.progressSegments)}</div>
  </div>

  <header class="scol shead">
    ${label(H.number, H.label)}
    <h1 class="stitle">${esc(H.title)}</h1>
    <dl class="smeta">${H.meta.map(m => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>
    ${H.lead ? `<p class="slead">${H.lead}</p>` : ''}
    ${H.outcome ? `<div class="soutcome"><p class="smono">${esc(H.outcome.label)}</p><p>${H.outcome.text}</p></div>` : ''}
  </header>
  ${H.statement ? `<div class="scol sstatement"><blockquote class="squote rule-blue"><p>${H.statement}</p></blockquote></div>` : ''}

  <div class="sbody"><div class="scol">
    ${st.blocks.map(block).join('\n    ')}
  </div></div>

  ${st.ending ? `<section class="sending" aria-labelledby="end-h"><div class="scol"><div class="send-in">
    ${label(st.ending.number, st.ending.heading, 'end-h')}
    <p class="send-text">${esc(st.ending.text)}</p>
    <div class="row">${st.ending.links.map((l, i) => i === 0
      ? `<span class="focusable"><a class="btn frame-control" data-fill="action" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${ic('external')}</a></span>`
      : `<a class="go" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${ic('external')}</a>`).join('')}</div>
  </div></div></section>` : ''}

  <div class="snext"><div class="scol">
    <a href="${esc(st.next.href)}"><span class="smono">${esc(st.next.label)}</span><span class="snext-title">${esc(st.next.title)} ${ic('arrowR')}</span></a>
  </div></div>
</main>
<dialog class="lightbox" id="lightbox" aria-label="Full-size image"><button type="button" class="lb-close mono" aria-label="Close">Close ×</button><img alt=""></dialog>`;

  const pageScript = `
  // reading progress: one segment per 10% of the article read, like live
  const bar = document.querySelector('.progress'), segs = bar.querySelectorAll('span');
  const art = document.querySelector('main.study');
  const upd = () => { const r = art.getBoundingClientRect(), total = r.height - innerHeight;
    const pct = Math.max(0, Math.min(100, Math.round(-r.top / Math.max(1, total) * 100)));
    bar.setAttribute('aria-valuenow', pct); segs.forEach((s, i) => s.classList.toggle('on', i < Math.floor(pct / (100 / segs.length)))); };
  addEventListener('scroll', upd, { passive: true }); upd();
  // lightbox
  const lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
  document.querySelectorAll('.sfig-zoom').forEach(b => b.addEventListener('click', () => { lbImg.src = b.dataset.full; lbImg.alt = b.querySelector('img').alt; lb.showModal(); }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) lb.close(); });`;

  return shell({ ...args, title: st.pageTitle, current: '/work', main, pageScript, compactFooter: true });
}
