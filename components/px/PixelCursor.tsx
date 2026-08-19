"use client";

import { useEffect, useRef } from "react";
import { CursorSprite } from "@/components/px/PixelGuide";

/**
 * The reader's own cursor, drawn in the system's pixel language so that the
 * guide's cursor has something to be a peer of. Two cursors on one page only
 * reads as "someone else is here" if both are drawn the same way.
 *
 * Site-wide, like the version this replaces.
 *
 * Position is written straight to style.transform inside a rAF loop. No React
 * state: a cursor that re-renders a component on every mousemove is a cursor
 * that stutters. Per prior findings on this repo, spring/motion libraries were
 * unreliable here in production — a raw loop is the thing that works.
 *
 * It follows the pointer exactly, with no lag or smoothing, because it IS the
 * pointer — lag on your own cursor reads as the page being broken. Only the
 * landing position is quantised to the 4px grid (§5.4), which is what makes it
 * feel like part of this system rather than a sticker on top of it.
 *
 * `cursor: none` is injected from here rather than living in globals.css, so
 * the native cursor is only ever hidden while this component is actually
 * mounted and painting. If it fails to render, the real cursor comes back.
 */

const GRID = 4;

export default function PixelCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No hover means no pointer to mirror. Reduced motion keeps the native
    // cursor too: a substituted cursor is a moving thing you cannot opt out of.
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reduced) return;

    document.documentElement.classList.add("has-px-cursor");

    const p = { x: -100, y: -100 };
    let raf = 0;
    let dirty = false;

    const onMove = (e: PointerEvent) => {
      p.x = Math.round(e.clientX / GRID) * GRID;
      p.y = Math.round(e.clientY / GRID) * GRID;
      dirty = true;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!dirty) return;
      dirty = false;
      const node = ref.current;
      if (node) node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-px-cursor");
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="px-cursor" aria-hidden="true">
      <CursorSprite fill="#FFFFFF" />
    </div>
  );
}
