# Era · now — Present day

**Status:** 🟨 Specified · tokens built · contract and contrast checks pass · rendered and verified in `era-preview.html` · legibility test, fallback metrics and specimen pending

> Read only this era file while building Now. Structure and behaviour come from `core.md`; this file only says how Now looks. Era id is lowercase `now`.

---

## 1. Identity

**Reference point:** Present-day product interfaces — dark mode, soft depth, editorial display type, generous radius
**One-line look:** A near-black page, rounded soft cards, a serif headline in sentence case, eased motion
**What arrives in this era:** Radius, soft shadows, blur, easing, sentence-case display type, stroked icons
**What leaves:** The pixel grid. For the first time nothing is quantised — this is the only era where motion interpolates

**The arc:** 1986 starts dark; 1995 turns the lights on; Now goes dark again, refined. Dark mode returning is a real piece of interface history, and it closes the timeline.

**Evoke, don't copy:** no layouts, components or palettes lifted from any specific current product. Icons are original, drawn for this era.

## 2. Fonts

Verified from the Google Fonts repository: licence file, weight axes from `fvar`, glyphs from `cmap`.

| Role | Face | Licence | Why this face |
|---|---|---|---|
| Statement | **Instrument Serif** 400 | SIL OFL | The editorial serif headline is the display look of this moment. Also a callback to the serif titles on the original site |
| Label | **JetBrains Mono** (variable 100–800) | SIL OFL | Current, highly legible mono for meta and tags |
| Sentence | **Inter** (variable 100–900) | SIL OFL | The reference UI face of the 2020s. Variable axis gives real 400/500/600 |

**Glyph coverage** (É é È ‘ ’ “ ” – — · →): Inter and JetBrains Mono complete. Instrument Serif lacks `→` only — statements never use it; arrows are icons. É renders as a proper capital (checked by eye, unlike Press Start 2P).

**Case:** `--statement-case: none`. Statements are written in normal case in the content and stay that way here. A serif in forced capitals reads cramped.

**Weights:** Instrument Serif has one weight — both statement weight tokens are 400. Emphasis comes from size and the lime accent.

**Legibility test** (`core.md` §2.3a) — ⬜ pending. Inter is the lowest-risk reading face in the project; still run it.
**Fallback metrics** — ⬜ pending. Serif display fallback (Georgia) is much wider than Instrument Serif — add `size-adjust` or the hero will jump on load.

## 3. Colour

All ratios from `scripts/check-contrast.mjs`.

| Token | Value | Ratio |
|---|---|---|
| `--bg` | `#0E0E11` | |
| `--bg-inverse` | `#000000` | bookends — a deeper, OLED black |
| `--surface` | `#18181D` | |
| `--surface-sunk` | `#09090B` | |
| `--line` | `#26262D` | decorative dividers only |
| `--outline` | `#6A6A76` | 3.61 on bg · 3.32 on surface |
| `--text` | `#EDEDF0` | 16.50 on bg · 15.14 on surface |
| `--text-muted` | `#9C9CA8` | 7.10 · 6.51 · 7.33 |
| `--text-inverse` | `#FFFFFF` | 21.00 |
| `--text-inverse-muted` | `#A1A1AA` | 8.19 |
| `--accent` | `#CDF22B` | lime — the thread through every era |
| `--on-accent` | `#0E0E11` | 14.99 |
| `--action` | `#8CA0FF` | periwinkle — 1995's blue, lifted for a dark page · 7.88 on bg |
| `--on-action` | `#0E0E11` | 7.88 |
| `--error` | `#FF7A70` | 7.59 on bg |
| `--error-surface` | `#2A1416` | |
| `--focus` | `#8CA0FF` | 7.88 · 7.23 |
| `--selection` | `#CDF22B` | |
| `--on-selection` | `#0E0E11` | 14.99 |

**The outline is deliberately brighter than fashionable.** A typical dark-mode hairline (`#2A2A30`) measures 1.35:1 and fails WCAG 1.4.11 for component boundaries. The first attempt, `#5E5E6A`, failed on cards at 2.77:1; `#62626E` still failed at 2.94:1. `#6A6A76` passes both. Cards use the subtle `--line` because they're identified by their content; inputs and secondary buttons use `--outline` because their edge *is* the affordance.

