"use client";

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
              text="Usually the only designer in the room."
              tag="h1"
              className="text-4xl md:text-6xl font-bold font-serif leading-tight tracking-tight mb-12"
            />
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.2}>
          <div className="space-y-8 text-base md:text-lg text-neutral-600 leading-relaxed font-sans">
            <p>
              I&apos;m a <span className="font-bold text-neutral-900">Senior Product Designer</span> with six years in B2B SaaS, based in Dubai. Logistics, healthcare, gym management, travel. In most of those rooms I was the only designer, which meant doing the research, making the call, drawing the screens, and then sitting with the engineers while it got built. Most of that work sits under NDA, so ask me about it on a call.
            </p>
            <p>
              At Cargoz I designed <span className="font-bold text-neutral-900">Cargoz Connect</span>, a product that gets a business into warehouse space inside 24 hours, from the first wireframe to the live UI, and built the design system six developers now work from. Before that I ran UX for a gym and healthcare ERP, reporting straight to the CEO, which mostly taught me how to defend a design decision to someone who owns the P&amp;L.
            </p>
            <p>
              My degree is in <span className="font-bold text-neutral-900">computer science</span>, and I treat that as a design advantage rather than a second job. I know what is expensive to build, so I stop proposing it. I can read the codebase to check whether a pattern already exists before inventing another one. And when an idea needs proving, I would rather build it than describe it, which is why the prototypes in the Sanad and Mizan case studies are real working software instead of screenshots.
            </p>
            <div className="pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-serif mb-6 italic leading-snug text-neutral-950">How I Work.</h2>
              <ul className="list-none space-y-6">
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">I show the constraint instead of hiding it</span>
                  In the Sanad flow the honest move was telling people the form takes ten minutes and the review takes two days, rather than pretending it was shorter. Hidden scope does not reduce drop-off, it just delays it to the moment someone feels misled.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">Research until the decision is obvious, then stop</span>
                  Interviews, competitor teardowns, usability tests. All of it useful right up to the point where it stops changing what I would draw. Process theatre helps nobody.
                </li>
                <li>
                  <span className="font-bold text-neutral-900 block mb-1">I audit my own work like someone else made it</span>
                  After building the Sanad prototype I held it to the same standard as the writing and found four things wrong, including a consent checkbox that was a dark pattern. That audit is still published on the case study.
                </li>
              </ul>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.3}>
          <div className="pt-4">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-8 italic leading-snug text-neutral-950">Where I&apos;ve Worked.</h2>
            <div className="space-y-9">
              {[
                {
                  role: "Senior UI/UX Designer & UX Engineer",
                  company: "Cargoz · Dubai",
                  period: "2025 – Present",
                  desc: "Shipped Cargoz Connect, a B2B product for booking warehouse space within 24 hours, from wireframes to live UI. Building the design system for a 6-developer team and shipping front-end code in React and Tailwind.",
                },
                {
                  role: "Senior UI/UX Designer",
                  company: "Pixelmind IT Solutions · Dubai (Remote)",
                  period: "2023 – 2025",
                  desc: "Led UX and UI for a B2B Gym & Healthcare ERP/CRM across web and mobile, working directly with the CEO. Built the component library, design tokens, and developer docs, and delivered WCAG-aligned responsive interfaces.",
                },
                {
                  role: "UX Designer",
                  company: "Illuminz · India",
                  period: "2022",
                  desc: "Sole UX lead across two mobile apps at once, grounding features in personas and journey maps and using rapid prototyping to shorten feedback loops.",
                },
                {
                  role: "UI/UX Designer",
                  company: "iOSys Software · India",
                  period: "2021 – 2022",
                  desc: "Designed client websites across industries as part of a three-designer agency team.",
                },
                {
                  role: "UI & Graphic Designer",
                  company: "Addwiser · India",
                  period: "2019 – 2021",
                  desc: "Client UI and brand visuals across e-commerce, tech, and services.",
                },
              ].map((job) => (
                <div key={job.company} className="border-l-2 border-neutral-100 pl-5 md:pl-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-base md:text-lg font-bold text-neutral-900 font-sans">{job.role}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 shrink-0">{job.period}</span>
                  </div>
                  <p className="text-sm font-semibold text-accent mb-2">{job.company}</p>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">{job.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-9 pt-6 border-t border-neutral-100 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-700">B.E. Computer Science &amp; Engineering</span>, Sahyadri College of Engineering &amp; Management (2019) · UX Design, Interaction Design Foundation.
            </p>
          </div>
        </ParallaxSection>

        <ParallaxSection delay={0.4}>
          <div className="pt-8 flex flex-wrap gap-4">
            <a
              href="/assets/Shareef_Padar_Resume.pdf"
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
            &quot;The problems worth taking are the ones where the constraint does not move. You cannot delete the compliance step or shorten the ten-day wait, so the only thing left to design is how it feels to live through. That is the work I want.&quot;
          </p>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-900/40 font-sans">— My Philosophy</span>
        </section>
      </ParallaxSection>
    </div>
  );
}
