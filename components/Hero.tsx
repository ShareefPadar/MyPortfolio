"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Hero = () => {
  const { scrollY } = useScroll();
  const yImage = useSpring(useTransform(scrollY, [0, 800], [0, -60]), { damping: 20, stiffness: 45 });
  const yBg = useSpring(useTransform(scrollY, [0, 800], [0, 20]), { damping: 20, stiffness: 45 });

  return (
    <section className="container-wide px-4 md:px-12 pt-16 pb-16 md:pt-24 md:pb-32 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center gap-12 md:gap-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xl md:text-2xl text-neutral-900 font-sans font-medium mb-4 md:mb-6">
          I&apos;m Shareef Padar
        </p>
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-4xl md:text-[3.5rem] font-bold leading-[1.2] md:leading-[1.3] mb-8 md:mb-12 font-sans tracking-tight text-neutral-900"
        >
          6 years of <span className="text-gradient">UX strategy.</span><br className="hidden md:block" />
          Now shipping with <span className="text-gradient">code.</span>
        </motion.h1>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="relative hidden md:flex justify-end md:justify-center w-full max-w-md mx-auto"
      >
        <motion.div 
          style={{ y: yBg }} 
          className="absolute top-0 right-10 bottom-10 left-0 bg-gradient-to-br from-accent to-[#8E24AA] rounded-[2.5rem] -z-10" 
        />
        <motion.img 
          style={{ y: yImage }}
          src="/assets/hero-portrait.webp" 
          alt="Shareef Padar Portrait"
          className="w-full h-auto aspect-[4/5] object-cover rounded-[3.5rem] shadow-2xl mt-6 ml-6 border border-white/10"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
