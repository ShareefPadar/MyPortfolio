"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal (spec §5.2).
 *
 * One small client component that does nothing but add a class. Everything it
 * wraps stays a server component — the children are rendered on the server and
 * passed through untouched.
 *
 * Fires once and then unobserves. Reveals must never re-trigger on scroll back
 * up (§12 mistake #12).
 *
 * Replaces ScrollReveal, RevealText, ParallaxSection and PageTransition. There
 * is no parallax and no page transition in this system: both interpolate
 * continuously, which hard constraint #4 forbids.
 */

type Variant =
  /** containers, cards, screenshots: 6-frame scanline, whole object */
  | "scan"
  /** Geist headings: faster 4-frame scanline */
  | "head"
  /** body copy and mono labels: binary, staggered one frame apart */
  | "on"
  /** numerals: 4-frame pop with a single overshoot frame */
  | "pop";

const CLASS: Record<Variant, string> = {
  scan: "reveal",
  head: "reveal reveal-head",
  on: "reveal reveal-on",
  pop: "reveal reveal-pop",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  as?: ElementType;
  className?: string;
};

const Reveal = ({ children, variant = "scan", as: Tag = "div", className = "" }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or already in view at load): show immediately
    // rather than leaving content hidden.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target); // fire once, never again
        }
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${CLASS[variant]} ${className}`.trim()}>
      {children}
    </Tag>
  );
};

export default Reveal;
