/**
 * The sprite primitive (spec §3).
 *
 * Every framed component in the system — buttons, bubbles, tabs, cards,
 * inputs — is one 6×6 pixel map stretched with `border-image`. Build it once.
 *
 * This module is PURE: no DOM, no canvas. It is imported by both
 * scripts/build-sprites.mjs (Node, build time) and React (for URL lookup), so
 * it must not touch `document`. Sprites are pre-rendered to PNGs in
 * /public/sprites/ at build time and referenced by URL, which means
 * `border-image-source` lives in a CSS class rather than an inline style —
 * so every component using one can stay a server component.
 *
 * Spec §12 mistake #3 is "calling sprite() inside a render". There is no
 * runtime sprite() to call; that mistake is unavailable by construction.
 */

import { BLUE, INK, LIME, type SpriteScale, type SpriteState } from "./tokens";

export type Palette = {
  face: string;
  hi: string; // bevel highlight (top-left)
  shade: string; // bevel shade (bottom-right)
  outline: string;
  hover?: string; // optional face override on hover
};

/**
 * The map. `.` transparent, `D` outline, `H` highlight, `S` shade, `F` face.
 * Two units of border on each edge, two units of face in the centre — which
 * is why border-width and border-image-slice are both scale × 2.
 */
export const BODY = [
  ".DDDD.",
  "DHHHSD",
  "DHFFSD",
  "DHFFSD",
  "DSSSSD",
  ".DDDD.",
] as const;

/** Chat bubble tail, symmetric (spec §4.5). Positioned separately. */
export const TAIL_TAPER = [
  "FFFFFF",
  "DFFFFS",
  ".DFFSD",
  "..DFSD",
  "...DD.",
] as const;

function mix(hex: string, target: string, amount: number): string {
  const h = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  const t = (i: number) => parseInt(target.slice(i, i + 2), 16);
  const c = (a: number, b: number) =>
    Math.round(a + (b - a) * amount)
      .toString(16)
      .padStart(2, "0");
  return "#" + c(h(1), t(1)) + c(h(3), t(3)) + c(h(5), t(5));
}

export const lighten = (c: string, a: number) => mix(c, "#ffffff", a);
export const darken = (c: string, a: number) => mix(c, "#000000", a);

/** Expand a single hex into the four tones a bevel needs (constraint #8). */
export function tones(face: string, outline: string): Palette {
  return { face, hi: lighten(face, 0.45), shade: darken(face, 0.42), outline };
}

export const PALETTES = {
  blue: { face: BLUE, hi: lighten(BLUE, 0.38), shade: darken(BLUE, 0.45), outline: "#0A0E2E" },
  lime: { face: LIME, hi: lighten(LIME, 0.55), shade: darken(LIME, 0.42), outline: INK },
  neutral: { face: "#E2E2DC", hi: "#FFFFFF", shade: "#A6A69E", outline: INK, hover: "#EDEDE7" },
  disabled: { face: "#DCDCD6", hi: "#EDEDE8", shade: "#B4B4AC", outline: "#A0A099" },
  // Inputs invert highlight and shade so the field reads as recessed.
  field: { face: "#FAFAF8", hi: "#8A8A80", shade: "#FFFFFF", outline: INK },
  fieldErr: { face: "#FDF2EF", hi: "#C4482E", shade: "#FFFFFF", outline: "#C4482E" },
  // Dark-surface variants: the outline LIGHTENS or the component dissolves.
  blueDk: { face: BLUE, hi: lighten(BLUE, 0.38), shade: darken(BLUE, 0.45), outline: "#4A5BAE" },
  limeDk: { face: LIME, hi: lighten(LIME, 0.55), shade: darken(LIME, 0.42), outline: "#5A6B1E" },
  neutralDk: { face: "#1E1E22", hi: "#3A3A40", shade: "#0A0A0C", outline: "#4A4A50", hover: "#2A2A30" },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof PALETTES;

export const PALETTE_NAMES = Object.keys(PALETTES) as PaletteName[];
export const SCALES: SpriteScale[] = [3, 4, 6];
export const STATES: SpriteState[] = ["base", "hover", "sunk"];

/**
 * Resolve the four tones for a given state. `sunk` swaps highlight and shade,
 * which is the whole bevel language: raised means interactive, sunk means
 * pressed, recessed, failed, current, or an input (constraint #7).
 */
export function resolve(p: Palette, state: SpriteState) {
  const face =
    state === "sunk"
      ? darken(p.face, 0.1)
      : state === "hover"
        ? (p.hover ?? lighten(p.face, 0.14))
        : p.face;

  return {
    ".": null,
    D: p.outline,
    H: state === "sunk" ? p.shade : p.hi,
    S: state === "sunk" ? p.hi : p.shade,
    F: face,
  } as Record<string, string | null>;
}

/** Path to a pre-rendered sprite. Border width and slice are both scale × 2. */
export function spriteUrl(name: PaletteName, state: SpriteState, scale: SpriteScale) {
  return `/sprites/${name}-${state}-${scale}.png`;
}

/** CSS class name for a palette at a scale, e.g. `sp-blue-4`. */
export function spriteClass(name: PaletteName, scale: SpriteScale) {
  return `sp-${name}-${scale}`;
}
