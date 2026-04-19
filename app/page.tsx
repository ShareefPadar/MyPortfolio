"use client";

import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import ParallaxSection from "@/components/ParallaxSection";
import ScrollReveal from "@/components/ScrollReveal";
import RoomyDemo from "@/components/RoomyDemo";
import FormDemo from "@/components/FormDemo";
import Magnetic from "@/components/Magnetic";
import RevealText from "@/components/RevealText";
import Marquee from "@/components/Marquee";
import ReactiveGlow from "@/components/ReactiveGlow";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { projects as allProjects } from "@/app/work/data";

const projects = Object.entries(allProjects)
  .filter(([slug]) => slug !== "roomy" && slug !== "form") // featured separately above
  .map(([slug, p]) => ({
    title: p.title,
    description: (p as any).homeDescription || p.description,
    category: p.tags?.[0] || "Case Study",
    imageUrl: (p as any).homeImageUrl || p.imageUrl,
    href: `/work/${slug}`,
    bgColor: p.bgColor,
  }));

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <ParallaxSection priority={true}>
        <Hero />
      </ParallaxSection>

      {/* MARQUEE STRIP */}
      <Marquee
        items={["Design Engineering", "UX Strategy", "Full-Stack", "Research", "Systems Thinking", "Shipping Products"]}
        speed={50}
        className="border-y border-neutral-100"
      />

      {/* FEATURED PRODUCTS — DARK BAND */}
      <section className="w-full bg-neutral-950 py-14 md:py-32 mb-0 relative overflow-hidden cv-auto">
        <ReactiveGlow glowClassName="bg-purple-500/25" size={600} className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-16">
            <span className="text-sm md:text-base font-bold text-white/40 uppercase tracking-widest">Featured Products</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* ROOMY */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-20 items-center">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 right-0 w-80 h-80 bg-purple-800/15 rounded-full blur-[100px] pointer-events-none" />
            <ScrollReveal className="space-y-8 relative">
              <div className="space-y-4">
                <RevealText
                  text="Roomy: The effortless expense tracker."
                  tag="h2"
                  className="text-4xl leading-none md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight md:leading-tight"
                />
                <p className="text-base md:text-lg text-neutral-400 font-sans leading-relaxed max-w-xl">
                  A full-stack solution built to manage shared living without the friction. Split bills, track utilities, and settle debts in real-time.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Live Application</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">React + Supabase</span>
                </div>
              </div>
              <div className="pt-4">
                <Magnetic strength={0.25}>
                  <Link
                    href="/work/roomy"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-white text-neutral-950 px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-100 transition-all shadow-xl group"
                  >
                    Explore the Product <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </ScrollReveal>
            <ParallaxSection delay={0.1} className="relative lg:ml-auto w-full max-w-md hidden lg:flex justify-center py-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-transparent to-transparent blur-3xl -z-10" />
                <RoomyDemo />
              </motion.div>
            </ParallaxSection>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-20 md:my-28" />

          {/* FORM */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-20 items-center">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 right-0 w-80 h-80 bg-cyan-700/10 rounded-full blur-[100px] pointer-events-none" />
            <ScrollReveal className="space-y-8 relative">
              <div className="space-y-4">
                <RevealText
                  text="Form: Privacy-first health."
                  tag="h2"
                  className="text-4xl leading-none md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight md:leading-tight"
                />
                <p className="text-base md:text-lg text-neutral-400 font-sans leading-relaxed max-w-xl">
                  An offline-ready, local-first tracker for weight, BMI, and body composition. No account required — your data stays on your device, syncs only when you want.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Live Application</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">React + Dexie + Supabase</span>
                </div>
              </div>
              <div className="pt-4">
                <Magnetic strength={0.25}>
                  <Link
                    href="/work/form"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-white text-neutral-950 px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-100 transition-all shadow-xl group"
                  >
                    Explore the Product <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </ScrollReveal>
            <ParallaxSection delay={0.1} className="relative lg:ml-auto w-full max-w-md hidden lg:flex justify-center py-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/25 via-transparent to-transparent blur-3xl -z-10" />
                <FormDemo />
              </motion.div>
            </ParallaxSection>
          </div>

        </ReactiveGlow>
      </section>

      <Marquee
        items={["Research", "Prototype", "Build", "Iterate", "Ship", "Refine"]}
        speed={55}
        className="border-b border-neutral-100"
      />

      <section id="work" className="container-wide mt-16 md:mt-32 mb-16 md:mb-32 w-full cv-auto">
        <ScrollReveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-widest">Case Studies</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 w-full">
          {projects.map((project, index) => (
            <ParallaxSection 
              key={project.title} 
              delay={index * 0.15}
            >
              <ProjectCard 
                {...project} 
              />
            </ParallaxSection>
          ))}
        </div>
      </section>
    </div>
  );
}

