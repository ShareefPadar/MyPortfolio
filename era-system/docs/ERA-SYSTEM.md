# Era system — master plan

## Architecture v2 — each era is its own design (current)

**What changed and why.** v1 built one layout and repainted it five times through a shared token contract. It worked mechanically — every era passed every check — but every era looked like *the same page in different paint*. A 2014 site never had folder tabs and recessed screenshot wells; those are 1995's. The time travel didn't feel like time travel.

**v2:** each era designs its own layout, components, type and motion. The only shared layer is content.

```
content/site.json  ──►  eras/1986/page.mjs  ──►  1986.html
  (every word,     ──►  eras/1995/page.mjs  ──►  1995.html
   link, email)    ──►  eras/2002/page.mjs  ──►  2002.html
                   ──►  eras/2014/page.mjs  ──►  2014.html
                   ──►  eras/now/page.mjs   ──►  now.html
```

**Drift that must never happen** is now content drift, not visual drift. Guards:

| Guard | Catches |
|---|---|
| `check-content.mjs` | A missing sentence, a dropped link, capitals typed into markup — in any era |
| `measure-contrast.py` | Text that's unreadable on screen even though its tokens pass (glass, gel, gradients) |
| `check-contrast.mjs` | Token-level contrast, as a fast first check |

### Redesign status

| Era | Status |
|---|---|
| **Now** | ✅ **Liquid Glass the way Apple ships it.** Solid content in light or dark; glass only on the floating controls (year switcher, Résumé, bottom tab bar, notification). Content checks pass on every page |
| **1995** | ✅ **Matches live — the base era.** Content 57/57 · contrast 94/94 (1280), 90/90 (390) · Clippy, pixel cursor, real portrait, Dino Runner |
| **1986** | ✅ **Redesigned — the portfolio as a game.** Title screen, ▶ menu, dialogue box, level select, secret area, bonus stages, continue screen. Content 43/43 · contrast 167/167 |
| **2014** | ✅ **Redesigned — flat / Material.** App bar with nav drawer, colour bands, image-top cards, FAB, ripples, long shadows. Content 43/43 · contrast 48/48 (1280), 45/45 (390), drawer 4/4 · second review: paper shadows, 44px targets, 320px reflow |
| **2002** | ✅ **Redesigned — glossy Web 2.0.** Pinstriped fixed-width page, glossy masthead with tabs, sidebar widgets, reflections, gel capsules, yellow info box. Content 43/43 · contrast 48/48 (1280 + 390) |

**Audit against the live site (`LIVE-AUDIT.md`):** the eras cover the homepage only (1 of 9 live pages), `site.json` is out of date, 1995's neutrals and label font have drifted from live, and 14 live components (Clippy, pixel cursor, Dino Runner, filters, timeline, case-study set…) have no era equivalent yet.

**All five eras are built.** Compare them in `design-reference/all-eras.html` (one file, switcher + phone-width toggle). Next decision: which era is the default, and how the real era switcher works.

The v1 reskin files (`styles/`, `design-reference/era-preview.html`, `core.md`, `contract.md`) stay as reference until every era is redesigned, then get removed.

---

## v1 — reskin model (superseded, kept as history)

## The idea

One portfolio, five eras of interface design. The visitor travels through time; every era shows the same work, the same words, the same structure — rendered the way a screen would have looked in that year.

| Era | Reference point | Look in one line |
|---|---|---|
| **1986** | NES, Commodore 64 | Flat pixel art, limited palette, no bevels |
| **1995** | Windows 95 | Grey chrome, raised bevels, recessed wells |
| **2002** | Mac OS X Aqua, Windows XP | Gel buttons, gradients, reflections |
| **2014** | iOS 7, Material Design | Flat colour blocks, no shadows, thin type |
| **Now** | Present day | Apple's Liquid Glass (iOS 26 / macOS 26): solid content, glass controls, light and dark |

Each jump is roughly a decade and visually unmistakable from the one before. The progression itself tells a story: bevels *arrive* in 1995, gloss *arrives* in 2002, and everything *flattens* in 2014.

## Why one system, not five

Five separate design systems would drift within weeks — five button implementations, five spacing opinions, five places for a bug. Instead:

```
┌─────────────────────────────────────────────┐
│  CORE — identical in every era              │
│  spacing · type roles · layout · anatomy    │
│  content · accessibility · motion rules     │
├─────────────────────────────────────────────┤
│  CONTRACT — the fixed list of slots         │
│  every era fills exactly these, no more     │
├──────┬──────┬──────┬──────┬─────────────────┤
│ 1986 │ 1995 │ 2002 │ 2014 │ Now             │
│  one CSS file each, filling the contract    │
└──────┴──────┴──────┴──────┴─────────────────┘
```

