"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import ParallaxSection from "@/components/ParallaxSection";

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="container-wide py-12 md:py-24 max-w-4xl"
    >
      {/* Intro Section */}
      <section className="space-y-16">
        <ParallaxSection>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-xs font-bold uppercase tracking-widest mb-8 block font-sans">ABOUT ME</span>
            <h1 className="text-5xl md:text-8xl font-bold font-serif leading-tight mb-12">
              The Bridge Between <span className="italic">Engineering</span> and <span className="italic">Empathy</span>.
            </h1>
          </motion.div>
        </ParallaxSection>

        <ParallaxSection delay={0.2}>
          <div className="space-y-8 text-xl md:text-2xl text-neutral-800 leading-relaxed font-serif">
            <p>
              I am a <span className="font-bold text-accent">Computer Science Engineer</span> who spent the last 6 years specializing in the complex world of B2B SaaS. My career has been defined by a deep understanding of user psychology and business logic, but in today’s AI-driven world, I’ve evolved.
            </p>
            <p>
              <span className="font-bold border-b-2 border-accent">From Strategy to Shipping:</span> I don’t just stop at the mockup. I believe that in the age of "vibe coding," the gap between a designer and an engineer should be zero. Leveraging tools like Cursor and AI-assisted development, I now execute the work of an entire product team solo.
            </p>
            <div className="pt-8">
              <h3 className="text-3xl font-bold font-serif mb-6 italic">What I Bring to the Table:</h3>
              <ul className="list-none space-y-6">
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">B2B Specialization:</span>
                  I thrive in complexity. I recently took a B2B product from $0$ to launch—handling everything from market research and competitor analysis to the final UI and UX strategy.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Full-Cycle Building:</span>
                  I’ve moved beyond static handoffs. I build what I design.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Shipped Products:</span>
                  I’ve recently designed and coded two functional applications from scratch: <span className="italic">Roomy</span> (a specialized Bedspace & Room Management system) and <span className="italic">Digital Khata</span> (a streamlined ledger for small shopkeepers).
                </li>
              </ul>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.4}>
          <div className="pt-16 flex flex-wrap gap-6">
            <a href="/assets/Shareef_Padar_Design_Engineer.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-neutral-950 text-white px-10 py-4 font-bold hover:bg-accent hover:shadow-2xl transition-all duration-300 rounded-full font-sans tracking-wide">
              📄 Download Resume <Download className="w-5 h-5" />
            </a>
            <a href="mailto:shareefpadar@gmail.com" className="flex items-center gap-3 border-2 border-neutral-950 text-neutral-950 px-10 py-4 font-bold hover:border-accent hover:text-accent transition-all duration-300 rounded-full font-sans tracking-wide">
              GET IN TOUCH <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </ParallaxSection>
      </section>

      {/* Philosophy */}
      <ParallaxSection className="mt-32">
        <section className="bg-surface-peach -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-24 py-32 rounded-3xl text-center mb-32">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 italic leading-tight">
            &quot;AI makes life easier, but only for those who know how to steer it. I use my engineering roots and my design seniority to build software that is technically sound, commercially viable, and a joy to use.&quot;
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 font-sans">— MY PHILOSOPHY</span>
        </section>
      </ParallaxSection>
    </motion.div>
  );
}
