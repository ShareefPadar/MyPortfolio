# Core — rules that never change between eras

> ⚠ **Superseded by architecture v2** (see `ERA-SYSTEM.md`). This file describes the v1 reskin model, where every era shared one layout. Still valid: the spacing ramp as a sensible default, the type gate as guidance, the accessibility floor, the motion safety rules. No longer binding: shared component anatomy, shared page compositions, the shared token contract.


> Everything in this file is identical in 1986, 1995, 2002, 2014 and Now.
> Colours, fonts, frames and motion curves are **not** here — they belong to the era files.
> Components described here reference contract tokens only. See `contract.md`.

---

## 1. Spacing

### 1.1 The ramp

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

```css
:root {
  --s4: 4px;   --s8: 8px;   --s12: 12px;  --s16: 16px;  --s24: 24px;
  --s32: 32px; --s48: 48px; --s64: 64px;  --s96: 96px;  --s128: 128px;
}
```

If a value isn't on this list it's wrong — in every era, including the soft modern one. No 11, 15, 18, 19, 20.

| Value | Typical use |
|---|---|
| 4 | Icon to label |
| 8 | Label to value, button gaps |
| 12 | Tag row to heading |
| 16 | Heading to body, card padding, paragraph gap |
| 24 | Component padding |
| 32 | Between components |
| 48 | Above a section heading, between cards |
| 64 | Between case study sections |
| 96 | Hero padding |
| 128 | Between major page regions |

### 1.2 Vertical rhythm

Space above a heading is **3–4× the space below it**. This is what attaches a heading to the content it introduces.

- 64 above a section marker → 16 below the heading
- 48 above an h3 → 12 below
- 16 between paragraphs

### 1.3 Mobile

Below 560px, only the large steps compress: 64→48, 96→48. `--s16` and below never change.

---

## 2. Type roles and the gate

### 2.1 Three roles

Every era supplies exactly three faces via the contract. The **role** a string plays decides which face it gets.

| Role | Token | Used for |
|---|---|---|
| **Statement** | `--font-statement` | Hero, page titles, section numerals, decision numerals, button labels, footer heading, nav wordmark |
| **Label** | `--font-label` | Tags, tabs, meta, eyebrows, nav links, timestamps, field labels |
| **Sentence** | `--font-sentence` | Anything read as language: every heading that is a sentence, body, lead, captions, quotes |

### 2.2 The gate — run it before setting any text

```
Is this string read as a sentence?
├── YES → --font-sentence. Always. At any size. Even as an H1.
└── NO  → Label or statement?
          ├── LABEL     → --font-label
          └── STATEMENT → --font-statement   (five words maximum)
```

**Heading level does not determine role.** The homepage H1 is a statement. A case study H1 is a sentence. Same tag, different role.

**Font rules, every era:**
- `font-synthesis: none` is set globally. Browsers must never fake a bold or italic
- The sentence face must ship real **400, 500 and 600** weights — the core sentence scale uses all three
- If a statement face has only one weight, set `--statement-weight` and `--statement-weight-strong` to the same value. Emphasis then comes from size and colour, never synthesised bold

**Why this matters more with eras:** a period-accurate statement face (a bitmap font in 1986, a gel headline in 2002) is only readable at short lengths. The gate is what keeps every era legible.

### 2.3 Sentence scale — core, fixed across eras

Each era chooses its own sentence face, but the scale below is fixed. On an era switch, line breaks can move; sizes, line heights and spacing never do.

| Token | Desktop | Mobile | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| `h1` | 40 | 28 | 1.15 | −.022em | 500 | Case study title |
| `h2` | 26 | 21 | 1.3 | −.016em | 500 | Section headings |
| `h3` | 19 | 17 | 1.4 | 0 | 600 | Decision titles, card titles |
| `h4` | 16 | 16 | 1.5 | 0 | 600 | Inside containers |
| `lead` | 19 | 17 | 1.65 | 0 | 400 | First paragraph, max 52ch |
| `body` | 16 | 16 | 1.7 | 0 | 400 | Everything else, max 60ch |
| `small` | 14 | 14 | 1.6 | 0 | 400 | Notes, audit block |
| `caption` | 13 | 13 | 1.55 | 0 | 400 | Under screenshots |

Negative tracking on h1/h2 only.

### 2.3a Sentence face requirements — every era

Because the reading face changes per era, each one must pass these before it's accepted:

