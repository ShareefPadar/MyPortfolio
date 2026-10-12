/**
 * ERA · now — case study, Liquid Glass over a still sky.
 * An article set on the page: a thin progress line along the very top, a large title, the meta as a grouped panel,
 * glass panels for outcome / callouts / short version, screenshots in rounded wells, the prototype in a macOS window.
 * The article's paragraphs sit straight on the sky and never move; figures and panels rise in once as you reach them.
 */
import { shell, esc, BACK } from './layout.mjs';
import { renderBlocks, imgSrc, studyJS } from '../_shared/study.mjs';
export const meta = { id: 'now', title: 'Now · Case study' };

export default function render(args) {
  const { content: c, icons, assetBase = '', study } = args;
  const st = c.studies[study], H = st.head, U = c.ui;
  const ic = n => icons.line[n];
  const src = s => esc(imgSrc(assetBase, s));
  const zoomable = (i, label) => `<button type="button" class="zoom" data-full="${src(i.src)}" aria-label="${esc(U.viewFullSize)}: ${esc(label ?? i.alt)}"><img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy"></button>`;

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
    short: b => `<aside class="sshort"><div class="sshort-head"><span class="tab-l">${esc(b.tab)}</span><span class="snote">${esc(b.note)}</span></div>
      <dl>${b.rows.map(r => `<div><dt>${esc(r.k)}</dt><dd>${r.v}</dd></div>`).join('')}</dl></aside>`,
    figure: b => `<figure class="sfig">${b.images.map(i => `<div class="shot">${b.zoom ? zoomable(i) : `<img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy">`}</div>`).join('')}
      ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    gallery: b => `<figure class="sgal"><div class="sgal-grid" style="--cols:${b.cols}${b.maxWidth ? `;max-width:${b.maxWidth}px` : ''}">${b.items.map(i => `
        <div class="sgal-item"><div class="shot">${zoomable(i, i.label)}${i.badge ? `<span class="sbadge">${esc(i.badge)}</span>` : ''}</div><span class="sgal-label">${esc(i.label)}</span></div>`).join('')}
      </div>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    prototype: b => `<figure class="sproto">
        <div class="mwin">
          <div class="mwin-bar"><span class="mdots" aria-hidden="true"><i></i><i></i><i></i></span><span class="murl">${esc(b.url)}</span><span class="mlabel">${esc(b.label)}</span></div>
          <img src="captures/${esc(st.id)}-prototype.png" alt="${esc(b.label)}" loading="lazy">
        </div>
        <figcaption>${esc(b.caption)}</figcaption></figure>`,
  };

  const main = `  <div class="gprogress" role="progressbar" aria-label="${esc(U.readingProgress)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
  <article class="study">
    <header class="shead" data-part="head">
      <a class="back" href="/work">${BACK}${esc(c.workIndex.heading)}</a>
      <p class="kicker"><span class="num">${esc(H.number)}</span>${esc(H.label)}</p>
      <h1 class="large">${esc(H.title)}</h1>
      ${H.lead ? `<p class="slead">${H.lead}</p>` : ''}
      <dl class="stats">${H.meta.map(m => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>
      ${H.outcome ? `<div class="soutcome"><p class="slab">${esc(H.outcome.label)}</p><p>${H.outcome.text}</p></div>` : ''}
    </header>
    ${H.statement ? `<figure class="sstatement" data-part="statement"><blockquote><p>${H.statement}</p></blockquote></figure>` : ''}

    <div class="col">
      ${renderBlocks('now', st.blocks, R)}
    </div>

    ${st.ending ? `<section class="sending" data-part="ending" aria-labelledby="end-h">
      <h2 id="end-h"><span class="num">${esc(st.ending.number)}</span>${esc(st.ending.heading)}</h2>
      <p>${esc(st.ending.text)}</p>
      <div class="actions">${st.ending.links.map((l, i) => `<a class="btn ${i === 0 ? 'prominent' : 'bordered'}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
    </section>` : ''}

    <a class="snext" data-part="next" href="${esc(st.next.href)}"><span class="snext-l">${esc(st.next.label)}</span><span class="snext-t">${esc(st.next.title)}</span></a>
  </article>
  <dialog class="lightbox" id="lightbox" aria-label="${esc(U.fullSizeImage)}"><button type="button" class="cap glass lb-close" data-close>${esc(U.close)} ${ic('close')}</button><img alt=""></dialog>`;

  const pageScript = `
  ${studyJS}
  studyBehaviour(document.querySelector('.study'), document.querySelector('.gprogress'));
`;
  return shell({ ...args, current: '/work', main, pageScript, compactFooter: true, quietSky: true });
}
