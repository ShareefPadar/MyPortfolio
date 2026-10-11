/**
 * Loads content/site.json and resolves references, so templates and checks see
 * the same shape. Projects live once (content.projects); the homepage and the
 * Work index refer to them by id.
 */
import fs from 'node:fs';
import path from 'node:path';

export function loadContent(root) {
  const c = JSON.parse(fs.readFileSync(path.join(root, 'content', 'site.json'), 'utf8'));
  const get = id => { const p = c.projects[id]; if (!p) throw new Error(`content: unknown project id "${id}"`); return p; };
  c.selectedWork.items = c.selectedWork.ids.map(get);
  c.workIndex.groups.forEach(g => { g.items = g.ids.map(get); });
  // filter chips: "All" + every domain in first-appearance order across the index
  c.workIndex.filters = [...new Set(c.workIndex.groups.flatMap(g => g.items.map(p => p.domain)))];
  // case studies: content/studies/<project id>.json, extracted from the live pages
  const dir = path.join(root, 'content', 'studies');
  c.studies = Object.fromEntries(fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).map(st => [st.id, st]));
  for (const id of Object.keys(c.studies)) if (!c.projects[id]) throw new Error(`content: study "${id}" has no project`);
  return c;
}
