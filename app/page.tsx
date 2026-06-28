"use client";

import Hero from "@/components/Hero";
import WorkCard, { type WorkCardProps } from "@/components/WorkCard";
import ParallaxSection from "@/components/ParallaxSection";
import ScrollReveal from "@/components/ScrollReveal";
import Marquee from "@/components/Marquee";

// Work grid — order is deliberate (case studies first, side projects last).
// Thumbnails fall back to a solid placeholder when no asset exists.
const work: WorkCardProps[] = [
  {
    title: "Almosafer UX Audit",
    category: "UX Audit",
    description:
      "Applied Hick's Law and visual hierarchy to simplify the Middle East's leading travel platform.",
    href: "/work/almosafer-audit",
    thumbnail: "/assets/almosafer-preview.png",
    bgColor: "#FEFCE8",
  },
  {
    title: "OmniCast AI",
    category: "Product Design",
    description:
      "AI publishing assistant that predicts performance and optimises campaigns across channels.",
    href: "/work/omni-cast-ai",
    thumbnail: "/assets/omnicast-preview.png",
    bgColor: "#F5F3FF",
  },
  {
    title: "Google Maps Route Pass",
    category: "Product Design",
    description:
      "An encrypted solution bridging the digital handshake for universal multi-stop navigation.",
    href: "/work/google-maps-route-pass",
    thumbnail: "/assets/google-maps-preview.png",
    bgColor: "#E1F2ED",
  },
  {
    title: "Instagram Local Feed",
    category: "Product Design",
    description:
      "Connecting global reach with local discovery — events and businesses in your neighbourhood.",
    href: "/work/instagram-local",
    thumbnail: null,
    bgColor: "#EDF9FF",
  },
  {
    title: "Roomy",
    category: "Side Project",
    description: "Full-stack bedspace management OS — designed and built end to end.",
    href: "/work/roomy",
    thumbnail: "/assets/roomy-preview.png",
    bgColor: "#F5F3FF",
  },
  {
    title: "Form",
    category: "Side Project",
    description: "Privacy-first, offline-ready health tracker — designed and built end to end.",
    href: "/work/form",
    thumbnail: null,
    bgColor: "#0D1117",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <ParallaxSection priority={true}>
        <Hero />
      </ParallaxSection>

      {/* Skills strip — visual break between hero and work */}
      <Marquee
        items={["UX Research", "Product Design", "Design Systems", "Prototyping", "Usability Testing", "B2B SaaS"]}
        speed={50}
        className="border-y border-neutral-100"
      />

      {/* WORK GRID */}
      <section id="work" className="container-wide mt-16 md:mt-28 mb-16 md:mb-32 w-full cv-auto">
        <ScrollReveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-bold text-neutral-900 uppercase tracking-widest">Work</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {work.map((project, index) => (
            <ParallaxSection key={project.title} delay={index * 0.1}>
              <WorkCard {...project} />
            </ParallaxSection>
          ))}
        </div>
      </section>
    </div>
  );
}
