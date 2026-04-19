"use client";

import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Magnetic from "./Magnetic";
import ScrambleText from "./ScrambleText";
import { useEffect, useState } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { scrollY } = useScroll();
  const yImage = useSpring(useTransform(scrollY, [0, 800], [0, -60]), { damping: 20, stiffness: 45 });
  const yBg = useSpring(useTransform(scrollY, [0, 800], [0, 20]), { damping: 20, stiffness: 45 });

  const line1 = ["6", "years", "of"];
  const line2 = ["Now", "shipping", "with"];

  const wordVariants: Variants = {
    hidden: { y: "110%", opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section className="container-wide pt-4 pb-8 md:pt-6 md:pb-12 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center gap-8 md:gap-16">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-neutral-900 font-sans font-medium mb-2 fm-anim"
        >
          I&apos;m <ScrambleText text="Shareef Padar" duration={800} delay={200} />
        </motion.p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-snug mb-3 font-sans tracking-tight text-neutral-900">
          <span className="inline-flex flex-wrap gap-x-[0.3em] overflow-hidden">
            {line1.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate={mounted ? "show" : "hidden"}
                  variants={wordVariants}
                  className="inline-block fm-anim"
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                custom={line1.length}
                initial="hidden"
                animate={mounted ? "show" : "hidden"}
                variants={wordVariants}
                className="inline-block text-gradient fm-anim"
              >
                UX strategy.
              </motion.span>
            </span>
          </span>
          <br className="hidden md:block" />
          <span className="inline-flex flex-wrap gap-x-[0.3em] overflow-hidden">
            {line2.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  custom={line1.length + 1 + i}
                  initial="hidden"
                  animate={mounted ? "show" : "hidden"}
                  variants={wordVariants}
                  className="inline-block fm-anim"
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                custom={line1.length + 1 + line2.length}
                initial="hidden"
                animate={mounted ? "show" : "hidden"}
                variants={wordVariants}
                className="inline-block text-gradient fm-anim"
              >
                code.
              </motion.span>
            </span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base md:text-lg text-neutral-500 font-sans leading-relaxed max-w-lg mb-6 fm-anim"
        >
          Design engineer based in Dubai — I research, design, and build products end-to-end. From UX audits to full-stack apps shipped in production.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fm-anim"
        >
          <Magnetic strength={0.3}>
            <Link
              href="/#work"
              className="inline-flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-neutral-800 transition-all shadow-lg group"
            >
              View my work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
      <motion.div
        className="relative hidden md:flex justify-end md:justify-center w-full max-w-md mx-auto"
      >
        <motion.div
          style={{ y: yBg }}
          className="absolute top-0 right-10 bottom-10 left-0 bg-gradient-to-br from-accent to-purple-700 rounded-3xl -z-10"
        />
        <motion.div
          style={{ y: yImage }}
          className="relative w-full aspect-[3/4] mt-4 ml-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/assets/hero-portrait.webp"
            alt="Shareef Padar Portrait"
            fill
            priority
            className="object-cover rounded-3xl shadow-2xl border border-white/10"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
