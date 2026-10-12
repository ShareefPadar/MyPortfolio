# Live site audit — shareefpadar.com vs the era system

**Audited:** live HTML, CSS and rendered pages (1280px), all 9 routes, October 2026.
**Bottom line:** the era system covers **1 of 9 pages**, its **content is out of date**, the **1995 tokens have drifted** from live, and **14 live components have no equivalent** in any era.

---

## 1. Pages

| Live route | In the era system? |
|---|---|
| `/` home | ✅ all five eras (content out of date — §2) |
| `/work` — index with filter chips, two groups, 9 projects | ✅ 1995 only |
| `/about` — bio, principles, experience timeline, pull quote | ✅ 1995 only |
| `/work/freelax` · `sanad` · `wio` · `almosafer-audit` · `google-maps-route-pass` · `omni-cast-ai` · `instagram-local` · `roomy` · `form` — **9** case studies (first audit missed three) | ✅ 1995 only |

## 2. Content drift — `content/site.json` vs live

`site.json` was written from an older homepage draft. **Live is the source of truth.**

| Item | Live | `site.json` |
|---|---|---|
| Nav | Home · Work · About · Résumé | Work · About · Contact |
| Eyebrow | Shareef Padar · Dubai | I'm Shareef Padar |
| Lead | …which is why the prototypes on this site are real software rather than screenshots. | …Based in Dubai. I build and ship my own products… |
| Hero CTAs | View work · Résumé | View work · About |
| Guide message | "It looks like you're viewing a portfolio. Shareef designs it and ships the code too." (Clippy) | NDA greeting (different text, different role) |
| Selected work | **4:** Freelax (Fintech · Live), Sanad, Wio, Almosafer audit (Travel) | **2:** Sanad, "Mizan" |
| Card status line | "Fintech · Live", "Fintech · Concept", "Travel · Concept" | none |
| Wio | real name, "where it actually stands", Wio Bank complaints | "Mizan", "what's actually happening" |
| NDA box label | "Under NDA" | none |
| Live tags | Co-living · Health; status "Live · side project" | none; "Live · in daily use" / "Live · privacy-first" |
| Roomy / Form URLs | roomy-delta.vercel.app · fitness-tracker-pi-tan.vercel.app | `#todo` |
| Behance / Medium | behance.net/shareefpadar · medium.com/@shareefpadar167 | `#todo` |
| Résumé | /assets/Shareef_Padar_Resume.pdf | /shareef-padar-resume.pdf |
| Footer | status "Dubai · GMT+4", copy button "Copy", credit "Designed & built by Shareef Padar" | longer status, "Copy email", credit with "Next.js · 2026" |

## 3. Token drift — live 1995 vs `styles/eras/1995.css`

| Role | Live | Era system | |
|---|---|---|---|
| bg (paper) | `#F0EFF4` | `#FAFAF8` | ✕ live is cool lavender-grey; ours warm |
| surface (plate) | `#D6D5DE` | `#D8D8D0` | ✕ |
| surface-sunk (panel) | `#E4E3EA` | `#F0F0EA` | ✕ |
| line | `#DCDBE4` | `#DEDED8` | ✕ |
| text-muted | `#5C5C67` | `#5C5C52` | ✕ |
| text, action, accent, error, night, night text | — | — | ✓ identical |
| Label font | **Geist Mono** | Departure Mono | ✕ |
| Statement / sentence | Silkscreen / Geist | Silkscreen / Geist | ✓ |
| Spacing ramp | 4 → 128 | 4 → 128 | ✓ |
| Containers | wide 1100px · lead 52ch · md 28rem | wrap 1100px | partial |
| Motion frame | `--f: 60ms`, scanClip + scanBands | same technique | ✓ |
| Sprites | PNG at 3/4/6: blue, blueDk, lime, limeDk, neutral, disabled, field, fieldErr | SVG at 4/6: action, surface, accent, disabled, field, error + bookend variants | different pipeline, same idea |

## 4. Component inventory

✅ present · ◐ partial / different · ❌ missing. Columns are 1986 · 1995 · 2002 · 2014 · Now.