- Real **400, 500, 600** weights (no synthesis)
- **Legibility test:** a full case study section at 16px body / 60ch reads comfortably on a phone at arm's length. If a period face fails this, pick a different period-appropriate face — never shrink the scale or drop the gate
- x-height close enough to the other eras' faces that the fixed scale still looks right. Use `font-size-adjust` if needed rather than changing sizes
- Glyph coverage for the site's copy: é (RÉSUMÉ), curly quotes, em dash, en dash, ·, →, digits
- **Check accented capitals by eye, not just by glyph table.** A face can contain É and still draw it too small to read as a capital — Press Start 2P renders RÉSUMÉ as "RéSUMé"
- Free for commercial web use, licence recorded in the era file
- A metric-matched fallback (`size-adjust`, `ascent-override`) so loading doesn't jump the layout

### 2.3b On an era switch

- Browser scroll anchoring keeps the reader's place when text rewraps. **Never set `overflow-anchor: none`**
- Preload the target era's fonts when the switcher is focused or hovered, so the switch doesn't flash fallback text
- Fonts for eras never visited are never downloaded

### 2.4 Statement and label scale — era-tunable

Statement and label faces vary so much between eras (a bitmap font vs. a modern display face) that their **sizes** are contract tokens, set per era: `--size-statement-xl/l/m`, `--size-label`, `--size-micro`. Their **roles** are fixed:

| Token | Role |
|---|---|
| `--size-statement-xl` | Homepage hero only |
| `--size-statement-l` | Page titles, 404 |
| `--size-statement-m` | Footer heading, nav wordmark, button labels |
| `--size-label` | Meta, nav links, card meta |
| `--size-micro` | Tags, tab labels, section-marker labels |

Section numerals use `--size-statement-l`. Decision numerals use `--size-statement-xl` × 1.25.

---

## 3. Layout

### 3.1 Containers

| Width | Used for |
|---|---|
| full bleed | Hero, footer, flattened nav |
| `1100px` | Card grid, work index |
| `720px` | Case study page |
| `60ch` / `52ch` | Prose cap / lead cap, regardless of container |

### 3.2 Breakpoints

| Range | Behaviour |
|---|---|
| `< 560px` | Single column. Gutter 16. Large spacing compresses. Statement type drops hardest; sentence type barely moves |
| `560–900px` | Card grid two-up. Gutter 24 |
| `> 900px` | Full scale. Gutter 32. Hero splits two columns, portrait right |

### 3.3 Page frame

Every page, every era: a `--bg` page with **two `--bg-inverse` blocks bookending the content** — the hero at the top and the footer at the bottom. What "inverse" looks like is up to the era (black in 1986, near-black in 1995, a saturated gloss in 2002, a bold colour block in 2014, near-black in Now). That there *are* two bookends is core.

---

## 4. Component anatomy

Parts, states and behaviour only. How a component *looks* comes from the era.

### 4.1 Frames

Two frame states exist in every era. They are the whole visual vocabulary of depth:

| State | Meaning | Used by |
|---|---|---|
| **Raised** | Interactive, or a container you can act on | Buttons, cards, nav bar, bubbles, device frame |
| **Sunk** | Pressed, recessed, an input, a failure, the current page | Pressed buttons, screenshot wells, fields, active nav item, audit panel |

No era may introduce a third meaning. An era may render raised and sunk identically (e.g. 2014 flat) — the **meaning** still applies, expressed through colour or border instead of depth.

Frames are applied with classes, which each era implements. See `contract.md` §7.

| Class | Used by | Attributes |
|---|---|---|
| `.frame-raised` | Plates: cards, nav bar, device frame, rail | — |
| `.frame-sunk` | Wells: screenshots, active nav item | — |
| `.frame-control` | Buttons, bubbles, inputs | `data-fill` (required) · `data-size="lg"` · `data-state="hover\|pressed"` |
| `.frame-tail` | Chat bubble tails | `data-fill` · `.is-right` to mirror |

`data-fill` values: `action · surface · accent · disabled · field · error`.
Components choose a **fill role**; they never know whether the era draws it with a sprite or with CSS.
`data-state` exists so the specimen can render hover and pressed statically — real interaction uses `:hover` / `:active`.

### 4.2 Button

| Level | Fill | Text | Face |
|---|---|---|---|
| Primary | `--action` | `--on-action` | statement, strong weight |
| Secondary | `--surface` | `--text` | statement |
| Tertiary | none | `--action` | statement, underline on hover |
| Disabled | `--surface-sunk` | `--text-muted` | statement |

