"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // High-performance motion values for raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // The small inner dot follows instantly
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 400, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 400, mass: 0.1 });

  // The outer ring ("Halo") lags smoothly behind
  const ringX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.4 });
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.4 });

  useEffect(() => {
    // Only mount cursor if device has an accurate pointing device (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsDesktop(true);
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    // Only hide cursor on desktop (matches md: breakpoint)
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    
    const applyCursor = (matches: boolean) => {
      document.body.style.cursor = matches ? "none" : "auto";
    };
    
    applyCursor(mediaQuery.matches);
    mediaQuery.addEventListener("change", (e) => applyCursor(e.matches));

    const updateMouseInfo = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        !!target.closest("a") ||
        !!target.closest("button");
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", updateMouseInfo);

    return () => {
      window.removeEventListener("mousemove", updateMouseInfo);
      mediaQuery.removeEventListener("change", (e) => applyCursor(e.matches));
      document.body.style.cursor = "auto";
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Outer Magnetic Halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center rounded-full border-2 border-neutral-400"
        style={{ opacity: isVisible ? 1 : 0 }}
        style={{
          x: ringX,
          y: ringY,
          width: 48,
          height: 48,
          marginLeft: -24,
          marginTop: -24,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? "rgba(163, 163, 163, 0.15)" : "rgba(163,163,163,0)",
          borderColor: isHovered ? "rgba(163,163,163,0)" : "rgba(163, 163, 163, 1)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:block rounded-full"
        style={{
          opacity: isVisible ? 1 : 0,
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          backgroundColor: isHovered ? "transparent" : "#A3A3A3",
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
