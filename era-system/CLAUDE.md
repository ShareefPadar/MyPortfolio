# shareefpadar.com — agent instructions

> Lives in the site repo as `era-system/`. 1995 is the Next.js app around it (the default era); `proxy.ts` at the repo root serves the other eras from `public/_eras/`, built by `npm run eras`.

A portfolio that time-travels: **1986 · 1995 · 2002 · 2014 · Now**.
Each era is **its own design** — its own layout, components, type and motion.
The eras share exactly one thing: **the content** in `content/site.json`.

> This replaced an earlier "reskin" model where every era repainted one shared
> layout. That made every era look like the same page in different paint.
> Do not reintroduce shared layout or shared components across eras.

## Read in this order, every session

0. `docs/PLAN.md` — **1995 matches live and is the base; other eras translate it**

1. `docs/ERA-SYSTEM.md` — architecture and which eras are redesigned
2. `docs/DECISIONS.md` — decided / rejected / open. Don't relitigate; don't decide open items silently
3. `docs/eras/<era>.md` — **only** the era you are working on

## What is shared, and what isn't

| Shared by every era | Owned by each era |
|---|---|
| `content/site.json` — every word, link and email | Layout and grid |
| Which pages exist | Components and their anatomy |
| The accessibility floor (below) | Type, colour, depth, radius |
| Era switching behaviour | Motion and interaction |

## Hard rules

1. **Content only from `content/site.json`.** Never type copy into a template. Write it in normal case — eras capitalise with CSS. **Era flavour text** ("LEVEL SELECT", "PRESS START") is allowed only as `aria-hidden` ornament that carries no information — if a sighted reader learns something from it, it's content and belongs in `site.json`
2. **Every era renders all of it.** `node scripts/check-content.mjs` must pass. Missing text, a broken link or typed capitals fail it
3. **No shared layout or components between eras.** If two eras need "the same" component, each builds its own. Sharing is how the reskin came back
4. **Contrast and accessibility are not gates** (Shareef's call). Match the design; don't block, redesign or "fix" colours because a ratio is low. `check-contrast.mjs` and `measure-contrast.py` still exist as optional tools — they report, they never fail a build. Don't add accessibility work or warnings unless asked
5. **Match live exactly where an era is the live site.** 1995 mirrors shareefpadar.com down to hover colours and the error red. Don't "improve" it
6. **Verify fonts actually load** (`document.fonts`). Fallback fonts look plausible in screenshots and are wrong
7. **Motion never blocks reading.** Headlines may reveal, but the full text is in the DOM from first paint; body text never moves; no reveal re-triggers
8. **One agent edits the repo at a time**

## Folder map

```
CLAUDE.md
content/
  site.json                 THE shared content — synced to live. projects{} once; home + work refer by id
  portrait.json             Shareef's real pixel portrait as data (96×144) — every era renders it
  studies/<id>.json         the 9 case studies as blocks — NEVER hand-edit: re-run scripts/sync-studies.py after changing a study on live
eras/
  _shared/client.mjs        BEHAVIOUR only, no look: decodePortrait() + guideBrain() (section lines, idle chatter, dismiss → comeback)
  _shared/head.mjs          <title>, description, share tags, icon, JSON-LD — from content/site.json `meta` (studies: their own)
  _shared/study.mjs         renderBlocks(): walks a study's blocks through the era's renderers — the build fails if an era misses one of the 13 types · studyJS (progress + lightbox)
  _shared/eras.mjs          eraItems(): the five years + ?era= links for a switcher. Behaviour: eraSwitchJS / arriveHeadJS in client.mjs
                            client.mjs also has filterJS (work-index filter: single select, empty groups hide)
                            and gameJS (gameField: the home game's focus, keys, state, loop, tones — no look)
  1995/                     the BASE — matches live
    layout.mjs              shared shell: nav (current pressed), footer, Clippy, pixel cursor
    page.mjs · work.mjs · about.mjs · study.mjs   home · work index · about · case study (one page per study)
    style.css
  1986/ 2002/ 2014/ now/    phase 2: layout.mjs (shell, guide, cursor, switcher) · portrait.mjs · page.mjs (home) · work.mjs · about.mjs · study.mjs
                            game.mjs: the home's easter-egg game (text from content.games[era]) — no box; page = sky, footer top = floor
assets/icons/               pixel.json (8×8) · line.json (stroked) — same 20 names · brands.json (LinkedIn, Behance, Medium)
assets/sprites-1995.json    Clippy frames + cursor sprites, from the live site
scripts/
  sync-studies.py           pulls the 9 case studies from live → content/studies (uses lib/extract-study.js)
  lib/content.mjs           loads site.json and resolves project ids — used by build and check
  lib/render.mjs            loadInputs() + renderPage(): what both builds use to render an era page
  build-eras.mjs            every era page → design-reference/eras/<era>.html, <era>-work.html … (previews)
  build-site.mjs            1986 · 2002 · 2014 · Now → ../public/_eras/<era>/ for the real site (npm run eras; runs before dev and build). 1995 is the Next.js app itself
  check-content.mjs         every era renders every piece of content
  measure-contrast.py       rendered-pixel contrast behind every text element
  check-contrast.mjs        token-level contrast (quick sanity check)
  build-icons.mjs           icon JSON → SVG
  build-switcher.mjs        all 60 pages → design-reference/all-eras.html (one-file preview; links, switcher and case studies work inside it)
assets/captures/            prototype stills for the non-1995 case studies
design-reference/eras/      GENERATED era pages — open index.html (lands on your last era, else the default). captures/ = prototype stills for previews (the real site mounts the live React prototype)
docs/
  ERA-SYSTEM.md · DECISIONS.md · eras/<era>.md
  eras/archive/             superseded v1 reskin docs — history only

styles/core.css, styles/eras/1995.*  1995's tokens, component bases and sprites (from the original system; 1995 only)
archive/v1-reskin/          the rejected reskin system — history only, nothing builds from it
```

## Workflow for an era

1. Read its `docs/eras/<era>.md`
2. Build `eras/<era>/<page>.mjs` on that era's `layout.mjs`, styles in its `style.css` — translate the 1995 component, don't copy it
3. `node scripts/build-eras.mjs`
4. `node scripts/check-content.mjs`
6. Look at it. The scripts can't see a clipped element or a layout that feels wrong
