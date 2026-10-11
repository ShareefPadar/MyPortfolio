# Era · 2014 — Flat

**Status:** 🟨 Specified · built · contract and contrast checks pass · rendered with real fonts · legibility test, fallback metrics and specimen pending

> Read only this era file while building 2014.

---

## 1. Identity

**Reference point:** iOS 7, Material Design (2014), the flat-design web of 2013–2015
**One-line look:** White page, bold flat colour blocks, thin uppercase headline, ghost buttons, underline fields, long shadows
**What arrives:** Flatness — no gradients, no gloss, no drop shadows. Colour carries all hierarchy
**What leaves (vs. 2002):** Every gel, gradient and reflection. The rejection of skeuomorphism is the point

**Evoke, don't copy:** no Material or iOS components reproduced; the palette is original, not the Flat UI or Material swatches.

## 2. Fonts

Verified from the Google Fonts repository (licence, `fvar` weight axis, `cmap`).

| Role | Face | Licence | Why |
|---|---|---|---|
| Statement | **Montserrat** (variable 100–900) | SIL OFL | The geometric sans of the 2014 web. Thin (300) for the hero, 600 for uppercase buttons |
| Label | **Oswald** (variable 200–700) | SIL OFL | Condensed uppercase labels were everywhere in flat design |
| Sentence | **Open Sans** (variable 300–800) | SIL OFL | The default body face of the 2012–2016 web |

**Glyphs:** Montserrat complete. Oswald and Open Sans lack only `→` (arrows are icons). É renders as a proper capital in Montserrat — checked by eye.

**Weights, inverted on purpose:** `--statement-weight: 600` (buttons) and `--statement-weight-strong: 300` (hero). "Strong" names the *role* — hero, titles, numerals — and in 2014 that role is thin.

**Legibility test** ⬜ pending · **Fallback metrics** ⬜ pending (Montserrat is much wider than Arial — needs `size-adjust`)

## 3. Colour

Ratios from `check-contrast.mjs`; all pass.

| Token | Value | Note |
|---|---|---|
| `--bg` | `#FFFFFF` | |
| `--bg-inverse` | `#1E3A5F` | a bold flat navy block, not black |
| `--surface` | `#EEF1F4` | flat grey cards |
| `--surface-sunk` | `#E4E8ED` | |
| `--line` | `#D5DBE1` | |
| `--outline` | `#77828E` | |
| `--text` | `#263238` | |
| `--text-muted` | `#56626C` | |
| `--text-inverse` / `-muted` | `#FFFFFF` / `#B9C8DA` | |
| `--accent` / `--on-accent` | `#CDF22B` / `#263238` | lime — decorative only on white (1.2:1), always with an outline |
| `--action` / `--on-action` | `#1668C4` / `#FFFFFF` | |
| `--error` / `--error-surface` | `#C62828` / `#FDECEA` | |
| `--focus` | `#1668C4` | |
| `--selection` / `--on-selection` | `#CDF22B` / `#263238` | |

## 4. Frames

**Frame kind:** `css`. No shadows anywhere except the callout's long shadow.

| Fill | Look |
|---|---|
| action | solid `--action`, 4px radius · hover lighter · pressed darker |
| surface | **ghost button** — transparent, 2px `--action` border. On bookends the border turns white |
| accent | solid lime |
| disabled | `--surface-sunk` |
| field | **underline only** — no box, 2px bottom border (Material 2014) |
| error | underline in `--error` on `--error-surface` |

**Bubble tails:** a flat triangle in the fill colour; the ghost visitor bubble's pointer takes its border colour.

**Raised/sunk without depth:** raised = a flat colour block; sunk = a 2px `--line` ring (wells) or a darker fill (pressed).

## 5. Shape and depth

| Token | Value |
|---|---|
| `--corner` / `--corner-tab` | `none` |
| `--radius` | `4px` |
| `--border-w` | `2px` |
| `--focus-width` | `3px` |
| `--shadow-raised` | `none` |
| `--shadow-sunk` | `0 0 0 2px #D5DBE1` |
| `--shadow-offset` | **long shadow** — twelve 1px hard steps at 45° in dark lime. The flat era's one flourish |

## 6. Motion

| Token | Value |
|---|---|
| `--reveal-anim` | `reveal-grow-2014` — fades in from 94% scale |
| `--reveal-duration` / `--reveal-timing` | `360ms` / `cubic-bezier(.4, 0, .2, 1)` — Material's standard curve |
| `--statement-reveal` | `fade` |
| `--type-speed` | `0ms` (unused by fade) |
| `--hover-timing` | `cubic-bezier(.4, 0, .2, 1)` |

## 7. Assets

| Token | Value | Notes |
|---|---|---|
| `--icon-set` | `line` | Thin stroked icons suit iOS 7's outline iconography |
| `--frame-kind` | `css` | |
| `--portrait` | `illustration` | Flat geometric avatar in a circle with a 45° long shadow, drawn from the era's own tokens |

## 8. Era-specific rules

**Always:** flat fills · uppercase statements · ghost secondary buttons · underline fields · Material's standard curve
**Never:** gradients, gloss or drop shadows (the callout's long shadow is the single exception) · rounded corners above 4px · pixel icons

## 9. Open questions

- Should the hero illustration be a real illustration of you, commissioned or drawn? The stand-in is geometric
