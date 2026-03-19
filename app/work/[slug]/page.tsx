"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import RoomyDemo from "@/components/RoomyDemo";
import { useParams } from "next/navigation";

const projects = {
  "instagram-local": {
    title: "Instagram Local Feed",
    description: "Instagram connects us to the world, but when it comes to our own neighborhoods, the experience falls short. Bridging global reach with local connections to help users discover events and businesses in their neighborhood.",
    role: "Product Designer",
    duration: "2-4 weeks",
    imageUrl: "/assets/instagram-local.png", // Just checking filename
    bgColor: "#E1F5FE",
    tags: ["Product Design", "UX Strategy", "Neighborhoods"],
    externalUrl: "https://shareefpadar167.medium.com/designing-instagrams-local-feed-bridging-global-reach-with-local-connections-82e6dbbc813f",
    externalLabel: "Read full story on Medium",
    stack: "",
    secondaryUrl: "",
    secondaryLabel: "",
    problem: "Instagram's local discoverability was underwhelming, with content buried under global hashtags. Users lacked a direct, intuitive way to connect with nearby events and creators in real-time.",
    solution: "A hyper-local feed integrated into the home navigation, utilizing geolocation to surface community-driven content and small business highlights seamlessly.",
    growth: "Navigating the thin line between personalization and privacy was the biggest takeaway. Local trust is a currency managed through clear UI patterns and user-consented geolocation mapping.",
    metric: "+45%",
    metricLabel: "User growth"
  },

  "omni-cast-ai": {
    title: "OmniCast AI",
    description: "AI-powered publishing assistant that predicts performance and optimizes multi-channel campaigns in real-time.",
    role: "Senior Product Designer",
    duration: "2-4 weeks",
    imageUrl: "/assets/omnicast-preview.png",
    bgColor: "#F0F4F8",
    tags: ["AI", "SaaS", "Product Design"],
    externalUrl: "https://www.notion.so/shareef-padar/OmniCast-AI-AI-Powered-Multi-Channel-Publishing-Assistant-23a967e98ad980d88a54ffac2e1e4e93",
    externalLabel: "Read on Notion",
    stack: "",
    secondaryUrl: "",
    secondaryLabel: "",
    problem: "Agencies and creators were drowning in fragmented workflows. Marketing teams had to guess optimal posting times and switch between four different AI tools just to draft a single omnichannel campaign.",
    solution: "We replaced 'black box' automation with an in-line AI workflow. By integrating predictive scheduling and real-time engagement insights directly into the content calendar, we eliminated the friction between planning and execution.",
    growth: "Achieved a significant uplift in engagement and saved users hours of manual work. Key takeaway: Explainability is critical. Users trust AI more when it provides clear confidence scores and allows for manual overrides.",
    metric: "+20%",
    metricLabel: "Engagement Lift"
  },
  "roomy": {
    title: "Roomy: The Bedspace OS",
    description: "A high-performance, mobile-first system designed to automate the management of 21-person shared living spaces.",
    role: "Founding Engineer & Designer",
    duration: "2-4 weeks",
    imageUrl: "/assets/roomy-preview.png",
    bgColor: "#F5F3FF",
    tags: ["Full Stack", "SaaS", "Bedspace OS"],
    stack: "Next.js 16 • React 19 • Tailwind CSS 4 • Cursor (AI-IDE)",
    externalUrl: "https://roomy-delta.vercel.app/",
    externalLabel: "Launch Live App",
    secondaryUrl: "https://github.com/ShareefPadar/Roomy",
    secondaryLabel: "View Repository",
    problem: "Co-living in high-density spaces like Dubai is a logistical disaster. With 21 roommates, financial transparency is zero and shared facilities like laundry are constant points of conflict. Core challenges included financial fog from lost receipts and manual rent overhead.",
    solution: "I architected a custom Pseudo-Relational Database Engine using LocalStorage. The system features Smart Ledger Logic for real-time balance recalculation, a Live-Status Scheduler for laundry with hard daily limits, and a role-based UI for Admins and Members.",
    growth: "This project was a deep dive into Vibe Coding. By using AI to handle boilerplate and complex state synchronization, I was able to focus on the system architecture. I learned to build a database client that provides a zero-latency user experience that feels like a native app.",
    metric: "-85%",
    metricLabel: "Manual Overhead Reduction"
  },
  "almosafer-audit": {
    title: "Almosafer UX Audit",
    description: "Refining the interface of the Middle East's leading travel platform by applying core UX principles to eliminate decision fatigue.",
    role: "Product Designer",
    duration: "2-4 weeks",
    imageUrl: "/assets/almosafer-preview.png",
    bgColor: "#E3F2FD",
    tags: ["UX Research", "Hick's Law", "Travel"],
    externalUrl: "https://shareefpadar167.medium.com/applying-hicks-law-and-visual-hierarchy-to-almosafer-s-interface-e2aa36a0d932",
    externalLabel: "Read full story on Medium",
    stack: "",
    secondaryUrl: "",
    secondaryLabel: "",
    problem: "The homepage was a minefield of decision paralysis. Hick's Law was regularly violated with repetitive icons, equal-weight service buttons, and visual clutter that overwhelmed users during the critical booking moments.",
    solution: "I consolidated niche services into a streamlined 'Travel Essentials' category and redefined the visual hierarchy. By creating distinct primary and secondary signifiers, we cleared the user's path toward the most important booking actions.",
    growth: "Significant reduction in time-to-decision and improved booking velocity. The audit proved that even minor, time-boxed UX corrections can drastically improve user confidence and conversion in high-traffic travel platforms.",
    metric: "Fast",
    metricLabel: "Booking Velocity"
  },
}


