# Plan — 1995 is the base

**Rule:** the live site *is* the 1995 era. 1995 must match it exactly — content, tokens, components, behaviour. Every other era then takes each 1995 component and builds its own native version. Nothing is invented for another era that 1995 doesn't have a reason for.

Source of truth for this plan: `LIVE-AUDIT.md`.

---

## Phase 1 — 1995 matches live

| Step | What | Status |
|---|---|---|
| 1.1 | Sync `content/site.json` to the live homepage, real links included | ✅ 57 texts · 18 links · 4 project images, strings taken from the live DOM |
| 1.2 | Real portrait extracted from live as data → `content/portrait.json` (96×144, 15 colours) | ✅ |
| 1.3 | Fix 1995 token drift: cool neutrals, Geist Mono labels | ✅ tokens and sprite colours read from live CSS and sprite PNGs |
| 1.4 | 1995 homepage at parity: sprite nav buttons, burger, real portrait, Clippy, pixel cursor, 4 work cards with real thumbnails and status lines, Under NDA box, live cards, footer with Copy → Copied | ✅ sizes matched to live's computed styles; contrast 94/94 (1280), 90/90 (390), Clippy and mobile menu pass |
| 1.5 | Dino Runner | ⏭ moved to the end of phase 1 (Shareef's call) |
| 1.6 | Work index (filters, two groups, 9 projects) | ✅ `eras/1995/work.mjs` — matches live within a few px; filters behave identically (Fintech 3, Travel 1, All 9) |
| 1.7 | About (bio, principles, experience timeline, pull quote) | ✅ `eras/1995/about.mjs` — within 3px of live at 1280, 5px at 390 |
| 1.8 | Case study template + the **9** case studies as content | ✅ `eras/1995/study.mjs` + `content/studies/*.json` (synced from live by `scripts/sync-studies.py`). 13 block types. All 9 within 9px of live at 1280, no overflow at 390 |
| 1.9 | **Parity check:** each 1995 page side by side with live at 1280 and 390 | ✅ home · work · about · 9 case studies |
| 1.10 | Dino Runner (moved here) | ✅ `eras/1995/game.mjs` — live's code ported as-is (sprites, physics, spawns, hit boxes, sounds, 3× canvas, overlay). Same size and spacing as live at 1280 and 390. The full footer was re-synced to live while checking it (live had changed: py-64, larger gaps) |

### 1995 matches live exactly
Including the primary button's lighter hover (`#3E5FFC`) and the error red (`#C4482E`). An earlier version darkened both for contrast; reverted — contrast is not a gate (`DECISIONS.md`).

## Phase 2 — every other era translates 1995

Each era gets its own version of each 1995 component. Starting map (to be refined per era):

| 1995 (live) | 1986 | 2002 | 2014 | Now |
|---|---|---|---|---|
| Clippy guide (sections, idle chatter, typing, dismiss) | Narrator in a text box, takes typed commands | Clippy as the 2002 Office assistant: yellow balloon, options, Hide | Chat head: round avatar on the edge, red 1, drag to × | Collaborator's cursor with cursor chat |
| Pixel cursor (arrow / hand, 4px snap) | Chunkier 8px cursor | Aqua-style cursor | System cursor (flat era) | System cursor |
| Pixel portrait, grey → colour on hover | Same pixels, 4-colour block palette | Same pixels, glossy frame + reflection | Same pixels, flat circle crop | Same pixels, crisp, in a solid well |
| Dino Runner (no box: page = sky, footer top = ground) | Ship the backlog — brick breaker, paddle rides the CONTINUE? box | Bubble pop — launcher sits on the gel footer bar | Paper plane — pillars grow out of the navy footer | none (Glass merge was dropped) |
| Sprite nav buttons, current = pressed | ▶ menu cursor | Glossy tabs | App bar + drawer | iOS 26 tab bar (glass), shrinks on scroll |
| Plate / tab / well cards | Level-select stages | Panels with reflections | Image-top paper cards | Big screenshots, text under them; Settings-style grouped lists |
| Under NDA box | Secret area | Yellow info box | Lime colour band | Grouped panel |
| Copy → Copied | per era | per era | per era | per era |

Order: home for all four eras → work index → about → case study.

### Progress
| Step | 1986 | 2002 | 2014 | Now |
|---|---|---|---|---|
| 2.0 Era switcher + arrival effect (1995 too) · default era Now | ✅ | ✅ | ✅ | ✅ |
| 2.1 Home — shell (`layout.mjs`), real portrait, guide, cursor, nav current state, Copy → Copied | ✅ | ✅ | ✅ | ✅ |
| 2.2 Work index | ✅ stage select | ✅ portfolio directory | ✅ Material tabs + list | ✅ glass segmented control |
| 2.3 About | ✅ character profile | ✅ profile page | ✅ hero + stepper | ✅ large title, prose, grouped panels |
| 2.4 Case study (all 13 block types, 9 studies) | ✅ a level | ✅ Web 2.0 article | ✅ Material article | ✅ article on the page, solid panels |
| 2.5 Home easter-egg game (`game.mjs`, picked by Shareef in the Era Arcade) | ✅ Ship the backlog | ✅ Bubble pop | ✅ Paper plane | none: Glass merge was built, then dropped (Shareef's call) |

**What 2.1 shipped, per era**
| 1995 component | 1986 | 2002 | 2014 | Now |
|---|---|---|---|---|
| Portrait | half-res, 4 screen-blue tones; NES palette swap on hover | smooth colour on a sky gel, glossy frame, reflection, gloss sweep on hover | 5 flat colours, circle crop, 45° long shadow cast by the silhouette | the real pixels, crisp, in a solid well |
| Clippy | Narrator text box: types, ▼, a > command line, tucks to a name tag | live's pixel Clippy standing bottom right, the pale yellow Office balloon with bullet options and Hide; he fidgets while idle | chat head: round avatar, bubble, red 1 unread, drags and snaps to a side, drop on × to send away; snackbar kept for "Copied" | collaborator's cursor that glides to what it talks about, cursor chat; a glass capsule on phones |
| Cursor | chunky 3px-pixel arrow on an 8px grid, ▶ over links | Aqua-style arrow (CSS) | system | system |
| Nav | game menu, ▶ cursor, ↑↓ keys, START menu on phones | glossy tabs | app bar + drawer | iOS 26 tab bar at the bottom: Home · Work · About; shrinks to the current tab on scroll |
| Copy → Copied | button flashes lime | green gel + tick, yellow fade | label swap + snackbar | lime glass, icon morphs to tick |
| Extra | — | gel app icons for the live products | — | Dubai clock widget (from the shared status line) |

Checked: content 57/57 on every home, no overflow at 1280/390, fonts load, no JS errors, guide section lines / dismiss / comeback and copy tested in a browser.

## Definition of done, every page, every era
- `check-content.mjs` passes — all shared content rendered
- No horizontal overflow at 390px; fonts load (`document.fonts`)
- Visual order = reading order
- Looked at, side by side with live where it exists — not just checked

**Phase 2 is complete:** 5 eras × (home, work, about, 9 case studies) = 60 pages, every one passing `check-content.mjs`, no overflow at 360/390/768/1280, no script errors. All five eras now have their home game: 1995's Dino Runner (1.10) and the four translations (2.5). Phases 1 and 2 are done.

**What 2.5 shipped — each game sits the way live's Dino Runner does: no box, the page background is its sky, the footer's top edge is its floor**
| | 1986 | 2002 | 2014 | Now |
|---|---|---|---|---|
| Game | Ship the backlog (brick breaker; bricks are tickets with punched ends) | Bubble pop (bubble shooter; rows push down every 8 shots) | Paper plane (one-tap flyer) | none |
| Sky | the navy screen; the field is exactly the CONTINUE? box's width | the pinstripes; same width as the page and the footer bar | the grey band carries on; full width | the mesh — orbs with no panel behind them |
| Floor | the paddle rides the box's top border; a dropped ball flashes it red | the silver cradle sits on the gel bar; loose bubbles fall into it | bottom pillars are the footer's navy, growing out of it; a crash lands on it | the footer glass is the jar's floor, and the jar's two glass walls rise out of it |
| Text | all from `content.games[era]`: title, start, hint, game over, play again | | | |

Behaviour is shared and look-free: `gameJS` in `_shared/client.mjs` (focus-only keys as live, idle / running / over state, pixel units, pauses off screen, little WebAudio tones). Touch keeps scrolling the page until a game is running.

## Phase 3 — into the Next.js site  ✅ wired (branch `time-travel-eras`)
- **1995 is the live Next.js app, unchanged, and the default era** (Shareef's call). No cookie → 1995, so first visits, search engines and link previews get the live site.
- **The other four eras are static pages** generated from `era-system/` by `npm run eras` (`scripts/build-site.mjs`) into `public/_eras/<era>/` at the live paths (`index.html`, `work.html`, `about.html`, `work/<slug>.html`). It runs before `next dev` and `next build`; the output is not committed.
- **`proxy.ts`** (repo root, Next 16's middleware): `?era=<id>` sets the `era` cookie and serves that era at once; otherwise the cookie decides. Other eras are rewrites, so URLs never change. Era responses carry `X-Robots-Tag: noindex`; `/_eras/` is disallowed in robots.txt.
- **The live navbar has the year switcher** (`components/px/EraSwitch.tsx`, the 1995 design: sprite button beside the wordmark, raised plate of years) and the scanline arrival wipe. Years come from `era-system/content/site.json`.
- Other eras' case studies show prototype stills (`assets/captures/`); the live React prototypes stay in 1995.
- Still open: era pages use `content/site.json`, the 1995 app uses its own `lib/` and MDX, so a copy change on live needs a re-sync (`sync-studies.py`) until the 1995 app reads `content/` too.
- Optional: a share image per era, generated like live's `/opengraph-image`.
