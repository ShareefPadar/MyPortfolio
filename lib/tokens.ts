/**
 * Design token hexes for the TypeScript side (the sprite generator).
 *
 * These MUST stay in sync with the @theme block in app/globals.css, which is
 * the source of truth for anything CSS touches. They are duplicated here only
 * because the sprite generator runs in Node at build time and cannot read CSS
 * custom properties.
 *
 * Spec: "8 bit/CLAUDE.md" §1.1
 */

export const INK = "#14140F";
export const LIME = "#CDF22B";
export const BLUE = "#1E45FB";
export const ERROR = "#C4482E";
export const PAPER = "#F0EFF4";
export const PLATE = "#D6D5DE";
export const PANEL = "#E4E3EA";
export const LINE = "#DCDBE4";
export const MUTE = "#5C5C67";

export const HI = "#FFFFFF";
export const SH = "#8A8992";

export const NIGHT = "#0B0B0C";
export const NIGHT2 = "#16161A";
export const NLINE = "#26262A";
export const NTEXT = "#9A9A94";

/** One pixel unit. Every dimension in the system is a multiple of this. */
export const U = 4;

/** Icon sizes are a closed set (spec §4.7). Typing this makes 20px a type error. */
export type IconSize = 8 | 16 | 24 | 32 | 48;

/** Sprite scales in use: 3 = inputs, 4 = default, 6 = large buttons. */
export type SpriteScale = 3 | 4 | 6;

/** Raised = interactive/containing. Sunk = pressed/recessed/current/input. */
export type SpriteState = "base" | "hover" | "sunk";
