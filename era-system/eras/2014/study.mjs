/**
 * ERA · 2014 — case study as a Material article.
 * 1995 → 2014: reading progress → a lime linear progress bar pinned under the app bar; header → the blue band with the meta as stat columns;
 * outcome → a lime-edged paper card; statement → a full-width lime band; callouts / short version → paper cards;
 * figures → cards with captions and a dark-scrim lightbox; prototype → a browser card with a blue app bar; next story → a raised card.
 */
import { shell, esc } from './layout.mjs';
import { renderBlocks, imgSrc, studyJS } from '../_shared/study.mjs';
export const meta = { id: '2014', title: '2014 — Case study' };

export default function render(args) {
  const { content: c, icons, assetBase = '', study } = args;
  const st = c.studies[study], H = st.head, U = c.ui;
  const ic = n => icons.line[n];
  const src = s => esc(imgSrc(assetBase, s));
  const zoomable = (i, label) => `<button type="button" class="zoom" data-full="${src(i.src)}" aria-label="${esc(U.viewFullSize)}: ${esc(label ?? i.alt)}"><img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy"><span class="zoom-hint" aria-hidden="true">${ic('search')}</span></button>`;

  const R = {
    p: b => `<p class="sp">${b.html}</p>`,
    h2: b => `<h2 class="sh2">${esc(b.text)}</h2>`,
    h3: b => `<h3 class="sh3">${esc(b.text)}</h3>`,
    hr: () => `<hr class="shr">`,
    quote: b => `<blockquote class="squote ${b.rule}"><p>${b.html}</p>${b.cite ? `<p class="scite">${b.cite}</p>` : ''}</blockquote>`,
    callout: b => `<aside class="scallout ${b.rule}">${b.label ? `<p class="slab">${esc(b.label)}</p>` : ''}${b.paras.map(h => `<p>${h}</p>`).join('')}</aside>`,
    ul: b => `<ul class="slist">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`,
    ol: b => `<ol class="slist ordered">${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`,
    pre: b => `<pre class="spre"><code>${esc(b.text)}</code></pre>`,
    short: b => `<aside class="sshort"><div class="sshort-head"><span>${esc(b.tab)}</span><span class="snote">${esc(b.note)}</span></div>
      <dl>${b.rows.map(r => `<div><dt>${esc(r.k)}</dt><dd>${r.v}</dd></div>`).join('')}</dl></aside>`,
    figure: b => `<figure class="sfig">${b.images.map(i => `<div class="pcard">${b.zoom ? zoomable(i) : `<img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy">`}</div>`).join('')}
      ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    gallery: b => `<figure class="sgal"><div class="sgal-grid" style="--cols:${b.cols}${b.maxWidth ? `;max-width:${b.maxWidth}px` : ''}">${b.items.map(i => `
        <div class="sgal-item pcard">${zoomable(i, i.label)}${i.badge ? `<span class="sbadge">${esc(i.badge)}</span>` : ''}<span class="sgal-label">${esc(i.label)}</span></div>`).join('')}
      </div>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    prototype: b => `<figure class="sproto">
        <div class="pcard browser">
          <div class="browser-bar"><span class="browser-dot" aria-hidden="true"></span><span class="browser-label">${esc(b.label)}</span></div>
          <div class="browser-url">${esc(b.url)}</div>
          <img src="captures/${esc(st.id)}-prototype.png" alt="${esc(b.label)}" loading="lazy">
        </div>
        <figcaption>${esc(b.caption)}</figcaption></figure>`,
  };

  const main = `<main id="main" class="study">
  <div class="lprogress" role="progressbar" aria-label="${esc(U.readingProgress)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
  <header class="hero dark shead" data-part="head"><div class="wrap">
    <a class="back" href="/work">${ic('arrowL')} ${esc(c.workIndex.heading)}</a>
    <p class="slabel"><span>${esc(H.number)}</span> ${esc(H.label)}</p>
    <h1>${esc(H.title)}</h1>
    <dl class="stats">${H.meta.map(m => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>
  </div></header>

  <div class="sbody"><div class="col">
    ${H.lead ? `<p class="slead">${H.lead}</p>` : ''}
    ${H.outcome ? `<div class="soutcome"><p class="slab">${esc(H.outcome.label)}</p><p>${H.outcome.text}</p></div>` : ''}
  </div></div>
  ${H.statement ? `<section class="nda sstatement" data-part="statement"><div class="col"><blockquote><p>${H.statement}</p></blockquote></div></section>` : ''}

  <div class="sbody"><div class="col">
    ${renderBlocks('2014', st.blocks, R)}
  </div></div>

  ${st.ending ? `<section class="band dark sending" data-part="ending" aria-labelledby="end-h"><div class="col">
    <p class="slabel"><span>${esc(st.ending.number)}</span> <span id="end-h">${esc(st.ending.heading)}</span></p>
    <p class="send-text">${esc(st.ending.text)}</p>
    <div class="row">${st.ending.links.map((l, i) => `<a class="btn ${i === 0 ? 'btn-lime' : 'btn-ghost-w'}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
  </div></section>` : ''}

  <div class="band grey snext-band"><div class="col">
    <a class="card snext" data-part="next" href="${esc(st.next.href)}"><span class="snext-l">${esc(st.next.label)}</span><span class="snext-t">${esc(st.next.title)}</span></a>
  </div></div>
</main>
<dialog class="lightbox" id="lightbox" aria-label="${esc(U.fullSizeImage)}"><button type="button" class="btn btn-flat lb-close" data-close>${esc(U.close)} ${ic('close')}</button><img alt=""></dialog>`;

  const pageScript = `
  ${studyJS}
  studyBehaviour(document.querySelector('main.study'), document.querySelector('.lprogress'));
`;
  return shell({ ...args, current: '/work', main, pageScript, compactFooter: true });
}
