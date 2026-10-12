# Era · now — Liquid Glass the way Apple ships it

**Status:** 🟦 Own design (v3) · `eras/now/` · every page built: home, work, about, 9 case studies

> Supersedes v2, the glass bento over a colour mesh (archived in `archive/now-v2-glass-bento.md`), and v1, the dark reskin (`archive/now-v1-reskin.md`). Shareef picked this direction from three and approved the home mock. This era shares **only content** with the others.

---

## 1. Identity

**Reference point:** Liquid Glass as Apple ships it in iOS 26 and macOS 26, not as people mock it up.
**The rule it follows (Apple HIG):** glass is for controls and navigation floating above content. Don't use it in the content layer.

| Layer | What's in it | Material |
|---|---|---|
| Sky | the page background (§5a) | a CSS gradient with stars or clouds drawn on it |
| Content | headline, portrait, screenshots, lists, footer | solid `--surface` panels; text straight on the sky |
| Controls | year switcher, Résumé, bottom tab bar, notification, lightbox close | glass |

Light by day, dark by night: the colours follow the sky, which follows the visitor's clock, not the device's dark mode. No mesh, no blobs, no bento.

## 2. Type

The system font: `system-ui, -apple-system, "SF Pro Text"/"SF Pro Display"`. SF Pro on Apple devices, the platform face elsewhere. No web fonts.

| Role | Size | Notes |
|---|---|---|
| Large title | `clamp(44px, 7vw, 80px)` 700, line-height 1.03 | tracking −.015em |
| Title 2 (section) | `clamp(28px, 3.2vw, 34px)` 700 | |
| Body | 17px / 1.47 | |
| Kicker, meta | 14–15px, `--text-muted` | normal case |

## 3. Colour

| Token | Day | Night |
|---|---|---|
| `--sky` | `#CFE3F8` → `#E4EFFA` → `#F7F2EA` | `#04060D` → `#0A1022` → `#161C38` |
| `--bg` (overscroll, arrival sheet) | `#E4EFFA` | `#080C1A` |
| `--surface` | `#FFFFFF` | `#1C1C1E` |
| `--text` | `#1D1D1F` | `#F5F5F7` |
| `--text-muted` | `rgba(60,60,67,.64)` | `rgba(235,235,245,.64)` |
| `--action` (links) | `#0066CC` | `#2997FF` |
| `--accent` (app tint, prominent button only) | `#CDF22B` | same |

## 4. Shape

Concentric corners: panel 32 → inner 20 → small 14. Every control is a capsule.

## 5. The glass

```
background       rgba(255,255,255,.52)  ·  dark rgba(44,44,48,.5)
backdrop-filter  url(#lens) blur(14px) saturate(1.8) brightness(1.04)   refraction where supported
                 blur(14px) saturate(1.8) brightness(1.04)              everywhere else
box-shadow       bright top rim, faint bottom rim, .5px edge, soft drop
```

A scroll edge effect blurs content as it slides under the top controls.

## 5a. The sky

`sky.mjs`. A fixed layer behind the page (Shareef's call, after gauravi.design). The gradient is CSS, so it paints before any script; two canvases draw what's in it.

| | Night, 19:00 to 06:00 | Day |
|---|---|---|
| Stays put | 240 dim stars, a Milky Way band of tiny stars from lower left to upper right | a warm glow top right where the sun is |
| Moves | 80 stars twinkle, 3 thin wisps of cloud drift, a shooting star every 10 to 20 seconds | 6 clouds drift at three depths |

- A script in `<head>` sets `data-sky="night"` or `"day"` on `<html>` from the visitor's clock before first paint, and the colour tokens key off it. It's decided once per page load. Without JavaScript the device's dark setting decides, and the sky is the plain gradient
- `?sky=day` or `?sky=night` previews either at any hour
- Case studies: one still frame at half strength, so the article stays easy to read
- Reduced motion: one still frame everywhere
- About 30 frames a second; pixel ratio capped at 2 (1.5 on phones); phones get fewer stars, a thinner band and 4 clouds
- Keep it weather and stars. The de-slop rule against blurred colour blobs still applies: the band has barely a glow, and nothing is a coloured haze

## 6. Components (1995 → Now)

| 1995 | Now |
|---|---|
| Sprite nav | iOS 26 tab bar floating at the bottom (Home · Work · About); shrinks to the current tab while you scroll down |
| Résumé button | glass capsule, top right |
| Era switcher | glass capsule top left, opening a glass popover |
| Clippy | a collaborator's cursor named Shareef, as in a shared Figma file. It glides to what it's talking about (the section heading, Résumé, the email) and says it in cursor chat, then drifts a little while quiet. × closes it; a glass capsule brings it back. On phones it parks as that capsule and the bubble opens above it |
| Portrait | the real pixels, crisp, in a solid well |
| Work cards | big screenshot, plain text under it. The whole card is the link, so "Read case study" is kept for screen readers only |
| Live products, principles, timeline | Settings-style grouped panels with hairline rows |
| Under NDA | grouped panel |
| Copy → Copied | the bordered button fills with the tint |
| Footer | solid panel; on home it's the floor of the Glass Merge jar |
| Filter chips | iOS segmented control; the white thumb slides to the choice |
| Back link | iOS back button: chevron and the previous page's name |
| Case study | article on the page; meta as a grouped panel; solid panels for outcome, callouts, short version; prototype in a plain macOS window; dark lightbox with a glass close button |

## 7. Home game

**Glass merge** (`game.mjs`). No panel: orbs fall over the page background, the footer panel is the jar's floor and the two walls rise out of it. Wall colour, aim guide and the biggest orb follow light and dark through `--merge-wall`, `--outline` and `--merge-top`.

## 8. Motion

- Tab bar shrink and grow, notification drop-in, popover scale-in, segmented thumb slide, button press scale
- Page arrives through a fading sheet
- The sky: clouds drift, stars twinkle, a shooting star now and then (§5a)
- No fade-in on sections, no word reveal
- Reduced motion turns all of it off; reduced transparency makes glass solid

## 9. Open questions

- Safari check for the refraction line (it should fall back to the plain blur)