## 4. Frames

**Frame kind:** `css` — the first era with no sprites. Every fill is written by hand in `now.css`.

| Fill | Rest | Hover | Pressed |
|---|---|---|---|
| action | `--action` fill, soft shadow | lighter | darker, 1px down, no shadow |
| surface | `--surface`, `--outline` border | lifted | sunk |
| accent | `--accent` | lighter | darker |
| disabled | `--surface-sunk`, `--line` border | — | — |
| field | `--surface-sunk`, `--outline` border | border to `--text-muted` | — |
| error | `--error-surface`, `--error` border | — | — |

Large size: padding 12 / 24.

**Raised/sunk meaning without bevels:** raised = lifted surface with a soft drop shadow; sunk = a 1px ring and no shadow (wells), or pressed down 1px (controls).

**Bubble tails:** there is no pointer in this era. Modern chat squares off one corner on the speaker's side instead. `.frame-tail` becomes a `--radius`-sized square in the bubble's fill, laid exactly over that corner — including its border for outlined bubbles. Same contract slot, completely different form.

## 5. Shape and depth

| Token | Value |
|---|---|
| `--corner` | `none` |
| `--corner-tab` | `none` |
| `--radius` | `12px` (cards use `radius + 4`) |
| `--border-w` | `1px` |
| `--focus-width` | `3px` — hugs the rounded control; 8px pixel-era plates would be a slab |
| `--shadow-raised` | inner top highlight + soft 32px drop |
| `--shadow-sunk` | `0 0 0 1px #26262D` |
| `--shadow-offset` | soft lime glow, `0 24px 48px -16px` |

## 6. Motion

| Token | Value |
|---|---|
| `--reveal-anim` | `reveal-rise-now` |
| `--reveal-duration` | `520ms` |
| `--reveal-timing` | `cubic-bezier(.2, .7, .2, 1)` |
| `--statement-reveal` | `words` |
| `--type-speed` | `70ms` — per-word stagger |
| `--hover-timing` | `cubic-bezier(.2, .7, .2, 1)` |

**Reveal technique — rise and settle:** fades in while rising 12px, eased out. Leaves no transform behind (core uses `fill-mode: backwards`).

**Statement reveal — words:** each word fades in from a light blur, staggered 70ms. Full sentence is in the DOM throughout; verified mid-reveal (3 of 5 words visible, whole text readable by assistive tech). Hero finishes in about 0.8s.

## 7. Assets

| Token | Value | Notes |
|---|---|---|
| `--icon-set` | `line` | 20 original stroked icons, `assets/icons/line.json`, 1.75 stroke, round caps. Same names as the pixel set — the build rejects a mismatch |
| `--frame-kind` | `css` | |
| `--portrait` | `photo` | A real photograph in a rounded card with the raised shadow. The preview shows a smooth stand-in labelled YOUR PHOTO |

## 8. Era-specific rules

**Always in Now:**
- Statements in sentence case, as written
- One radius token for everything; cards add 4px
- Borders that carry meaning pass 3:1 — no fashionable invisible hairlines
- Every animation eased and under 720ms

**Never in Now:**
- Forced capitals on the serif
- Borders below 3:1 on inputs or secondary buttons
- Pixel icons, sprites or stepped motion
- Pointer-style bubble tails

## 9. Contract changes Now caused (v4)

Building Now was supposed to stress the contract. It found two gaps:

1. **`--focus-width`** — core hardcoded an 8px focus plate. Fine for pixels, a heavy slab around a modern rounded button. Added as a token; 1986 and 1995 set it to 8px, so they didn't change
2. **`words`** statement reveal — the defining present-day hero entrance couldn't be expressed. Added to the enum; same visual-only principle as typing

Nothing else was needed. The same 49 slots now describe a bevelled era, a flat pixel era and a soft modern one.

## 10. Open questions

- Bookends: black on near-black is subtle. Accept it, or does the hero want a faint radial glow? (Would need a contract slot — the era can't style `.bookend` directly)
- Should Now be the **default** era? It's the most conventional to a recruiter's eye
