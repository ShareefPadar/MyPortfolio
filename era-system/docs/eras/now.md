# Era · now — Liquid Glass the way Apple ships it

**Status:** 🟦 Own design (v3) · `eras/now/` · every page built: home, work, about, 9 case studies

> Supersedes v2, the glass bento over a colour mesh (archived in `archive/now-v2-glass-bento.md`), and v1, the dark reskin (`archive/now-v1-reskin.md`). Shareef picked this direction from three and approved the home mock. This era shares **only content** with the others.

---

## 1. Identity

**Reference points:** Liquid Glass as Apple ships it in iOS 26 and macOS 26, for the controls. gauravi.design, for the sky, the glass cards and the scroll reveal.
**Changed (Shareef's call):** this era used to follow Apple's rule that glass is only for controls floating above content. Now the content panels are glass too, so the sky shows through them. The controls keep the stronger glass, so the two still read as different layers.

| Layer | What's in it | Material |
|---|---|---|
| Sky | the page background (§5a) | a CSS gradient with stars or clouds drawn on it |
| Content | panels, work cards, the portrait well, the footer | panel glass (§5); headlines and article text sit straight on the sky |
| Controls | year switcher, Résumé, bottom tab bar, notification, lightbox close | control glass (§5), with refraction |

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

Two glasses. Controls (`.glass`):

```
background       rgba(255,255,255,.52)  ·  night rgba(44,44,48,.5)
backdrop-filter  url(#lens) blur(14px) saturate(1.8) brightness(1.04)   refraction where supported
                 blur(14px) saturate(1.8) brightness(1.04)              everywhere else
box-shadow       bright top rim, faint bottom rim, .5px edge, soft drop
```

Content panels (`--pane`): `.group`, `.footer`, `.stats`, `.soutcome`, `.scallout`, `.sshort`, `.sending`, `.snext`, `.spre`, `.mwin`, `.work`, `.portrait`:

```
background       rgba(255,255,255,.44)  ·  night rgba(30,33,48,.42)
backdrop-filter  blur(12px) saturate(1.4)        no refraction: these are big and there are many of them
box-shadow       1px inset rim (so no panel changes size), soft drop; deeper drop on hover for cards that are links
```

A work card is a glass card with the screenshot inside it, corners concentric (32 − 10 = 22). A scroll edge effect blurs content as it slides under the top controls.

## 5a. The sky

`sky.mjs`. A fixed layer behind the page (Shareef's call, after gauravi.design). The gradient is CSS, so it paints before any script; two canvases draw what's in it.

| | Night, 19:00 to 06:00 | Day |
|---|---|---|
| Drawn once | 240 dim stars, a Milky Way band of tiny stars from lower left to upper right | a warm glow top right where the sun is; it breathes (CSS, 9s) |
| Moves by itself | 120 stars twinkle, each on its own beat, the brightest with a halo; every second or two one flares into a four-point glint; 3 thin wisps of cloud drift; a shooting star every 4 to 9 seconds, one in four of them bigger | 8 clouds cross at three depths (12, 20 and 32px a second); a few birds go over every half minute or so, high up, wings beating |
| Moves with the scroll | the drawn-once layer slides up 4% of the scroll (200px spare); each twinkling star 6 to 16%; the wisps 14 to 22%. Stars and clouds wrap round off screen, so the sky never runs out | clouds 10, 18 and 28% by depth; the sun stays put |
| Moves with the pointer | the whole sky leans up to 12px away from it, the far layer less | the same |

- A script in `<head>` sets `data-sky="night"` or `"day"` on `<html>` from the visitor's clock before first paint, and the colour tokens key off it. It's decided once per page load. Without JavaScript the device's dark setting decides, and the sky is the plain gradient
- `?sky=day` or `?sky=night` previews either at any hour
- Case studies: one still frame at half strength, so the article stays easy to read. No drift, no parallax
- Reduced motion: one still frame everywhere
- Shareef asked for the motion to be turned up: the first version drifted too gently to notice
- About 30 drawings a second, every frame while the page is scrolling; pixel ratio capped at 2 (1.5 on phones); phones get fewer stars, a thinner band, 5 clouds and 3 birds
- Keep it weather and stars. The de-slop rule against blurred colour blobs still applies: the band has barely a glow, and nothing is a coloured haze

## 6. Components (1995 → Now)

| 1995 | Now |
|---|---|
| Sprite nav | iOS 26 tab bar floating at the bottom (Home · Work · About); shrinks to the current tab while you scroll down |
| Résumé button | glass capsule, top right |
| Era switcher | glass capsule top left, opening a glass popover |
| Clippy | a collaborator's cursor named Shareef, as in a shared Figma file, in glass like the cards (it was lime; Shareef's call). It glides to what it's talking about (the section heading, Résumé, the email) and says it in cursor chat, then drifts a little while quiet. × closes it; a glass capsule brings it back. On phones it parks as that capsule and the bubble opens above it |
| Portrait | the real pixels, crisp, in a glass well |
| Work cards | a glass card: big screenshot inside it, plain text under. The whole card is the link, so "Read case study" is kept for screen readers only. Lifts 4px under the pointer |
| Live products, principles, timeline | Settings-style grouped glass panels with hairline rows |
| Under NDA | grouped glass panel |
| Copy → Copied | the bordered button fills with the tint |
| Footer | glass panel |
| Filter chips | iOS segmented control; the white thumb slides to the choice |
| Back link | iOS back button: chevron and the previous page's name |
| Case study | article on the page; meta as a grouped panel; glass panels for outcome, callouts, short version; prototype in a macOS window; dark lightbox with a glass close button |

## 7. Home game

None. Now is the one era without an easter-egg game (Shareef's call): Glass merge was dropped once the sky and the glass cards arrived. The home page ends on the live products and the footer. `game.mjs`, its styles and `games.now` in `content/site.json` are gone; the game is in git history if it's wanted back.

## 8. Motion

- Tab bar shrink and grow, notification drop-in, popover scale-in, segmented thumb slide, button press scale
- Page arrives through a fading sheet
- The sky: clouds drift, stars twinkle, a shooting star now and then (§5a)
- Scroll reveal (Shareef's call, after gauravi.design; it replaces "no fade-in on sections" for this era only): panels, cards, figures and section headings rise 24px and fade in over .8s the first time you reach them, 70ms apart when several enter together. Once only. Only what starts below the fold is hidden, so nothing waits at first paint, and the script takes the classes off afterwards. Article paragraphs are never touched
- The hero falls 56px behind the scroll and thins to 45% as the page moves on. CSS scroll-driven, two columns only; browsers without it just scroll
- Work cards and the next-study card lift 4px under the pointer
- No word reveal, no smooth-scroll script
- Reduced motion turns all of it off; reduced transparency makes every glass solid

## 9. Open questions

- Safari check for the refraction line (it should fall back to the plain blur)
- Real-phone check: the glass panels re-blur a moving sky. Smooth in desktop Chrome; not yet measured on a phone
