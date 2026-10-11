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

/**
 * Clippy's grammar, not a narrator's. The one artifact everybody can quote is
 * "It looks like you're writing a letter. Would you like help?" — so every
 * stop opens on that pattern.
 *
 * Third person about Shareef, deliberately: Clippy was an assistant, never the
 * author. A paperclip saying "Hey, I'm Shareef" is a costume; a paperclip
 * saying "you're viewing Shareef's portfolio" is a character.
 */
export const GUIDE_STOPS: GuideStop[] = [
  {
    id: "hero",
    message:
      "It looks like you're viewing a portfolio. Shareef designs it and ships the code too.",
  },
  {
    id: "work",
    message: "It looks like you're browsing case studies. Click any card to dig in.",
  },
  {
    id: "nda",
    message: "It looks like you're wondering what's missing. Six years of it sits under NDA.",
  },
  {
    id: "live",
    message: "It looks like you want proof. These two are live. Go press some buttons.",
  },
];

/**
 * Unprompted interruptions. The scroll-triggered stops above are contextual;
 * these fire on a timer whether or not you did anything, which is the actual
 * reason people remember Clippy. Fired at random, repeatable.
 */
export const NAGS: string[] = [
  "It looks like you're reading. Would you like help reading?",
  "It looks like you're scrolling. That's going well.",
  "Did you know? You can click things. Try it.",
  "It looks like you haven't hired Shareef yet. Would you like to?",
  "Still here. Just checking in.",
  "It looks like you're evaluating a candidate. I can vouch for him.",
  "Tip: the case studies have working prototypes in them.",
  "It looks like you're busy. I'll wait.",
];

/** What he says when he comes back after you've dismissed him. */
export const COMEBACK: string[] = [
  "It looks like you're trying to hide me. Would you like help?",
  "I'm back. Did you miss me?",
  "You can't actually get rid of me. That's the whole joke.",
  "It looks like you clicked me. I've chosen to interpret that as affection.",
];

/** Timings carried over from the previous implementation. */
export const TYPE_MS = 26;
export const DOTS_MS = 700;
export const HOLD_MS = 4200;

/** How long he stays gone after you dismiss him. Never permanent. */
export const HIDE_MS = 7000;
/** Gap between unprompted interruptions. */
export const NAG_MS = 11000;
