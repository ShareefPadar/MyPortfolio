"use client";

import "./marquee.css";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

const Marquee = ({ items, speed = 30, className = "" }: MarqueeProps) => {
  const loop = [...items, ...items];

  return (
    <div className={`relative overflow-hidden py-8 ${className}`}>
      <div
        className="marquee-track flex gap-12 whitespace-nowrap"
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="text-5xl md:text-7xl font-serif font-bold text-neutral-950/[0.08] tracking-tight shrink-0"
          >
            {item}
            <span className="mx-8 text-accent/30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
