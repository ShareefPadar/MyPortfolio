"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import RevealText from "@/components/RevealText";
import SectionLabel from "@/components/SectionLabel";
import MDXComponents from "@/components/MDXComponents";
import { useParams, notFound } from "next/navigation";
import { MDXProvider } from "@mdx-js/react";

import { projects } from '../data';

// Map each slug to its MDX file — loaded only when that slug is visited
const mdxMap: Record<string, React.ComponentType> = {
  "google-maps-route-pass": dynamic(() => import("@/content/work/google-maps-route-pass.mdx")),
  "omni-cast-ai":           dynamic(() => import("@/content/work/omni-cast-ai.mdx")),
  "almosafer-audit":        dynamic(() => import("@/content/work/almosafer-audit.mdx")),
  "instagram-local":        dynamic(() => import("@/content/work/instagram-local.mdx")),
  "roomy":                  dynamic(() => import("@/content/work/roomy.mdx")),
  "form":                   dynamic(() => import("@/content/work/form.mdx")),
};

export default function WorkItem() {
  const { slug } = useParams();

  const project = projects[slug as keyof typeof projects];
  if (!project) notFound();
  const projectSlugs = Object.keys(projects);
  const currentIndex = projectSlugs.indexOf(slug as string);
  const nextSlug = projectSlugs[(currentIndex + 1) % projectSlugs.length];
  const nextProject = projects[nextSlug as keyof typeof projects];

  const MDXContent = mdxMap[slug as string] ?? null;

  return (
    <div className="w-full bg-white">
      {/* BACK NAV */}
      <nav className="w-full pt-8 pb-4 bg-white">
        <div className="container-wide">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-900/60 hover:text-neutral-900 font-bold uppercase tracking-widest text-xs transition-all group">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
          </Link>
        </div>
      </nav>

      <section className="bg-white py-12 md:py-20">
        <div className="container-wide space-y-20">

          {/* 01 OVERVIEW */}
          <div className="space-y-6">
            <SectionLabel number={1} title="OVERVIEW" />
            <div className="space-y-6">
              <RevealText
                text={`${project.title}.`}
                tag="h1"
                className="text-3xl md:text-5xl font-serif font-bold text-neutral-950 leading-tight tracking-tight"
              />
              <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">My Role</p>
                  <p className="text-sm md:text-base font-medium text-neutral-800">{project.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Period</p>
                  <p className="text-sm md:text-base font-medium text-neutral-800">{project.duration}</p>
                </div>
                {(project as any).stack && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">The Stack</p>
                    <p className="text-sm md:text-base font-medium text-neutral-800 tracking-tight">{(project as any).stack}</p>
                  </div>
                )}
              </div>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans max-w-3xl pt-4">
                {project.description}
              </p>

              {/* Quote banner */}
              {(project as any).quote && (
                <ScrollReveal className="pt-8">
                  <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden group" style={{ backgroundColor: project.bgColor }}>
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 text-neutral-950 opacity-[0.04] transform rotate-12 pointer-events-none group-hover:scale-110 transition-all duration-700">
                      <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex gap-6 items-stretch">
                      <div className="w-1.5 bg-neutral-950/15 rounded-full shrink-0 self-stretch" />
                      <p className="text-xl md:text-3xl font-serif font-medium text-neutral-900 leading-relaxed italic pr-4 md:pr-12">
                        "{(project as any).quote}"
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>

          {/* MDX CONTENT — full case study */}
          {MDXContent && (
            <ScrollReveal className="pt-4 border-t border-neutral-100">
              <div className="max-w-3xl">
                <MDXProvider components={MDXComponents}>
                  <MDXContent />
                </MDXProvider>
              </div>
            </ScrollReveal>
          )}

          {/* Fallback sections when no MDX */}
          {!MDXContent && (
            <>
              <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
                <SectionLabel number={2} title="THE FRICTION" />
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-950">The Strategic Friction.</h2>
                  <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans max-w-2xl">{project.problem}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
                <SectionLabel number={3} title="THE EXECUTION" />
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-950">The Strategic Execution.</h2>
                  <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans max-w-2xl">{project.solution}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal className="space-y-6 pt-12 border-t border-neutral-100">
                <SectionLabel number={4} title="WHAT I LEARNED" />
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-serif font-bold italic text-neutral-950">Growth & Takeaways.</h2>
                    <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans max-w-2xl">{project.growth}</p>
                  </div>
                  <div className="flex flex-col justify-end pt-4 md:pt-0">
                    <div className="text-4xl font-serif font-bold text-neutral-950">{project.metric || "+45%"}</div>
                    <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mt-2">{project.metricLabel || "User Growth"}</p>
                  </div>
                </div>
              </ScrollReveal>
            </>
          )}

          {/* 05 CALL TO ACTION */}
          <ScrollReveal className="pt-12 border-t border-neutral-200">
            <SectionLabel number={MDXContent ? 2 : 5} title="CALL TO ACTION" className="mb-8" />
            <div className="space-y-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-950 leading-snug max-w-xl">
                Ready to explore the full story?
              </h2>
              <div className="flex flex-wrap gap-4">
                {(project as any).externalUrl && (project as any).externalUrl !== "#" && (
                  <a
                    href={(project as any).externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-neutral-950 text-white px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 transition-all shadow-xl group"
                  >
                    {(project as any).externalLabel} <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
                {(project as any).secondaryUrl && (project as any).secondaryUrl !== "#" && (
                  <a
                    href={(project as any).secondaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-white text-neutral-950 border border-neutral-200 px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-50 transition-all shadow-sm group"
                  >
                    {(project as any).secondaryLabel} <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER NAV */}
      <section className="py-24 md:py-32 bg-neutral-50 border-t border-neutral-100">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Link href="/" className="group flex flex-col items-start gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Return home</span>
              <div className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-colors flex items-center gap-3 underline decoration-neutral-200 decoration-1 underline-offset-8">
                <ArrowLeft className="w-5 h-5" /> Back to Home
              </div>
            </Link>
            <Link href={`/work/${nextSlug}`} className="group flex flex-col items-end text-right gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">next story</span>
              <div className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-all duration-300">
                {nextProject.title} <ArrowRight className="inline-block ml-2 w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-3 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
