"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  delay?: number;
}

export default function ParallaxSection({ children, className = "", delay = 0 }: ParallaxSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Extremely subtle movement that feels organic rather than "shifted"
  const springConfig = { stiffness: 45, damping: 20, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [15, -15]),
    springConfig
  );

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <motion.div 
        style={{ y }} 
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={isInView ? { 
          opacity: 1, 
          scale: 1, 
          filter: "blur(0px)",
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

