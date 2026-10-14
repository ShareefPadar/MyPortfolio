#!/usr/bin/env node
/**
 * Validates every styles/eras/<era>.css against scripts/era-contract.json.
 *
 * Fails when an era:
 *   - has no [data-era="<era>"] block
 *   - is missing a contract token
 *   - declares a token that isn't in the contract and isn't prefixed --era-
 *   - uses a value outside a token's allowed enum
 *   - references a keyframes name in --reveal-anim that it doesn't define
 *   - doesn't implement a required selector (.frame-raised, .frame-sunk)
 *
 * Usage:  node scripts/check-era-tokens.mjs [stylesDir]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(fs.readFileSync(path.join(here, 'era-contract.json'), 'utf8'));
const required = Object.values(contract.tokens).flat();
const privatePrefix = contract.privatePrefix;
const dir = process.argv[2] ?? path.join(here, '..', 'styles', 'eras');

// an era may be split across files: 1995.css, 1995.sprites.css (generated), …
const files = fs.readdirSync(dir).filter(f => f.endsWith('.css'));
const eras = [...new Set(files.map(f => f.split('.')[0]))];
if (eras.length === 0) {
  console.error(`✕ No era files found in ${dir}`);
  process.exit(1);
}

let failed = false;
const fail = (era, msg) => { console.error(`  ✕ ${msg}`); failed = true; };

for (const era of eras) {
  const file = `${era}.css`;
  const css = files.filter(f => f.split('.')[0] === era)
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');               // strip comments
  console.log(`\n${era}`);

  // 0. era id must be one of the five
  if (contract.eraIds && !contract.eraIds.includes(era)) {
    fail(era, `"${era}" is not a valid era id — use one of ${contract.eraIds.join(', ')} (lowercase "now")`);
    continue;
  }

  // 1. token block
  const blockRe = new RegExp(`\\[data-era="${era}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`);
  const block = css.match(blockRe);
  if (!block) { fail(era, `no [data-era="${era}"] { … } block`); continue; }

  const decls = new Map(
    [...block[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)].map(m => [m[1], m[2].trim()])
  );

  // 2. missing tokens
  const missing = required.filter(t => !decls.has(t));
  missing.forEach(t => fail(era, `missing token --${t}`));

  // 3. undeclared tokens
  for (const t of decls.keys()) {
    if (!required.includes(t) && !t.startsWith(privatePrefix)) {
      fail(era, `--${t} is not in the contract. Add it to the contract for every era, or rename it --${privatePrefix}${t}`);
    }
  }

  // 4. enums
  for (const [token, allowed] of Object.entries(contract.enums)) {
    const v = decls.get(token);
    if (v && !allowed.includes(v)) {
      fail(era, `--${token}: "${v}" is not one of ${allowed.join(' | ')}`);
    }
  }

  // 5. keyframes referenced by --reveal-anim exist
  const anims = (decls.get('reveal-anim') ?? '').split(',').map(s => s.trim()).filter(Boolean);
  for (const a of anims) {
    if (a !== 'none' && !new RegExp(`@keyframes\\s+${a}\\b`).test(css)) {
      fail(era, `--reveal-anim references "${a}" but @keyframes ${a} is not defined in ${file}`);
    }
  }

  // 6. required selectors implemented under this era
  for (const sel of contract.requiredSelectors) {
    const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\[data-era="${era}"\\][^{]*${escaped}`).test(css)) {
      fail(era, `missing [data-era="${era}"] ${sel}`);
    }
  }

  // 7. every fill implemented for .frame-control
  for (const fill of contract.fills ?? []) {
    if (!new RegExp(`\\[data-era="${era}"\\][^{]*\\.frame-control\\[data-fill="${fill}"\\]`).test(css)) {
      fail(era, `missing [data-era="${era}"] .frame-control[data-fill="${fill}"]`);
    }
  }

  console.log(`  ${required.length - missing.length}/${required.length} tokens · ${(contract.fills ?? []).length} fills`);
}

console.log(failed ? '\n✕ Era check failed\n' : '\n✓ All eras satisfy the contract\n');
process.exit(failed ? 1 : 0);
