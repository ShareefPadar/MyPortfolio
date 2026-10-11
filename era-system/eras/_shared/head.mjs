/**
 * <title> and share tags for any page, from content/site.json `meta` (and a study's own
 * pageTitle / description / ogImage). Not visual — every era emits the same tags, as live does.
 *
 *   headMeta({ content, pageUrl, study, assetBase }) → the <title>, meta/link tags and the JSON-LD Person block, as one string
 */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (base, u) => /^https?:/.test(u) ? u : base + u;

export function headMeta({ content: c, pageUrl = '/', study = null, assetBase = '' }) {
  const M = c.meta, st = study ? c.studies[study] : null, pg = M.pages[pageUrl] ?? {};
  const title = st ? st.pageTitle : pg.title ?? M.pages['/'].title;
  const description = st ? st.description : pg.description ?? M.pages['/'].description;
  const share = st
    ? { title: st.pageTitle, description: st.description, image: st.ogImage, imageAlt: st.pageTitle, sized: false }
    : { title: M.share.title, description: M.share.description, image: pg.image ?? M.share.image, imageAlt: pg.imageAlt ?? M.share.imageAlt, sized: true };
  const img = abs(M.siteUrl, share.image);
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="icon" href="${esc(abs(assetBase, M.icon))}">`,
    `<meta property="og:title" content="${esc(share.title)}">`,
    `<meta property="og:description" content="${esc(share.description)}">`,
    `<meta property="og:url" content="${esc(M.siteUrl + (pageUrl === '/' ? '' : pageUrl))}">`,
    `<meta property="og:site_name" content="${esc(M.siteName)}">`,
    `<meta property="og:locale" content="${esc(M.locale)}">`,
    `<meta property="og:type" content="${st ? 'article' : 'website'}">`,
    `<meta property="og:image" content="${esc(img)}">`,
    ...(share.sized ? ['<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">'] : []),
    `<meta property="og:image:alt" content="${esc(share.imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(share.title)}">`,
    `<meta name="twitter:description" content="${esc(share.description)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
    `<meta name="twitter:image:alt" content="${esc(share.imageAlt)}">`,
  ];
  // the Person profile for search engines (live has one too)
  const ld = { '@context': 'https://schema.org', '@type': 'Person', name: c.person.name, jobTitle: 'Senior Product Designer',
    email: 'mailto:' + c.footer.email, address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    sameAs: c.footer.socials.map(s => s.href) };
  tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n');
}
