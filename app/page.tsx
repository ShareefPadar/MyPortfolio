"use client";

import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import ParallaxSection from "@/components/ParallaxSection";
import ScrollReveal from "@/components/ScrollReveal";
import Marquee from "@/components/Marquee";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { workEntries, featuredSlugs, sideProjectSlugs } from "@/app/work/workList";

const featured = featuredSlugs
  .map((slug) => workEntries.find((w) => w.slug === slug)!)
  .filter(Boolean);
const sideProjects = sideProjectSlugs
  .map((slug) => workEntries.find((w) => w.slug === slug)!)
  .filter(Boolean);

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div data-guide="Hey, I'm Shareef 👋 Senior product designer, and I ship the code too. Let me show you around.">
        <ParallaxSection priority={true}>
          <Hero />
        </ParallaxSection>
      </div>

      {/* Skills strip — visual break between hero and work */}
      <Marquee
        items={["UX Research", "Product Design", "Design Systems", "Prototyping", "Usability Testing", "B2B SaaS"]}
        speed={50}
        className="border-y border-neutral-100"
      />

      {/* SELECTED WORK — the two strongest case studies */}
      <section id="work" data-guide="My favourite case studies live here. Click any card to dig in." className="container-wide mt-16 md:mt-28 w-full cv-auto">
        <ScrollReveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-widest">Selected Work</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {featured.map((project, index) => (
            <ParallaxSection key={project.slug} delay={index * 0.1}>
              <WorkCard
                title={project.title}
                category={project.category}
                badge={project.badge}
                description={project.description}
                href={`/work/${project.slug}`}
                thumbnail={project.thumbnail}
                bgColor={project.bgColor}
                featured
              />
            </ParallaxSection>
          ))}
        </div>
      </section>

      {/* SIDE PROJECTS — live products that back up "who ships" */}
      <section data-guide="I designed and built these two myself. They're live, so go press some buttons." className="container-wide mt-12 md:mt-16 w-full cv-auto">
        <ScrollReveal className="mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-widest">Designed, Built &amp; Live</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {sideProjects.map((project, index) => (
            <ParallaxSection key={project.slug} delay={index * 0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Live · Side project
                  </span>
                </div>
                <h3 className="mb-2 font-serif text-2xl font-bold leading-tight tracking-tight text-neutral-950">
                  {project.title}
                </h3>
                <p className="mb-6 font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm font-bold">
                  <Link href={`/work/${project.slug}`} className="group/link inline-flex items-center gap-1.5 text-neutral-900">
                    Case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 text-accent"
                    >
                      Launch app
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </ParallaxSection>
          ))}
        </div>
      </section>

      {/* NDA note + all work */}
      <section data-guide="Plenty more sits under NDA. Want the full story? Let's talk. 👇" className="container-wide mt-14 md:mt-20 mb-16 md:mb-32 w-full">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-neutral-50 px-6 py-12 text-center md:py-16">
            <p className="max-w-2xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg">
              Six years of client work in logistics, healthcare, and travel sits under NDA.
              I&apos;m happy to walk you through it on request.
            </p>
            <Link
              href="/work"
              className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-8 py-4 font-sans text-sm font-bold text-neutral-950 transition-all hover:border-neutral-950 group"
            >
              View all work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
