"use client";

import { useEffect, useRef, useState } from "react";
import { DOTS_MS, GUIDE_STOPS, HOLD_MS, TYPE_MS } from "@/lib/guide";

/**
 * The pixel guide (spec §4.5).
 *
 * A cursor that walks the page section by section, pausing to say something.
 * Replaces the Figma multiplayer cursors: same idea, redrawn in the system.
 *
 * Everything is quantised on both axes (§5.4). Movement steps at one frame
 * per step and every landing position snaps to the 4px grid, so the cursor
 * never comes to rest on 37.5px.
 *
 * Suppressed entirely under prefers-reduced-motion, and on touch, where there
 * is no cursor to be a metaphor for and the bubble would just cover content.
 */

/** 8×8 cursor map. Sharp kite with a white outline so it reads on any surface. */
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

export default function PixelGuide() {
  const [stop, setStop] = useState(-1);
  const [typed, setTyped] = useState("");
  const [dots, setDots] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduced || touch) return;

    // Dev-only guard: the old version read data-guide attributes and simply
    // vanished when the markup changed. Fail loudly instead.
    if (process.env.NODE_ENV !== "production") {
      const missing = GUIDE_STOPS.filter(
        (s) => !document.querySelector(`[data-guide-id="${s.id}"]`),
      ).map((s) => s.id);
      if (missing.length) {
        console.warn(
          `[PixelGuide] no element for data-guide-id: ${missing.join(", ")}. ` +
            `The tour will skip these stops.`,
        );
      }
    }

    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const wait = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    let cancelled = false;

    const run = (i: number) => {
      if (cancelled || i >= GUIDE_STOPS.length) {
        setStop(-1);
        setPos(null);
        return;
      }

      const s = GUIDE_STOPS[i];
      const el = document.querySelector(`[data-guide-id="${s.id}"]`);
      if (!el) return run(i + 1);

      const r = el.getBoundingClientRect();

      /* Anchor to the right of the reading column rather than on top of it.
         A guide that covers the copy it is describing is worse than no guide;
         the text column is capped at 720px, so past that there is margin to
         sit in. Below that width the tour is suppressed anyway (touch), but
         clamp regardless so it can never leave the viewport. */
      const BUBBLE_W = 300;
      const preferred = r.left + Math.min(r.width * 0.62, 760);
      const rawX = Math.min(preferred, window.innerWidth - BUBBLE_W - 24);
      const rawY = Math.min(Math.max(r.top + 40, 96), window.innerHeight - 180);

      // Both axes snap to the 4px grid: stepping the timing but landing on
      // 37.5px still reads wrong (§5.4).
      const x = Math.round(Math.max(rawX, 24) / GRID) * GRID;
      const y = Math.round(rawY / GRID) * GRID;

      setPos({ x, y });
      setStop(i);
      setTyped("");
      setDots(true);

      // Think, then type, then hold, then move on.
      wait(DOTS_MS, () => {
        if (cancelled) return;
        setDots(false);
        let c = 0;
        const tick = () => {
          if (cancelled) return;
          c += 1;
          setTyped(s.message.slice(0, c));
          if (c < s.message.length) wait(TYPE_MS, tick);
          else wait(HOLD_MS, () => run(i + 1));
        };
        tick();
      });
    };

    // Let the page settle before the tour starts.
    wait(1200, () => run(0));

    // Any real interaction ends it — the guide should never be in the way.
    const stopTour = () => {
      cancelled = true;
      clear();
      setStop(-1);
      setPos(null);
    };
    window.addEventListener("pointerdown", stopTour, { once: true });
    window.addEventListener("wheel", stopTour, { once: true, passive: true });

    return () => {
      cancelled = true;
      clear();
      window.removeEventListener("pointerdown", stopTour);
      window.removeEventListener("wheel", stopTour);
    };
  }, []);

  if (stop < 0 || !pos) return null;

  return (
    <div
      className="guide-cursor"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden="true"
    >
      <div className="flex items-start gap-8">
        {/* cursor sprite */}
        <svg width={16} height={16} viewBox="0 0 8 8" shapeRendering="crispEdges" className="shrink-0">
          {CURSOR.flatMap((row, y) =>
            [...row].map((ch, x) =>
              ch === "." ? null : (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  fill={ch === "X" ? "#14140F" : "#FFFFFF"}
                />
              ),
            ),
          )}
        </svg>

        <div style={{ animation: "guideIn calc(var(--f) * 4) steps(4, end) both" }}>
          <div className="guide-bubble">
            <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-ink/60">
              Shareef
            </p>
            {dots ? (
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
      </div>
    </div>
  );
}
