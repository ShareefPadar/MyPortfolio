() => {
  const T = e => e ? e.textContent.replace(/\s+/g, ' ').trim() : '';
  // inline HTML kept: links, bold, italic, code, line breaks — everything else flattened to text
  const inline = el => {
    let out = '';
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { out += n.data.replace(/\s+/g, ' ').replace(/&/g,'&amp;').replace(/</g,'&lt;'); continue; }
      if (n.nodeType !== 1) continue;
      const t = n.tagName, inner = inline(n);
      if (t === 'A') out += `<a href="${n.getAttribute('href')}"${n.target === '_blank' ? ' target="_blank" rel="noopener"' : ''}>${inner.replace(/\s*$/, '')}</a>`;
      else if (t === 'STRONG' || t === 'B') out += `<strong>${inner}</strong>`;
      else if (t === 'EM' || t === 'I') out += `<em>${inner}</em>`;
      else if (t === 'CODE') out += `<code>${inner}</code>`;
      else if (t === 'BR') out += '<br>';
      else if (t === 'SVG' || t === 'svg') continue;
      else out += inner;
    }
    return out;
  };
  const unknown = [];
  const article = document.querySelector('article');
  const kids = [...article.children];
  const [topbar, headWrap, bodyWrap] = kids; const nextWrap = kids[kids.length - 1]; const middle = kids.slice(3, -1);
  const header = headWrap.querySelector('header');
  const label = header.querySelector('div');
  const spans = label.querySelectorAll('span');
  const head = {
    number: T(spans[0]), label: T(spans[1]), title: T(header.querySelector('h1')),
    meta: [...header.querySelectorAll('dl > div')].map(d => ({ k: T(d.querySelector('dt')), v: T(d.querySelector('dd')) })),
  };
  for (const k of header.children) {
    if (k === label || k.tagName === 'H1' || k.tagName === 'DL') continue;
    if (k.tagName === 'P') head.lead = inline(k).trim();
    else if (getComputedStyle(k).borderLeftWidth === '6px') { const ps = k.querySelectorAll('p'); head.outcome = { label: T(ps[0]), text: inline(ps[ps.length - 1]).trim() }; }
    else unknown.push('head:' + k.tagName + ' ' + T(k).slice(0, 50));
  }
  const after = [...headWrap.children].filter(k => k !== header);
  for (const k of after) { const q = k.querySelector('blockquote'); if (q) head.statement = inline(q).trim(); else unknown.push('headafter:' + k.tagName + ' ' + T(k).slice(0, 50)); }

  const blocks = [];
  const take = el => {
    const t = el.tagName, cs = getComputedStyle(el);
    if (t === 'P') return blocks.push({ type: 'p', html: inline(el).trim() });
    if (t === 'H2') return blocks.push({ type: 'h2', text: T(el) });
    if (t === 'H3') return blocks.push({ type: 'h3', text: T(el) });
    if (t === 'HR') return blocks.push({ type: 'hr' });
    if (t === 'UL' || t === 'OL') return blocks.push({ type: t.toLowerCase(), items: [...el.children].map(li => inline(li).trim()) });
    if (t === 'BLOCKQUOTE') { const ps = [...el.querySelectorAll(':scope > p')];
      const q = { type: 'quote', html: (ps.length ? inline(ps[0]) : inline(el)).trim(), rule: cs.borderLeftColor === 'rgb(30, 69, 251)' ? 'blue' : 'lime' };
      if (ps.length > 1) q.cite = ps.slice(1).map(p => inline(p).trim()).join(' ');
      return blocks.push(q); }
    if (t === 'ASIDE' && el.querySelector('.card-tab')) {
      const body = el.querySelector('.card-body');
      return blocks.push({ type: 'short', tab: T(el.querySelector('.card-tab')), note: T(body.querySelector(':scope > p')),
        rows: [...body.querySelectorAll('dl > div')].map(d => ({ k: T(d.querySelector('dt')), v: inline(d.querySelector('dd')).trim() })) });
    }
    if (t === 'FIGURE') {
      const iso = el.querySelector('.iso');
      if (iso) return blocks.push({ type: 'prototype', label: T(el.querySelector(':scope > div span:last-child')),
        url: T([...el.querySelectorAll('span')].find(s => /\.[a-z]{2,}\//.test(s.textContent) && s.children.length === 0)), caption: T(el.querySelector('figcaption')) });
      const imgs = [...el.querySelectorAll('img')];
      // gallery: a grid of framed screens, each with an optional number badge and a label underneath
      const grid = el.querySelector(':scope > div[style*="grid-template-columns"], :scope > div');
      const cells = grid ? [...grid.children].filter(d => d.querySelector('button img') && d.querySelector(':scope > span')) : [];
      if (cells.length) {
        const st = grid.getAttribute('style') || '';
        return blocks.push({ type: 'gallery',
          cols: +(st.match(/repeat\((\d+)/) || [0, cells.length])[1], maxWidth: +((st.match(/max-width:\s*(\d+)px/) || [0, 0])[1]) || undefined,
          items: cells.map(d => { const im = d.querySelector('img'), badge = [...d.querySelectorAll('button span')].find(x => /^\d+$/.test(x.textContent.trim()));
            return { src: im.getAttribute('src'), alt: im.getAttribute('alt') || '', label: T(d.querySelector(':scope > span')), badge: badge ? T(badge) : undefined }; }),
          caption: inline(el.querySelector('figcaption') || document.createElement('i')).trim() });
      }
      if (imgs.length) return blocks.push({ type: 'figure', images: imgs.map(i => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') || '' })),
        caption: inline(el.querySelector('figcaption') || document.createElement('i')).trim(), zoom: !!el.querySelector('button') });
      const vid = el.querySelector('video');
      if (vid) return blocks.push({ type: 'video', src: vid.getAttribute('src') || vid.querySelector('source')?.getAttribute('src'), caption: T(el.querySelector('figcaption')) });
    }
    if (t === 'PRE') return blocks.push({ type: 'pre', text: el.textContent.replace(/\n$/, '') });
    if (t === 'ASIDE' && cs.borderLeftWidth === '6px') { const kids = [...el.children];
      const hasLabel = kids.length > 1 && kids[0].tagName === 'P' && getComputedStyle(kids[0]).fontSize === '9px';
      const rest = kids.slice(hasLabel ? 1 : 0);
      const paras = rest.flatMap(k => k.tagName === 'P' ? [k] : [...k.querySelectorAll(':scope > p')].length ? [...k.querySelectorAll(':scope > p')] : [k]);
      return blocks.push({ type: 'callout', rule: cs.borderLeftColor === 'rgb(30, 69, 251)' ? 'blue' : 'lime', label: hasLabel ? T(kids[0]) : '', paras: paras.map(p => inline(p).trim()) }); }
    if (t === 'TABLE') return blocks.push({ type: 'table', head: [...el.querySelectorAll('thead th')].map(T), rows: [...el.querySelectorAll('tbody tr')].map(r => [...r.children].map(c => inline(c).trim())) });
    // wrappers: descend
    if ((t === 'DIV' || t === 'SECTION') && el.children.length) {
      if (cs.borderLeftWidth === '6px') { const ps = el.querySelectorAll('p'); return blocks.push({ type: 'callout', label: ps.length > 1 ? T(ps[0]) : '', html: inline(ps[ps.length - 1]).trim() }); }
      for (const k of el.children) take(k); return;
    }
    unknown.push(t + '.' + (typeof el.className === 'string' ? el.className.slice(0, 40) : '') + ' ' + T(el).slice(0, 60));
  };
  for (const k of bodyWrap.children) take(k);
  const ending = middle.map(m => ({ text: [...m.querySelectorAll('p,h2,h3,span')].filter(e => !e.closest('a')).map(T).filter(Boolean),
    links: [...m.querySelectorAll('a')].map(a => ({ label: T(a), href: a.getAttribute('href') })) }));

  const na = nextWrap && nextWrap.querySelector('a');
  const next = na ? { label: T(na.querySelector('span')), title: T(na.querySelectorAll('span')[1]), href: na.getAttribute('href') } : null;
  const progress = topbar.querySelectorAll('[role=progressbar] > span').length;
  return { ending, title: document.title, description: document.querySelector('meta[name=description]')?.content || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.content || '', head, blocks, next, progressSegments: progress, unknown };
}
