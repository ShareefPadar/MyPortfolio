"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isHover = !!target.closest("a, button, [role='button']");
      if (isHover !== hoveredRef.current) {
        hoveredRef.current = isHover;
        setHovered(isHover);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) and (min-width: 768px) {
          *, *::before, *::after { cursor: none !important; }
          input, textarea, select, [contenteditable="true"] { cursor: text !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ willChange: "transform", marginLeft: -4, marginTop: -4 }}
      >
        <div
          className="w-2 h-2 rounded-full bg-neutral-500 transition-transform duration-150"
          style={{ transform: hovered ? "scale(0)" : "scale(1)" }}
        />
      </div>

      <div
        aria-hidden="true"
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ willChange: "transform", marginLeft: -24, marginTop: -24 }}
      >
        <div
          className="w-12 h-12 rounded-full border-2 border-neutral-400 transition-all duration-200"
          style={{
            transform: hovered ? "scale(1.6)" : "scale(1)",
            backgroundColor: hovered ? "rgba(163,163,163,0.12)" : "transparent",
            borderColor: hovered ? "transparent" : undefined,
          }}
        />
      </div>
    </>
  );
}
