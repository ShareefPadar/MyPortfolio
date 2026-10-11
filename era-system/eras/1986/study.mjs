/**
 * ERA · 1986 — case study as a LEVEL.
 * 1995 → 1986: reading progress → an XP bar of 10 blocks; meta grid → a STATS box; outcome → a lime-framed box;
 * statement → a dialogue box; figures → framed screens in a black bezel; prototype → a console screen with a power LED;
 * ending → a BONUS box; next story → NEXT LEVEL. Every block type comes through renderBlocks (_shared/study.mjs).
 * Flavour ("XP", "Stats", "Bonus", "Next level") is aria-hidden ornament.
 */
import { shell, esc } from './layout.mjs';
import { renderBlocks, imgSrc, studyJS } from '../_shared/study.mjs';
export const meta = { id: '1986', title: '1986 — Case study' };

export default function render(args) {
  const { content: c, icons, assetBase = '', study } = args;
  const st = c.studies[study], H = st.head, U = c.ui;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const src = s => esc(imgSrc(assetBase, s));
  const zoomable = (i, label) => `<button type="button" class="zoom" data-full="${src(i.src)}" aria-label="${esc(U.viewFullSize)}: ${esc(label ?? i.alt)}"><img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy"><span class="zoom-hint" aria-hidden="true">${esc(U.viewFullSize)}</span></button>`;

  const R = {
    p: b => `<p class="sp">${b.html}</p>`,
    h2: b => `<h2 class="sh2"><span aria-hidden="true">▶ </span>${esc(b.text)}</h2>`,
    h3: b => `<h3 class="sh3">${esc(b.text)}</h3>`,
    hr: () => `<hr class="shr">`,
    quote: b => `<blockquote class="squote ${b.rule}"><p>${b.html}</p>${b.cite ? `<p class="scite">${b.cite}</p>` : ''}</blockquote>`,
    callout: b => `<aside class="box scallout ${b.rule}">${b.label ? `<p class="stag">${esc(b.label)}</p>` : ''}${b.paras.map(h => `<p>${h}</p>`).join('')}</aside>`,
    ul: b => `<ul class="slist">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`,
    ol: b => `<ol class="slist ordered">${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`,
    pre: b => `<pre class="box spre"><code>${esc(b.text)}</code></pre>`,
    short: b => `<aside class="box sshort"><p class="stag">${esc(b.tab)}</p><p class="snote">${esc(b.note)}</p>
      <dl>${b.rows.map(r => `<div><dt>${esc(r.k)}</dt><dd>${r.v}</dd></div>`).join('')}</dl></aside>`,
    figure: b => `<figure class="sfig">${b.images.map(i => `<div class="bezel">${b.zoom ? zoomable(i) : `<img src="${src(i.src)}" alt="${esc(i.alt)}" loading="lazy">`}</div>`).join('')}
      ${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    gallery: b => `<figure class="sgal"><div class="sgal-grid" style="--cols:${b.cols}${b.maxWidth ? `;max-width:${b.maxWidth}px` : ''}">${b.items.map(i => `
        <div class="sgal-item"><div class="bezel">${zoomable(i, i.label)}${i.badge ? `<span class="sbadge">${esc(i.badge)}</span>` : ''}</div><span class="sgal-label">${esc(i.label)}</span></div>`).join('')}
      </div>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`,
    prototype: b => `<figure class="box sproto">
        <div class="sproto-top"><b class="led" aria-hidden="true"></b><span class="stag">${esc(b.label)}</span><span class="sproto-url">${esc(b.url)}</span></div>
        <div class="bezel"><img src="captures/${esc(st.id)}-prototype.png" alt="${esc(b.label)}" loading="lazy"></div>
        <figcaption>${esc(b.caption)}</figcaption></figure>`,
  };

  const main = `  <main id="main" class="study">
    <div class="study-top">
      <a class="back" href="/work">${ic('arrowL')} ${esc(c.workIndex.heading)}</a>
      <div class="xp" role="progressbar" aria-label="${esc(U.readingProgress)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <span class="xp-l" aria-hidden="true">XP</span><span class="xp-bar">${'<i data-seg></i>'.repeat(st.progressSegments)}</span>
      </div>
    </div>

    <header class="shead" data-part="head">
      <p class="slabel"><span class="snum">${esc(H.number)}</span>${esc(H.label)}</p>
      <h1>${esc(H.title)}</h1>
      <dl class="box stats">${H.meta.map(m => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>
      ${H.lead ? `<p class="slead">${H.lead}</p>` : ''}
      ${H.outcome ? `<div class="box soutcome"><p class="stag">${esc(H.outcome.label)}</p><p>${H.outcome.text}</p></div>` : ''}
    </header>
    ${H.statement ? `<figure class="box sstatement" data-part="statement"><blockquote><p>${H.statement}</p></blockquote><span class="more" aria-hidden="true">▼</span></figure>` : ''}

    <div class="sbody">
      ${renderBlocks('1986', st.blocks, R)}
    </div>

    ${st.ending ? `<section class="box sending" data-part="ending" aria-labelledby="end-h">
      <span class="flavour" aria-hidden="true">Bonus</span>
      <p class="slabel"><span class="snum">${esc(st.ending.number)}</span><span id="end-h">${esc(st.ending.heading)}</span></p>
      <p>${esc(st.ending.text)}</p>
      <div class="row">${st.ending.links.map((l, i) => `<a class="btn${i === 0 ? ' primary' : ''}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
    </section>` : ''}

    <a class="box snext" data-part="next" href="${esc(st.next.href)}">
      <span class="flavour" aria-hidden="true">Next level</span>
      <span class="snext-l">${esc(st.next.label)}</span>
      <span class="snext-t">${esc(st.next.title)}</span>
    </a>
  </main>
  <dialog class="lightbox" id="lightbox" aria-label="${esc(U.fullSizeImage)}"><button type="button" class="btn lb-close" data-close>${esc(U.close)} ×</button><img alt=""></dialog>`;

  const pageScript = `
  ${studyJS}
  studyBehaviour(document.querySelector('main.study'), document.querySelector('.xp'));
`;
  return shell({ ...args, current: '/work', main, pageScript, compactFooter: true });
}
