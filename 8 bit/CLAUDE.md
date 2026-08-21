# Portfolio Design System — Implementation Spec

> **For the agent:** This is the single source of truth for `shareefpadar.com`. Read this file fully before writing any component. Where this file and your instinct disagree, this file wins. Where this file is silent, ask rather than invent.
>
> **Stack:** Next.js (App Router) · React · Tailwind CSS · Vercel
> **Visual reference:** `/design-reference/*.html` — open in a browser to see any component rendered. Do not copy their markup; they are prototypes, not production code.

---

## 0. Hard constraints

These are non-negotiable. Violating any of them breaks the system.

| # | Constraint |
|---|---|
| 1 | Every dimension, offset, border and gap is a multiple of **4px** |
| 2 | Bitmap type (Silkscreen) **only** on strings of five words or fewer |
| 3 | Anything read as a sentence is **Geist**, at any size, including a 40px H1 |
| 4 | All animation uses `steps()`. Nothing eases. Nothing interpolates |
| 5 | Icons render at **8, 16, 24, 32, 48px only** — never between |
| 6 | Spacing comes from the ramp. No 11px, 15px, 19px, 20px |
| 7 | Raised bevel = interactive/containing. Sunk bevel = pressed/recessed/failed/current/input. No third meaning |
| 8 | Every colour used in a sprite expands to four tones. Flat fills kill the bevel |

---

## 1. Design tokens

### 1.1 `app/globals.css`

