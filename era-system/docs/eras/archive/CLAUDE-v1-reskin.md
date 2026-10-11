# shareefpadar.com — agent instructions

A portfolio that time-travels. One site, one set of components, five visual eras:
**1986 · 1995 · 2002 · 2014 · Now.** The visitor moves between eras; the content never changes, only the skin.

## Read in this order, every session

1. `docs/core.md` — rules that are identical in every era
2. `docs/contract.md` — the token contract every era must fill
3. `docs/eras/<era>.md` — **only** the era you are working on
4. `docs/DECISIONS.md` — before proposing anything that sounds like a new direction

Do not read other era files while building one era. Cross-contamination between eras is the main drift risk.

## Architecture in one paragraph

Components are written once and are era-agnostic. They read only **contract tokens** (CSS custom properties like `--action`, `--font-statement`, `--shadow-raised`). Each era is a single CSS file, `styles/eras/<era>.css`, that defines every contract token inside a `[data-era="<era>"]` block. Switching era means changing the `data-era` attribute on `<html>`. Nothing else changes.

## Hard rules

1. **No hardcoded visual values in components.** No hex, no font name, no radius, no shadow, no timing function. Contract tokens only.
2. **No era branching in components.** If you're about to write `if (era === '1995')`, the contract is missing a token. Stop and flag it — do not add the branch.
3. **Never change `core.md` or `contract.md` as a side effect of era work.** A contract change is its own task, and it must be applied to every existing era in the same change.
4. **Era-private tokens must start with `--era-`** and may only be used inside that era's own CSS file. Components never read them.
5. **An era is not done until it passes `docs/specimen.md`.**
6. **Run both checks after touching any era file.** Both must pass:
   `node scripts/check-era-tokens.mjs` and `node scripts/check-contrast.mjs`
   Never state a contrast ratio from memory — run the script.
7. **Content is identical across eras.** Copy, case studies, images, links — same in all five.
8. **The type gate in `core.md` §2 applies in every era.** Sentences are always set in `--font-sentence`, even in 1986.
9. **Accessibility floor is era-independent.** A period-accurate era still has to pass AA contrast, 44px targets, and visible focus.
10. **Never edit generated files.** `styles/eras/*.sprites.css` and `public/sprites/**` come from `scripts/build-sprites.mjs`. Change the `.sprites.json` and rebuild.
11. **Components choose a fill role, never a colour.** `<button class="frame-control" data-fill="action">` — the era decides what "action" looks like.

## When unsure

- If it's in `DECISIONS.md` under **Decided**, don't relitigate it.
- If it's under **Open**, don't decide it silently. Ask.
- If neither file covers it, ask.

## Folder map

```
CLAUDE.md                     ← you are here
docs/
  ERA-SYSTEM.md               plan, build order, status
  core.md                     era-independent rules
  contract.md                 the token contract (human-readable)
  specimen.md                 definition of done for an era
  DECISIONS.md                decided / open / rejected
  eras/
    _template.md              copy this to start a new era
    1995.md                   🟨 specified — tokens pass, specimen not built yet
    1986.md                   🟨 specified — tokens pass, legibility test + specimen pending
    now.md                    🟨 specified — tokens pass, legibility test + specimen pending
    2014.md                   🟨 specified — tokens pass, legibility test + specimen pending
    2002.md                   🟨 specified — tokens + measured gel pass, legibility test + specimen pending
styles/
  core.css                    uses contract tokens only — no hex, fonts or timing
  eras/
    1995.css                  implements the contract
    1995.sprites.json         sprite palette + pixel maps (era data)
    1995.sprites.css          GENERATED — do not edit
    1986.css                  implements the contract
    1986.sprites.json         sprite data (flat double-line)
    1986.sprites.css          GENERATED — do not edit
    now.css                   implements the contract — css frames, no sprites
    2014.css                  implements the contract — flat css frames
    2002.css                  implements the contract — gel css frames
public/
  sprites/1995/               GENERATED — 38 SVG sprites
  sprites/1986/               GENERATED — 29 SVG sprites
  icons/pixel/, icons/line/   GENERATED — 20 SVG icons each
assets/
  icons/pixel.json            the 20 pixel icon maps — source of truth
  icons/line.json             the same 20 names as stroked paths (Now)
scripts/
  build-sprites.mjs           sprite eras: <era>.sprites.json → SVGs + generated CSS
  build-icons.mjs             assets/icons/*.json → public/icons/*.svg
  build-preview.mjs           real tokens → design-reference/era-preview.html
  era-contract.json           authoritative token list (machine-checked)
  check-era-tokens.mjs        validates every era file against the contract
  check-contrast.mjs          computes every required contrast pair per era
design-reference/
  era-preview.html            GENERATED — same markup in every built era
  1995/                       rendered prototypes — visual truth, not code to copy
```
