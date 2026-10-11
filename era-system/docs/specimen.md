# Specimen — definition of done for an era

> One route renders every core component in every state: `/specimen?era=<era>`.
> An era is not done until every box below is ticked **for that era**.
> The specimen page itself is core — it's built once and never changes per era.

---

## 1. Automated

- [ ] `node scripts/check-content.mjs` passes — every piece of shared content rendered
- [ ] `python3 scripts/measure-contrast.py <page> 1280` and `390` both pass

- [ ] `node scripts/check-era-tokens.mjs` passes
- [ ] `node scripts/check-contrast.mjs` passes
- [ ] No component file contains a hex value, font name, or timing function (`grep` for `#[0-9a-f]{3,6}`, `cubic-bezier`, `steps(` outside `styles/eras/`)
- [ ] Lighthouse accessibility score ≥ 95 on the specimen page

## 2. Render every component, every state

Each row must render with no clipping, overlap, unreadable text, or missing frame.

| Component | States to render |
|---|---|
| Type | statement xl / l / m · numeral · decision numeral · h1–h4 · lead · body · small · caption · label · micro |
| Button | primary · secondary · tertiary · disabled — each at rest / hover / pressed / focus |
| Button with icon | leading icon · trailing icon |
| Input | empty · filled · focus · error · disabled · with help text |
| Checkbox, radio | unchecked · checked · focus |
| Icons | all 20 at 16px and 24px |
| Nav | at rest · flattened · each item active · mobile closed · mobile open |
| Card | tier 1 · tier 2 · relevant tab · plain tab · hover |
| Chat bubble | Shareef · visitor · system · typing · with tail left / right |
| Section marker | numeral + label + rule |
| Callout | with label and one sentence |
| Decision block | full, with media well and caption |
| Audit panel | two failure items |
| Device frame | with LED caption |
| Prose | link · external link · UI string · bullets · ordered list · pull quote · said quote |
| Reading aids | progress at 0 / 50 / 100% · section rail with active item |
| Footer | full · minimal |
| Portrait | at rest · pointer active · touch fallback running |
| Era switcher | closed · open · each era selected · focus |
| Bookends | hero block and footer block with every text token on them |

## 3. Behaviour

- [ ] Reveals fire once on scroll-in, not on scroll-back
- [ ] After a reveal, `getComputedStyle(el).clipPath` is `none` and no animation is still attached — tabs and offset shadows fully visible
- [ ] Every control on a `.bookend` has readable text (secondary buttons especially)
- [ ] No capitals typed into content — statements and labels change case only through `--statement-case`
- [ ] Every era's three faces are actually loaded (`document.fonts`) — screenshots with fallback fonts look plausible and are wrong
- [ ] Any control with a gradient or gloss: contrast sampled from rendered pixels behind the label, in rest / hover / pressed, pointer parked, transitions off, real fonts loaded
- [ ] Statement reveal completes in ≤ 1.5s for the hero
- [ ] Nav flattens instantly at 24px with no transition
- [ ] Focus ring appears instantly, follows the era's corner shape, and is **visible** on `--bg`, `--surface` and `--bg-inverse` — test by keyboard, not by inspecting CSS
- [ ] Portrait responds to pointer on desktop and runs its fallback on touch
- [ ] Switching to this era from every other built era changes **only line breaks** in sentence text — no size, line-height or spacing change
- [ ] The reader's scroll position holds across the switch (scroll anchoring intact)
- [ ] Sentence face passes `core.md` §2.3a — including the 16px phone legibility test on a real case study section
- [ ] `prefers-reduced-motion`: every element at final state, nothing moves

## 4. Viewports

- [ ] 375px
- [ ] 768px
- [ ] 1280px
- [ ] 200% browser zoom at 1280px — statement face still readable

## 5. Era file

- [ ] `docs/eras/<era>.md` has no `TODO` remaining
- [ ] Font licences recorded
- [ ] Every "Never" rule in the era file is actually true on the specimen
- [ ] Status row in `ERA-SYSTEM.md` updated to ✅
