"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import ParallaxSection from "@/components/ParallaxSection";

export default function About() {
  return (
    <div className="container-wide py-12 md:py-24 max-w-4xl">
      {/* Intro Section */}
      <section className="space-y-16">
        <ParallaxSection priority={true}>
          <div className="pt-4">
            <span className="text-xs font-bold text-neutral-900/40 uppercase tracking-widest mb-8 block font-sans">About Me</span>
            <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight tracking-tight mb-12">
              The Bridge Between <span className="italic">Engineering</span> and <span className="italic">Empathy</span>.
            </h1>
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.2}>
          <div className="space-y-8 text-base md:text-lg text-neutral-600 leading-relaxed font-sans">
            <p>
              I am a <span className="font-bold text-neutral-900">Computer Science Engineer</span> who spent the last 6 years specializing in the complex world of B2B SaaS. My career has been defined by a deep understanding of user psychology and business logic — and in today&apos;s AI-driven world, I&apos;ve evolved.
            </p>
            <p>
              <span className="font-bold text-neutral-900 border-b-2 border-neutral-900">From Strategy to Shipping:</span> I don&apos;t just stop at the mockup. I believe that in the age of vibe coding, the gap between a designer and an engineer should be zero. Leveraging tools like Cursor and AI-assisted development, I now execute the work of an entire product team solo.
            </p>
            <div className="pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-serif mb-6 italic leading-snug text-neutral-950">What I Bring to the Table.</h2>
              <ul className="list-none space-y-6">
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">B2B Specialisation</span>
                  I thrive in complexity. I recently took a B2B product from zero to launch — handling everything from market research and competitor analysis to the final UI and UX strategy.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Full-Cycle Building</span>
                  I&apos;ve moved beyond static handoffs. I build what I design.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Shipped Products</span>
                  I&apos;ve recently designed and coded two functional applications from scratch: <span className="italic">Roomy</span> (a Bedspace &amp; Room Management OS) and <span className="italic">Form</span> (a privacy-first, offline-ready health tracker).
                </li>
              </ul>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.4}>
          <div className="pt-8 flex flex-wrap gap-4">
            <a
              href="/assets/Shareef_Padar_Design_Engineer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 font-bold hover:bg-neutral-800 transition-all duration-300 rounded-full font-sans text-sm md:text-base"
            >
              Download Resume <Download className="w-4 h-4" />
            </a>
            <a
              href="mailto:shareefpadar@gmail.com"
              className="inline-flex items-center gap-3 border border-neutral-200 text-neutral-950 px-8 py-4 font-bold hover:border-neutral-950 transition-all duration-300 rounded-full font-sans text-sm md:text-base"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ParallaxSection>
      </section>

      {/* Philosophy */}
      <ParallaxSection className="mt-32">
        <section className="bg-surface-peach -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-24 py-24 md:py-32 rounded-3xl text-center mb-32">
          <p className="text-2xl md:text-4xl font-serif font-bold mb-8 italic leading-snug text-neutral-950">
            &quot;AI makes life easier, but only for those who know how to steer it. I use my engineering roots and design seniority to build software that is technically sound, commercially viable, and a joy to use.&quot;
          </p>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-900/40 font-sans">— My Philosophy</span>
        </section>
      </ParallaxSection>
    </div>
  );
}
