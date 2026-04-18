"use client";

import { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

const ScrambleText = ({ text, className = "", duration = 900, delay = 0 }: ScrambleTextProps) => {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now() + delay;
    const end = start + duration;

    const tick = (now: number) => {
      if (now < start) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(text.length * progress);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount || text[i] === " ") {
          out += text[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (now < end) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, duration, delay]);

  return <span className={className}>{display}</span>;
};

export default ScrambleText;
