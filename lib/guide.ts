/**
 * Guide tour copy.
 *
 * The old implementation put these strings in `data-guide` attributes inside
 * the homepage JSX and read them with querySelectorAll. That is a silent
 * contract: rewrite the markup, the selector returns nothing, and the whole
 * feature just never appears — no error, no failing build.
 *
 * So the copy lives here and sections carry only `data-guide-id`. PixelGuide
 * warns in development when a stop resolves to no element, which turns a
 * silent disappearance into something you actually notice.
 */

export interface GuideStop {
  id: string;
  message: string;
}

export const GUIDE_STOPS: GuideStop[] = [
  {
    id: "hero",
    message: "Hey, I'm Shareef. Senior product designer, and I ship the code too.",
  },
  {
    id: "work",
    message: "My favourite case studies live here. Click any card to dig in.",
  },
  {
    id: "nda",
    message: "Six years more sits under NDA. I'll walk you through it on a call.",
  },
  {
    id: "live",
    message: "I designed and built these two myself. Go press some buttons.",
  },
];

/** Timings carried over from the previous implementation. */
export const TYPE_MS = 26;
export const DOTS_MS = 700;
export const HOLD_MS = 4200;
