"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PINK = "#E21D70";
const BLACK = "#1a1a1a";
const BUBBLE_MS = 5200; // how long a bubble stays before auto-dismiss

// The multiplayer arrow, tilted like Figma's cursor.
function Arrow({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: "block" }}>
      <path
        d="M5 3.5 L5 20.5 L9.6 16 L12.5 22.5 L15.2 21.3 L12.3 15 L18.5 15 Z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FigmaCursors() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  // The message currently shown by Shareef (null = hidden)
  const [bubble, setBubble] = useState<string | null>(null);
  // Whether this route has anything to guide (hides Shareef otherwise)
  const [guiding, setGuiding] = useState(false);

  // refs for the two cursors + bubble container (imperative for 60fps)
  const youRef = useRef<HTMLDivElement>(null);
  const shareefRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const shareef = useRef({ x: -100, y: -100 });
  const target = useRef({ x: 0, y: 0 });
  const activeEl = useRef<HTMLElement | null>(null);
  const shown = useRef<Set<string>>(new Set());
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Discover guide stops + observe which one is most in view.
  useEffect(() => {
    // wait a tick for the new route's DOM
    const t = setTimeout(() => {
      const stops = Array.from(
        document.querySelectorAll<HTMLElement>("[data-guide]")
      );
      if (stops.length === 0) {
        setGuiding(false);
        activeEl.current = null;
        return;
      }

      const ratios = new Map<HTMLElement, number>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            ratios.set(e.target as HTMLElement, e.isIntersecting ? e.intersectionRatio : 0);
          }
          // pick the most-visible stop as active
          let best: HTMLElement | null = null;
          let bestR = 0.15; // require a minimum presence
          ratios.forEach((r, el) => {
            if (r > bestR) {
              bestR = r;
              best = el;
            }
          });
          if (best) setGuiding(true);
          if (best && best !== activeEl.current) {
            activeEl.current = best;
            const msg = (best as HTMLElement).getAttribute("data-guide") || "";
            const id = msg.slice(0, 24);
            if (!shown.current.has(id)) {
              shown.current.add(id);
              showBubble(msg);
            }
          }
        },
        { threshold: [0, 0.15, 0.35, 0.6, 0.85] }
      );
      stops.forEach((s) => io.observe(s));
      cleanup.current = () => io.disconnect();
    }, 120);

    return () => {
      clearTimeout(t);
      cleanup.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const cleanup = useRef<(() => void) | null>(null);

  const showBubble = (msg: string) => {
    setBubble(msg);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), BUBBLE_MS);
  };

  // Cursor motion loop (desktop only).
  useEffect(() => {
    if (!isDesktop) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // You cursor — tracks the real pointer exactly
      if (youRef.current) {
        youRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }

      // Shareef target — a point near the active section, clamped to the viewport
      const el = activeEl.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const tx = Math.min(Math.max(r.left + 56, 90), window.innerWidth - 90);
        const ty = Math.min(Math.max(r.top + 90, 130), window.innerHeight - 150);
        // subtle idle drift so it feels alive/robotic
        const now = performance.now() / 1000;
        target.current.x = tx + Math.sin(now * 1.1) * 6;
        target.current.y = ty + Math.cos(now * 0.9) * 5;
      }
      shareef.current.x = lerp(shareef.current.x, target.current.x, 0.055);
      shareef.current.y = lerp(shareef.current.y, target.current.y, 0.055);
      if (shareefRef.current) {
        shareefRef.current.style.transform = `translate(${shareef.current.x}px, ${shareef.current.y}px)`;
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [isDesktop]);

  // ---- MOBILE: no cursors, just the auto-tour bubble pinned bottom-center ----
  if (!isDesktop) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9998] flex justify-center px-4">
        <div
          className={`flex max-w-sm items-start gap-2.5 rounded-2xl rounded-bl-sm px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 ${
            bubble ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
          style={{ backgroundColor: PINK }}
        >
          <span className="mt-0.5 shrink-0 text-[11px] font-bold uppercase tracking-wide opacity-80">
            Shareef
          </span>
          <span className="leading-snug">{bubble}</span>
        </div>
      </div>
    );
  }

  // ---- DESKTOP: hide native cursor, render both cursors + Shareef's bubble ----
  return (
    <>
      <style>{`
        @media (pointer: fine) and (min-width: 768px) {
          *, *::before, *::after { cursor: none !important; }
          input, textarea, select, [contenteditable="true"] { cursor: text !important; }
        }
      `}</style>

      {/* Shareef (pink, robot guide) */}
      <div
        aria-hidden
        ref={shareefRef}
        className="fixed left-0 top-0 z-[9998] transition-opacity duration-500 will-change-transform"
        style={{ pointerEvents: "none", opacity: guiding ? 1 : 0 }}
      >
        <Arrow color={PINK} />
        <div
          className="absolute left-4 top-4 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white shadow"
          style={{ backgroundColor: PINK }}
        >
          Shareef
        </div>
        {/* chat bubble */}
        <div
          className={`absolute left-3 top-9 w-[230px] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] font-medium leading-snug text-white shadow-xl transition-all duration-300 ${
            bubble ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-1 scale-95 opacity-0"
          }`}
          style={{ backgroundColor: PINK }}
        >
          {bubble}
        </div>
      </div>

      {/* You (black, follows the real pointer) */}
      <div
        aria-hidden
        ref={youRef}
        className="fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ pointerEvents: "none" }}
      >
        <Arrow color={BLACK} />
        <div
          className="absolute left-4 top-4 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white shadow"
          style={{ backgroundColor: BLACK }}
        >
          You
        </div>
      </div>
    </>
  );
}
