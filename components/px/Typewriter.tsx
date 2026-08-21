"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Typewriter (spec §5.3). Silkscreen only.
 *
 * 45ms per character, hard-capped at 1.5s total — if the string is long enough
 * to exceed that, the interval shortens rather than the visitor waiting. This
 * is why Silkscreen is capped at five words: a case-study H1 is ~72 characters,
 * and typing that is three seconds before the title can be read. Sentence-length
 * headings scan instead (Reveal variant="head").
 *
 * The caret is a blue block that is REMOVED when the line completes, never left
 * blinking (§5.3).
 *
 * Never type body copy. Never type more than one element on screen at a time.
 */

const CHAR_MS = 45;
const MAX_MS = 1500;

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Wait this many ms after mount before starting. */
  delay?: number;
};

const Typewriter = ({ text, as: Tag = "span", className = "", delay = 0 }: Props) => {
  // Server render and no-JS get the full string: the animation is an
  // enhancement, never a precondition for reading the page.
  const [shown, setShown] = useState(text.length);
  const [done, setDone] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // already at final state

    const step = Math.min(CHAR_MS, MAX_MS / Math.max(text.length, 1));
    let i = 0;
    let tick: ReturnType<typeof setInterval>;

    setShown(0);
    setDone(false);

    const start = setTimeout(() => {
      tick = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= text.length) {
          clearInterval(tick);
          setDone(true);
        }
      }, step);
    }, delay);

    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
  }, [text, delay]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {/* The visible, animating copy is hidden from assistive tech; the
          accessible name on the wrapper carries the full string throughout. */}
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!done && (
          <span
            className="ml-[2px] inline-block h-[0.9em] w-[0.55em] translate-y-[0.08em] bg-blue align-baseline"
            style={{ animation: "caret .9s steps(1,end) infinite" }}
          />
        )}
      </span>
    </Tag>
  );
};

export default Typewriter;
