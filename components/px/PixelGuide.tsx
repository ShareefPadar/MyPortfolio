"use client";

import { useEffect, useRef, useState } from "react";
import {
  COMEBACK,
  DOTS_MS,
  GUIDE_STOPS,
  HIDE_MS,
  HOLD_MS,
  NAG_MS,
  NAGS,
  TYPE_MS,
} from "@/lib/guide";

/**
 * The pixel guide (spec §4.5) — Clippy, drawn in this site's own system.
 *
 * A second cursor that lives on the page alongside yours. It wanders while you
 * read, and interrupts whether or not you asked it to.
 *
 * This is the hand-drawn version. It was briefly replaced by clippyjs, which
 * carries the original Office Agent artwork and all 43 of Clippy's real
 * animations — more faithful to the nostalgia, but a 1990s 3D render sitting
 * on top of a flat 8-bit site, and 1.8MB of sprite sheet with it. Reverted on
 * purpose: the whole site is Silkscreen, 6x6 sprite maps and stepped motion,
 * and the guide should be drawn the way everything else here is drawn.
 *
 * SCROLL-DRIVEN, not a timed tour. Scrolling is the input, plus a nag timer
 * that fires regardless. Nothing dismisses it permanently.
 *
 * Movement is stepped, never eased — 4px hops on a 60ms frame, so it lands on
 * grid positions instead of sliding between them (constraint #4, §5.4).
 *
 * Suppressed under prefers-reduced-motion, and on touch, where there is no
 * cursor for it to be a metaphor for and the bubble would just cover content.
 */

/** 8x8 cursor map. X = ink outline, O = fill. The default pointer glyph. */
const CURSOR = [
  "X.......",
  "XX......",
  "XOX.....",
  "XOOX....",
  "XOOOX...",
  "XOOOOX..",
  "XOOXXXX.",
  "XXX.XOX.",
];

/**
 * 10x12. A raised index finger over a fist, hotspot at the fingertip (0,0) —
 * same convention as CURSOR, so swapping glyphs never shifts what the
 * cursor is actually pointing at.
 */
export const HAND_CURSOR = [
  ".....XX...",
  "....XOOX..",
  "....XOOX..",
  "....XOOX..",
  "....XOOXXX",
  ".XX.XOOOOX",
  "XOOXOOOOOX",
  "XOOOOOOOOX",
  ".XOOOOOOOX",
  ".XOOOOOOX.",
  "..XOOOOX..",
  "...XXXX...",
];

/**
 * 20x29. Clippy. X = ink wire, W = eye white, and no O at all — a paperclip is
 * a WIRE, so the body is outline with nothing filled in. An earlier draft
 * filled the interior with lime and read as a solid totem.
 *
 * LOPSIDED on purpose: the right eye sits three rows below the left, and the
 * brows follow it down. A symmetric version reads as a robot face on a rounded
 * rectangle — that asymmetry is most of what makes the real Clippy read as
 * him. Redrawing the whole body around the offset made it muddy; moving one
 * eye on the working symmetric base did not.
 *
 * NOT the default glyph, deliberately: PixelCursor imports CursorSprite for
 * the reader's actual mouse pointer, so changing CURSOR would turn everyone's
 * cursor into a paperclip.
 */
