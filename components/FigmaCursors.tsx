"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PINK = "#E21D70";
const BLACK = "#1f1f1f";

const DOTS_MS = 700; // "..." thinking state before typing starts
const TYPE_MS = 26; // per character
const HOLD_MS = 4200; // after fully typed, before dismiss

// Figma's classic multiplayer cursor — sharp straight-edged kite with a
// thin white outline, exactly as rendered on the canvas.
function FigCursor({ color }: { color: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "block", filter: "drop-shadow(0 1px 2.5px rgba(0,0,0,.25))" }}
    >
      <path
        d="M3.2 3.2 L20.5 10.1 L12.4 12.4 L10.1 20.5 Z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Phase = "hidden" | "dots" | "typing" | "hold" | "exit";

export default function FigmaCursors() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [guiding, setGuiding] = useState(false);

  // chat bubble state machine
  const [phase, setPhase] = useState<Phase>("hidden");
  const [message, setMessage] = useState("");
  const [chars, setChars] = useState(0);

  const youRef = useRef<HTMLDivElement>(null);
  const shareefRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const shareef = useRef({ x: -120, y: -120 });
  const target = useRef({ x: 0, y: 0 });
  const activeEl = useRef<HTMLElement | null>(null);
  const shown = useRef<Set<string>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef(0);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (typeInterval.current) clearInterval(typeInterval.current);
    typeInterval.current = null;
  };

  const showBubble = (msg: string) => {
    clearTimers();
    setMessage(msg);
    setChars(0);
    setPhase("dots");
    timers.current.push(
      setTimeout(() => {
        setPhase("typing");
        typeInterval.current = setInterval(() => {
          setChars((c) => {
            if (c + 1 >= msg.length) {
              if (typeInterval.current) clearInterval(typeInterval.current);
              typeInterval.current = null;
              setPhase("hold");
              timers.current.push(
                setTimeout(() => {
                  setPhase("exit");
                  timers.current.push(setTimeout(() => setPhase("hidden"), 220));
                }, HOLD_MS)
              );
              return msg.length;
            }
            return c + 1;
          });
        }, TYPE_MS);
      }, DOTS_MS)
    );
  };

  // Discover guide stops on this route + track the most-visible one.
  useEffect(() => {
    const t = setTimeout(() => {
      const stops = Array.from(document.querySelectorAll<HTMLElement>("[data-guide]"));
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
          let best: HTMLElement | null = null;
          let bestR = 0.15;
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
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Motion loop (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      if (youRef.current) {
        youRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      const el = activeEl.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const tx = Math.min(Math.max(r.left + 64, 100), window.innerWidth - 320);
        const ty = Math.min(Math.max(r.top + 96, 140), window.innerHeight - 200);
        const now = performance.now() / 1000;
        target.current.x = tx + Math.sin(now * 1.1) * 5;
        target.current.y = ty + Math.cos(now * 0.9) * 4;
      }
      shareef.current.x = lerp(shareef.current.x, target.current.x, 0.07);
      shareef.current.y = lerp(shareef.current.y, target.current.y, 0.07);
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

  const bubbleOpen = phase !== "hidden";
  const typed = phase === "typing" ? message.slice(0, chars) : message;

  // ----- shared bubble (Figma cursor-chat replica) -----
  const Bubble = (
    <div
      className={bubbleOpen && phase !== "exit" ? "fig-pop" : "fig-out"}
      style={{
        transformOrigin: "top left",
        backgroundColor: PINK,
        borderRadius: "10px 26px 26px 26px",
        padding: "12px 18px 13px 17px",
        maxWidth: 290,
        width: "max-content",
        boxShadow: "0 4px 16px rgba(226,29,112,.35), 0 1px 3px rgba(0,0,0,.15)",
      }}
    >
      {phase === "dots" ? (
        <div style={{ display: "flex", gap: 4.5, padding: "7px 4px 6px" }}>
          <span className="fig-dot" style={{ animationDelay: "0ms" }} />
          <span className="fig-dot" style={{ animationDelay: "150ms" }} />
          <span className="fig-dot" style={{ animationDelay: "300ms" }} />
        </div>
      ) : (
        <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.4, color: "#fff", letterSpacing: ".005em" }}>
          {typed}
          {phase === "typing" && <span className="fig-caret" />}
        </div>
      )}
    </div>
  );

  const styles = (
    <style>{`
      @keyframes figPop {
        0% { transform: scale(.35); opacity: 0; }
        65% { transform: scale(1.04); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .fig-pop { animation: figPop 300ms cubic-bezier(.21,1.02,.55,1) both; }
      @keyframes figOut {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(.5); opacity: 0; }
      }
      .fig-out { animation: figOut 200ms ease-in both; }
      .fig-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: rgba(255,255,255,.9); display: inline-block;
        animation: figDot 900ms ease-in-out infinite;
      }
      @keyframes figDot {
        0%, 60%, 100% { opacity: .35; transform: translateY(0); }
        30% { opacity: 1; transform: translateY(-2px); }
      }
      .fig-caret {
        display: inline-block; width: 1.5px; height: 12px;
        background: #fff; margin-left: 2px; vertical-align: -1.5px;
        animation: figCaret 750ms steps(1) infinite;
      }
      @keyframes figCaret { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
    `}</style>
  );

  // ---- MOBILE: no cursors; bubble tours pinned bottom-left ----
  if (!isDesktop) {
    return (
      <>
        {styles}
        <div className="pointer-events-none fixed bottom-5 left-4 right-4 z-[9998]">
          {bubbleOpen && Bubble}
        </div>
      </>
    );
  }

  // ---- DESKTOP ----
  return (
    <>
      {styles}
      <style>{`
        @media (pointer: fine) and (min-width: 768px) {
          *, *::before, *::after { cursor: none !important; }
          input, textarea, select, [contenteditable="true"] { cursor: text !important; }
        }
      `}</style>

      {/* Shareef — pink robot guide */}
      <div
        aria-hidden
        ref={shareefRef}
        className="fixed left-0 top-0 z-[9998] transition-opacity duration-500 will-change-transform"
        style={{ pointerEvents: "none", opacity: guiding ? 1 : 0 }}
      >
        <FigCursor color={PINK} />
        {/* name label (hidden while the chat bubble is open, like Figma) */}
        <div
          style={{
            position: "absolute",
            left: 17,
            top: 21,
            backgroundColor: PINK,
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: ".005em",
            padding: "6px 13px 7px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,.18)",
            opacity: bubbleOpen ? 0 : 1,
            transition: "opacity 150ms",
          }}
        >
          Shareef
        </div>
        {/* cursor chat bubble */}
        <div style={{ position: "absolute", left: 17, top: 21 }}>{bubbleOpen && Bubble}</div>
      </div>

      {/* You — black, real pointer */}
      <div
        aria-hidden
        ref={youRef}
        className="fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ pointerEvents: "none" }}
      >
        <FigCursor color={BLACK} />
        <div
          style={{
            position: "absolute",
            left: 17,
            top: 21,
            backgroundColor: BLACK,
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: ".005em",
            padding: "6px 13px 7px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,.18)",
          }}
        >
          You
        </div>
      </div>
    </>
  );
}
