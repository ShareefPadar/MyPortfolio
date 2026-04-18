"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const { scrollY } = useScroll();
  const yImage = useSpring(useTransform(scrollY, [0, 800], [0, -60]), { damping: 20, stiffness: 45 });
  const yBg = useSpring(useTransform(scrollY, [0, 800], [0, 20]), { damping: 20, stiffness: 45 });

  return (
    <section className="container-wide px-4 md:px-12 pt-16 pb-16 md:pt-24 md:pb-32 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center gap-12 md:gap-24">
      <div>
        <p className="text-xl md:text-2xl text-neutral-900 font-sans font-medium mb-4 md:mb-6">
          I&apos;m Shareef Padar
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold leading-tight md:leading-snug mb-6 font-sans tracking-tight text-neutral-900"
        >
          6 years of <span className="text-gradient">UX strategy.</span><br className="hidden md:block" />
          Now shipping with <span className="text-gradient">code.</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-500 font-sans leading-relaxed max-w-lg mb-10">
          Design engineer based in Dubai — I research, design, and build products end-to-end. From UX audits to full-stack apps shipped in production.
        </p>
        <Link
          href="/#work"
          className="inline-flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-neutral-800 transition-all shadow-lg group"
        >
          View my work
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Link>
      </div>
      <motion.div 
        className="relative hidden md:flex justify-end md:justify-center w-full max-w-md mx-auto"
      >
        <motion.div 
          style={{ y: yBg }} 
          className="absolute top-0 right-10 bottom-10 left-0 bg-gradient-to-br from-accent to-purple-700 rounded-3xl -z-10" 
        />
        <motion.div style={{ y: yImage }} className="relative w-full aspect-[4/5] mt-6 ml-6">
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
