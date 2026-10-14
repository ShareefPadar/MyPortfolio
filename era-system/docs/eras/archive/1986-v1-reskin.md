# Era · 1986 — 8-bit

**Status:** 🟨 Specified · tokens and sprites built · contract and contrast checks pass · legibility test and specimen pending

> Read only this era file while building 1986. Structure and behaviour come from `core.md`; this file only says how 1986 looks.

---

## 1. Identity

**Reference point:** Mid-80s home consoles and computers — the NES and Commodore 64 era, and the dialogue boxes of early RPGs
**One-line look:** A dark screen, white double-line frames, chunky pixel type, one lime and one cyan
**What arrives in this era:** Everything — this is the first stop. Pixel type, framed boxes, a limited palette
**What leaves in 1995:** The dark screen and the flat frames. 1995 turns the lights on and adds depth

**Why a dark page:** 8-bit screens were dark; text lived in framed boxes on black or deep blue. This also makes the jump into 1995's light page the most visible transition in the whole timeline.

**Evoke, don't copy:**
- No reproduced game UI, sprites, menus, or logos from any real game or console
- No Nintendo or Commodore palettes used verbatim — the palette below is original and tuned for contrast
- The double-line frame is a generic 8-bit convention, drawn original

## 2. Fonts

All three verified from the Google Fonts repository: licence file present, weights read from each file's `OS/2` table, glyphs read from its `cmap`.

| Role | Face | Licence | Why this face |
|---|---|---|---|
| Statement | **Press Start 2P** 400 | SIL OFL | Drawn from 8-bit console type. Rejected as 1995's face (single weight, overused, slow reveals), but this is literally the era it comes from — see `DECISIONS.md` |
| Label | **VT323** 400 | SIL OFL | Drawn from a 1987 DEC terminal. Monospace, reads as a separate register from the statement face |
| Sentence | **IBM Plex Mono** 400 / 500 / 600 | SIL OFL | Evokes the IBM PC era. Real 400/500/600 in separate files; comfortable at 16px |

**Glyph coverage** (É é ‘ ’ “ ” – — · → 0–9):
- Press Start 2P — all present, including É for RÉSUMÉ
- VT323 — all except `→`. Labels never use arrows (arrows are icons), so this is accepted
- IBM Plex Mono — all present, all three weights

**Accented capitals:** ⚠ Press Start 2P contains É but draws it too small, so RÉSUMÉ reads as "RéSUMé". Open in `DECISIONS.md`.

**Weights:** Press Start 2P has one weight, so `--statement-weight` and `--statement-weight-strong` are both `400`. Emphasis comes from size and colour. `font-synthesis: none` (core) prevents faked bold.

**Sizing:** Press Start 2P is drawn on an 8px grid and only renders crisp at multiples of 8. Statement sizes are 16 / 24 / 32 — never `clamp()`, never 20 or 28. Its native 8px is legible on a TV, but too small for a phone button label, so buttons use 16.

**Legibility test** (`core.md` §2.3a) — ⬜ **pending**. Run it on a real case study section at 16px on a phone before marking this era done. IBM Plex Mono is the expected pass; the risk is monospace at 60ch feeling long. If it fails, widen the leading before changing the face.

**Fallback metrics** — ⬜ pending. Add `size-adjust` / `ascent-override` fallbacks for all three faces so loading doesn't jump the layout.

## 3. Colour

All ratios computed by `scripts/check-contrast.mjs`.

| Token | Value | Ratio |
|---|---|---|
| `--bg` | `#15153A` | deep indigo screen |
| `--bg-inverse` | `#000000` | the CRT bezel |
| `--surface` | `#262660` | |
| `--surface-sunk` | `#0C0C24` | |
| `--line` | `#34347A` | |
| `--outline` | `#F2F2FF` | 15.76 on bg · 12.38 on surface |
| `--text` | `#F2F2FF` | 15.76 on bg · 12.38 on surface · 17.30 on sunk |
| `--text-muted` | `#A6A6E0` | 7.63 on bg · 5.99 on surface · 8.37 on sunk |
| `--text-inverse` | `#FFFFFF` | 21.00 on bg-inverse |
| `--text-inverse-muted` | `#A0A0B8` | 8.22 on bg-inverse |
| `--accent` | `#CDF22B` | lime — 16.33 on bg-inverse |
| `--on-accent` | `#0A0A1E` | 15.19 |
| `--action` | `#3CC8FF` | cyan — 9.08 on bg |
| `--on-action` | `#0A0A1E` | 10.14 |
| `--error` | `#FF6F61` | 6.41 on bg |
| `--error-surface` | `#3A1414` | |
| `--focus` | `#3CC8FF` | 9.08 on bg · 7.13 on surface |
| `--selection` | `#CDF22B` | |
| `--on-selection` | `#0A0A1E` | 15.19 |

**Lime is a valid state signal here.** It measures 13.6:1 on this era's dark page, unlike 1995 where it's 1.23:1 and can only decorate. The core rule still applies — pair it with an outline anyway, because the same component must work in every era.

