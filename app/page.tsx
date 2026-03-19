"use client";

import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import ParallaxSection from "@/components/ParallaxSection";
import ScrollReveal from "@/components/ScrollReveal";
import RoomyDemo from "@/components/RoomyDemo";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Instagram Local Feed",
    description: "Bridging global reach with local connections to help users discover events and businesses in their neighborhood.",
    category: "Product Design",
    imageUrl: "https://miro.medium.com/v2/resize:fit:780/1*3sIpxdG2WHXa9JyB9dI_lA.png",
    href: "/work/instagram-local",
    bgColor: "#EDF9FF", // Light Blue
  },

  {
    title: "OmniCast AI",
    description: "AI-powered publishing assistant that predicts performance and optimizes multi-channel campaigns in real-time.",
    category: "Product Design",
    imageUrl: "/assets/omnicast-preview.png",
    href: "/work/omni-cast-ai",
    bgColor: "#F5F3FF", // Light Purple
  },
  {
    title: "Almosafer UX Audit",
    description: "Applying Hick's Law and Visual Hierarchy to streamline the Middle East's leading travel platform.",
    category: "UX Audit",
    imageUrl: "/assets/almosafer-preview.png",
    href: "/work/almosafer-audit",
    bgColor: "#FEFCE8", // Light Yellow
  },
];



export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col w-full overflow-hidden"
    >
      <ParallaxSection>
        <Hero />
      </ParallaxSection>

      {/* FEATURED PRODUCT SECTION */}
      <section className="container-wide mb-32 w-full px-4 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-[0.4em]">Featured Product</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
          <div className="bg-[#5C45D3]/[0.03] rounded-[2.5rem] md:rounded-[4rem] px-6 py-10 md:p-20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-20 items-center border border-[#5C45D3]/5">
            <ScrollReveal className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-[2rem] leading-[1.1] md:text-5xl lg:text-6xl font-serif font-bold text-neutral-950 tracking-tight md:leading-tight">
                  Roomy: The effortless expense tracker.
                </h2>
                <p className="text-lg md:text-2xl text-neutral-600 font-sans leading-relaxed max-w-xl">
                  A full-stack solution built to manage shared living without the friction. Split bills, track utilities, and settle debts in real-time.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-neutral-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Live Application</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-neutral-100">
                   <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">React + Supabase</span>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  href="/work/roomy" 
                  className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-neutral-950 text-white px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 transition-all shadow-xl group"
                >
                  Explore the Product <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
            <ParallaxSection delay={0.1} className="relative lg:ml-auto w-full max-w-md hidden lg:flex justify-center py-8">
              <motion.div 
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 className="w-full relative"
              >
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#5C45D3]/20 via-transparent to-transparent blur-3xl -z-10" />
                 <RoomyDemo />
              </motion.div>
            </ParallaxSection>
          </div>
        </div>
      </section>
      
      <section className="container-wide mb-32 w-full">
        <ScrollReveal className="max-w-[1440px] mx-auto px-4 md:px-12 mb-16">
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-[0.4em]">Case Studies</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 max-w-[1440px] mx-auto w-full px-4 md:px-12">
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
    </motion.div>
  );
}