```css
@font-face {
  font-family: 'Departure Mono';
  src: url('/fonts/DepartureMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

:root {
  /* units */
  --u: 4px;              /* one pixel unit */
  --f: 60ms;             /* one animation frame */
  --type: 45ms;          /* one typed character */

  /* spacing ramp — the only valid values */
  --s4: 4px;   --s8: 8px;    --s12: 12px;  --s16: 16px;  --s24: 24px;
  --s32: 32px; --s48: 48px;  --s64: 64px;  --s96: 96px;  --s128: 128px;

  /* colour */
  --lime:  #CDF22B;
  --blue:  #1E45FB;
  --ink:   #14140F;
  --error: #C4482E;
  --paper: #FAFAF8;
  --plate: #D8D8D0;
  --panel: #F0F0EA;
  --line:  #DEDED8;
  --mute:  #6E6E62;      /* NOT #87877A — that failed contrast */
  --hi:    #FFFFFF;      /* bevel highlight */
  --sh:    #8A8A80;      /* bevel shade */

  /* dark surfaces */
  --night:  #0B0B0C;
  --night2: #16161A;
  --nline:  #26262A;
  --ntext:  #9A9A94;

  /* the notch — reused by buttons, tabs, focus ring */
  --notch: polygon(
    4px 0, calc(100% - 4px) 0,
    calc(100% - 4px) 4px, 100% 4px,
    100% calc(100% - 4px),
    calc(100% - 4px) calc(100% - 4px),
    calc(100% - 4px) 100%, 4px 100%,
    4px calc(100% - 4px), 0 calc(100% - 4px),
    0 4px, 4px 4px
  );
}

::selection { background: var(--lime); color: var(--ink); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

### 1.2 `tailwind.config.ts`

```ts
export default {
  theme: {
    extend: {
      colors: {
        lime:  '#CDF22B',
        blue:  '#1E45FB',
        ink:   '#14140F',
        error: '#C4482E',
        paper: '#FAFAF8',
        plate: '#D8D8D0',
        panel: '#F0F0EA',
        line:  '#DEDED8',
        mute:  '#6E6E62',
        night:  '#0B0B0C',
        night2: '#16161A',
        nline:  '#26262A',
        ntext:  '#9A9A94',
      },
      spacing: {
        's4': '4px',  's8': '8px',   's12': '12px', 's16': '16px', 's24': '24px',
        's32': '32px','s48': '48px', 's64': '64px', 's96': '96px', 's128': '128px',
      },
      fontFamily: {
        pix:  ['Silkscreen', 'monospace'],
        mono: ['Departure Mono', 'ui-monospace', 'monospace'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '60ch',
        lead:  '52ch',
        col:   '720px',
        wide:  '1100px',
      },
    },
  },
}
```

### 1.3 Colour usage — do not deviate

| Token | Used for | Never used for |
|---|---|---|
| `lime` | Chat speaker bubble, role-relevant tabs, callouts, LED indicators, portrait accents, text selection, caption rule | Buttons, body text, error states |
| `blue` | Primary button, section numerals, links, system bubbles, typing caret, focus ring | Large fills, backgrounds |
| `ink` | Outlines, body text, rules | Backgrounds except `night` |
| `error` | Form errors only | Emphasis, decoration |
| `mute` | Meta labels, captions | Anything below 16px that isn't a label |

Magenta is **retired**. If you find `#E91E63` or similar anywhere, remove it.

---

## 2. Typography

### 2.1 The gate — run this before setting any text

```
Is this string read as a sentence?
├── YES → Geist. Always. Even at 40px. Even as an H1.
└── NO  → Is it a label or a statement?
          ├── LABEL     → Departure Mono   (tags, meta, eyebrows, nav, timestamps)
          └── STATEMENT → Silkscreen       (max 5 words: hero, page titles, numerals, buttons)
```

**Heading level does not determine face.** The homepage H1 is Silkscreen ("SENIOR PRODUCT DESIGNER WHO SHIPS."). A case study H1 is Geist ("Making business verification feel fast without making it less rigorous."). Same tag, different face, because one is a statement and one is a sentence.

### 2.2 Scale

| Token | Face / weight | Desktop | Mobile | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| `display-xl` | Silkscreen 700 | 32px | 20px | 1.75 | .01em | Homepage hero only |
| `display-l` | Silkscreen 700 | 20px | 15px | 1.8 | .01em | Page titles, 404 |
| `display-m` | Silkscreen 400 | 14px | 14px | 1.8 | .02em | Footer heading, nav wordmark, buttons |
| `section-num` | Silkscreen 700 | 20px | 20px | 1 | — | Section markers, blue |
| `decision-num` | Silkscreen 700 | 40px | 30px | 0.9 | — | Decision blocks, lime + 2px ink stroke |
| `h1` | Geist 500 | 40px | 28px | 1.15 | −.022em | Case study title |
| `h2` | Geist 500 | 26px | 21px | 1.3 | −.016em | Section headings |
| `h3` | Geist 600 | 19px | 17px | 1.4 | 0 | Decision titles, card titles |
| `h4` | Geist 600 | 16px | 16px | 1.5 | 0 | Inside plates |
| `lead` | Geist 400 | 19px | 17px | 1.65 | 0 | First para, max 52ch |
| `body` | Geist 400 | 16px | 16px | 1.7 | 0 | Everything else, max 60ch |
| `small` | Geist 400 | 14px | 14px | 1.6 | 0 | Notes, audit block |
| `caption` | Geist 400 | 13px | 13px | 1.55 | 0 | Under screenshots, 3px lime left rule |
| `meta` | Departure Mono | 11px | 11px | 1.5 | .08em | Card meta, nav links |
| `micro` | Departure Mono | 9px | 9px | 1.4 | .11em | Tags, tab labels, uppercase |

**Rules:**
- Silkscreen never below 1.7 line height — bitmap faces jam together
- Silkscreen Bold reserved for hero, page titles, numerals. Everything else Regular
- Negative tracking on h1/h2 only — below 20px it makes Geist muddy
- Captions are Geist, not mono. A caption is a sentence

---

## 3. The sprite system

Every framed component — buttons, bubbles, tabs, cards, inputs — uses **one 6×6 pixel map** stretched with `border-image`. This is the core primitive. Build it once.

### 3.1 `lib/sprite.ts`

```ts
type Palette = {
  face: string;
  hi: string;      // bevel highlight (top-left)
  shade: string;   // bevel shade (bottom-right)
  outline: string;
  hover?: string;  // optional face override on hover
};

type State = 'base' | 'hover' | 'sunk';

const BODY = [
  '.DDDD.',
  'DHHHSD',
  'DHFFSD',
  'DHFFSD',
  'DSSSSD',
  '.DDDD.',
];

const TAIL_TAPER = [
  'FFFFFF',
  'DFFFFS',
  '.DFFSD',
  '..DFSD',
  '...DD.',
];

function mix(hex: string, target: string, amount: number): string {
  const h = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  const t = (i: number) => parseInt(target.slice(i, i + 2), 16);
  const c = (a: number, b: number) =>
    Math.round(a + (b - a) * amount).toString(16).padStart(2, '0');
  return '#' + c(h(1), t(1)) + c(h(3), t(3)) + c(h(5), t(5));
}

export const lighten = (c: string, a: number) => mix(c, '#ffffff', a);
export const darken  = (c: string, a: number) => mix(c, '#000000', a);

/** Expand a single hex into the four tones a bevel needs. */
export function tones(face: string, outline: string): Palette {
  return {
    face,
    hi: lighten(face, 0.45),
    shade: darken(face, 0.42),
    outline,
  };
}

/** Render the 6×6 map to a PNG data URI. scale = px per pixel unit. */
export function sprite(p: Palette, scale = 4, state: State = 'base'): string {
  const face =
    state === 'sunk'  ? darken(p.face, 0.10)
  : state === 'hover' ? (p.hover ?? lighten(p.face, 0.14))
  : p.face;

  const map: Record<string, string | null> = {
    '.': null,
    D: p.outline,
    H: state === 'sunk' ? p.shade : p.hi,
    S: state === 'sunk' ? p.hi : p.shade,
    F: face,
  };

  const c = document.createElement('canvas');
  c.width = 6 * scale;
  c.height = 6 * scale;
  const ctx = c.getContext('2d')!;
  for (let r = 0; r < 6; r++) {
    for (let q = 0; q < 6; q++) {
      const col = map[BODY[r][q]];
      if (col) { ctx.fillStyle = col; ctx.fillRect(q * scale, r * scale, scale, scale); }
    }
  }
  return `url(${c.toDataURL()})`;
}
```

**Performance note:** `sprite()` uses canvas, so it must run client-side. Generate each palette/state combination **once** at module load and cache it — do not call it inside a render or an event handler. A `Map<string, string>` keyed by `${paletteName}-${scale}-${state}` is sufficient.

For production, prefer **pre-rendering the sprites to static PNGs in `/public/sprites/`** at build time and referencing them by URL. Only fall back to runtime canvas generation if the palette is dynamic.

### 3.2 The palettes

```ts
export const PALETTES = {
  blue:     { face: '#1E45FB', hi: lighten('#1E45FB', .38), shade: darken('#1E45FB', .45), outline: '#0A0E2E' },
  lime:     { face: '#CDF22B', hi: lighten('#CDF22B', .55), shade: darken('#CDF22B', .42), outline: '#14140F' },
  neutral:  { face: '#E2E2DC', hi: '#FFFFFF', shade: '#A6A69E', outline: '#14140F', hover: '#EDEDE7' },
  disabled: { face: '#DCDCD6', hi: '#EDEDE8', shade: '#B4B4AC', outline: '#A0A099' },
  // inputs: highlight and shade are INVERTED so the field reads as recessed
  field:    { face: '#FAFAF8', hi: '#8A8A80', shade: '#FFFFFF', outline: '#14140F' },
  fieldErr: { face: '#FDF2EF', hi: '#C4482E', shade: '#FFFFFF', outline: '#C4482E' },
  // dark-surface variants — outline LIGHTENS or the component dissolves
  blueDk:   { face: '#1E45FB', hi: lighten('#1E45FB', .38), shade: darken('#1E45FB', .45), outline: '#4A5BAE' },
  limeDk:   { face: '#CDF22B', hi: lighten('#CDF22B', .55), shade: darken('#CDF22B', .42), outline: '#5A6B1E' },
  neutralDk:{ face: '#1E1E22', hi: '#3A3A40', shade: '#0A0A0C', outline: '#4A4A50', hover: '#2A2A30' },
} as const;
```

### 3.3 Applying a sprite

```tsx
<button
  className="font-pix text-[11px] leading-none px-[13px] py-[9px] min-h-[44px]
             border-[8px] border-transparent bg-none text-lime
             inline-flex items-center gap-s8"
  style={{
    borderImageSource: sprite(PALETTES.blue),
    borderImageSlice: '8 fill',
    borderImageRepeat: 'stretch',
  }}
>
  VIEW WORK
</button>
```

- `border-width` = `scale × 2` (so scale 4 → 8px border, scale 6 → 12px)
- `border-image-slice` must equal the border width
- Large buttons use **scale 6**, not a scaled-up scale-4 sprite

---

## 4. Components

### 4.1 Button

Four levels. One primary per view.

| Level | Palette | Text | Notes |
|---|---|---|---|
| Primary | `blue` | `lime`, Silkscreen 700 | One per view |
| Secondary | `neutral` | `ink`, Silkscreen 400 | |
| Tertiary | none | `blue`, Silkscreen 400 | Underline appears on hover only |
| Disabled | `disabled` | `#9A9A92` | `cursor: not-allowed` |

```
padding: 9px 13px       (large: 10px 16px, scale 6)
min-height: 44px        (always — accessibility floor)
icon gap: 8px
```

States: `base` → `hover` (face lightens) → `sunk` on `pointerdown`. Return to `hover` on `pointerup`, not `base`.

**Never** put two saturated buttons side by side. Inside a card the secondary drops to tertiary.

### 4.2 Focus ring

A square outline around a notched sprite reads as a rendering bug. Use a notched plate behind the element instead.

```css
.focusable { position: relative; display: inline-block; }
.focusable::before {
  content: "";
  position: absolute;
  inset: -7px;
  background: var(--blue);
  clip-path: var(--notch);
  z-index: -1;
  opacity: 0;
}
.focusable:focus-within::before { opacity: 1; }
```

Wrap every interactive element in `.focusable`. Set `outline: none` on the inner element **only** because the ring replaces it — never remove focus indication outright.

**Focus is instant. Never animated. Never suppressed.** This is the one place in the system where motion is banned.

### 4.3 Input

Uses the `field` palette (inverted bevel — recessed).

```
padding: 12px 13px
min-height: 48px
font-size: 16px         (below 16 triggers iOS zoom on focus)
scale: 3                (border-width 6px, slice 6)
```

- Labels always visible above the field, Departure Mono 10px uppercase, `.1em` tracking
- Placeholders are examples, **never** labels
- Errors: `fieldErr` palette + text below with a 9px `error` square. Never colour alone
- Select arrow is a drawn pixel triangle as an inline SVG data URI, not the browser default

### 4.4 Card

```
Structure:
  <a class="card">                    plate palette, raised bevel, 3px ink border
    <span class="tab">DOMAIN</span>   absolute, top:-17px, left:14px, min-width:104px
    <div class="well">                margin 10px, sunk — see below
      <img />                         aspect 16/10
    </div>
    <div class="body">                paper bg, 3px ink border, margin 10px, padding 16px
      <div class="meta" />            mono 10px
      <h3 />                          Geist 500, 19px
      <p />                           Geist 400, 14.5px
      <span class="go">               Silkscreen 10px + arrow icon
    </div>
  </a>
```

**The well** (recessed screenshot):
```css
box-shadow: 0 0 0 3px var(--ink), inset 4px 4px 0 rgba(0,0,0,.4);
```

**The tab:**
```css
position: absolute; top: -17px; left: 14px;
border: 3px solid var(--ink); border-bottom: 0;
padding: 4px 10px 5px;
min-width: 104px; text-align: center;
font-family: var(--mono); font-size: 10px; letter-spacing: .07em;
background: var(--plate);   /* or var(--lime) when role-relevant */
clip-path: polygon(
  4px 0, calc(100% - 4px) 0,
  calc(100% - 4px) 4px, 100% 4px,
  100% 100%, 0 100%, 0 4px, 4px 4px
);
```

**Tab content rule:** the tab carries **domain only** — `FINTECH`, `MARKETPLACE`, `MOBILE`. Never a year, never a discipline, never a role. Lime tab = matches the role being applied to; plate tab = everything else. `min-width: 104px` stops short labels raggedy-ing the grid.

On hover: card body goes `#FFFFFF`, tab goes lime.

### 4.5 Chat bubble

Same 6×6 frame. Tail is a **separate sprite** positioned absolutely, overlapping the bottom edge by one unit (`margin-top: -4px`) so the outline opens into the bubble.

| Speaker | Palette | Text |
|---|---|---|
| Shareef | `lime` | `ink` |
| Visitor | `neutral` | `ink`, right-aligned, mirrored tail |
| System | `blue` | `lime`, Departure Mono 13px |

- Tail shapes: **taper** (symmetric) for threads, **flag** (vertical left edge) for a corner-pinned greeting
- Typing indicator: three 9px **ink** squares, `steps(1)`, 0.35s stagger. Never lime — lime on lime disappears
- Entrance: 4-frame scale with overshoot, `transform-origin: bottom left`

### 4.6 Nav

Sticky plate bar that flattens past 24px scroll.

```
At rest:   3px border all round, full bevel, contained to 1100px column
Scrolled:  border-bottom only, no bevel, plate → panel, height −8px,
           bar spans full width, contents stay on the column
Transition: INSTANT. No easing. Toggle a class.
```

- Active item is **sunk** (inverted bevel)
- On a case study page, `WORK` stays sunk — the case study's own back link handles upward navigation
- **Résumé is a blue sprite button, never a nav link.** It's a download, not a place, so it can never be sunk. It doubles as the only always-visible CTA
- Mobile burger: three 14×3px ink blocks, not thin lines. Menu drops full width, items numbered `01`–`04`, active item lime

### 4.7 Icons

20 icons, each an 8×8 pixel map, rendered to canvas.

```ts
export const ICONS = {
  arrowR:   ['........','...XX...','....XX..','XXXXXXX.','XXXXXXX.','....XX..','...XX...','........'],
  arrowL:   ['........','...XX...','..XX....','.XXXXXXX','.XXXXXXX','..XX....','...XX...','........'],
  arrowU:   ['........','...XX...','..XXXX..','.XX..XX.','...XX...','...XX...','...XX...','........'],
  arrowD:   ['........','...XX...','...XX...','...XX...','.XX..XX.','..XXXX..','...XX...','........'],
  external: ['..XXXXX.','..XXXXX.','.....XX.','....XX..','...XX...','..XX....','.XX.....','........'],
  download: ['...XX...','...XX...','...XX...','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...','........'],
  play:     ['.XX.....','.XXXX...','.XXXXXX.','.XXXXXXX','.XXXXXXX','.XXXXXX.','.XXXX...','.XX.....'],
  close:    ['........','.XX...XX','..XX.XX.','...XXX..','...XXX..','..XX.XX.','.XX...XX','........'],
  plus:     ['........','...XX...','...XX...','XXXXXXXX','XXXXXXXX','...XX...','...XX...','........'],
  minus:    ['........','........','........','XXXXXXXX','XXXXXXXX','........','........','........'],
  chevron:  ['........','........','XX....XX','.XX..XX.','..XXXX..','...XX...','........','........'],
  check:    ['........','......XX','.....XX.','XX..XX..','XXX.XX..','.XXXX...','..XX....','........'],
  warning:  ['...XX...','...XX...','..XXXX..','..X..X..','.XX..XX.','.XXXXXX.','XXX..XXX','XXXXXXXX'],
  info:     ['XXXXXXXX','X......X','X..XX..X','X......X','X..XX..X','X..XX..X','X......X','XXXXXXXX'],
  clock:    ['..XXXX..','.X....X.','X..X...X','X..X...X','X..XXX.X','X......X','.X....X.','..XXXX..'],
  search:   ['.XXXX...','X....X..','X....X..','X....X..','.XXXX...','....XXX.','.....XXX','......XX'],
  mail:     ['........','XXXXXXXX','XXX..XXX','X.XXXX.X','X..XX..X','X......X','XXXXXXXX','........'],
  copy:     ['..XXXXX.','..X...X.','XXXXX.X.','X...X.X.','X...XXX.','X...X...','X...X...','XXXXX...'],
  grid:     ['XXX.XXX.','XXX.XXX.','XXX.XXX.','........','XXX.XXX.','XXX.XXX.','XXX.XXX.','........'],
  menu:     ['........','XXXXXXXX','XXXXXXXX','........','XXXXXXXX','XXXXXXXX','........','........'],
} as const;
```

Render with `image-rendering: pixelated`. Prefer generating static SVGs at build time over runtime canvas.

**Rules:**
- Sizes: `8 | 16 | 24 | 32 | 48` only. Never `width: 1em`, never 18/20/22px
- Icons inherit `currentColor`
- Decorative icons beside a label: `aria-hidden="true"`
- Icon-only buttons: accessible name required, min 44×44px target
- One icon = one job. Never reuse `chevron` as a link affordance
- **Never pixelate LinkedIn / Behance / Medium marks.** Use official SVGs, monochrome, always with a text label

---

## 5. Motion

### 5.1 One motion per face

| Element | Motion | Timing |
|---|---|---|
| Silkscreen | Typewriter, blue block caret | 45ms/char, **max 1.5s total** |
| Geist headings | Scanline wipe | 4–6 frames |
| Containers, cards, screenshots | Scanline, whole object | 6 frames |
| Geist body | Binary opacity, staggered | 1 step, 1 frame apart |
| Departure Mono | Binary, instant | — |
| Numerals | Pop with overshoot | 4 frames |
| Nav flatten | Instant | no transition |
| Loaders | Segmented blocks filling | 1 block/frame |
| LED indicator | Blink | 2.6s loop — the only looping animation |

**Why Silkscreen types and Geist scans:** Silkscreen is capped at five words, so it types in under 1.5s. A case study H1 is ~72 characters — typing that is 3+ seconds before the visitor can read your title. Sentence-length headings always scan.

### 5.2 Scanline (the primary reveal)

```css
@keyframes scanClip {
  0%   { clip-path: inset(0 0 100% 0); }
  100% { clip-path: inset(0 0 0% 0); }
}
@keyframes scanBands {
  0%   { mask-image: repeating-linear-gradient(#000 0 1px, transparent 1px 6px); }
  30%  { mask-image: repeating-linear-gradient(#000 0 3px, transparent 3px 6px); }
  60%  { mask-image: repeating-linear-gradient(#000 0 5px, transparent 5px 6px); }
  100% { mask-image: none; }
}
.scan {
  animation:
    scanClip  calc(var(--f) * 6) steps(6, end) both,
    scanBands calc(var(--f) * 8) steps(1, end) both;
}
```
Include `-webkit-mask-image` alongside `mask-image` for Safari.

Trigger with `IntersectionObserver`, `threshold: 0.15`, then **`unobserve`** — reveals fire once and never re-trigger on scroll back up.

### 5.3 Typewriter

```tsx
// 45ms per character. Caret is a blue block, steps(1) blink,
// REMOVED when the line completes — never left blinking.
```

Never type body copy. Never type more than one element at a time on screen.

### 5.4 Both axes quantise

Time steps into frames **and** space snaps to 4px. Stepping the timing but letting an element land on 37.5px still reads wrong.

### 5.5 Never step

Page scroll · text currently being read · focus rings · form validation feedback.
Nothing runs past 12 frames. Everything disabled under `prefers-reduced-motion`.

---

## 6. Layout

### 6.1 Spacing ramp

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

If a value isn't on this list it's wrong.

### 6.2 Vertical rhythm

**Space above a heading is 3–4× the space below it.** This is what makes a heading attach to the content it introduces rather than float between two blocks.

```
64px above a section marker → 16px below the heading
48px above an h3            → 12px below
16px between paragraphs
```

### 6.3 Containers

| Width | Used for |
|---|---|
| full bleed | Hero block, footer, flattened nav bar |
| `1100px` | Card grid, work index |
| `720px` | Case study page, default column |
| `60ch` / `52ch` | Prose cap / lead cap — regardless of container width |

### 6.4 Breakpoints

| Range | Behaviour |
|---|---|
| `< 560px` | Single column. Gutter 16. Section gap 64→48, hero 96→48. Display type drops hardest; body barely moves |
| `560–900px` | Card grid two-up. Gutter 24 |
| `> 900px` | Full scale. Gutter 32. Hero splits two-column, portrait right |

Mobile compresses **large steps only**. `--s16` and below never change.

### 6.5 Page structure

Light page with **two dark blocks bookending the work**: hero and footer are `--night`, everything between is `--paper`.

---

## 7. Page compositions

### 7.1 Homepage

```
Nav (sticky plate)
Hero            — night, typed Silkscreen h1, lead, two buttons,
                  ASCII portrait right, greeting bubble
01 Selected work — 2 featured cards, two-up
NDA strip        — full-width rule top and bottom, "view all work"
02 Designed, built & live — Roomy + Form, live indicators, dual actions
Footer (night)
```

### 7.2 Work index

```
Tier 1 "START HERE"  — 2 strongest, full cards with description
Tier 2               — remaining case studies, compact cards, no description
Archive              — off-discipline and older work as a collapsed text list
Filter               — domain chips, deep-linkable (?filter=fintech)
Empty state          — search icon, message, reset button
```

Off-discipline work is **separated, not deleted.**

### 7.3 Case study

```
Nav (WORK sunk) + back link
01 OVERVIEW      — h1 (Geist), meta grid, lead, disclosure quote
02 SHORT VERSION — 3 tab-plate cards: problem / what I did / why it was hard
03 THE TENSION   — h2, prose, lime callout with the reframe question
04 RESEARCH      — 3 tab-plate finding cards
05 DECISIONS     — repeating block: numeral + h3 + options weighed + choice
                   + screenshot in a well + caption
06 SELF-AUDIT    — inverted dark panel, sunk bevel, lime headers
07 TRY IT        — bezel with live prototype, LED strip, primary button
08 WHAT'S NEXT   — prose, closing pull quote
Next story link
Minimal footer
Section rail (sticky desktop) + segmented scroll progress
```

**The decision block is 6/7 of the reading.** Build it as one component and repeat it.

### 7.4 Footer

Dark, centred. Status strip (location + response time — **never availability**), Silkscreen heading typed once on scroll-in, one line of Geist, email as visible text with a copy button, labelled social links, "designed & built by" credit, back to top.

Case study pages get the **minimal** footer — a next-story link plus a full sitemap is two navigation systems arguing.

---

## 8. Prose kit

Inside case study body copy:

```css
/* inline link — ink text with a blue rule, NOT blue text */
.prose a {
  color: var(--ink);
  text-decoration: none;
  background-image: linear-gradient(var(--blue), var(--blue));
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  padding-bottom: 1px;
}
.prose a:hover {
  background-image: linear-gradient(var(--lime), var(--lime));
  background-size: 100% 40%;
}
.prose a[target="_blank"]::after { content: "↗"; /* external only */ }

/* UI string quoted from a product */
.ui { font-family: var(--mono); font-size: .88em;
      background: var(--panel); border: 1px solid var(--line); padding: 1px 5px; }

/* bullets are squares, never discs */
.prose ul li::before {
  content: ""; position: absolute; left: 4px; top: .62em;
  width: 8px; height: 8px; background: var(--blue);
}

/* ordered lists use leading zeros, matching section markers */
.prose ol li::before { content: counter(n, decimal-leading-zero); }
```

- **Pull quote** (your own line): unquoted, 23px Geist 500, 6px lime left rule
- **Said quote** (someone else's words): keeps quotation marks, sits on a `panel` plate with attribution
- **Scroll progress:** 10 segmented blocks filling one at a time. Never a smooth bar
- **Section rail:** sticky desktop, numerals matching section markers, active item sunk

---

## 9. ASCII portrait

Hero element. Samples a source image into a character grid.

```
Grid:      ~46 × 38 characters
Ramp:      [' ', '·', '░', '░', '▒', '▒', '▓', '▓', '█', '█', '█']
Font:      Departure Mono, ~6.5px, line-height 1
Quantise:  brightness → 4 discrete levels, then map to ramp index
Accent:    lime on the densest cells only (top 2 ramp indices)
Pointer:   proximity within radius 9 boosts brightness by (1 - d/r) * 0.55
Touch:     matchMedia('(hover: none)') → auto-sweep, 130ms interval
```

Density must step through **four discrete levels**. Smooth interpolation turns it into a blur effect rather than a dither.

`alt=""` — decorative.

---

## 10. Share cards (OG)

1200×630. Generate with `next/og` (`ImageResponse`), not exported PNGs — every case study gets one from its frontmatter.

| Template | Design |
|---|---|
| Homepage | `night` bg, Silkscreen headline, lime accent word, URL |
| Case study | Tab + Geist title + screenshot cropped tall in a well |
| Statement | Lime fill, one Geist line, for LinkedIn posts |
| Fallback | Plate frame, for About / Contact / 404 |

**Rules:** nothing below 22px on the 1200px canvas (≈6px in a mobile feed). Six words max in the largest text. URL on every card. Dark or lime fill — never paper, the card must break out of a white feed.

Meta tags per page: `og:title`, `og:description`, `og:image`, `og:image:width` 1200, `og:image:height` 630, `og:type`, `twitter:card` = `summary_large_image`.

---

## 11. Accessibility

| Pairing | Ratio | Level |
|---|---|---|
| Ink on paper | 16.9:1 | AAA |
| Ink on lime | 13.0:1 | AAA |
| White on blue | 8.6:1 | AAA |
| Mute on paper | 5.7:1 | AA |
| Lime on blue | 4.9:1 | AA |

- **`--mute` is `#6E6E62`.** The earlier `#87877A` measured 4.0:1 and failed on 9–11px meta labels. Do not revert it
- Touch targets minimum 44×44px everywhere, including mobile nav links
- Skip link is the first focusable element on every page
- Screenshot alt text describes what the screen shows and why it matters — not "screenshot of Sanad"
- Errors carry icon **and** text, never colour alone
- Layout holds to 200% zoom. Test the Silkscreen hero specifically
- `prefers-reduced-motion`: all typing, scanline, pop and blink disabled; content renders at final state

---

## 12. Common mistakes

Things that will look almost right and be wrong:

1. **Setting a case study H1 in Silkscreen** because it's an H1. Check the gate: it's a sentence → Geist
2. **Using `transition` or an easing function** anywhere in the pixel layer. Everything is `steps()`
3. **Calling `sprite()` inside a render or event handler.** Generate once, cache, reuse
4. **Scaling a scale-4 sprite up for a large button.** Draw it at scale 6 instead
5. **A square focus outline** on a notched component. Use the notched plate
6. **Using lime as a button fill.** Lime is the highlight tone, never the face on a primary action
7. **Near-black outlines on dark surfaces.** Switch to the `*Dk` palettes
8. **Icon at 20px** because it "looked right". Only 8/16/24/32/48
9. **Padding of 15px or 18px.** Only ramp values
10. **Scanline applied to a card's children individually.** The container animates as one object
11. **Reverting `--mute` to a lighter grey** because it looks heavy. It fails contrast
12. **Re-triggering scroll reveals** on scroll-up. `unobserve` after firing
13. **Two sprite buttons inside one card.** Secondary drops to tertiary
14. **A tab reading "2026" or "UX Design".** Domain only

---

## 13. Open decisions — ask before implementing

- **Logo:** currently a smooth curved mark on a 4px-grid site. Redraw as pixel art, or keep as a deliberate exception? Not decided
- **Cursor:** pixel cursor images vs. a grid-snap follower. Not decided
- **404 / About / Contact:** components exist, compositions don't
- **Cargoz Connect placement:** currently tier two pending client permission

---

## 14. Reference files

Open in a browser to see any component rendered live:

| File | Contents |
|---|---|
| `design-system-v3.html` | Full system reference — start here |
| `spacing-scale.html` | Ramp, rhythm, containers |
| `type-scale.html` | All type tokens with specimens |
| `nineslice-lime-blue.html` | Sprite anatomy at 20× |
| `secondary-button.html` | Button hierarchy |
| `forms-accessibility.html` | Fields, focus ring, contrast pass |
| `icon-set.html` | All 20 icons, sizes, usage |
| `sticky-plate-nav.html` | Nav scroll behaviour (scroll it) |
| `case-study-window-nochrome.html` | Card treatments |
| `chat-bubble-lime.html` | Bubbles, tails, typing |
| `prose-kit.html` | Links, lists, quotes, rail, progress |
| `motion-by-face.html` | Motion mapping with replay controls |
| `sanad-case-study-template.html` | Full case study page |
| `work-index.html` | Index with filtering |
| `footer-dark.html` | Footer |
| `share-cards.html` | OG templates + feed test |
| `ascii-portrait.html` | Portrait ramps and fallbacks |

These are **prototypes**. Read them for visual truth, not for code structure — they use inline styles and vanilla JS. Production code should be idiomatic React with Tailwind.
