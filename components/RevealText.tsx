"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ElementType, useEffect, useState } from "react";

interface RevealTextProps {
  text: string;
  tag?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}

const RevealText = ({
  text,
  tag: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.06,
}: RevealTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const words = text.split(" ");

  return (
    <Tag ref={ref as any} className={`overflow-hidden ${className}`}>
      <span className="inline-flex flex-wrap gap-x-[0.3em]">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block fm-anim"
              initial={{ y: "110%", opacity: 0 }}
              animate={mounted && inView ? { y: 0, opacity: 1 } : {}}
              transition={{
                delay: delay + i * stagger,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default RevealText;
