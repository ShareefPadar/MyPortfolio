/**
 * ERA · 1995 — home. Matches the live homepage. Shell (nav, footer, Clippy, cursor) in layout.mjs.
 * Dino Runner (game.mjs): ported from live as-is, between the live section and the footer.
 */
import { shell, esc, STYLES } from './layout.mjs';
import { gameMarkup, gameScript } from './game.mjs';
export const meta = { id: '1995', title: '1995 — Bevelled desktop (live)', styles: STYLES };

export default function render(args) {
  const { content: c, icons, assetBase = '', portrait } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const p = c.person;
  const work = c.selectedWork.items.map(w => `
      <a class="card frame-raised reveal" href="${esc(w.href)}">
        <span class="tab">${esc(w.domain)}</span>
        <div class="well frame-sunk"><img src="${assetBase}${esc(w.image)}" alt="" loading="lazy"></div>
        <div class="body">
          <p class="mono">${esc(w.status)}</p>
          <h3>${esc(w.title)}</h3>
          <p class="mono">${esc(w.meta)}</p>
          <p class="summary">${esc(w.summary)}</p>
          <span class="go">${esc(c.ui.readCaseStudy)} ${ic('arrowR')}</span>
        </div>
      </a>`).join('');

  const live = c.live.items.map(l => `
      <article class="card frame-raised reveal">
        <span class="tab">${esc(l.tag)}</span>
        <div class="body" style="margin-top:var(--s12)">
          <p class="mono led"><b aria-hidden="true"></b>${esc(l.status)}</p>
          <h3>${esc(l.title)}</h3>
          <p class="mono">${esc(l.meta)}</p>
          <p class="summary">${esc(l.summary)}</p>
          <div class="row">
            <a class="go" href="${esc(l.caseStudy)}">${esc(c.ui.caseStudy)} ${ic('arrowR')}</a>
            <a class="go" href="${esc(l.launch)}" target="_blank" rel="noopener">${esc(c.ui.launchApp)} ${ic('external')}</a>
          </div>
        </div>
      </article>`).join('');

  const main = `<main id="main">
  <section class="hero wrap" data-guide-id="hero" aria-labelledby="hero-title">
    <div>
      <p class="t-micro eyebrow">${esc(p.eyebrow)}</p>
      <h1 class="t-statement-xl" id="hero-title">${esc(p.statement.before)} ${esc(p.statement.accent)}</h1>
      <p class="t-lead">${esc(p.lead)}</p>
      <div class="row">
        <span class="focusable"><a class="btn frame-control" data-fill="action" data-size="lg" href="${esc(c.ctas.primary.href)}">${esc(c.ctas.primary.label)} ${ic('arrowD')}</a></span>
        <span class="focusable"><a class="btn frame-control" data-fill="surface" data-size="lg" href="${esc(c.ctas.resume.href)}">${esc(c.ctas.resume.label)} ${ic('download')}</a></span>
      </div>
    </div>
    <div class="portrait" tabindex="0" role="img" aria-label="${esc(portrait.alt)}">
      <canvas class="grey" width="96" height="144" aria-hidden="true"></canvas>
      <canvas class="colour" width="96" height="144" aria-hidden="true"></canvas>
    </div>
  </section>

  <section class="wrap block" id="work" data-guide-id="work" aria-labelledby="w-h">
    <div class="marker reveal"><span class="t-numeral">01</span><h2 id="w-h">${esc(c.selectedWork.heading)}</h2><i></i></div>
    <div class="cards">${work}</div>
  </section>

  <div class="wrap"><div class="nda frame-raised reveal" data-guide-id="nda">
    <div>
      <p class="mono">${ic('info')} ${esc(c.nda.label)}</p>
      <p class="text">${esc(c.nda.text)}</p>
    </div>
    <a class="underline-link" href="${esc(c.nda.link.href)}">${esc(c.nda.link.label)} ${ic('arrowR')}</a>
  </div></div>

  <section class="wrap block" data-guide-id="live" aria-labelledby="l-h">
    <div class="marker reveal"><span class="t-numeral">02</span><h2 id="l-h">${esc(c.live.heading)}</h2><i></i></div>
    <div class="cards">${live}</div>
  </section>
</main>`;
  const pageScript = `  // ── portrait: decoded exactly as live; grey = luminance × 1.12 contrast ──
  const decode = s => { const t = new Uint8Array(P.width * P.height); let r = 0, a = 0;
    while (r < s.length) { const n = s.charCodeAt(r++) - 65, i = r; while (r < s.length) { const c = s.charCodeAt(r); if (c >= 65 && c <= 79) break; r++; }
      const d = r > i ? parseInt(s.slice(i, r), 36) : 1; t.fill(n, a, a + d); a += d; } return t; };
  const px = decode(P.pixels);
  const grey = P.palette.map(h => { const r = parseInt(h.slice(1), 16), l = Math.round(Math.min(255, Math.max(0, (.2126*(r>>16&255) + .7152*(r>>8&255) + .0722*(r&255) - 128) * 1.12 + 128))); return [l, l, l]; });
  const colour = P.palette.map(h => { const r = parseInt(h.slice(1), 16); return [r>>16&255, r>>8&255, r&255]; });
  // background = palette 0 pixels connected to the edge → transparent (live's "transparent" mode)
  const W = P.width, H = P.height, clear = new Uint8Array(W * H), stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) { const n = stack.pop(); if (clear[n] || px[n] !== 0) continue; clear[n] = 1; const x = n % W;
    if (x > 0) stack.push(n - 1); if (x < W - 1) stack.push(n + 1); if (n >= W) stack.push(n - W); if (n < (H - 1) * W) stack.push(n + W); }
  for (const [sel, pal] of [['.grey', grey], ['.colour', colour]]) {
    const cv = document.querySelector('.portrait ' + sel), x = cv.getContext('2d'), im = x.createImageData(P.width, P.height);
    px.forEach((k, i) => { const [r, g, b] = pal[k] || [0, 0, 0]; im.data.set([r, g, b, clear[i] ? 0 : 255], i * 4); });
    x.putImageData(im, 0, 0);
  }

  // ── typed statement — visual only ──
  function typewrite(el) {
    if (reduce) return;
    const chars = [], nodes = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) { const f = document.createDocumentFragment();
      for (const ch of n.data) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; f.append(s); chars.push(s); } n.replaceWith(f); }
    if (!chars.length) return; el.classList.add('is-typing'); let i = 0;
    const id = setInterval(() => { chars[i - 1]?.classList.remove('is-caret'); chars[i].classList.add('on', 'is-caret');
      if (++i >= chars.length) { clearInterval(id); chars[i - 1].classList.remove('is-caret'); el.classList.remove('is-typing'); } }, parseFloat(tok('type-speed')) || 45);
  }
  typewrite(document.getElementById('hero-title'));
  ${gameScript}

`;
  return shell({ ...args, title: `${p.name}, Senior Product Designer`, current: '/', main, beforeFooter: gameMarkup(c), pageScript, guideOpening: c.guide.sections.hero });
}
