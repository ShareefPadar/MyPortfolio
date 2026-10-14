#!/usr/bin/env node
/**
 * Renders every icon set to static SVG — no runtime canvas.
 *
 *   assets/icons/<set>.json  →  public/icons/<set>/<name>.svg
 *   pixel: 8×8 grids · line: stroked 24×24 paths. Sets must share names.
 *
 * Icons use fill="currentColor" so they inherit text colour.
 * (Era sprites are a separate pipeline: scripts/build-sprites.mjs.)
 *
 * Usage:  node scripts/build-icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => { const f = path.join(root, 'public', ...p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };

/** Grid of characters → SVG of 1×1 rects, merged into horizontal runs per colour. */
function gridToSvg(grid, colours, scale) {
  const h = grid.length, w = grid[0].length;
  const rects = [];
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const ch = grid[y][x], fill = colours[ch];
      if (!fill) { x++; continue; }
      let run = 1;
      while (x + run < w && grid[y][x + run] === ch) run++;
      rects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${fill}"/>`);
      x += run;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" ` +
         `viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects.join('')}</svg>\n`;
}

let count = 0;

// ── every icon set in assets/icons/ ─────────────────────────
// Each set must define exactly the same names — an era can switch sets
// without a single missing icon.
const setsDir = path.join(root, 'assets', 'icons');
// brands.json is excluded: its icons have their own names and are vector paths
const sets = fs.readdirSync(setsDir).filter(f => f.endsWith('.json') && f !== 'brands.json').map(f => [f.replace('.json', ''), JSON.parse(fs.readFileSync(path.join(setsDir, f), 'utf8'))]);
const names = sets.map(([n, s]) => [n, Object.keys(s.icons).sort().join(',')]);
if (new Set(names.map(([, k]) => k)).size !== 1) {
  console.error('✕ icon sets disagree on names:'); names.forEach(([n, k]) => console.error(`  ${n}: ${k}`)); process.exit(1);
}
for (const [setName, set] of sets) {
  fs.rmSync(path.join(root, 'public', 'icons', setName), { recursive: true, force: true });
  for (const [name, def] of Object.entries(set.icons)) {
    let svg;
    if (set.type === 'stroke') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${set.viewBox} ${set.viewBox}" fill="none" stroke="currentColor" ` +
            `stroke-width="${set.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${def}</svg>\n`;
    } else {
      if (def.length !== set.grid || def.some(r => r.length !== set.grid)) { console.error(`✕ ${setName}/${name} is not ${set.grid}×${set.grid}`); process.exit(1); }
      svg = gridToSvg(def, { X: 'currentColor' }, 1);
    }
    fs.writeFileSync(out('icons', setName, `${name}.svg`), svg);
    count++;
  }
  console.log(`✓ ${Object.keys(set.icons).length} ${setName} icons`);
}
console.log(`\n${count} files written to public/\n`);
