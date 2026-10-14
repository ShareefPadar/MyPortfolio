#!/usr/bin/env node
/**
 * Computes WCAG 2.x contrast for every required pair (core.md §6) in every era.
 * Colour tokens must be 6-digit hex so they can be checked.
 *
 * Usage:  node scripts/check-contrast.mjs [stylesDir]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = process.argv[2] ?? path.join(here, '..', 'styles', 'eras');

// [foreground, background, minimum] — mirrors core.md §6
const PAIRS = [
  ['text',               'bg',           7],
  ['text',               'surface',      7],
  ['text',               'surface-sunk', 7],
  ['action',             'bg',           4.5],   // tertiary buttons, numerals
  ['accent',             'bg-inverse',   4.5],   // footer email, hero accent word, audit headers
  ['text-muted',         'bg',           4.5],
  ['text-muted',         'surface',      4.5],
  ['text-muted',         'surface-sunk', 4.5],
  ['on-action',          'action',       4.5],
  ['on-accent',          'accent',       4.5],
  ['text-inverse',       'bg-inverse',   7],
  ['text-inverse-muted', 'bg-inverse',   4.5],
  ['error',              'bg',           4.5],
  ['outline',            'bg',           3],     // WCAG 1.4.11 — component boundaries
  ['outline',            'surface',      3],
  ['focus',              'bg',           3],
  ['focus',              'surface',      3],
  ['on-selection',       'selection',    4.5],
];

const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = false;
// v1 reskin eras (styles/eras/<era>.css) and redesigned eras (eras/<era>/style.css)
const sources = fs.readdirSync(dir).filter(f => f.endsWith('.css') && !f.includes('.sprites')).map(f => [f.replace(/\.css$/, ''), path.join(dir, f)]);
const erasRoot = path.join(here, '..', 'eras');
if (fs.existsSync(erasRoot)) for (const d of fs.readdirSync(erasRoot)) {
  const f = path.join(erasRoot, d, 'style.css'); if (fs.existsSync(f)) sources.push([`${d} (redesign)`, f]);
}
for (const [label, file] of sources) {
  const era = label.split(' ')[0];
  const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const block = css.match(new RegExp(`\\[data-era="${era}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!block) continue;
  const t = Object.fromEntries(
    [...block[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)].map(m => [m[1], m[2].trim()])
  );

  console.log(`\n${label}`);
  for (const [fg, bg, min] of PAIRS) {
    const a = t[fg], b = t[bg];
    const ok = /^#[0-9a-f]{6}$/i;
    if (!ok.test(a ?? '') || !ok.test(b ?? '')) {
      console.error(`  ✕ --${fg} / --${bg}: both must be 6-digit hex (got ${a} / ${b})`);
      failed = true; continue;
    }
    const r = ratio(a, b);
    const pass = r >= min;
    if (!pass) failed = true;
    (pass ? console.log : console.error)(
      `  ${pass ? '✓' : '✕'} --${fg} on --${bg}`.padEnd(46) + `${r.toFixed(2)}:1  (min ${min})`
    );
  }
}
// Advisory by design (Shareef's call): contrast is reported, never a gate. Pass --strict to enforce.
const strict = process.argv.includes('--strict');
console.log(failed ? `\n${strict ? '✕' : '⚠'} Some pairs are under their minimum (${strict ? 'strict' : 'advisory — not blocking'})\n` : '\n✓ All pairs pass\n');
process.exit(failed && strict ? 1 : 0);
