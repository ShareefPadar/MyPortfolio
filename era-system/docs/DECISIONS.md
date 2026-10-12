# Decisions

> ⚠ **Architecture v2 (latest).** Each era is its own design; only `content/site.json` is shared. Entries below marked *superseded* belonged to the v1 reskin model.

## Decided — architecture v2

| Decision | Why |
|---|---|
| **1995 is the default era** (Shareef's call) and stays the live Next.js app; the other four ship as static pages served by `proxy.ts` from a cookie | Recruiters and search engines land on the site as it is today; the time machine is opt-in. Static pages keep each era exactly as designed, with no React port to drift |
| **Each era has its own helper, in its own voice** (Shareef's call): 1986 a text-adventure Narrator that takes typed commands (LOOK, WORK, ABOUT, RESUME, INVENTORY, HELP) · 1995 Clippy, as live · 2002 Clippy as the Office assistant of 2002 (Shareef's call: he was still in Office XP), live's pixel Clippy in the pale yellow balloon · 2014 a chat head (Shareef picked it over a site chat widget and a team-chat bot): his round avatar on the screen edge · Now a collaborator's cursor, as in a shared Figma file, that glides to what it's talking about | Clippy is from 1997 to 2007, so he was wrong in 1986, 2014 and Now. The 2002 Clippy reuses live's own pixel sprite; Microsoft's character isn't redrawn. Each helper is what that time had. Lines live in `content.guides[era]`; 1995 keeps `content.guide`. Siri was ruled out for Now: it's Apple's own product, so a lookalike would be a copy |
| **Now = Liquid Glass the way Apple ships it** (Shareef picked it from three directions, approved the home mock) | Replaces the glass bento over a mesh. Apple's rule: glass only for controls floating over content, never the content itself. So the page is solid (light by default, dark with the device, system font) and glass is only the year switcher, Résumé, the bottom tab bar, the notification and the lightbox close. The bento, mesh, clock, specular and word blur-in are gone |
| **Now's page background is a sky that follows the visitor's clock** (Shareef's call, after gauravi.design; changes "the page is solid, dark with the device" above) | Night from 19:00 to 06:00 on the visitor's device: stars, a faint Milky Way, thin cloud, a shooting star every 10 to 20 seconds. Day: a pale morning sky with clouds drifting. Shareef's picks: the clock decides, not the device's dark mode · every Now page, with case studies still and at half strength · a pale day sky so the dark text stays · "asteroids" means shooting stars. The light and dark colours follow the sky through `data-sky` on `<html>`, set in `<head>` before first paint; without JavaScript the device setting decides as before. Fixed hours, two skies, no switch on the page. The sky has to be seen to move (Shareef's call, after the first version read as static): stars twinkle and flare, shooting stars come every few seconds, clouds cross in under a minute, birds go over by day, and scrolling moves each layer at its own speed. The de-slop rule against blurred colour blobs still stands: the galaxy is tiny stars with barely a glow and clouds are drawn as weather. `?sky=day` or `?sky=night` previews either |
| **Now's content panels are glass, and things rise in as you scroll** (Shareef's call, after gauravi.design, where every card is glass; changes "glass only for controls" above and, for Now only, "no fade-in on every section" below) | With a sky behind the page, solid panels hid it. Panels, work cards, the portrait well and the footer now use a plain glass: a light tint, a 12px blur, a 1px rim, no refraction. The controls keep the stronger refracting glass, so they still read as a layer above. Work cards became glass cards with the screenshot inside. Scroll: panels, cards, figures and section headings rise and fade in once, the first time you reach them; the hero falls a little behind the scroll; cards that are links lift under the pointer. Kept from the old rules: nothing above the fold waits at first paint, nothing re-triggers, article paragraphs never move, and reduced motion turns it off. The guide's cursor and chat bubble are glass too, a little denser than the cards so the words read over anything; it was lime. Not taken from the reference: its smooth-scroll script, its pointer-following light, its deep blue day sky with white text |
| **De-slop pass on 1986 · 2002 · 2014 · Now** (Shareef's list, from the AI-design tells people name) | No coloured last word in headlines · no label above the headline (the name is a byline under the buttons) · tracking no tighter than −0.02em · no blurred colour blobs (Now is off-black with grain) · Now's radii by hierarchy (28 / 16 / 12 / 8) · no icon tiles on top of the live cards · no arrows or » on links · no pulsing or decorative dots · no fade-in on every section · small labels in normal case · no em-dashes in site copy. Kept: blinking "Press start" (Shareef's call), 2014's 2px corners and caps buttons (Material 2014 spec), 1995 as live |
| **Em-dashes in the case studies wait for live** | 45 of them are in the 9 studies, which are synced from live and never hand-edited. Change them on live, then re-run sync-studies.py |
| **1995's Dino Runner is live's code, ported as-is** (not rebuilt on the shared gameJS) | 1995 matches live exactly. Keeps live's quirks: keys only while focused, a hidden tab ends the run, square-wave beeps |
| **1995 full footer re-synced to live** (Oct 2026) | Live's footer had grown (py-64, 48px gaps, 9px credit); found while matching the Dino's floor |
| **Now has no game** (Shareef's call, dropping Glass merge; changes the two rows below for Now) | With the sky and the glass cards the home page had enough going on. Now is the one era without an easter-egg game: `eras/now/game.mjs`, its styles and `games.now` in `content/site.json` are removed, and the home page ends on the live products and the footer. The other four eras keep theirs |
| *Superseded for Now:* **Now's game is Glass merge, not Five** (Shareef's call, picked from six options on the Now Era Games page) | Five didn't feel right for Now. In Glass merge the footer glass is the jar's floor and the jar walls rise out of it |
| **One easter-egg game per era on the home page** (Shareef picked them in the Era Arcade): 1986 Ship the backlog · 2002 Bubble pop · 2014 Paper plane · Now Glass merge (replaced Five). 1995 keeps live's Dino Runner | Each era gets a game of its own time; replaces the earlier plan to move the Dino to 2014 |
| **Every game sits the way live's Dino Runner does** (Shareef's call): no box, the page background is its sky, the footer's top edge is its floor | Live's game reads as part of the page, not a widget. 1986's paddle rides the CONTINUE? box; 2002's cradle sits on the gel bar; 2014's pillars grow out of the navy footer; Now's footer glass is the floor of the jar |
| **Game text lives in `content.games[era]`** (replaces the single `game` block) | Titles, hints, start / game over / play again — eras only draw shapes. check-content requires each era's home to render its own game's text |
| **Each era is its own design** — own layout, components, type, motion | v1 repainted one layout five times; every era looked like the same page. Shareef's call: the 8-bit style he made shouldn't dictate every era's layout |
| **Only content is shared** — `content/site.json` | The one thing that must never drift between eras |
| **`check-content.mjs` is the cross-era guard** | Replaces the token contract as the thing that holds eras together. Catches missing text, dropped links, typed capitals |
| **`measure-contrast.py` required for every era** | Token checks can't see text on glass, gel or gradients. Auto-discovers every text element; pointer away and hovering; 1280 and 390 |
| **Now is Liquid Glass** (supersedes Now v1 soft dark) | The actual present-day aesthetic |
| **Glass tint .58, not clearer** | Measured: .46 failed 7 elements. Denser than Apple's, deliberately |
| **Refraction only on the nav pill** | Real `backdrop-filter: url()` distortion works in Chromium; limited to where content visibly scrolls beneath |
| **Honour `prefers-reduced-transparency`** | Glass turns solid for people who need it |
| **1995 is ported, not redesigned** | Its plate/tab/well layout is native to 1995 — it was the one era the v1 layout actually fitted |
| **The label stays "Résumé", accent included** (Shareef's call) | In 1986, Press Start 2P draws the É small, so it reads "RéSUMé". Accepted as period-authentic rather than switching the label to "CV" |
| **2014 is an app bar + colour bands, not a recoloured 1995** | Flat design's signature is bold colour blocks, image-top cards and a FAB. Long shadows are a CSS box-shadow stack clipped by the card header |
| **Scrims live inside the stacking context of the thing they dim around** | A sticky app bar is its own stacking context; a scrim outside it painted over the open drawer |
| **`<button>` elements need an explicit background** | Browsers paint a grey face; ghost and flat variants silently inherit it |
| **`measure-contrast.py` disables transitions, and takes `--prelude` / `--only`** | A colour transition left labels half-visible at screenshot time (false 1.07:1); off-canvas drawers need to be opened and measured on their own |
| **2002 is a Web 2.0 page, not a gel reskin** | Fixed width on pinstripes, tabs, sidebar widgets, reflections, yellow info box — the period's structure, not just its buttons |
| **Never reorder content with CSS `order`** | Visual and reading order must match. 2002's phone layout briefly broke this |
| **Focus rings inside elements that sit flush in a clipping container** | 2002's tabs: outside rings were clipped and blended into the masthead |
| **`all-eras.html` for comparing eras** | One self-contained file; a review tool, not the site's real switcher |
| **1995 = the live site, and the base for every era** | Shareef's call. Other eras translate 1995's components, not invent new ones |
| **Content synced from the live DOM, stored in normal case** | Live types capitals into markup; 1995 capitalises with CSS and renders identically |
| **The portrait is shared content** (`content/portrait.json`, 96×144 run-length data from live) | Every era can show the real Shareef in its own technique |
| **1995 sprite colours and Clippy/cursor art taken from live** | Read from the live sprite PNGs and code, not recreated |
| **Two deliberate deviations from live in 1995** | Live's primary hover (3.85:1) and error red (4.26:1) fail contrast |
| **Custom cursors are hidden when measuring** | A pixel cursor is a page element; it lands on the text being sampled |
| **Contrast and accessibility are not gates** (Shareef's call) | Match the design. Checks remain as optional, advisory tools; nothing blocks on them. Supersedes every earlier decision framed around contrast or accessibility minimums |
| **1995 hover and error colours match live** | Reverts the earlier "deliberate deviations" (`#1A3BD8` hover, `#B8442B` error) |
| **Projects stored once** (`content.projects`), referenced by id from home and work | The same 9 projects appear on several pages; one copy can't drift |
| **1995 pages share one shell** (`layout.mjs`) | Nav, footer, Clippy and cursor are identical on every live page |
| **Previews keep real URLs** with a preview-only router | Content check stays exact (`href="/work"`), yet previews navigate between built pages |
| **Dino Runner moved to the end of phase 1** | Shareef's call |
| **About content (bio, principles, timeline, quote) lives in `content.about`** | Every era renders the same About; check-content enforces it |
| **1995 mobile burger is a plain icon** | Matches live; it had a sprite frame |
| **Case studies are content blocks synced from live** (`sync-studies.py`) | 445 blocks across 9 studies; hand-copying would drift. Types: p, h2, h3, hr, quote (+cite), callout (+label, paragraphs), short-version card, figure, gallery (cols, badges, labels, max-width), prototype, ul, ol, pre |
| **Prototypes are referenced, not rebuilt** | The real site keeps mounting Shareef's React prototypes; era previews show a still captured from live |
| **Case-study pages use the compact footer** | Matches live (status + credit only) |
| **Live quirks kept:** invisible section dividers, unpinned progress bar | 1995 matches live exactly |
| **UI labels live in content too** (`content.ui`: Read case study, Case study, Launch app, Copy email, Back to top) | Typed into templates, they drift — one era says "Launch", another "Launch app" |
| **Era flavour text only as `aria-hidden` ornament** | "LEVEL SELECT", "PRESS START" are fine; anything a reader learns from belongs in content. Removed taglines typed into Now and a "Side project" tab typed into 1995 |
| **1986 is the portfolio as a game** | Title screen, menu, dialogue, level select — its own layout, not 1995's in dark paint |
| **Blinking stops after three cycles** | WCAG 2.2.2: blinking past 5s must be pausable |
| **1995 primary hover darkens** | Lightening put lime text at 3.85:1 — a v1 bug only rendered measurement found |
| **`measure-contrast.py` settles the page first** | Scroll-triggered typing and pointer-redrawn portraits mutated the DOM mid-measurement; decorative (`aria-hidden`) and visually-hidden text are skipped |
| **Unknown links are explicit placeholders** (`_todo` in content) | Behance, Medium, Roomy and Form URLs, résumé path — never invented |

### Superseded by v2
- *One system with swappable eras* · *Component anatomy is core* · *Sentence type scale is core* · *The 49-token contract binds every era* · *`era-preview.html` as the comparison* — all v1. The contract's colour roles and the check scripts remain useful inside each era.

---
> **Decided** — don't relitigate. **Rejected** — don't re-propose without new information. **Open** — don't decide silently; ask.
> Add a line whenever something is decided. Newest at the top of each section.

---

## Decided
| Decision | Why |
|---|---|
| **One block walker for case studies; the look stays per era** (`_shared/study.mjs`) | 13 block types × 9 studies × 5 eras is where content gets dropped. Each era passes one renderer per type; the build stops if an era is missing one, and `check-content.mjs` proves every text, link and image arrived |
| **Case-study translations** | 1986 a level (XP bar, STATS box, framed screens in a bezel, NEXT LEVEL) · 2002 a Web 2.0 article (Aqua barber-pole progress, details table, Aqua window prototype) · 2014 a Material article (linear progress under the app bar, lime statement band, paper cards) · Now a glass reading sheet (glowing hairline progress, stat chips, floating glass window prototype, frosted lightbox) |
| **Lightbox / progress / full-size words come from content** (`ui.close`, `ui.viewFullSize`, `ui.readingProgress`, `ui.fullSizeImage`) | Same rule as every other visible or announced word |
| **Work-index filtering is shared behaviour** (`filterJS`) | Same rules as live in every era — single select, a group hides when it's empty. Each era draws the control its own way: 1986 option boxes + stage counter · 2002 gel tag pills + "Showing N of 9" · 2014 scrollable tabs with a sliding ink bar · Now a segmented control with a sliding glass lens |
| **Projects without a screenshot get an era-native stand-in** | Instagram and Form have no image on live. 1986 a dithered card · 2002 a gel app icon · 2014 a Material letter tile · Now a soft colour field. Never a fake screenshot |
| **Each era's portrait lives in `portrait.mjs`** | Home and About both show it; one copy per era |
| **Default era: Now** (`content/site.json` → `eras.default`) | A recruiter's first 30 seconds should read as current. The other eras are the discovery. One line to change |
| **The era switcher is a year rail on the right edge, in every era** (Shareef's call, replacing the year chip as the main control) | All five years always visible, one click each, in the same place whichever year you are in: fixed, 16px from the right edge, vertically centred. Each era draws it natively: 1986 a double-line box with a ▶ on the current year · 1995 a raised plate of sprite buttons, current one sunk · 2002 a silver capsule with an Aqua-blue selection · 2014 a paper sheet with an accent edge on the current year · Now a glass capsule with a white current tile. From 1280px up only: below that the page has no margin for it, so the year chip beside the brand (the previous design, kept as built) takes over. The two never show together. In 2014 the chat head rests just inside the rail and the arrival circle opens from it |
| **Switching keeps you on the same page** (`/about?era=1986`) | Real links, so an era can be shared. Until an era has that page, it lands on that era's home |
| **The choice is remembered** | Preview: `localStorage`, read by `design-reference/eras/index.html`. Real site: a cookie set from `?era=`, read by Next.js middleware that rewrites to the era's route — URLs stay `/work`, not `/1986/work` |
| **Each era has an arrival effect, only after a switch** | 1986 CRT power-on · 1995 stepped scanline wipe · 2002 fade from white · 2014 circular reveal from the year button · Now defrost. Off under reduced motion; never on a normal page load |
| **1995 gains the switcher on top of live** | The one intended difference from live: the time machine is the point of the site |
| **Head tags are shared code** (`eras/_shared/head.mjs`) | Title, description, share image, icon and JSON-LD copied from live, identical in every era. A page that drops one fails `check-content.mjs` |
| **The guide is "Clippy" by name in every era, but only 1995 draws him** | 1995's sprite comes from Shareef's live site. The other eras show the shared guide lines in their own UI (NPC box, IM window, snackbar, notification) with a generic glyph or none. Drawing new versions of the character for other eras isn't something we do |
| **Guide behaviour is shared code, the look is not** (`eras/_shared/client.mjs`) | Timing (section lines, idle chatter, dismiss → comeback, poke) is one behaviour that matches live. Copying it four times would drift. Every pixel of presentation stays in the era |
| **Phones: the guide starts tucked in 2002 and Now** | A floating window or banner over the headline on a 390px screen hides the page. 1986 and 2014 tuck themselves after one line |
| **Now glass loosened to read as glass** (tint .58 → .34, masked light rim) | Contrast isn't a gate (Shareef). The notification banner keeps a denser tint so its message stays readable over anything |
| **Dark eras clear the portrait's light edge pixels** (`decodePortrait(P, true)`) | Live's portrait sits on a light page; on dark screens its anti-aliased edge showed as a white fringe |


### Architecture
| Decision | Why |
|---|---|
| **Ship 1995 alone first** — live as the whole site once it passes the specimen; other eras land later behind the switcher | A finished one-era portfolio beats an unfinished five-era one |
| **Framed controls use `.frame-control[data-fill]`; sprite eras generate their CSS with `build-sprites.mjs`** | Contract had no way to express button/bubble tones — components would have needed hex values or era branches |
| **Sprites and icons are built to static SVG, never drawn with canvas at runtime** | No hex in components, no per-render cost, crisp at every scale |
| **Typing is visual only** — full text in the DOM, characters revealed by colour | Inserting characters hid the H1 from screen readers and crawlers and shifted layout |
| **`font-synthesis: none`; sentence face must ship 400/500/600** | Prevents faked bold, especially with single-weight period faces |
| **`--hover-timing: steps(1, start)` for instant eras** | `steps(1, end)` delays every hover by the full transition duration |
| **Outlines need 3:1; accent is never the only state signal** | Lime measures 1.23:1 on the light page — invisible as a sole indicator |
| **Contract v4: `--focus-width` token and `words` reveal** — found by Now, as intended | Core hardcoded an 8px focus plate; the modern hero entrance had no enum value. Existing eras set `--focus-width: 8px`, so nothing changed for them |
| **Write statements and labels in normal case; the era decides capitals** | The preview's typed capitals made Now's serif shout, and no era could undo them |
| **Measure gradient controls from rendered pixels, every state, real fonts loaded** | 2002's gel passed every token check and still failed on screen. A fallback font shifted text 2px; a stray hover produced a false failure |
| **`fade` statement reveal and `illustration` portrait implemented** | Both were in the contract but unimplemented until 2014 and 2002 needed them |
| **Era ids: `1986` `1995` `2002` `2014` `now`**, lowercase, script-enforced | `Now` vs `now` would silently break selectors |
| **Reveals use `animation-fill-mode: backwards`** | `both` left the final clip-path applied — cut off every card tab and callout shadow in 1995. Found by rendering, not by any check |
| **Secondary buttons on bookends use `--text-inverse`** | The sprite darkened on the dark hero but the label stayed ink — invisible |
| **Tail size and overlap come from sprite data** (`tailOverlap`) | 1995's single-line frame overlaps 1 row; 1986's double line needs 2 or the tail looks detached |
| **`era-preview.html` is generated from the real token files** | A hand-built prototype can drift from the system; a generated one can't. If the preview looks wrong, a token is wrong |
| **Five eras: 1986 · 1995 · 2002 · 2014 · Now** | Each roughly a decade apart and instantly distinguishable; the progression tells a story (bevels arrive, gloss arrives, everything flattens) |
| **One system with swappable eras, not five systems** | Five separate systems drift. Core + contract + era layer means drift can only happen in three guarded places |
| **Build order: 1995 → 1986 → Now → 2014 → 2002** | 1995 defines the contract; Now stress-tests it at the opposite extreme while only three eras depend on it; 2002 is hardest so goes last |
| **Contract freezes after Now passes the specimen** | Prevents late eras quietly growing the contract |
| **Content identical across eras** | Only the skin changes; the portfolio is the same portfolio |
| **Sentence type scale is core, not per era** | Sizes, line heights and spacing never change on an era switch — only line breaks can move |
| **Each era chooses its own sentence face** | Period authenticity across the whole screen, not just the chrome. Cost accepted: text rewraps on switch, and every era's reading face needs its own legibility test |
| **Accessibility floor is era-independent** | A period palette that fails contrast is wrong, not authentic |
| **Contrast is computed by script, never estimated** | Ratios were stated incorrectly twice during design; `check-contrast.mjs` exists so it can't happen again |
| **The existing v3 system becomes the 1995 era** | Its bevels place it in 1995, not 1986 |

### Visual — 2014 era
| Decision | Why |
|---|---|
| White page, flat navy bookends, no shadows | Flat design's whole premise |
| Montserrat (thin hero, 600 buttons) · Oswald · Open Sans | Verified OFL, variable weights; the typefaces of the 2014 web |
| Ghost secondary buttons, underline-only fields | The two most recognisable flat-era controls |
| Long shadow on the callout — the one shadow allowed | The flat era's signature flourish |
| `--statement-weight-strong: 300` | "Strong" names the hero role; in 2014 the hero is thin |

### Visual — 2002 era
| Decision | Why |
|---|---|
| Gel capsule buttons, pill fields, deep blue bookends | Aqua / XP / Web 2.0 |
| Nunito · Nunito Sans | Rounded Web 2.0 look; Verdana isn't free to embed |
| **Gloss band fixed at 7px, clear of all text** | Measured: 38%, 26% and 10px all put the band under some text. 7px passes every control in every state, worst 5.27:1 |
| Silver gel keeps a dark label on bookends | Core defaults secondary labels to `--text-inverse` on bookends; right for four eras, invisible in this one |
| Blind-down reveal | Period web effect; distinct from 1995's stepped scanline |

### Visual — Now era
| Decision | Why |
|---|---|
| Near-black page, black bookends, soft rounded cards | Dark mode's return closes the timeline: dark → light → dark, refined |
| Instrument Serif · JetBrains Mono · Inter | Verified OFL; Inter and JetBrains Mono are variable (real weights); editorial serif is the display look of the moment |
| Statements in sentence case (`--statement-case: none`) | A serif in forced capitals reads cramped |
| Periwinkle `#8CA0FF` action, lime accent kept | 1995's blue lifted for a dark page; lime is the thread through every era |
| Outline `#6A6A76` — brighter than fashionable | Typical dark hairlines are ~1.35:1 and fail 1.4.11 |
| First `css` frame era, every fill hand-written | Proves the contract doesn't depend on sprites |
| Bubbles square one corner instead of a pointer | The modern chat convention, expressed through the same tail slot |
| Line icon set, 20 original icons | `--icon-set: line`; build rejects any set whose names differ |
| Rise-and-settle reveal, word-by-word hero | The first era that interpolates |

### Visual — 1986 era
| Decision | Why |
|---|---|
| Dark indigo page, black bezel bookends | 8-bit screens were dark; makes the jump to 1995's light page the clearest transition in the timeline |
| Flat symmetric double-line frames — no bevel | No light source is what separates 1986 from 1995 |
| Press Start 2P · VT323 · IBM Plex Mono | Verified: OFL, real weights, glyph coverage. Press Start 2P was rejected *for 1995* — for 1986 it's the period face itself |
| Statement sizes at multiples of 8 only (16/24/32) | Press Start 2P blurs at other sizes |
| Cyan action, lime accent | 1995's blue is 2.75:1 on this page; lime is 13.6:1 |
| Palette fade reveal (4 hard opacity steps), not scanline | Period-accurate; keeps each era's motion distinct |
| Portrait technique `blocks` — contract v3 | Fewer, bigger pixels than 1995's dither; needed an enum value, no new token |

### Visual — 1995 era
| Decision | Why |
|---|---|
| Minimal base, pixel as punctuation — not full 8-bit | Full 8-bit signals games/indie; target roles are fintech and B2B SaaS |
| Palette lime `#CDF22B` + blue `#1E45FB`; magenta retired | From the original moodboard; magenta (old brand colour) removed site-wide |
| Silkscreen for statements, Departure Mono for labels, Geist for sentences | Silkscreen has two weights; Departure Mono separates the label register; Geist is legible and in-stack |
| The type gate: sentence → Geist regardless of heading level | Prevents bitmap paragraphs; keeps every era legible |
| Nine-slice 6×6 sprite for buttons, bubbles, inputs | Pixel-perfect at any width; one construction for every framed component |
| Blue primary button, neutral plate secondary, text tertiary | Secondary must clearly lose; lime as a secondary inverted the hierarchy |
| Lime chat bubble for Shareef | Differentiates the bubble from blue buttons |
| Cards: plate + notched tab + sunk well, no window chrome | Title bars made current work look like a retro artifact |
| Tab carries domain only; lime tab = role-relevant | Recruiters scan for domain; lime becomes a relevance signal |
| Sticky plate nav that flattens instantly past 24px | Avoids content scrolling under a raised slab |
| Résumé is a button, never a nav link | A download can't be "current"; doubles as the only persistent CTA |
| Notched focus ring following `--corner` | A square outline around a notched sprite read as a bug |
| Inputs use the sunk bevel | A field is a recess — reuses existing meaning |
| `--error: #C4482E` added | Errors can't borrow lime or blue, which already mean something positive |
| `--text-muted: #5C5C52` | `#87877A` failed on bg; `#6E6E62` failed on surface; this passes on all light surfaces |
| 20 pixel icons, 8×8, sizes 8/16/24/32/48 only | Half-pixel sizes go soft |
| Brand marks (LinkedIn, Behance, Medium) always official SVGs | Redrawn logos read as sloppy and ignore brand guidelines |
| Motion by face: statements type, headings and containers scan, body snaps | Each face gets one motion; nothing to remember per component |
| Scanline over dither dissolve for reveals | User preference |
| Typewriter at 45ms, max 1.5s | Hero is 34 characters ≈ 1.5s; longer becomes a wait |
| Sentence headings never type | A 72-character H1 would take 3+ seconds to become readable |
| Light page, dark hero and footer | Lime, the portrait and screenshot contrast all argued for it |
| ASCII portrait uses dither blocks, auto-sweeps on touch | Matches the reveal language; hover doesn't exist on phones |
| Footer status: location + response time | Never announce availability — visible to current employer |
| Socials labelled | Behance and Medium marks aren't universally recognised; screen readers |
| Case study footer is minimal | Next-story link + full sitemap is two navigation systems |
| Work index: two tiers + collapsed archive + domain filter | Reviewers open what they see first; filter enables per-application tailoring |
| The design itself is a colophon, not a case study | No user problem; solving a positioning problem |

---

## Rejected

| Idea | Why not |
|---|---|
| One sentence face (Geist) across all eras | Chosen instead: each era gets its own reading face, for authenticity |
| `.tone-*` class API and a second sprite build script | Duplicated `data-fill` + `build-sprites.mjs`. Two pipelines for one job is drift |
| Generating sprites with canvas at runtime | Hex values leak into components; render cost; can't be checked |
| Inserting typed characters into the DOM | Breaks screen readers, SEO and layout stability |
| Five independent design systems | Guaranteed drift |
| Chronological build order | Hardest problems found last, after the contract is locked |
| Press Start 2P **for 1995** | Single weight, overused, forces short lines and slow reveals. (Accepted for 1986, where it's the period face) |
| Window title bar with minimise/close buttons on cards | Made current work look like a retro artifact |
| Lime as secondary button | Wins the pair and inverts hierarchy |
| Lime as primary button face | Lime is the highlight tone; flat neon kills the bevel |
| Bitmap type for case study headings | Unreadable at sentence length; breaks scanning |
| Typing sentence-length headings | Too slow |
| Scanlining paragraphs | Banding over text being read |
| Eased slide-up scroll reveals | The only thing on the page that would interpolate |
| "Open to roles" availability line | Visible to current employer |
| Unlabelled social icons | Recognition and screen-reader issues |
| Pixel-redrawn brand logos | Brand guidelines; reads as sloppy |
| A case study about the portfolio's design | No user; belongs in a colophon |

---

## Open

| Question | Notes |
|---|---|
| **Logo per era** — one mark restyled per era, or a single fixed mark? | Live uses `/assets/logo.svg` as the tab icon; every era shows it |
| **Share image per era** | Every era uses live's share image today. A per-era card (an 8-bit one for 1986, glass for Now…) would make a shared link show the era it points to. Belongs in the Next.js phase, where the images are generated |
| **404 page** | Not built in any era |
| **Cargoz Connect placement** | Tier two until client permission; arguably tier one after |
| **Safari check** | Now's refraction fallback and 2002's `-webkit-box-reflect` haven't been checked in Safari |

**Closed since the last review:** links synced from live · portrait technique per era · fonts per era · cursor per era · 2002 reflection (real `box-reflect`) · easter-egg placement (`PLAN.md`) · sync to live. The v1 "contract freeze" and "Now bookend glow" questions belonged to the archived reskin system.

---

## Corrections log

Things stated incorrectly during design, kept so they aren't repeated:

| Claim | Actual | Source of truth |
|---|---|---|
| "2014 means no soft shadows" | True of iOS 7, false of Material — Material 2014 was paper with elevation shadows. Cards had no edges until it was corrected | Material Design (2014) |
| "Now's glass fails in 12 places" (first sweep) | 7 real; the rest were artifacts — indicator dots sampled as background, smooth-scroll screenshots | `measure-contrast.py` after fixes |
| "Hero words read 1.00:1" | Tool artifact: tight leading made glyph boxes overlap the next line. Real value ≥ 8:1 | tool fixed to hide the whole block |
| "Lime on blue fails contrast badly" | 4.95:1 — passes AA | `check-contrast.mjs` |
| "Mute `#87877A` is 4.0:1" | 3.48:1 | `check-contrast.mjs` |
| "Mute `#6E6E62` is 5.7:1 and fixes every instance" | 4.9 on bg (passes) but **3.6 on surface** — failed on plates | `check-contrast.mjs` |
| "The generated regex was double-escaped" | It wasn't — tool output is JSON-escaped, so one backslash displayed as two. Verified by running the regex from the page | `node` |
| "The 2002 gel band at 38% clears the text" | Measured: overlapped by 4px. 10px also failed on the bubble. 7px passes | browser, pixel sampling |
| "2002's Résumé button fails at 3.32:1" | A stray pointer hover during capture; controlled run gives 5.66 | browser, controlled |
| Fonts for 2014 and 2002 were rendering | They weren't — the preview's font link was missing five families; fallbacks were shown until checked | `document.fonts` |
| "`#62626E` was the first outline tried for Now" | `#5E5E6A` was (2.77:1) | computed |
| "1995 blue is under 2:1 on the 1986 page" | 2.75:1 — still fails, but the number was wrong | computed |
| "White on blue 8.6:1, AAA" | 6.4:1 — AA, not AAA | computed |
| "Ink on lime 13:1" | 14.37:1 | `check-contrast.mjs` |

---

## Process

| Rule | Why |
|---|---|
| **One agent edits the repo at a time** | Two sessions edited this folder in parallel during setup. One overwrote the other's sprite data and deleted its generated sprites; it had to be reconstructed from the generated CSS. The contract only protects against drift if one writer holds it at a time |

