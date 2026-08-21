"use client";

import { useEffect, useRef } from "react";
import { CursorSprite, HAND_CURSOR } from "@/components/px/PixelGuide";

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
 *
 * Hover state (arrow / hand / hidden-for-disabled) is ALSO imperative, for
 * the same reason position is: `pointerover` fires on every element boundary
 * crossed, which on a page full of small interactive chips is often enough
 * to matter. Both glyphs are always in the DOM; only which one is visible
 * changes, via a ref, never a re-render.
 */

const GRID = 4;

/**
 * What gets a hand: real links, real buttons, and the native form controls —
 * i.e. what already means "you can activate this" without needing a label to
 * say so. `:not(:disabled)` is deliberate: a disabled control is excluded
 * here and handled by DISABLED_SELECTOR below instead, so it never shows a
 * hand promising an action it cannot perform.
 */
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  '[role="link"]',
  'input:not([type="hidden"]):not(:disabled)',
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "label[for]",
  "summary",
  '[tabindex="0"]',
].join(", ");

/**
 * The custom cursor hides itself entirely over these, rather than drawing
 * anything. globals.css keeps an explicit native `cursor: not-allowed` alive
 * for exactly this selector — spec requires it on the disabled state — so
 * hiding here is what stops the drawn arrow from sitting on top of it.
 */
const DISABLED_SELECTOR = ':disabled, [aria-disabled="true"]';

export default function PixelCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const handRef = useRef<HTMLSpanElement>(null);

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
      const node = rootRef.current;
      if (node) node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    };

    type Mode = "arrow" | "hand" | "hidden";
    let mode: Mode = "arrow";
    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      const root = rootRef.current;
      const arrow = arrowRef.current;
      const hand = handRef.current;
      if (!root || !arrow || !hand) return;
      root.style.opacity = mode === "hidden" ? "0" : "1";
      arrow.style.display = mode === "arrow" ? "block" : "none";
      hand.style.display = mode === "hand" ? "block" : "none";
    };

    // pointerover bubbles and fires on every element boundary the pointer
    // crosses, so reading e.target here covers hovering both a button and
    // whatever sits inside it (an icon, a span of label text) in one place.
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(DISABLED_SELECTOR)) setMode("hidden");
      else if (target.closest(INTERACTIVE_SELECTOR)) setMode("hand");
      else setMode("arrow");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-px-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="px-cursor" aria-hidden="true">
      <span ref={arrowRef} style={{ display: "block" }}>
        <CursorSprite fill="#FFFFFF" />
      </span>
      <span ref={handRef} style={{ display: "none" }}>
        <CursorSprite fill="#FFFFFF" glyph={HAND_CURSOR} />
      </span>
    </div>
  );
}
