/**
 * Case-study plumbing shared by every era. Structure only — every era supplies its own markup per block type.
 *
 *   BLOCK_TYPES                    the 13 block types content/studies/*.json can contain
 *   renderBlocks(era, blocks, R)   R = { p, h2, h3, hr, quote, callout, ul, ol, pre, short, figure, gallery, prototype } → HTML.
 *                                  Throws at build time if R misses a type — no era can silently drop a block.
 *   imgSrc(assetBase, s)           live-site asset path → previewable URL
 *   studyJS                        studyBehaviour(article, bar): reading progress (sets aria-valuenow, --p 0…1 on the bar,
 *                                  and .on on any [data-seg] children) + the lightbox (#lightbox dialog; triggers: [data-full])
 */
export const BLOCK_TYPES = ['p', 'h2', 'h3', 'hr', 'quote', 'callout', 'ul', 'ol', 'pre', 'short', 'figure', 'gallery', 'prototype'];

export function renderBlocks(era, blocks, R) {
  const missing = BLOCK_TYPES.filter(t => typeof R[t] !== 'function');
  if (missing.length) throw new Error(`era ${era}: study.mjs has no renderer for block type(s): ${missing.join(', ')}`);
  return blocks.map((b, i) => {
    if (!R[b.type]) throw new Error(`era ${era}: unknown block type "${b.type}" — add it to BLOCK_TYPES and every era`);
    return R[b.type](b, i).replace(/^(\s*<[a-z0-9]+)/i, `$1 data-b="${b.type}"`);   // tags each block with its type (for review tooling)
  }).join('\n');
}

export const imgSrc = (assetBase, s) => /^https?:/.test(s) || s.startsWith('captures/') ? s : assetBase + s;

export const studyJS = `
function studyBehaviour(article, bar) {
  const segs = bar ? [...bar.querySelectorAll('[data-seg]')] : [];
  const upd = () => { const r = article.getBoundingClientRect(), total = r.height - innerHeight;
    const pct = Math.max(0, Math.min(100, Math.round(-r.top / Math.max(1, total) * 100)));
    if (!bar) return; bar.setAttribute('aria-valuenow', pct); bar.style.setProperty('--p', pct / 100);
    segs.forEach((s, i) => s.classList.toggle('on', i < Math.floor(pct / (100 / segs.length)))); };
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  const lb = document.getElementById('lightbox'); if (!lb) return;
  const img = lb.querySelector('img');
  document.querySelectorAll('[data-full]').forEach(b => b.addEventListener('click', () => {
    img.src = b.dataset.full; img.alt = (b.querySelector('img') || {}).alt || ''; lb.showModal(); }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('[data-close]')) lb.close(); });
}`;
