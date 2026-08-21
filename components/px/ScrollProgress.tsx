"use client";

import { useEffect, useState } from "react";

/**
 * Scroll progress (spec §8): ten segmented blocks filling one at a time.
 * Never a smooth bar — the fill quantises for the same reason the animation
 * does.
 */
const SEGMENTS = 10;

const ScrollProgress = () => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      setFilled(Math.round(pct * SEGMENTS));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="flex gap-4"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={filled * 10}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span key={i} className={`prog-seg ${i < filled ? "on" : ""}`} />
      ))}
    </div>
  );
};

export default ScrollProgress;
