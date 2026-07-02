"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import ParallaxSection from "@/components/ParallaxSection";
import RevealText from "@/components/RevealText";

export default function About() {
  return (
    <div className="container-wide py-12 md:py-24 max-w-4xl">
      {/* Intro Section */}
      <section className="space-y-16">
        <ParallaxSection priority={true}>
          <div className="pt-4">
            <span className="text-xs font-bold text-neutral-900/40 uppercase tracking-widest mb-8 block font-sans">About Me</span>
            <RevealText
              text="The bridge between empathy and engineering."
              tag="h1"
              className="text-4xl md:text-6xl font-bold font-serif leading-tight tracking-tight mb-12"
            />
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.2}>
          <div className="space-y-8 text-base md:text-lg text-neutral-600 leading-relaxed font-sans">
            <p>
              I&apos;m a <span className="font-bold text-neutral-900">Senior Product Designer</span> with 6 years of experience in B2B SaaS — taking complex products from early research through to shipped, production-ready interfaces. I&apos;ve worked as the sole designer across platforms in logistics, healthcare, gym management, and travel, which means I&apos;m used to owning the entire design process without hand-holding. Most of that client work sits under NDA — detailed case studies are available on request.
            </p>
            <p>
              My background is in <span className="font-bold text-neutral-900">computer science</span>, which means I design with the implementation in mind. I don&apos;t hand off mockups and disappear — I understand the constraints, collaborate closely with engineers, and increasingly ship front-end code directly using React, Tailwind, and AI-assisted workflows with Cursor and Claude Code.
            </p>
            <p>
              What I bring to a product team: deep user research capability, a strong system-level design instinct, and the ability to move fast without breaking consistency. I&apos;ve built design systems from zero, run usability testing, conducted stakeholder interviews, and delivered WCAG-aligned responsive interfaces across web and mobile.
            </p>
            <div className="pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-serif mb-6 italic leading-snug text-neutral-950">What I Bring to the Table.</h2>
              <ul className="list-none space-y-6">
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">B2B product depth</span>
                  I thrive in complexity. I&apos;ve designed ERP platforms, logistics booking systems, and CRM tools — always as sole designer, always end to end.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Research-led decisions</span>
                  I run user interviews, usability tests, and competitor audits to ground design decisions in real data — not assumptions.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">From design to shipped code</span>
                  I build what I design. Two live products — Roomy and Form — designed and coded entirely by me, in production.
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
      <ParallaxSection className="mt-16 md:mt-32">
        <section className="bg-surface-peach -mx-4 md:-mx-12 lg:-mx-20 px-8 md:px-24 py-14 md:py-32 rounded-3xl text-center mb-16 md:mb-32">
          <p className="text-2xl md:text-4xl font-serif font-bold mb-8 italic leading-snug text-neutral-950">
            &quot;AI makes execution faster, but only for those who understand the design problem first. I use my engineering background and design seniority to build software that is technically sound, commercially viable, and a joy to use.&quot;
          </p>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-900/40 font-sans">— My Philosophy</span>
        </section>
      </ParallaxSection>
    </div>
  );
}
