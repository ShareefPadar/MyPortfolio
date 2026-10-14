# The contract

> ⚠ **Superseded by architecture v2** (see `ERA-SYSTEM.md`). This file describes the v1 reskin model, where every era shared one layout. Still valid: the spacing ramp as a sensible default, the type gate as guidance, the accessibility floor, the motion safety rules. No longer binding: shared component anatomy, shared page compositions, the shared token contract.


> Every era fills **exactly** these slots — no more, no fewer.
> The authoritative, machine-checked list is `scripts/era-contract.json`. This file explains what each slot means.
> If the two ever disagree, the JSON wins and this file is out of date.

**Version 4 · freeze candidate.** v2 added the `.frame-control` fill contract and era ids. v3 added the `blocks` portrait technique (for 1986). v4 added `--focus-width` and the `words` reveal (both found by Now). Freezes formally when Now passes the specimen. Freezes after the Now era passes the specimen (see `ERA-SYSTEM.md`).

---

## Era ids

Exactly five, lowercase, used in file names and the `data-era` attribute: `1986` · `1995` · `2002` · `2014` · `now`. The check script rejects anything else — `Now`, `2020s`, `modern` all fail.

---

## 1. Colour — 19 tokens

| Token | Meaning | 1995 value |
|---|---|---|
| `--bg` | Page background | `#FAFAF8` |
| `--bg-inverse` | Hero and footer bookends | `#0B0B0C` |
| `--surface` | Raised containers, secondary button face | `#D8D8D0` |
| `--surface-sunk` | Recessed fills, disabled, option panels, UI strings | `#F0F0EA` |
| `--line` | Hairline dividers | `#DEDED8` |
| `--outline` | Component outlines and heavy rules | `#14140F` |
| `--text` | Primary text on `--bg` | `#14140F` |
| `--text-muted` | Meta, captions — **≥ 4.5:1 on `--bg`, `--surface` and `--surface-sunk`** | `#5C5C52` |
| `--text-inverse` | Primary text on `--bg-inverse` | `#E8E8E2` |
| `--text-inverse-muted` | Secondary text on `--bg-inverse` | `#9A9A94` |
| `--accent` | Chat speaker, relevant tabs, callouts, LEDs, highlights | `#CDF22B` |
| `--on-accent` | Text on `--accent` | `#14140F` |
| `--action` | Primary button, links, numerals, system bubble | `#1E45FB` |
| `--on-action` | Text on `--action` | `#CDF22B` |
| `--error` | Error text and icon | `#C4482E` |
| `--error-surface` | Errored field fill | `#FDF2EF` |
| `--focus` | Focus ring | `#1E45FB` |
| `--selection` | Text selection background | `#CDF22B` |
| `--on-selection` | Selected text | `#14140F` |

**All colour tokens must be 6-digit hex** so `scripts/check-contrast.mjs` can compute them. No `rgb()`, no named colours, no `var()` references between colour tokens.

**Role, not hue.** `--accent` is lime in 1995 but might be orange in 2002. Components never care — they ask for "accent".

## 2. Type — 13 tokens

| Token | Meaning | 1995 value |
|---|---|---|
| `--font-statement` | Face for statements (≤5 words) | `'Silkscreen', monospace` |
| `--font-label` | Face for labels | `'Departure Mono', ui-monospace, monospace` |
| `--font-sentence` | Face for anything read as language — **must be highly legible** | `'Geist', system-ui, sans-serif` |
| `--statement-case` | `text-transform` for statements | `uppercase` |
| `--statement-weight` | Regular statement weight | `400` |
| `--statement-weight-strong` | Hero, titles, numerals | `700` |
| `--statement-lh` | Statement line height | `1.75` |
| `--size-statement-xl` | Homepage hero | `clamp(20px, 4.4vw, 32px)` |
| `--size-statement-l` | Page titles, section numerals | `clamp(15px, 3.2vw, 20px)` |
| `--size-statement-m` | Buttons, footer heading, wordmark | `14px` |
| `--size-label` | Meta, nav links | `11px` |
| `--size-micro` | Tags, tabs, marker labels | `9px` |
| `--label-tracking` | Label letter-spacing | `.08em` |

Sentence sizes are **not** in the contract — they're fixed in `core.md` §2.3. The face changes per era, so line breaks move on a switch; sizes, line heights and spacing never do.

## 3. Shape — 5 tokens

| Token | Meaning | 1995 value |
|---|---|---|
| `--corner` | `clip-path` for a full component outline. `none` in eras that use radius | notched polygon |
| `--corner-tab` | `clip-path` for a tab (top corners only) | top-notch polygon |
| `--radius` | `border-radius`. `0px` in pixel eras | `0px` |
| `--border-w` | Outline and heavy-rule width | `3px` |
| `--focus-width` | Focus ring thickness. Pixel eras 8px; modern eras ~3px (v4) | `8px` |

Components apply **both** `clip-path: var(--corner)` and `border-radius: var(--radius)`. Each era sets one of them to a no-op.