- States: rest → hover → pressed (sunk) → focus. Return to hover on pointer-up, not rest
- Min height **44px** · padding 8/12 · icon gap 8
- **One primary per view.** Never two saturated buttons side by side. Inside a card, secondary drops to tertiary

### 4.3 Focus

- Every interactive element shows focus using `--focus`
- The ring's **shape** follows the era's corner token (`--corner`), so it hugs the component instead of boxing it
- **Instant. Never animated. Never suppressed.**
- The ring's wrapper must create its own stacking context (`isolation: isolate`), or an ancestor's background paints over it and the ring is invisible

### 4.4 Input

- Frame: sunk
- Label always visible above, label face, `--size-micro`, uppercase
- Placeholder is an example, never a label
- Min height 48 · font-size **16px minimum** (prevents iOS zoom)
- Error: `--error-surface` fill on the field, `--error` message + icon **below the field on `--bg`** — never inside the tinted fill, where contrast drops. Never colour alone

### 4.5 Icons

Twenty icons, fixed names, every era supplies all twenty:

`arrowR arrowL arrowU arrowD external download play close plus minus chevron check warning info clock search mail copy grid menu`

- Source of truth: `assets/icons/<set>.json`. Built to `public/icons/<set>/<name>.svg` with `node scripts/build-icons.mjs`. Never copy icon maps out of the prototypes
- Sizes **8 / 16 / 24 / 32 / 48 only**
- Inherit `currentColor`
- Decorative beside a label: `aria-hidden="true"`. Alone: accessible name required, 44px target
- One icon = one job. `chevron` is for selects only, never a link affordance
- Third-party brand marks (LinkedIn, Behance, Medium) use **official SVGs in every era** — never redrawn in period style

### 4.6 Nav

- Sticky. At rest: raised, contained to the 1100px column
- Past 24px scroll: flattens — frame removed, bottom border only, spans full width, contents stay on the column. **Instant switch, no transition**
- Active item: sunk
- On a case study page, WORK stays active; the page's own back link handles upward navigation
- **Résumé is a primary button, never a nav link** — it's a download, so it can never be "current". It is the only always-visible CTA
- Mobile: burger → full-width panel, items numbered 01–04, active item in `--accent`

### 4.7 Card

```
card (raised frame)
├── tab            label face, --size-micro, min-width 104px
├── media well     sunk frame, 16:10
└── body
    ├── meta       label face
    ├── title      sentence face, h3
    ├── description sentence face, 14.5px   (tier 1 only)
    └── action     statement face + arrowR
```

- **Tab carries domain only** — FINTECH, MARKETPLACE, MOBILE. Never a year, discipline or role
- Tab in `--accent` when the work matches the role being applied to; `--surface` otherwise
- Hover: body lightens, tab goes to `--accent`

### 4.8 Chat bubble

| Speaker | Fill | Text | Face |
|---|---|---|---|
| Shareef | `--accent` | `--on-accent` | sentence |
| Visitor | `--surface` | `--text` | sentence, right-aligned, mirrored tail |
| System | `--action` | `--on-action` | label |

- Tail overlaps the bottom edge so the outline opens into the bubble
- Typing indicator: three squares in `--on-accent`, never `--accent` (invisible on its own fill)
- Greeting bubble hides below 820px

### 4.9 Section marker

Numeral (statement, `--action`) · label (label face, micro, `--text-muted`) · rule to the edge (`--border-w`, `--outline`).

### 4.10 Callout

`--accent` fill, `--outline` border, `--shadow-offset`. Label on top in label face. Content in sentence face. One per section maximum.

### 4.11 Decision block

The component that is ~6/7 of a case study. Build once, repeat.

```
numeral (statement, --accent with --outline stroke)  +  h3 title
prose — the problem
"options weighed" panel (--surface-sunk, label header)
the choice (sentence, weight 500, ▸ marker in --action)
media well (sunk) + caption
```

### 4.12 Audit panel

Inverted: `--bg-inverse` fill, sunk frame, headers in label face `--accent`, body in sentence face `--text-inverse-muted`.

### 4.13 Device frame

Raised frame around a live prototype, sunk well inside, LED indicator (`--accent`) with label-face caption. The one place a heavy frame is always justified — it genuinely holds a running screen.

### 4.14 Prose