export default function WorkItem() {
  const { slug } = useParams();
  
  const { scrollY } = useScroll();
  const yImage = useSpring(useTransform(scrollY, [0, 800], [0, 80]), { damping: 20, stiffness: 45 });

  const project = projects[slug as keyof typeof projects] || projects["instagram-local"];
  // Get next project logic
  const projectSlugs = Object.keys(projects);
  const currentIndex = projectSlugs.indexOf(slug as string);
  const nextSlug = projectSlugs[(currentIndex + 1) % projectSlugs.length];
  const nextProject = projects[nextSlug as keyof typeof projects];

  return (
    <div className="w-full">
      {/* 01. THE IMAGE (Top Hero) */}
      <section 
        className="w-full pt-8 pb-12 md:pt-12 md:pb-16"
        style={{ backgroundColor: project.bgColor }}
      >
        <div className="container-wide">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-900/60 hover:text-neutral-900 font-bold uppercase tracking-widest text-[9px] md:text-xs transition-all mb-8 group px-4 md:px-12">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
          </Link>
          
          {slug !== "roomy" && (
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 pb-16 md:pb-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full hidden md:flex justify-center"
              >
                 <motion.img 
                   style={{ y: yImage }}
                   src={project.imageUrl} 
                   alt={project.title} 
                   className="w-full h-auto object-contain max-h-[750px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-[1.5rem] md:rounded-[2.5rem]"
                 />
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* THE SUMMARY GRID */}
      <section className="bg-white py-12 md:py-20">
        <div className="container-wide px-4 md:px-12 max-w-[1440px] mx-auto space-y-20">
          
          {/* 02. OVERVIEW */}
          <div className="space-y-6">
            <span className="text-[9px] font-bold text-neutral-900/40 uppercase tracking-[0.3em] block">02 — OVERVIEW</span>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-neutral-950 leading-tight tracking-tight">
                {project.title}.
              </h1>
              <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">My Role</p>
                   <p className="text-sm md:text-base font-medium text-neutral-800">{project.role}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Period</p>
                   <p className="text-sm md:text-base font-medium text-neutral-800">{project.duration}</p>
                </div>
                {project.stack && (
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">The Stack</p>
                     <p className="text-sm md:text-base font-medium text-neutral-800 tracking-tight">{project.stack}</p>
                  </div>
                )}
              </div>
              <p className="text-xl md:text-2xl text-neutral-800 leading-relaxed font-sans font-light max-w-4xl pt-4">
                {project.description}
              </p>
            </div>
          </div>

          {/* 03. THE FRICTION (Problem) */}
          <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
            <span className="text-[9px] font-bold text-neutral-900/40 uppercase tracking-[0.3em] block">03 — THE FRICTION</span>
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold">The Strategic Friction.</h3>
              <p className="text-base md:text-xl text-neutral-800 leading-relaxed font-sans opacity-90 max-w-2xl">
                {project.problem}
              </p>
            </div>
          </ScrollReveal>

          {/* 04. THE EXECUTION (Solution) */}
          <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
            <span className="text-[9px] font-bold text-neutral-900/40 uppercase tracking-[0.3em] block">04 — THE EXECUTION</span>
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold">The Strategic Execution.</h3>
              <p className="text-base md:text-xl text-neutral-800 leading-relaxed font-sans opacity-90 max-w-2xl">
                {project.solution}
              </p>
            </div>
          </ScrollReveal>

          {/* 05. WHAT I LEARNED */}
          <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
            <span className="text-[9px] font-bold text-neutral-900/40 uppercase tracking-[0.3em] block">05 — WHAT I LEARNED</span>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold italic text-neutral-950">Growth & Takeaways.</h3>
                <p className="text-base md:text-lg text-neutral-800 leading-relaxed font-sans opacity-80 max-w-2xl">
                  {project.growth}
                </p>
              </div>
              <div className="flex flex-col justify-end pt-4 md:pt-0">
                 <div className="text-5xl font-serif font-bold text-neutral-950">{project.metric || "+45%"}</div>
                 <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mt-2">{project.metricLabel || "User Growth"}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* 06. THE CALL TO ACTION */}
          <ScrollReveal className="pt-12 border-t border-neutral-200">
            <span className="text-[9px] font-bold text-neutral-900/40 uppercase tracking-[0.3em] block mb-8">06 — CALL TO ACTION</span>
            <div className="space-y-8">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-950 leading-snug max-w-xl">
                Ready to explore the full story?
              </h2>
              
              <div className="flex flex-wrap gap-4">
                {project.externalUrl !== "#" && (
                  <a 
                    href={project.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-neutral-950 text-white px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 transition-all shadow-xl group"
                  >
                    {project.externalLabel} <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {project.secondaryUrl && project.secondaryUrl !== "#" && (
                  <a 
                    href={project.secondaryUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-white text-neutral-950 border border-neutral-200 px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-50 transition-all shadow-sm group"
                  >
                    {project.secondaryLabel} <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Refined Footer Navigation */}
      <section className="py-24 md:py-32 bg-neutral-50 border-t border-neutral-100">
         <div className="container-wide max-w-[1440px] mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* BACK HOME */}
               <Link href="/" className="group flex flex-col items-start gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Return home</span>
                  <div className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-colors flex items-center gap-3 underline decoration-neutral-200 decoration-1 underline-offset-8">
                     <ArrowLeft className="w-5 h-5" /> Back to Home
                  </div>
               </Link>

               {/* NEXT PROJECT */}
               <Link href={`/work/${nextSlug}`} className="group flex flex-col items-end text-right gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">next story</span>
                  <div className="text-3xl md:text-5xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-all duration-300">
                     {nextProject.title} <ArrowRight className="inline-block ml-2 w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-3 transition-transform duration-300" />
                  </div>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