## 4. Depth — 3 tokens

| Token | Meaning | 1995 value |
|---|---|---|
| `--shadow-raised` | Raised frame depth | `inset 4px 4px 0 #FFF, inset -4px -4px 0 #8A8A80` |
| `--shadow-sunk` | Sunk frame / recessed well | `0 0 0 3px #14140F, inset 4px 4px 0 rgba(0,0,0,.4)` |
| `--shadow-offset` | Hard offset shadow on callouts | `6px 6px 0 #14140F` |

## 5. Motion — 6 tokens

| Token | Meaning | 1995 value |
|---|---|---|
| `--reveal-anim` | `animation-name`, may be a comma list | `reveal-clip-1995, reveal-bands-1995` |
| `--reveal-duration` | Matching list of durations | `360ms, 480ms` |
| `--reveal-timing` | Matching list of timing functions | `steps(6, end), steps(1, end)` |
| `--statement-reveal` | `type` · `words` · `fade` · `none` — read by JS. `words`: each word fades in, staggered by `--type-speed`, eased by `--hover-timing` | `type` |
| `--type-speed` | Per-character delay when typing | `45ms` |
| `--hover-timing` | Timing for hover transitions (core applies 120ms). Instant eras use `steps(1, start)` — **`end` delays every hover by the full duration** | `steps(1, start)` |

Keyframes must be **named with the era suffix** (`reveal-clip-1995`) because `@keyframes` can't be scoped by attribute selector. The check script verifies every name in `--reveal-anim` exists in the era's file.

Core rules still apply regardless of these values — reveals fire once, nothing over 720ms, statement reveal capped at 1.5s, reduced motion disables all of it.

## 6. Assets — 3 tokens

| Token | Allowed | Meaning | 1995 value |
|---|---|---|---|
| `--icon-set` | `pixel` · `line` | Which icon set React renders. Both sets have all 20 names | `pixel` |
| `--frame-kind` | `sprite` · `css` | `sprite` = 6×6 border-image sprites for buttons, bubbles, inputs. `css` = pure CSS frames | `sprite` |
| `--portrait` | `dither` · `blocks` · `halftone` · `photo` · `illustration` | Portrait technique. `dither` = shade glyphs `░▒▓█` on a ~46-column grid. `blocks` = solid cells on a ~24-column grid, 4 levels coloured `--bg` · `--surface` · `--text-muted` · `--text`, densest cells `--accent` | `dither` |

These are read in JS:

```ts
const read = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

const iconSet = read('icon-set') as 'pixel' | 'line';
```

Re-read them whenever `data-era` changes. Never cache across an era switch.

## 7. Required selectors

Every era must implement, scoped to itself:

```css
[data-era="<era>"] .frame-raised { … }                          /* plates */
[data-era="<era>"] .frame-sunk   { … }                          /* wells */
[data-era="<era>"] .frame-control[data-fill="action"]   { … }   /* primary button, system bubble */
[data-era="<era>"] .frame-control[data-fill="surface"]  { … }   /* secondary button, visitor bubble */
[data-era="<era>"] .frame-control[data-fill="accent"]   { … }   /* Shareef bubble */
[data-era="<era>"] .frame-control[data-fill="disabled"] { … }
[data-era="<era>"] .frame-control[data-fill="field"]    { … }   /* inputs */
[data-era="<era>"] .frame-control[data-fill="error"]    { … }   /* errored input */
[data-era="<era>"] .frame-tail { … }
```

Each fill should also handle `:hover`, `:active`, `[data-state]`, `[data-size="lg"]`, and the `.bookend` (inverse) context where the fill needs a lighter outline.

These are the only component-level rules an era may write. Everything else reads tokens.

**Sprite eras** (`--frame-kind: sprite`) don't write these by hand. They keep a palette in `styles/eras/<era>.sprites.json` and run `node scripts/build-sprites.mjs <era>`, which writes SVG sprites to `public/sprites/<era>/` and the rules to `styles/eras/<era>.sprites.css`. Never edit the generated CSS directly.

**CSS eras** (`--frame-kind: css`) write the rules by hand in `styles/eras/<era>.css`.

## 8. Era-private tokens

Helpers an era needs internally (sprite tones, gradient stops) use the `--era-` prefix:

```css
--era-hi: #FFFFFF;
--era-gloss-top: rgba(255,255,255,.6);
```

Only that era's own CSS may read them. A component that reads `--era-*` is a bug.

---

## Changing the contract

The contract is the only thing shared by all five eras, so changing it is a deliberate act, never a side effect.

1. Write an entry in `DECISIONS.md` explaining why no existing token can express the need
2. Add the token to `scripts/era-contract.json`
3. Add it to this file with its meaning
4. Add a value to **every existing era file** in the same change
5. Run `node scripts/check-era-tokens.mjs` — it must pass for every era

After the contract freezes (post-Now), step 1 must also explain why the need wasn't foreseeable.
