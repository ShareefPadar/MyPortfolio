/**
 * The five years as data for a switcher: hrefs keep the current page and add ?era=<id>.
 *   eraItems(content, pageUrl, currentEra) → [{ id, year, name, href, current }]
 */
export const eraItems = (c, pageUrl, current) => c.eras.items.map(e => ({ ...e, href: `${pageUrl}?era=${e.id}`, current: e.id === current }));
export const eraOf = (c, id) => c.eras.items.find(e => e.id === id);