### Global
| Live component | 86 | 95 | 02 | 14 | Now | Notes |
|---|---|---|---|---|---|---|
| Skip link | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Sticky nav that flattens on scroll | ◐ | ✅ | ◐ | ✅ | ✅ | |
| Nav items as raised/pressed buttons, current = sunk | ❌ | ◐ | ❌ | ❌ | ❌ | ours: label links + sunk current |
| Mobile burger menu | ❌ | ❌ | ❌ | ✅ | ❌ | only 2014 has one |
| **Pixel cursor** (custom arrow, site-wide) | ❌ | ❌ | ❌ | ❌ | ❌ | |
| **Clippy guide** — character, name tag, bubble, typing dots, follows/pops in | ❌ | ❌ | ❌ | ❌ | ❌ | each era could have its own guide |
| Scroll reveals | ✅ | ✅ | ✅ | ✅ | ✅ | |
| LED status indicator | ◐ | ✅ | ◐ | ◐ | ◐ | |
| Copy email + confirmation | ✅ | ✅ | ✅ | ✅ | ✅ | |
| Socials with icons | ◐ | ◐ | ◐ | ◐ | ◐ | ours: text labels, no brand icons |
| OG / share image (`/opengraph-image`) | ❌ | ❌ | ❌ | ❌ | ❌ | one per era? |

### Home
| Live component | 86 | 95 | 02 | 14 | Now | Notes |
|---|---|---|---|---|---|---|
| **Real pixel-art portrait** (colour canvas from your photo) | ◐ | ◐ | ◐ | ◐ | ◐ | all eras use generated stand-ins |
| Typed statement | ✅ | ✅ | ◐ | ◐ | ◐ | |
| 4 project cards with **real screenshots** | ◐ | ◐ | ◐ | ◐ | ◐ | 2 cards, placeholders |
| Card status line ("Fintech · Live") | ❌ | ❌ | ❌ | ❌ | ❌ | |
| NDA box with "Under NDA" label | ◐ | ◐ | ◐ | ◐ | ◐ | text only, no label |
| Live-product cards (text only, tag + LED) | ✅ | ✅ | ✅ | ✅ | ✅ | |
| **Dino Runner** game (canvas, space/tap) | ✅ | ✅ | ✅ | ✅ | none | 1995 is live's Dino, ported as-is. 1986, 2002 and 2014 have their own game (Ship the backlog, Bubble pop, Paper plane), placed like the Dino (no box, footer top = floor). Now has no game: Shareef dropped Glass merge |

### Work index
| Live component | Status |
|---|---|
| Breadcrumb, intro | ❌ all eras |
| **Filter chips** (toggle buttons, `aria-pressed`) | ❌ |
| Two groups ("Start here" / "Everything else"), 9 cards | ❌ |

### About
| Live component | Status |
|---|---|
| Long-form bio | ❌ all eras |
| Principles (bold lead + paragraph) | ❌ |
| **Experience timeline** (role, company, dates, summary) | ❌ |
| Education line, pull quote (lime rule), CTA pair | ❌ |

### Case study
| Live component | Status |
|---|---|
| Back link, section label ("01 Overview"), title | ❌ all eras |
| **Meta grid** — Role · Timeline · Year · Stack | ❌ |
| **Reading progress** (segmented `prog-seg` blocks) | ❌ |
| Three-width grid (col 720px · wide · full) | ❌ |
| Callouts — lime-rule note, blue-rule TL;DR | ❌ (v1 had a callout; not in the redesigns) |
| "Short story" log box (dated rows in a plate) | ❌ |
| Numbered decisions, h2/h3 prose, prose links (↗ on external), numbered lists | ❌ |
| **Embedded live prototype screens** (isolated, DM Sans) with captions | ❌ |
| Annotation notes ("A note on the visual language") | ❌ |
| Blockquotes / pull quotes | ❌ |
| Interactive "try the whole flow" prototype | ❌ |
| Related work cards | ❌ |

## 4b. Contrast notes on live (informational only — not being pursued)
Primary button hover `#3E5FFC` with the lime label measures 3.85:1, and error red `#C4482E` on the paper 4.26:1. Shareef's decision: contrast isn't a gate, so 1995 keeps live's values.

Live also has a JSON-LD Person block (good for search) — the 1995 era includes it.

## 5. What this means

The era system is a **homepage redesign exercise**; the live site is a **9-page product**. Before any era can replace live, each era needs the Work, About and case-study templates — and case studies carry most of your actual value (the embedded prototypes especially).

**Suggested order**
1. **Sync `content/site.json` to live** (§2) and expand it to cover Work, About and case-study content. Mechanical; every era re-renders automatically
2. **Fix 1995 token drift** (§3) — cool neutrals, Geist Mono labels. 1995 must match what's live, since it *is* what's live
3. **Era-native easter eggs:** Clippy in 1995 (Office '97), Dino Runner in 2014, a native guide in each other era
4. **Templates per era:** Work index → About → case study (the largest; each era needs its own prose, callout, meta grid, progress and embed treatments)
5. Real assets: pixel portrait source, project screenshots, OG image per era
