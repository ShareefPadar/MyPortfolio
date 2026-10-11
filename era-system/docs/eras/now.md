# Era · now — Liquid Glass the way Apple ships it

**Status:** 🟦 Own design (v3) · `eras/now/` · every page built: home, work, about, 9 case studies

> Supersedes v2, the glass bento over a colour mesh (archived in `archive/now-v2-glass-bento.md`), and v1, the dark reskin (`archive/now-v1-reskin.md`). Shareef picked this direction from three and approved the home mock. This era shares **only content** with the others.

---

## 1. Identity

**Reference point:** Liquid Glass as Apple ships it in iOS 26 and macOS 26, not as people mock it up.
**The rule it follows (Apple HIG):** glass is for controls and navigation floating above content. Don't use it in the content layer.

| Layer | What's in it | Material |
|---|---|---|
| Content | headline, portrait, screenshots, lists, footer | solid: `--bg` page, `--surface` panels |
| Controls | year switcher, Résumé, bottom tab bar, notification, lightbox close | glass |

Light by default, dark when the device is (`prefers-color-scheme`). No mesh, no blobs, no bento.

## 2. Type

The system font: `system-ui, -apple-system, "SF Pro Text"/"SF Pro Display"`. SF Pro on Apple devices, the platform face elsewhere. No web fonts.

| Role | Size | Notes |
|---|---|---|
| Large title | `clamp(44px, 7vw, 80px)` 700, line-height 1.03 | tracking −.015em |
| Title 2 (section) | `clamp(28px, 3.2vw, 34px)` 700 | |
| Body | 17px / 1.47 | |
| Kicker, meta | 14–15px, `--text-muted` | normal case |

## 3. Colour

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F2F2F7` | `#000000` |
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
- No fade-in on sections, no word reveal
- Reduced motion turns all of it off; reduced transparency makes glass solid

## 9. Open questions

- Safari check for the refraction line (it should fall back to the plain blur)