**Why cyan, not blue, for action:** 1995's blue measures 2.75:1 on this page — well short of the 4.5 that links and numerals need. Role, not hue — `--action` just has to be the colour that means "do this."

## 4. Frames

**Frame kind:** `sprite`

**No bevel anywhere.** Where 1995 lights its frames from the top left, 1986 uses a **symmetric double line**: a light outer outline and a dark inner line, identical on every side. There's no light source, which is the whole difference.

```
BODY (6×6)          TAIL (6×5)
. D D D D .         F F F F F F
D H H H H D         D F F F F D
D H F F H D         . D F F D .
D H F F H D         . . D D . .
D H H H H D         . . . . . .
. D D D D .
```

`D` outline (light) · `H` inner line (dark) · `F` face. `hi` and `shade` are the same colour, so the build script's sunk swap does nothing.

| Fill | Face | Inner line | Outline | Used by |
|---|---|---|---|---|
| action | `#3CC8FF` | `#0A0A1E` | `#F2F2FF` | Primary button, system bubble |
| surface | `#262660` | `#0A0A1E` | `#F2F2FF` | Secondary button, visitor bubble |
| accent | `#CDF22B` | `#0A0A1E` | `#F2F2FF` | Shareef bubble |
| disabled | `#1C1C44` | — | `#5A5A8A` | Disabled button |
| field | `#0C0C24` | — | `#F2F2FF` | Inputs |
| error | `#3A1414` | — | `#FF6F61` | Errored input |

- Hover: face +18%. Pressed: face −25%
- Tail is 8×5 and overlaps **two** rows (`tailOverlap: 2`) so it opens through both the outline and the inner line
- No `.bookend` variants — white outlines already read on the black bezel
- Authoritative copy: `styles/eras/1986.sprites.json`. Build: `node scripts/build-sprites.mjs 1986`

**Plates and wells (`.frame-raised`, `.frame-sunk`):** raised plates get the same double line with CSS (4px outline + 4px inset dark ring). Screenshot wells get a white frame sitting inside a black bezel ring — the screen inside a screen.

**How the raised/sunk meaning survives without depth:** raised = double-line frame on a lit face; sunk = darker face (pressed) or a bezel ring (wells). The meaning is carried by colour and framing instead of light.

## 5. Shape and depth

| Token | Value |
|---|---|
| `--corner` | 12-point notch, 4px steps |
| `--corner-tab` | top-only notch |
| `--radius` | `0px` |
| `--border-w` | `4px` — chunkier than 1995's 3px; 8-bit pixels were bigger |
| `--shadow-raised` | `inset 0 0 0 4px #0A0A1E` — the inner line |
| `--shadow-sunk` | `0 0 0 4px #F2F2FF, 0 0 0 8px #000000` — frame + bezel |
| `--shadow-offset` | `8px 8px 0 #000000` — hard block shadow under callouts |

## 6. Motion

| Token | Value |
|---|---|
| `--reveal-anim` | `reveal-fade-1986` |
| `--reveal-duration` | `320ms` |
| `--reveal-timing` | `steps(4, end)` |
| `--statement-reveal` | `type` |
| `--type-speed` | `40ms` |
| `--hover-timing` | `steps(1, start)` |

**Reveal technique — palette fade:** consoles of this era faded by stepping through a few palette brightness levels, not by blending. Four hard steps of opacity. Deliberately different from 1995's scanline: 1986 has no CRT-drawing effect because it isn't pretending to be a display, it *is* the display.

**Statement reveal — dialogue typing:** characters appear one at a time, like a game's dialogue box. Hero is 34 characters × 40ms = 1.36s, inside the 1.5s cap. Colour-reveal only, per `core.md` §5 rule 10.

## 7. Assets

| Token | Value | Notes |
|---|---|---|
| `--icon-set` | `pixel` | The 20 icons from `assets/icons/pixel.json` — shared with 1995 |
| `--frame-kind` | `sprite` | See §4 |
| `--portrait` | `blocks` | ~24-column grid of solid cells, 4 levels coloured `--bg` · `--surface` · `--text-muted` · `--text`, densest cells `--accent`. Chunkier than 1995's 46-column dither — fewer, bigger pixels is the point of the era |

## 8. Era-specific rules

**Always in 1986:**
- Statement sizes at multiples of 8 only
- Frames are symmetric — the same line on every side
- Motion in hard steps; the reveal is a palette fade, never a scanline
- Every framed control uses the double line

**Never in 1986:**
- A bevel, highlight or light source of any kind
- Gradients, blur or soft shadows
- `clamp()` or fluid sizes on the statement face
- Blue `#1E45FB` as action — it fails on the dark page
- Reproduced art, UI or palettes from a real game or console

## 9. Open questions

- Logo in 1986: the pixel "S" placeholder in `--text`, or `--accent`?
- Should the era switcher itself use a dialogue-box frame here?
- Legibility test and fallback metrics (see §2) must be done before ✅