export const CLIPPY = [
  "XXX.................",
  ".XXX................",
  "..XXX...............",
  ".................XXX",
  "..XXXX..........XXX.",
  ".XWWWWX.XXXXX..XXX..",
  "XWWWWWWX.....X......",
  "XWWXXWWX......XXXX..",
  "XWWXXWWXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWWWWWX",
  ".XWWWWX.X..XXWWXXWWX",
  "..XXXX..X..XXWWXXWWX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

/**
 * Blink frame. Keeps each eye's round outline and closes a lid inside it,
 * rather than replacing the eye with a bare lash line — these eyes overhang
 * the body silhouette, so a flat bar out there reads as a whisker, not a
 * shut eye.
 */
export const CLIPPY_BLINK = [
  "XXX.................",
  ".XXX................",
  "..XXX...............",
  ".................XXX",
  "..XXXX..........XXX.",
  ".XWWWWX.XXXXX..XXX..",
  "XWWWWWWX.....X......",
  "XXXXXXXX......XXXX..",
  "XWWWWWWXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWWWWWX",
  ".XWWWWX.X..XXXXXXXXX",
  "..XXXX..X..XXWWWWWWX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

/** Pupils left. Paired with RIGHT to make him glance around the page. */
export const CLIPPY_LEFT = [
  "XXX.................",
  ".XXX................",
  "..XXX...............",
  ".................XXX",
  "..XXXX..........XXX.",
  ".XWWWWX.XXXXX..XXX..",
  "XWWWWWWX.....X......",
  "XXXWWWWX......XXXX..",
  "XXXWWWWXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWWWWWX",
  ".XWWWWX.X..XXXXWWWWX",
  "..XXXX..X..XXXXWWWWX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

/** Pupils right. */
export const CLIPPY_RIGHT = [
  "XXX.................",
  ".XXX................",
  "..XXX...............",
  ".................XXX",
  "..XXXX..........XXX.",
  ".XWWWWX.XXXXX..XXX..",
  "XWWWWWWX.....X......",
  "XWWWWXXX......XXXX..",
  "XWWWWXXXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWWWWWX",
  ".XWWWWX.X..XXWWWWXXX",
  "..XXXX..X..XXWWWWXXX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

/** Pupils up — reads as thinking, and as looking at his own bubble. */
export const CLIPPY_UP = [
  "XXX.................",
  ".XXX................",
  "..XXX...............",
  ".................XXX",
  "..XXXX..........XXX.",
  ".XWWWWX.XXXXX..XXX..",
  "XWWXXWWX.....X......",
  "XWWXXWWX......XXXX..",
  "XWWWWWWXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWXXWWX",
  ".XWWWWX.X..XXWWXXWWX",
  "..XXXX..X..XXWWWWWWX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

/** Brows dropped two rows. Doing the work of a mouth he does not have. */
export const CLIPPY_BROW = [
  "....................",
  "....................",
  "XXX.................",
  ".XXX................",
  "..XXXX..............",
  ".XWWWWX.XXXXX....XXX",
  "XWWWWWWX.....X..XXX.",
  "XWWXXWWX......XXXX..",
  "XWWXXWWXX..X.XWWWWX.",
  "XWWWWWWXX..XXWWWWWWX",
  ".XWWWWX.X..XXWWXXWWX",
  "..XXXX..X..XXWWXXWWX",
  ".....X..X..XXWWWWWWX",
  ".....X..X..X.XWWWWX.",
  ".....X..X..X..XXXX..",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X..X..X..X.....",
  ".....X...XX...X.....",
  ".....X........X.....",
  "......X......X......",
  ".......XXXXXX.......",
];

const GRID = 4; // every landing position snaps to this
const FRAME = 60; // ms per movement step — one --f frame
const ROAM_STEP = 12; // max px per frame while wandering
const CHASE_STEP = 44; // max px per frame while going to talk
const BUBBLE_W = 300;

export function CursorSprite({
  fill,
  size = 16,
  glyph = CURSOR,
}: {
  fill: string;
  size?: number;
  glyph?: string[];
}) {
  const w = glyph[0].length;
  const h = glyph.length;
  return (
    <svg
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className="shrink-0"
      aria-hidden="true"
    >
      {glyph.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={ch === "X" ? "#14140F" : ch === "W" ? "#F0EFF4" : fill}
            />
          ),
        ),
      )}
    </svg>
  );
}

const snap = (n: number) => Math.round(n / GRID) * GRID;

/**
 * One movement frame on one axis. The distance covered is proportional, but
 * it is quantised to whole grid units before it is applied, so the cursor
 * only ever occupies multiples of 4px.
 */
function stepAxis(cur: number, tgt: number, max: number) {
  const d = tgt - cur;
  if (Math.abs(d) <= GRID) return tgt;
  const raw = Math.min(Math.abs(d) * 0.24, max);
  const s = Math.max(GRID, snap(raw));
  return cur + Math.sign(d) * s;
}

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

/** One held frame: the glyph, and how long it stays up. */
type Step = [string[], number];

/**
 * The idle vocabulary. Two frames is a blink; this is a character.
 *
 * Modelled on the real agent's animation set, which is where Clippy's whole
 * personality lived — he had a dozen idle loops and ran one whenever you left
 * him alone. These are the cheapest few that carry the most: eyes that track
 * around the page, a double-take, and brows doing the work of the mouth he
 * has never had.
 *
 * Durations are uneven on purpose. Evenly spaced frames read as a mechanism;
 * a held beat before a return reads as a decision.
 */
const ANIM: Record<string, Step[]> = {
  blink: [[CLIPPY_BLINK, 130]],
  // A glance across the page and back, pausing at each end.
  glance: [
    [CLIPPY_LEFT, 420],
    [CLIPPY, 180],
    [CLIPPY_RIGHT, 420],
  ],
  // Looks up at his own speech bubble, then back at you.
  ponder: [
    [CLIPPY_UP, 460],
    [CLIPPY_BROW, 260],
  ],
  // Double-take: blink, snap aside, back.
  startle: [
    [CLIPPY_BLINK, 90],
    [CLIPPY_RIGHT, 150],
    [CLIPPY_BLINK, 90],
  ],
  // Played on a loop while the bubble is open, so he is animated while
  // "speaking" rather than a still image with text beside it.
  talk: [
    [CLIPPY_BROW, 220],
    [CLIPPY, 200],
    [CLIPPY_UP, 240],
    [CLIPPY, 180],
  ],
};

const IDLE_ANIMS = [ANIM.blink, ANIM.glance, ANIM.ponder, ANIM.startle];

type Phase = "idle" | "dots" | "typing" | "hold";

export default function PixelGuide() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [live, setLive] = useState(false); // has it entered the page yet
  const [frame, setFrame] = useState<string[]>(CLIPPY);

  const elRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -80, y: -80 });
  const target = useRef({ x: 0, y: 0 });
  const talking = useRef(false);
  const activeEl = useRef<Element | null>(null);
  const repickAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  /* Dismissal is a lie, so it needs two pieces of state: `gone` hides him,
     `hidden` stops the loops talking to an invisible sprite. He always comes
     back — in Office, Hide only lasted until the next time anything wanted
     your attention. */
  const [gone, setGone] = useState(false);
  const hidden = useRef(false);
  const comeback = useRef<(() => void) | null>(null);

  /* The animation player. Steps a named sequence frame by frame, then falls
     back to the resting glyph and asks for the next one.

     Timeout-driven rather than rAF: these are held frames at 100–500ms, not
     per-frame interpolation, and stepped animation is the site's whole motion
     language (§5.4). Nothing here eases.

     Reads `talking` live inside the loop rather than depending on it, so the
     effect never re-runs and restarts a sequence mid-blink. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;

    const play = (seq: Step[], done: () => void) => {
      let i = 0;
      const next = () => {
        if (cancelled) return;
        if (i >= seq.length) {
          setFrame(CLIPPY); // always return to rest between sequences
          done();
          return;
        }
        const [glyph, ms] = seq[i++];
        setFrame(glyph);
        t = setTimeout(next, ms);
      };
      next();
    };

    const loop = () => {
      if (cancelled) return;
      /* Mid-sentence he loops the talk cycle almost continuously; idle, he
         fidgets every few seconds. The gap is what separates "alive" from
         "twitching". */
      const gap = talking.current ? 120 : 2200 + Math.random() * 3600;
      t = setTimeout(() => {
        if (cancelled) return;
        play(talking.current ? ANIM.talk : pick(IDLE_ANIMS), loop);
      }, gap);
    };

    loop();
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduced || touch) return;

    const stops = GUIDE_STOPS.map((s) => ({
      ...s,
      el: document.querySelector(`[data-guide-id="${s.id}"]`),
    })).filter((s): s is typeof s & { el: Element } => Boolean(s.el));

    // Dev-only guard: this used to read data attributes and simply vanish when
    // the markup changed. Fail loudly instead — but only on a page that has
    // some anchors, since he is mounted site-wide and most routes carry none.
    if (process.env.NODE_ENV !== "production" && stops.length) {
      const missing = GUIDE_STOPS.filter(
        (s) => !document.querySelector(`[data-guide-id="${s.id}"]`),
      ).map((s) => s.id);
      if (missing.length) {
        console.warn(
          `[PixelGuide] no element for data-guide-id: ${missing.join(", ")}. ` +
            `Those stops will never fire.`,
        );
      }
    }

    /* No early return when a page has no stops. He is mounted site-wide, and
       on a page with nothing to narrate he still roams and still interrupts —
       which is the point. Only the scroll-triggered lines need anchors. */

    let cancelled = false;
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    /* Think, then type, then hold, then go back to wandering. Every step is a
       scheduled timeout rather than a chain of state effects, so a fast
       scroll through several sections cannot leave two sequences interleaved:
       the next openBubble clears the previous one outright. */
    const openBubble = (msg: string) => {
      clear();
      talking.current = true;
      setTyped("");
      setPhase("dots");

      push(() => {
        if (cancelled) return;
        setPhase("typing");
        for (let i = 1; i <= msg.length; i++) {
          push(() => setTyped(msg.slice(0, i)), i * TYPE_MS);
        }
        const typeEnd = msg.length * TYPE_MS;
        push(() => setPhase("hold"), typeEnd);
        push(() => {
          setPhase("idle");
          talking.current = false;
          repickAt.current = 0; // wander off immediately
        }, typeEnd + HOLD_MS);
      }, DOTS_MS);
    };

    /* Unprompted interruption on a timer. This is the Clippy behaviour proper:
       he does not wait to be asked, and he does not wait for you to do
       anything. Skipped only while he is already mid-sentence or hidden. */
    const nag = setInterval(() => {
      if (talking.current || hidden.current) return;
      setLive(true);
      openBubble(pick(NAGS));
    }, NAG_MS);

    // ── which section is the reader actually looking at ──────────────

    /* Resolved by geometry, NOT by intersection ratio. The NDA notice is 161px
       and the section under it is 550px, so scrolling to the latter leaves
       both sitting at ratio 1.0 — ratio cannot separate them, and the tie goes
       to whichever was observed first, which pins the guide on the wrong one.
       Nearest-centre-to-viewport-centre is what "the thing you are looking at"
       actually means, and it behaves the same for a small block and a tall
       one. */
    const resolveActive = () => {
      const mid = window.innerHeight / 2;
      let best: Element | null = null;
      let bestDist = Infinity;
      for (const s of stops) {
        const r = s.el.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) continue; // off-screen
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = s.el;
        }
      }
      if (!best || best === activeEl.current) return;

      activeEl.current = best;
      if (hidden.current) return;
      setLive(true);
      const stop = stops.find((s) => s.el === best);
      /* No `seen` set any more. The old build fired each line once, on the
         reasoning that re-reading a section should not re-lecture — which is
         correct design and exactly the opposite of what Clippy did. He had no
         memory that you had already been told. Scroll back up, get told
         again. */
      if (stop) openBubble(stop.message);
    };

    // ── movement ─────────────────────────────────────────────────────
    let raf = 0;
    let last = 0;

    const pickRoam = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Stay where a bubble would still fit, so it never has to teleport.
      target.current.x = snap(24 + Math.random() * Math.max(80, w - BUBBLE_W - 48));
      target.current.y = snap(96 + Math.random() * Math.max(80, h - 280));
      repickAt.current = now + 1300 + Math.random() * 1700;
    };

    /** Keep him somewhere the bubble actually fits on screen. */
    const clampIntoView = () => {
      target.current.x = snap(
        Math.max(24, Math.min(pos.current.x, window.innerWidth - BUBBLE_W - 24)),
      );
      target.current.y = snap(
        Math.min(Math.max(pos.current.y, 96), window.innerHeight - 220),
      );
    };

    const aimAtActive = () => {
      const el = activeEl.current;
      /* No section to point at — either the page has no anchors, or he is
         still walking in from off-screen. Either way he may be talking, and a
         speech bubble clipped off the top of the viewport reads as broken
         rather than as charming, so pull him somewhere it fits. */
      if (!el) {
        clampIntoView();
        return;
      }
      const r = el.getBoundingClientRect();
      /* Sits ON the reading column, not beside it. The previous build
         deliberately anchored to the right so it never covered the copy it was
         describing — the single most defensible line in this component. Clippy
         did the opposite: he was a floating window over your document, and
         that is most of why he is remembered. He still never eats a click
         (pointer-events stays off everywhere except his own sprite), so the
         page underneath keeps working while he sits on top of it. */
      const preferred = r.left + Math.min(r.width * 0.3, 420);
      target.current.x = snap(
        Math.max(24, Math.min(preferred, window.innerWidth - BUBBLE_W - 24)),
      );
      target.current.y = snap(
        Math.min(Math.max(r.top + 40, 96), window.innerHeight - 220),
      );
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME) return; // hold the 60ms frame
      last = now;

      // Four rect reads per frame, batched before any writes. Cheap, and it
      // means the guide tracks a scroll continuously instead of only at the
      // moments an observer happens to cross a threshold.
      resolveActive();

      if (talking.current) aimAtActive();
      else if (now >= repickAt.current) pickRoam(now);

      const max = talking.current ? CHASE_STEP : ROAM_STEP;
      pos.current.x = stepAxis(pos.current.x, target.current.x, max);
      pos.current.y = stepAxis(pos.current.y, target.current.y, max);

      /* Clamp the POSITION, not just the target, while a bubble is open.
         Clamping the target alone still let him talk during the walk-in from
         y = -60, with the balloon cut off above the viewport — which reads as
         broken rather than as charming. He snaps into view the moment he
         opens his mouth, which is roughly how Clippy materialised anyway. */
      if (talking.current) {
        pos.current.y = Math.min(
          Math.max(pos.current.y, 96),
          Math.max(96, window.innerHeight - 220),
        );
        pos.current.x = Math.max(
          24,
          Math.min(pos.current.x, window.innerWidth - BUBBLE_W - 24),
        );
      }

      const node = elRef.current;
      if (node) {
        node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
    };

    /* Dismissal, Office-style: it works, briefly, and then it doesn't. Wired
       through a ref so the click handler in the JSX can reach into this
       effect's closure without re-running it. */
    comeback.current = () => {
      clear();
      talking.current = false;
      hidden.current = true;
      setGone(true);
      setPhase("idle");
      push(() => {
        if (cancelled) return;
        hidden.current = false;
        setGone(false);
        openBubble(pick(COMEBACK));
      }, HIDE_MS);
    };

    // Start off-screen and let it walk in.
    pos.current = { x: snap(window.innerWidth * 0.5), y: -60 };
    pickRoam(performance.now());
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      clear();
      clearInterval(nag);
      cancelAnimationFrame(raf);
    };
  }, []);

  const open = phase !== "idle";

  return (
    <div
      ref={elRef}
      className="guide-cursor"
      style={{ opacity: live && !gone ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="flex items-start gap-8">
        {/* The only part of the guide that takes a pointer event. Everything
            else stays click-through, so he can sit on top of the copy without
            stealing a single click from the page underneath. */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => comeback.current?.()}
          /* Only clickable while he is actually visible. Under reduced motion
             the whole guide never goes live, and an invisible-but-clickable
             40px target sitting over the page is a real bug, not a quirk. */
          className={`block shrink-0 bg-transparent p-0 ${
            live && !gone ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden="true"
        >
          <CursorSprite fill="#CDF22B" size={40} glyph={frame} />
        </button>

        <div>
          {/* Name tag while quiet, bubble while talking — never both, so the
              cursor does not grow a second lime block beside the first. */}
          {open ? (
            <div style={{ animation: "guideIn calc(var(--f) * 4) steps(4, end) both" }}>
              <div className="guide-bubble">
                <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-ink/60">
                  Clippy
                </p>
                {phase === "dots" ? (
                  <div className="mt-8 flex gap-4">
                    <span className="guide-dot" />
                    <span className="guide-dot" />
                    <span className="guide-dot" />
                  </div>
                ) : (
                  <p className="mt-4 font-sans text-[14px] leading-[1.5] text-ink">{typed}</p>
                )}
              </div>
              <div className="guide-tail" />
            </div>
          ) : (
            <span className="guide-name">CLIPPY</span>
          )}
        </div>
      </div>
    </div>
  );
}
