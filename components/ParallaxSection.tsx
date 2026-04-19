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

export default function ParallaxSection({ children, className = "", delay = 0, priority = false }: ParallaxSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    mq.addEventListener("change", (e) => setIsMobile(e.matches));
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 45, damping: 20, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [15, -15]),
    springConfig
  );

  // blur(10px) is extremely expensive on throttled mobile CPUs — skip it on mobile
  const hiddenState = isMobile
    ? { opacity: 0, scale: 0.98 }
    : { opacity: 0, scale: 0.98, filter: "blur(10px)" };
  const visibleState = isMobile
    ? { opacity: 1, scale: 1 }
    : { opacity: 1, scale: 1, filter: "blur(0px)" };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <motion.div
        style={{ y }}
        initial={priority ? visibleState : hiddenState}
        animate={(isInView || priority) ? {
          ...visibleState,
          transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: delay
          }
        } : {}}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

