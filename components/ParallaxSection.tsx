"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  delay?: number;
  priority?: boolean;
}

function ParallaxSectionDesktop({ children, className, delay, priority }: Required<Pick<ParallaxSectionProps, "children" | "className" | "delay" | "priority">>) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 45, damping: 20, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [15, -15]),
    springConfig
  );

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <motion.div
        style={{ y }}
        initial={priority ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={(isInView || priority) ? {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: delay
          }
        } : {}}
        className="w-full fm-anim"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ParallaxSection({ children, className = "", delay = 0, priority = false }: ParallaxSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // After mount on mobile, render plain div — removes useScroll + useSpring + useInView subscriptions.
  // Before mount (SSR + hydration), render the desktop version; CSS `.fm-anim` override makes it visible on mobile.
  if (mounted && isMobile) {
    return <div className={`relative w-full ${className}`}>{children}</div>;
  }

  return <ParallaxSectionDesktop className={className} delay={delay} priority={priority}>{children}</ParallaxSectionDesktop>;
}

