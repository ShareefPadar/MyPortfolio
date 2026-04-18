"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ReactiveGlowProps {
  children: ReactNode;
  className?: string;
  glowClassName?: string;
  size?: number;
}

const ReactiveGlow = ({
  children,
  className = "",
  glowClassName = "bg-purple-500/20",
  size = 500,
}: ReactiveGlowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 70, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 70, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left - size / 2);
    y.set(e.clientY - r.top - size / 2);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`relative ${className}`}>
      <motion.div
        aria-hidden="true"
        style={{ x: sx, y: sy, width: size, height: size }}
        className={`pointer-events-none absolute top-0 left-0 rounded-full blur-[120px] ${glowClassName}`}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

export default ReactiveGlow;