Drift can only happen in one of three places, and each is guarded:

| Where drift happens | Guard |
|---|---|
| A component hardcodes a value | Rule: contract tokens only. Review against `core.md` |
| An era invents a new slot | `check-era-tokens.mjs` fails on undeclared tokens |
| An era looks right but breaks a component state | `specimen.md` renders every state in every era |

## Runtime

- `<html data-era="1995">` — the only switch
- Era chosen by URL param `?era=1986` first, then `localStorage`, then the default era
- All five era CSS files are small and scoped, so all ship together; **fonts** load per era on demand
- The era switcher is a core component (see `core.md` §4.18) — its behaviour is core, its skin is per era
- Share cards and OG images use the **default era**
- **No flash of the wrong era.** A small inline, blocking script in `<head>` reads `?era=` / `localStorage` and sets `data-era` and the `.js` class on `<html>` **before first paint**. Setting it in a React effect is too late — the default era paints first, then snaps
- The server renders the default era, so the page is complete without JS

## Build order

Not chronological. Each step is chosen to stress the contract as early as possible.

| # | Era | Why this position | Status |
|---|---|---|---|
| 1 | **1995** | Refactor the existing v3 system into core + 1995 layer. This step *defines* the contract. | ✅ Specified · ⬜ Built |
| 2 | **1986** | Nearest neighbour — mostly removing bevels. Cheapest test that the contract generalises at all. | 🟨 Specified · tokens + sprites built · checks pass. **Result: contract generalised with one enum value, zero new tokens** |
| 3 | **Now** | The opposite extreme: radius, soft shadows, eased motion. If the contract has to bend, find out while only three eras depend on it. | 🟨 Specified · built · rendered and verified. **Result: two contract additions (v4), both small. Contract is the freeze candidate** |
| 4 | **2014** | Flat — sits comfortably between 1986 and Now once both exist. | 🟨 Specified · built · rendered. **Zero contract changes** |
| 5 | **2002** | Hardest. Gradients and reflections stress the frame slot more than anything else. | 🟨 Specified · built · gel contrast measured from pixels in every state. **Zero contract changes** |

**Ship 1995 first.** As soon as 1995 passes the specimen, it goes live as the whole site — no switcher, no other eras. Eras 2–5 are additive: they land later behind the switcher without touching what's live. A finished single-era portfolio beats an unfinished five-era one, and the contract doesn't need all five to exist to be sound.

**Look before you check boxes.** After building an era, run `node scripts/build-preview.mjs` and open `design-reference/era-preview.html`. The scripts prove tokens exist and contrast passes; they can't see a clipped tab or an invisible label. The first render of 1986 found three bugs no check had caught.

**Result of building all five:** the contract reached v4 at Now, and 2014 and 2002 fit it without a single change. 49 slots describe a flat pixel era, a bevelled era, a glossy era, a flat-design era and a soft modern one.

**Contract freeze:** after step 3 passes the specimen, the contract is frozen. Steps 4 and 5 may not add tokens without a written entry in `DECISIONS.md` explaining why the existing slots can't express it.

## Definition of done — per era

An era is done when all of these are true:

- [ ] `docs/eras/<era>.md` fully filled from `_template.md` — no `TODO` left
- [ ] `styles/eras/<era>.css` defines every contract token
- [ ] Sprite eras only: `node scripts/build-sprites.mjs <era>` run, output committed
- [ ] `node scripts/check-era-tokens.mjs` passes
- [ ] `node scripts/check-contrast.mjs` passes
- [ ] Specimen page renders every component in every state with no visual breakage
- [ ] Focus is visible on every interactive element
- [ ] `prefers-reduced-motion` renders every element at final state
- [ ] Era fonts are free for commercial web use, licence noted in the era file
- [ ] Status row above updated

## Resuming work

In a new session, whether with Claude Code or in a chat:

1. Read `CLAUDE.md`
2. Read this file's **Build order** table to see where things stand
3. Read `DECISIONS.md` before suggesting anything directional
4. Open only the era file you're working on

If you're working in a claude.ai Project chat rather than Claude Code, attach `ERA-SYSTEM.md`, `DECISIONS.md`, `contract.md` and the relevant era file to the Project knowledge so every conversation starts from the same state.
