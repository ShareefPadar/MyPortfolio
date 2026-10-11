# Era · 2002 — Glossy

**Status:** 🟨 Specified · built · contract and contrast checks pass · gel contrast measured from rendered pixels in every state · legibility test, fallback metrics and specimen pending

> Read only this era file while building 2002. This is the hardest era: gloss lightens whatever sits under it.

---

## 1. Identity

**Reference point:** Mac OS X Aqua, Windows XP, and the glossy Web 2.0 that followed
**One-line look:** Soft silver-blue page, gel capsule buttons, pill fields, deep blue bookends, rounded bold type
**What arrives:** Gloss, gradients, soft drop shadows, reflections. Interfaces trying to look touchable
**What leaves (vs. 1995):** Hard bevels become soft gradients; pixel type becomes smooth rounded type

**Evoke, don't copy:** no Aqua or XP chrome, traffic lights, pinstripes or system artwork reproduced. Gel buttons are drawn from era-private gradients, original values.

## 2. Fonts

Verified from the Google Fonts repository.

| Role | Face | Licence | Why |
|---|---|---|---|
| Statement | **Nunito** 700 / 800 (variable 200–1000) | SIL OFL | The rounded bold wordmark look of glossy Web 2.0 |
| Label | **Nunito Sans** | SIL OFL | Same family keeps the era soft |
| Sentence | **Nunito Sans** (variable 200–1000) | SIL OFL | Real 400/500/600; a legible stand-in for the Verdana era, which isn't free to embed |

**Glyphs:** both lack only `→` (arrows are icons). **Case:** `none`.
**Legibility test** ⬜ pending · **Fallback metrics** ⬜ pending — **critical here**: see §3, the gel geometry depends on the real font's metrics.

## 3. The gel problem, and how it was solved

A gel button is a gradient with a translucent white highlight band across the top. White text over that band drops to **2.8–3.5:1**. Every token-level check still passes, because the checks compare flat colours and the problem only exists in the rendered gradient.

**How it was measured:** in the browser, with the label made transparent, sampling every pixel behind the text box. Pointer parked, transitions off, each state forced (rest, hover, pressed), **with the real fonts loaded**.

| Attempt | Result |
|---|---|
| Band to 38% (planned) | Text box started at 12px, band ended at 16px — **overlap** |
| Band to 26% | Buttons cleared — but a % band grows into short controls |
| Fixed 10px band | System bubble failed at **3.71:1** — text at exactly 10px |
| **Fixed 7px band** | **Every control, every state passes** |

**Final, measured with Nunito loaded:**

| Control | Rest | Hover | Pressed |
|---|---|---|---|
| Nav Résumé | 5.66 | 5.29 | 6.55 |
| Hero View work | 5.64 | 5.27 | 6.64 |
| System bubble | 5.64 | 5.27 | 6.64 |

**Two lessons:**
- **Measure with the real font.** With a fallback loaded, the text sat 2px lower. The first round of measurements validated a layout that wouldn't ship
- **Measure every state.** A stray pointer over one button produced a 3.32 reading. Controlled runs only

**Rule for this era:** the gloss band is a fixed pixel height, and must end at least 2px above the earliest text in any control. Re-measure if padding, font or size tokens change.

## 4. Colour

All pass `check-contrast.mjs`.

| Token | Value |
|---|---|
| `--bg` | `#EDF1F6` |
| `--bg-inverse` | `#123D7A` — deep glossy blue |
| `--surface` | `#FFFFFF` |
| `--surface-sunk` | `#DDE4EE` |
| `--line` / `--outline` | `#C8D2DE` / `#6F7F96` |
| `--text` / `--text-muted` | `#1B2433` / `#505D73` |
| `--text-inverse` / `-muted` | `#FFFFFF` / `#BCD0EC` |
| `--accent` / `--on-accent` | `#CDF22B` / `#1B2433` |
| `--action` / `--on-action` | `#1A5DBF` / `#FFFFFF` |
| `--error` / `--error-surface` | `#B3261E` / `#FCEBEA` |
| `--focus` | `#1A5DBF` |
| `--selection` / `--on-selection` | `#CDF22B` / `#1B2433` |

## 5. Frames

**Frame kind:** `css`

| Fill | Look |
|---|---|
| action | blue gel: 3-stop gradient + 7px gloss band, dark border, embossed text shadow · pressed flips to an inset shadow |
| surface | silver gel · **on bookends it stays light, so its label is restored to `--text`** (overrides core's `--text-inverse`) |
| accent | lime gel |
| disabled | flat `--surface-sunk` |
| field / error | white pill with a soft inner shadow |

Containers: white panels with a faint gradient and a soft drop shadow. Wells: a 1px etched ring.
**Bubble tails:** soft offset triangle in the gel's lower stop colour.

## 6. Shape, depth, motion

| Token | Value |
|---|---|
| `--radius` | `14px` — buttons read as capsules, fields as pills |
| `--border-w` / `--focus-width` | `1px` / `3px` |
| `--shadow-raised` | inner top highlight + soft 20px drop |
| `--shadow-sunk` | etched 1px ring |
| `--shadow-offset` | soft glossy drop under the callout |
| `--reveal-anim` | `reveal-blind-2002` — smooth top-to-bottom clip ("blind down"), eased |
| `--reveal-duration` / `--reveal-timing` | `460ms` / `cubic-bezier(.25, .1, .25, 1)` |
| `--statement-reveal` | `fade` |
| `--hover-timing` | `cubic-bezier(.25, .1, .25, 1)` |

## 7. Assets

`--icon-set: line` · `--frame-kind: css` · `--portrait: photo` (a real photo in a glossy rounded card)

## 8. Era-specific rules

**Always:** gloss band fixed in px and clear of all text · measure gel contrast from pixels, every state, real fonts · rounded everything
**Never:** a percentage-height gloss band · white text on the band · light labels on the bookend silver gel · flat colour fills on primary actions

## 9. Open questions

- Should the photo get the classic Web 2.0 mirrored reflection underneath? It would need a new portrait technique value
