/**
 * ERA · 2002 — case study as a Web 2.0 article, full width (no sidebar), in one white panel.
 * 1995 → 2002: back link → breadcrumb; reading progress → an Aqua progress bar (striped blue gel) pinned to the top;
 * meta grid → a details table; outcome → the yellow info box; statement → a glossy pull quote; figures → white-framed shots;
 * prototype → an Aqua window with traffic-light buttons; next story → a big gel button.
 */
import { shell, esc } from './layout.mjs';
import { renderBlocks, imgSrc, studyJS } from '../_shared/study.mjs';
export const meta = { id: '2002', title: '2002 — Case study' };

export default function render(args) {
  const { content: c, icons, assetBase = '', study } = args;
  const st = c.studies[study], H = st.head, U = c.ui;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.line[n]}</span>`;
  const src = s => esc(imgSrc(assetBase, s));
  const home = c.nav.find(n => n.href === '/');
  const zoomable = (i, label) => `<button type="button" class="zoom" data-full="${src(i.src)}" aria-label="${esc(U.viewFullSize)}: ${esc(label ?? i.alt)}"><img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy"><span class="zoom-hint" aria-hidden="true">${ic('search')} ${esc(U.viewFullSize)}</span></button>`;

  const R = {
    p: b => `<p class="sp">${b.html}</p>`,
    h2: b => `<h2 class="sh2">${esc(b.text)}</h2>`,
    h3: b => `<h3 class="sh3">${esc(b.text)}</h3>`,
    hr: () => `<hr class="shr">`,
    quote: b => `<blockquote class="squote ${b.rule}"><p>${b.html}</p>${b.cite ? `<p class="scite">${b.cite}</p>` : ''}</blockquote>`,
    callout: b => `<aside class="scallout ${b.rule}"><span class="note-i" aria-hidden="true">i</span><div>${b.label ? `<p class="slab">${esc(b.label)}</p>` : ''}${b.paras.map(h => `<p>${h}</p>`).join('')}</div></aside>`,
    ul: b => `<ul class="slist">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`,
    ol: b => `<ol class="slist ordered">${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`,
    pre: b => `<pre class="spre"><code>${esc(b.text)}</code></pre>`,
    short: b => `<aside class="sshort"><div class="sshort-head"><span>${esc(b.tab)}</span><span class="snote">${esc(b.note)}</span></div>
      <dl>${b.rows.map(r => `<div><dt>${esc(r.k)}</dt><dd>${r.v}</dd></div>`).join('')}</dl></aside>`,
    figure: b => `<figure class="sfig">${b.images.map(i => `<div class="frame">${b.zoom ? zoomable(i) : `<img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy">`}</div>`).join('')}
      ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    gallery: b => `<figure class="sgal"><div class="sgal-grid" style="--cols:${b.cols}${b.maxWidth ? `;max-width:${b.maxWidth}px` : ''}">${b.items.map(i => `
        <div class="sgal-item"><div class="frame">${zoomable(i, i.label)}${i.badge ? `<span class="sbadge">${esc(i.badge)}</span>` : ''}</div><span class="sgal-label">${esc(i.label)}</span></div>`).join('')}
      </div>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    prototype: b => `<figure class="sproto">
        <div class="aqua">
          <div class="aqua-bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="aqua-title">${esc(b.label)}</span></div>
          <div class="aqua-url"><span>${esc(b.url)}</span></div>
          <img src="captures/${esc(st.id)}-prototype.png" alt="${esc(b.label)}" loading="lazy">
        </div>
        <figcaption>${esc(b.caption)}</figcaption></figure>`,
  };

  const main = `    <main class="main study" id="main">
      <div class="aquabar" role="progressbar" aria-label="${esc(U.readingProgress)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(home.href)}">${esc(home.label)}</a><span aria-hidden="true"> » </span><a href="/work">${esc(c.workIndex.heading)}</a><span aria-hidden="true"> » </span><span aria-current="page">${esc(H.label)}</span></nav>

      <article class="panel sarticle">
        <h2 class="panel-head"><span class="snum">${esc(H.number)}</span> ${esc(H.label)}</h2>
        <div class="sinner">
          <header class="shead" data-part="head">
            <h1>${esc(H.title)}</h1>
            <dl class="details">${H.meta.map(m => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>
            ${H.lead ? `<p class="slead">${H.lead}</p>` : ''}
            ${H.outcome ? `<div class="note soutcome"><span class="note-i" aria-hidden="true">i</span><div><p class="slab">${esc(H.outcome.label)}</p><p>${H.outcome.text}</p></div></div>` : ''}
          </header>
          ${H.statement ? `<figure class="pull sstatement" data-part="statement"><blockquote><p>${H.statement}</p></blockquote></figure>` : ''}

          <div class="sbody">
            ${renderBlocks('2002', st.blocks, R)}
          </div>
        </div>
      </article>

      ${st.ending ? `<section class="panel sending" data-part="ending" aria-labelledby="end-h">
        <h2 class="panel-head" id="end-h"><span class="snum">${esc(st.ending.number)}</span> ${esc(st.ending.heading)}</h2>
        <div class="panel-body"><p>${esc(st.ending.text)}</p>
          <div class="row">${st.ending.links.map((l, i) => `<a class="gel ${i === 0 ? 'gel-blue' : 'gel-silver'}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
        </div>
      </section>` : ''}

      <a class="snext" data-part="next" href="${esc(st.next.href)}"><span class="snext-l">${esc(st.next.label)}</span><span class="snext-t">${esc(st.next.title)}</span></a>
    </main>
    <dialog class="lightbox" id="lightbox" aria-label="${esc(U.fullSizeImage)}"><button type="button" class="gel gel-silver lb-close" data-close>${esc(U.close)} ×</button><img alt=""></dialog>`;

  const pageScript = `
  ${studyJS}
  studyBehaviour(document.querySelector('main.study'), document.querySelector('.aquabar'));
`;
  return shell({ ...args, current: '/work', main, pageScript, compactFooter: true });
}