- **Links:** `--text` coloured, `--action` 2px underline rule; hover grows to an `--accent` highlight. Never coloured link text
- External arrow on external links only
- **UI strings** quoted from a product: label face, `--surface-sunk` background
- Unordered bullets: 8px `--action` squares (or the era's equivalent marker — never a default disc)
- Ordered lists: leading zeros, label face, matching section markers
- **Pull quote** (own words): unquoted, h3-ish, `--accent` left rule. One per section
- **Said quote** (someone else's): keeps quotation marks, `--surface-sunk` plate, attribution in label face

### 4.15 Reading aids (case study only)

- **Progress:** 10 discrete segments at the top, filling one at a time in `--accent`. Never a continuous bar, in any era
- **Section rail:** sticky on desktop, numerals match section markers, active item sunk

### 4.16 Footer

Contents, in order:
1. Status strip — **location + response time. Never availability.** e.g. `DUBAI · GMT+4 · USUALLY REPLIES WITHIN A DAY`
2. Heading (statement): "LET'S CONNECT"
3. One sentence
4. Email as visible text + copy button
5. Social links — labelled, official SVGs
6. "Designed & built by Shareef Padar · Next.js · <year>" + back to top

Case study pages get the **minimal** footer (items 1, 2, 4, 6).

### 4.17 Portrait

The hero portrait is a **slot**. Every era renders the same source image in its own technique (declared by `--portrait` — see `contract.md` §6 for what each value means). Always decorative (`alt=""`). Must have a non-hover behaviour on touch devices.

### 4.18 Era switcher

- A real control: keyboard operable, labelled ("Change era"), current era announced
- Updates `data-era` on `<html>`, writes `?era=` to the URL, persists to `localStorage`
- Styled by the current era like every other component
- Interaction pattern is an **open decision** (see `DECISIONS.md`)

### 4.19 Share cards

1200×630, generated with `next/og` from the **default era**. Nothing under 22px on the canvas. Six words max in the largest text. URL on every card.

---

## 5. Motion rules

Motion *curves* are era tokens. These *rules* are core:

1. Reveals fire **once** on scroll-in (`IntersectionObserver`, threshold 0.15, then `unobserve`). Never on scroll back
2. Containers reveal as **one object** — never animate a card's children separately
3. Statement text may use the era's `--statement-reveal`, capped at **1.5s total**. Sentences never type
4. Body text never moves. Binary appearance only, staggered at most
5. **Never animate:** page scroll, text currently being read, focus rings, form validation feedback
6. No single reveal runs longer than 720ms. The two exceptions: statement typing (capped at 1.5s total, rule 3) and the LED loop (rule 7)
7. Only one looping animation on the site: the LED indicator
8. `prefers-reduced-motion`: everything renders at its final state immediately, in every era
9. Reveals hide content only after JS has added `.js` to `<html>`. Without JS — or for crawlers — everything is simply visible
10. **Statement reveals are visual only** (`type` and `words` alike). The full statement is in the DOM and the accessibility tree from first render. Characters are revealed by colour, never inserted. Screen readers read the whole line once; crawlers see it; the line never changes width, so there's no layout shift

```ts
// Reveals a statement by characters ('type') or by words ('words'), per the era.
// Full text is in the DOM from first render; only visibility changes.
// Text nodes are walked (not innerHTML), so <em> and inline markup survive.
export function revealStatement(el: HTMLElement) {
  const cs = getComputedStyle(document.documentElement);
  const mode = cs.getPropertyValue('--statement-reveal').trim();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (mode === 'fade') {                     // whole statement fades in once
    el.classList.add('is-fading');
    setTimeout(() => el.classList.remove('is-fading'), 700);
    return;
  }
  if (!['type', 'words'].includes(mode)) return;
  const speed = parseFloat(cs.getPropertyValue('--type-speed')) || 45;

  const units: HTMLSpanElement[] = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walk.nextNode()) nodes.push(walk.currentNode as Text);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    const parts = mode === 'type' ? [...node.data] : node.data.split(/(\s+)/);
    for (const part of parts) {
      if (mode === 'words' && /^\s*$/.test(part)) { frag.append(part); continue; }
      const s = document.createElement('span');
      s.className = mode === 'type' ? 'ch' : 'w'; s.textContent = part;
      frag.append(s); units.push(s);
    }
    node.replaceWith(frag);
  }
  if (!units.length) return;
  const cls = mode === 'type' ? 'is-typing' : 'is-wording';
  el.classList.add(cls);
  let i = 0;
  const id = setInterval(() => {
    if (mode === 'type') units[i - 1]?.classList.remove('is-caret');
    units[i].classList.add('on', ...(mode === 'type' ? ['is-caret'] : []));
    if (++i >= units.length) {
      clearInterval(id);
      if (mode === 'type') units[i - 1].classList.remove('is-caret');
      setTimeout(() => el.classList.remove(cls), mode === 'words' ? 520 : 0);
    }
  }, speed);
}
```
11. **Reveals leave no residue.** Once a reveal finishes, the element has no clip, mask, opacity or transform left on it. Core uses `animation-fill-mode: backwards` for this reason — `both` kept 1995's final `clip-path` applied forever and cut off card tabs and callout shadows

---

## 6. Accessibility floor

Identical in every era. A period-accurate palette that fails these is wrong, not authentic. Ratios are WCAG 2.x relative-luminance contrast — **compute them, never estimate them**.

| Pair | Minimum |
|---|---|
| `--text` on `--bg` | 7:1 |
| `--text-muted` on `--bg` | 4.5:1 |
| `--text-muted` on `--surface` | 4.5:1 |
| `--text-muted` on `--surface-sunk` | 4.5:1 |
| `--text` on `--surface` | 7:1 |
| `--text` on `--surface-sunk` | 7:1 |
| `--action` on `--bg` (tertiary buttons, numerals) | 4.5:1 |
| `--accent` on `--bg-inverse` (footer email, accent words) | 4.5:1 |
| `--on-action` on `--action` | 4.5:1 |
| `--on-accent` on `--accent` | 4.5:1 |
| `--text-inverse` on `--bg-inverse` | 7:1 |
| `--text-inverse-muted` on `--bg-inverse` | 4.5:1 |
| `--error` on `--bg` | 4.5:1 |
| `--focus` against adjacent colours | 3:1 |

**Non-text contrast (WCAG 1.4.11).** Component boundaries — input outlines, button edges, tabs — need **3:1** against what they sit on. Flat eras are where this usually fails. `check-contrast.mjs` checks `--outline` on `--bg` and `--surface`.

**Secondary buttons on bookends:** core sets their label to `--text-inverse`, which suits eras that darken the fill there. An era whose secondary fill stays light on a bookend (2002's silver gel) must restore `--text` with a `.bookend .frame-control[data-fill="surface"]` rule.

**Accent is never the only signal.** `--accent` measures ~1.2:1 on a light `--bg` in 1995. Anything that shows *state* with accent — a relevant tab, a filled progress segment, an active mobile nav item — must also carry an `--outline` border or a text change. Accent can decorate; it cannot be the sole indicator.

- Touch targets 44×44px minimum
- Skip link is the first focusable element
- Screenshot alt text describes what the screen shows and why it matters
- Layout holds at 200% zoom — test the statement face in every era
- `lang` set on `<html>`

---

## 7. Content rules

- Copy, case studies, images and links are **identical in every era**
- **Write statements and labels in normal case** — "View work", "Let's connect", "Sanad · KYB onboarding". Never type capitals into the markup. Capitalisation is an era decision (`--statement-case`): pixel eras uppercase, Now doesn't. Capitals typed into content can't be undone by any era
- Never announce job-seeking availability anywhere on the site
- Social links always labelled
- The disclosure that concept work is concept work stays visible in every era

---

## 8. Page compositions

### 8.1 Homepage
```
Nav
Hero (--bg-inverse) — eyebrow, statement h1, lead, primary + secondary, portrait, greeting bubble
01 Selected work — two tier-1 cards
NDA strip — rule above and below, "view all work"
02 Designed, built & live — Roomy, Form: live indicator, case study + launch app
Footer (--bg-inverse)
```

### 8.2 Work index
```
Tier 1 "START HERE" — two strongest, full cards with description
Tier 2 — remaining case studies, compact cards
Archive — off-discipline and older work, collapsed text list (separated, never deleted)
Filter — domain chips, deep-linkable ?filter=fintech
Empty state — search icon, message, reset
```

### 8.3 Case study
```
Nav (WORK active) + back link
01 Overview · 02 Short version · 03 Tension · 04 Research
05 Decisions (repeating decision block) · 06 Self-audit (audit panel)
07 Try it (device frame) · 08 What's next · closing pull quote
Next story · minimal footer · section rail · progress
```
