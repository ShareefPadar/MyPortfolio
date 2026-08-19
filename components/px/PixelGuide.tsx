"use client";

import { useEffect, useRef, useState } from "react";
import { DOTS_MS, GUIDE_STOPS, HOLD_MS, TYPE_MS } from "@/lib/guide";

/**
 * The pixel guide (spec §4.5) — Shareef's cursor.
 *
 * A second cursor that lives on the page alongside yours. It wanders while
 * you read, and when you scroll a new section into view it comes over and
 * says what that section is.
 *
 * SCROLL-DRIVEN, not a timed tour. The previous version ran a fixed sequence
 * from the top and treated the first wheel event as "dismiss", so it said its
 * piece over the hero and then vanished the moment you scrolled — which is
 * exactly when the rest of it should have been happening. Scrolling is now
 * the input that drives it, and nothing dismisses it.
 *
 * Movement is stepped, never eased. The original glided with an rAF lerp;
 * here it hops in whole 4px units on a 60ms frame, so it lands on grid
 * positions instead of sliding between them (constraint #4, §5.4). Same
 * wandering behaviour, drawn the way this system draws motion.
 *
 * Suppressed under prefers-reduced-motion, and on touch, where there is no
 * cursor for it to be a metaphor for and the bubble would just cover content.
 */

/** 8x8 cursor map. X = ink outline, O = fill. */
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

const GRID = 4; // every landing position snaps to this
const FRAME = 60; // ms per movement step — one --f frame
const ROAM_STEP = 12; // max px per frame while wandering
const CHASE_STEP = 44; // max px per frame while going to talk
const BUBBLE_W = 300;

export function CursorSprite({ fill, size = 16 }: { fill: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      className="shrink-0"
      aria-hidden="true"
    >
      {CURSOR.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={ch === "X" ? "#14140F" : fill}
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

type Phase = "idle" | "dots" | "typing" | "hold";

export default function PixelGuide() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [live, setLive] = useState(false); // has it entered the page yet

  const elRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -80, y: -80 });
  const target = useRef({ x: 0, y: 0 });
  const talking = useRef(false);
  const activeEl = useRef<Element | null>(null);
  const repickAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduced || touch) return;

    // Dev-only guard: this used to read data attributes and simply vanish when
    // the markup changed. Fail loudly instead.
    if (process.env.NODE_ENV !== "production") {
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

    const stops = GUIDE_STOPS.map((s) => ({
      ...s,
      el: document.querySelector(`[data-guide-id="${s.id}"]`),
    })).filter((s): s is typeof s & { el: Element } => Boolean(s.el));

    if (!stops.length) return;

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

    // ── which section is the reader actually looking at ──────────────
    const seen = new Set<string>();

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
      setLive(true);
      const stop = stops.find((s) => s.el === best);
      // Each line lands once. Re-reading a section should not re-lecture.
      if (stop && !seen.has(stop.id)) {
        seen.add(stop.id);
        openBubble(stop.message);
      }
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

    const aimAtActive = () => {
      const el = activeEl.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      /* Anchor to the right of the reading column rather than on top of it.
         A guide that covers the copy it is describing is worse than no guide.
         Recomputed every frame, so it tracks the section as you keep
         scrolling instead of pinning to where it first appeared. */
      const preferred = r.left + Math.min(r.width * 0.62, 760);
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

      const node = elRef.current;
      if (node) {
        node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
    };

    // Start off-screen and let it walk in.
    pos.current = { x: snap(window.innerWidth * 0.5), y: -60 };
    pickRoam(performance.now());
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      clear();
      cancelAnimationFrame(raf);
    };
  }, []);

  const open = phase !== "idle";

  return (
    <div
      ref={elRef}
      className="guide-cursor"
      style={{ opacity: live ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="flex items-start gap-8">
        <CursorSprite fill="#CDF22B" />

        <div>
          {/* Name tag while quiet, bubble while talking — never both, so the
              cursor does not grow a second lime block beside the first. */}
          {open ? (
            <div style={{ animation: "guideIn calc(var(--f) * 4) steps(4, end) both" }}>
              <div className="guide-bubble">
                <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-ink/60">
                  Shareef
                </p>
                {phase === "dots" ? (
                  <div className="mt-8 flex gap-4">
                    <span className="guide-dot" />
                    <span className="guide-dot" />
                    <span className="guide-dot" />
                  </div>
                ) : (
                  <p className="mt-4 font-sans text-[13px] leading-[1.5] text-ink">{typed}</p>
                )}
              </div>
              <div className="guide-tail" />
            </div>
          ) : (
            <span className="guide-name">SHAREEF</span>
          )}
        </div>
      </div>
    </div>
  );
}
