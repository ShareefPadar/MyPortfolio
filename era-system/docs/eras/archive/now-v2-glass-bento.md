# Era · now — Liquid Glass

**Status:** 🟦 Own design (v2) · `eras/now/` · every page built: home, work, about, 9 case studies

> Supersedes Now v1 (soft dark mode on the shared layout — archived in `archive/now-v1-reskin.md`). This era shares **only content** with the others. Its layout, components and type are its own.

---

## 1. Identity

**Reference point:** Apple's Liquid Glass (2025) and the glassmorphism before it
**One-line look:** A vivid mesh behind a bento grid of glass tiles, a floating pill nav that refracts what scrolls under it, a huge tight grotesk headline
**Layout, not just skin:** bento grid (hero 3×2, portrait 1×2, message and note tiles, then work and live tiles two-up), floating capsule nav, message-bubble greeting, glass footer panel

**Evoke, don't copy:** no Apple UI, icons or wallpapers reproduced. The mesh, glass and icons are original.

## 2. Type

| Role | Face | Licence |
|---|---|---|
| Display | **Inter Tight** 600 / 650 (variable 100–900) | SIL OFL — verified |
| Everything else | **Inter** (variable 100–900) | SIL OFL — verified |

Headline `clamp(44px, 6.4vw, 88px)`, line-height .98, tracking −.045em, sentence case. One family for the UI, like the system faces this era evokes.

## 3. Glass

```
background-color  rgba(14, 16, 36, .34)        tint (was .58 while contrast was a gate)
background-image  135° white sheen, .13 → .035
backdrop-filter   blur(22px) saturate(165%)
border            1px rgba(255,255,255,.17)
box-shadow        top rim highlight + soft 56px drop
::after           pointer-following specular, white .07
```

**Real refraction** on the nav pill only: `backdrop-filter: url(#liquid) blur(16px) saturate(180%)`, an SVG turbulence and displacement filter. Verified working in Chromium (straight stripes measurably bent). Browsers that can't parse it drop that line and keep the plain blur declared above it — ⬜ still to verify in Safari.

**The mesh** is what the glass refracts; over flat black, glass looks like nothing. Four radial fields (periwinkle, cyan, lime, violet) on `#06070F`, drifting over 48s, frozen under reduced motion.

## 4. Legibility — measured, not assumed

Glass is where Apple's own legibility broke in the Liquid Glass betas. Every text element was measured from rendered pixels with `scripts/measure-contrast.py`: text hidden, pixels sampled behind its glyphs, pointer away **and** hovering (the specular highlight lightens the glass).

| Round | Result |
|---|---|
| Tint .46, highlight .13, full-strength mesh | **7 real failures** — eyebrow 3.15, nav "Contact" 2.78 under the highlight |
| Tint .58, nav .66, highlight .07, calmer mesh, muted text `#C3C7DE` | Hand-picked list 41/41 at 1280 and 390 |
| Auto-discovery of every text element | Found 2 more: avatar initials 2.40, placeholders 4.48 → fixed |
| **Final** | **54/54 at 1280, 53/53 at 390 · tightest 5.37:1** |

**Measurement pitfalls found and fixed in the tool:**
- Smooth scrolling put screenshots mid-scroll → false 1.00 readings. The tool disables it
- Tight display leading makes one word's glyph box overlap the next line → white-on-white 1.00. The tool hides the whole text block
- Indicator dots inside chips counted as "background" → it samples glyph boxes, not element boxes

**The trade-off, plainly:** this glass is denser than Apple's. The colours still show through and it reads as glass, but it won't look as clear as a marketing render — clearer glass failed.

## 5. Accessibility settings

| Setting | Behaviour |
|---|---|
| `prefers-reduced-transparency` | Glass becomes solid `--surface`, no blur; mesh dims to 35%. Verified by emulation |
| `prefers-contrast: more` | Tint to .86, borders to 55% white |
| `prefers-reduced-motion` | No drift, no word reveal, no rise, no smooth scroll |
| Focus | 3px `#9FB0FF` outline, 3px offset, follows each shape's radius |

## 6. Colour tokens

Solid values for `check-contrast.mjs` (passes). Text sits on glass, so §4 is the real check.
`--bg #06070F` · `--surface #151830` · `--text #F5F6FF` · `--text-muted #C3C7DE` · `--accent`/`--action #CDF22B` · `--on-action #0A0B14` · `--focus #9FB0FF` · `--outline #7A80A6` · `--error #FF7B72`

## 7. Motion

- Headline words blur in 90ms apart — full text in the DOM throughout
- Tiles rise, un-blur and settle once on scroll-in (.8s, eased)
- Specular highlight follows fine pointers only
- Nav pill tightens past 40px of scroll
- Mesh drifts slowly — the one loop, off under reduced motion

## Phase 2 — home (translates 1995)
`eras/now/layout.mjs` is the shell every Now page uses.
- **Portrait:** the real pixels drawn smooth and lit from behind by a blurred copy of themselves; the tile tilts toward the pointer.
- **Guide:** a glass notification top-right (app icon, name, "now"); settles into a glass pill. Phones start with the pill.
- **Clock widget:** Dubai time under the shared status line, filling the slot the old greeting tile used.
- **Copy → Copied:** lime-tinted glass, the icon morphs to a tick.
- **Glass loosened** (contrast is no longer a gate): tint .34, a masked 1.5px light rim, four drifting colour fields in the mesh. The notification keeps a denser tint so it reads over anything.
- **Era switcher:** a floating glass capsule, top-left (bottom-left under 900px), opening a glass panel. Arrival: the page defrosts into focus.
- **Work:** a glass header tile with a segmented control whose glass lens slides to the filter; tall tiles for Start here, smaller tiles for the rest (colour field when there's no screenshot).
- **About:** a bento — hero + portrait tile, two bio tiles, three principle tiles, one wide glass timeline, the quote in a large tile with both calls to action.
- **Case study:** a glass reading sheet — a glowing hairline for progress, a glass header with stat chips, the statement in a large glass tile, inner glass cards, rounded screens, a floating glass window for the prototype, a frosted lightbox.

- **Home game (`game.mjs`):** GLASS MERGE (Shareef's pick; it replaced Five), sitting the way live's Dino Runner does. No panel: glass orbs in the mesh colours fall through the mesh. The footer glass is the bottom of the jar and the jar's two glass walls rise out of it, brightest where they meet it; a few orbs already rest on the footer before you start. Two orbs of a size merge into the next (8 sizes); a pink dashed line marks the top, and an orb over it for 1.6s ends the game. The footer's reveal is skipped on the home page so the floor never drifts under the orbs.

## 8. Open questions

- Safari check for the refraction fallback
- Should the mesh react to scroll instead of drifting on a timer?
