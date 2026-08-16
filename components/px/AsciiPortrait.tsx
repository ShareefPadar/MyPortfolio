"use client";

import { useEffect, useRef } from "react";
import data from "./portrait.data.json";

/**
 * ASCII portrait (spec §9).
 *
 * Samples a source photo into a 46×38 grid whose brightness is quantised to
 * FOUR discrete levels. Four is the whole point: smooth interpolation turns
 * this into a blur effect rather than a dither.
 *
 * Rendered as rectangles on a canvas rather than block glyphs (░▒▓█). Google's
 * webfont subsets routinely omit box-drawing characters, so those cells would
 * fall back to a system mono with a different advance width and the grid would
 * shear. Rectangles are also more honestly on-grid: every cell is 8×12px, both
 * multiples of the 4px unit.
 *
 * Tones are surface-aware: see TONES below.
 *
 * Decorative: alt="" equivalent, aria-hidden.
 */

/**
 * Tone per level, per surface.
 *
 * The ramp has to run AWAY from the surface or the face disappears. On night
 * the mid levels must be lighter than the background — ink on night is
 * ink-on-ink and the whole mid-tone structure collapses into a blob of
 * highlights. On paper the same logic inverts: the levels darken.
 *
 * Lime carries the top of the ramp on night, where it picks out the lit edge.
 * It is NOT used on paper: #CDF22B against #FAFAF8 has almost no contrast, so
 * the densest cells — the ones doing the most work — would be the hardest to
 * see. Ink takes the top of the ramp there instead, and lime stays on the
 * elements around the portrait where it still reads.
 */
const LIME = "#CDF22B";

type Tone = { fill: string; alpha: number };

const TONES: Record<"night" | "paper", Record<number, Tone>> = {
  night: {
    1: { fill: "#9A9A94", alpha: 0.28 },
    2: { fill: "#E6E6E0", alpha: 0.55 },
    3: { fill: LIME, alpha: 1 },
  },
  paper: {
    1: { fill: "#14140F", alpha: 0.18 },
    2: { fill: "#14140F", alpha: 0.45 },
    3: { fill: "#14140F", alpha: 1 },
  },
};

/** Pointer proximity, in cells (spec §9). */
const RADIUS = 9;
const BOOST = 0.55;

const AsciiPortrait = ({
  className = "",
  surface = "paper",
}: {
  className?: string;
  /** Which background it sits on. The ramp runs away from the surface. */
  surface?: "night" | "paper";
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const TONE = TONES[surface];
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, cellW, cellH, grid } = data;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = cols * cellW * dpr;
    canvas.height = rows * cellH * dpr;
    canvas.style.width = `${cols * cellW}px`;
    canvas.style.height = `${rows * cellH}px`;
    ctx.scale(dpr, dpr);

    // Pointer position in cell coordinates. Off-grid until the pointer arrives.
    let px = -999;
    let py = -999;
    let raf = 0;
    let sweep = 0;

    const draw = () => {
      ctx.clearRect(0, 0, cols * cellW, rows * cellH);
      for (let r = 0; r < rows; r++) {
        const row = grid[r];
        for (let c = 0; c < cols; c++) {
          const base = row.charCodeAt(c) - 48; // '0'..'3'
          if (base <= 0 && px < -100) continue;

          // Proximity boost, still quantised: the level steps, it never fades.
          let level = base;
          const d = Math.hypot(c - px, r - py);
          if (d < RADIUS) {
            level = Math.min(3, Math.round(base + (1 - d / RADIUS) * BOOST * 3));
          }
          if (level <= 0) continue;

          const tone = TONE[level];
          ctx.fillStyle = tone.fill;
          ctx.globalAlpha = tone.alpha;
          ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
        }
      }
      ctx.globalAlpha = 1;
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * cols;
      py = ((e.clientY - rect.top) / rect.height) * rows;
      schedule();
    };
    const onLeave = () => {
      px = -999;
      py = -999;
      schedule();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;

    if (!reduced && touch) {
      // No pointer to follow, so sweep the boost across the grid instead.
      sweep = window.setInterval(() => {
        px = (px + 3) % (cols + RADIUS * 2) - RADIUS;
        py = rows * 0.42;
        schedule();
      }, 130);
    } else if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (sweep) clearInterval(sweep);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [surface]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pixelated block ${className}`}
    />
  );
};

export default AsciiPortrait;
