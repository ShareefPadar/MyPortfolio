import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/px/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { notFound } from "next/navigation";
import { getStudy, nextStory, slugs } from "@/lib/work";

/* A server component now: the MDX map resolves through the root
   mdx-components.tsx, which works in RSC where MDXProvider did not. */

const mdxMap: Record<string, React.ComponentType> = {
  "google-maps-route-pass": dynamic(() => import("@/content/work/google-maps-route-pass.mdx")),
  "omni-cast-ai": dynamic(() => import("@/content/work/omni-cast-ai.mdx")),
  "almosafer-audit": dynamic(() => import("@/content/work/almosafer-audit.mdx")),
  "sanad": dynamic(() => import("@/content/work/sanad.mdx")),
  "mizan": dynamic(() => import("@/content/work/mizan.mdx")),
  "instagram-local": dynamic(() => import("@/content/work/instagram-local.mdx")),
  "roomy": dynamic(() => import("@/content/work/roomy.mdx")),
  "form": dynamic(() => import("@/content/work/form.mdx")),
};

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getStudy(slug);
  if (!project) return { title: "Project | Shareef Padar" };

  return {
    title: `${project.title} | Shareef Padar`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Shareef Padar`,
      description: project.description,
      images: [{ url: project.imageUrl }],
    },
    // Without this the Twitter card falls back to the root layout's homepage
    // defaults, so every shared case-study link previews as the homepage.
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Shareef Padar`,
      description: project.description,
      images: [project.imageUrl],
    },
  };
}

export default async function WorkItem({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getStudy(slug);
  if (!project) notFound();

  const next = nextStory(slug);
  const MDXContent = mdxMap[slug] ?? null;

  return (
    <div className="w-full bg-white">
      {/* BACK NAV */}
      <nav className="w-full pt-8 pb-4 bg-white">
        <div className="container-wide">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-900/60 hover:text-neutral-900 font-bold uppercase tracking-widest text-xs transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />{" "}
            BACK TO HOME
          </Link>
        </div>
      </nav>

      <section className="bg-white py-12 md:py-20">
        <div className="container-wide space-y-20">
          {/* 01 OVERVIEW */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <SectionLabel number={1} title="OVERVIEW" />
            <div className="space-y-6">
              {/* The H1 states the problem solved; `title` stays short for the
                  footer "next story" link and the page/meta title. */}
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-950 leading-tight tracking-tight">
                {project.headline}.
              </h1>
              <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">My Role</p>
                  <p className="text-sm md:text-base font-medium text-neutral-800">{project.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Type</p>
                  <p className="text-sm md:text-base font-medium text-neutral-800">{project.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Period</p>
                  <p className="text-sm md:text-base font-medium text-neutral-800">{project.duration}</p>
                </div>
                {project.stack && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">The Stack</p>
                    <p className="text-sm md:text-base font-medium text-neutral-800 tracking-tight">
                      {project.stack}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans max-w-3xl pt-4">
                {project.description}
              </p>

              {/* Outcome — the recruiter's punchline, up front. Ruled rather
                  than boxed: the quote banner below is the one card here. */}
              {project.outcome && (
                <div className="flex flex-col gap-2 max-w-3xl border-t border-neutral-200 pt-4 md:flex-row md:gap-8">
                  <span className="text-[11px] font-bold text-accent tracking-widest uppercase shrink-0 md:w-[8rem] md:pt-1.5">
                    Outcome
                  </span>
                  <p className="text-base md:text-[1.0625rem] font-medium text-neutral-800 leading-relaxed">
                    {project.outcome}
                  </p>
                </div>
              )}

              {/* Quote banner */}
              {project.quote && (
                <Reveal className="pt-8">
                  <div
                    className="relative rounded-2xl p-6 md:p-8 overflow-hidden group"
                    style={{ backgroundColor: project.bgColor }}
                  >
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 text-neutral-950 opacity-[0.04] transform rotate-12 pointer-events-none group-hover:scale-110 transition-all duration-700">
                      <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex gap-6 items-stretch">
                      <div className="w-1.5 bg-neutral-950/15 rounded-full shrink-0 self-stretch" />
                      <p className="text-xl md:text-3xl font-serif font-medium text-neutral-900 leading-relaxed italic pr-4 md:pr-12">
                        &quot;{project.quote}&quot;
                      </p>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          {/* MDX CONTENT — full case study */}
          {MDXContent && (
            <Reveal className="pt-4 border-t border-neutral-100">
              {/* The first paragraph runs larger and darker as a standfirst, so
                  the body opens with a change of scale instead of a flat wall. */}
              <div className="max-w-3xl mx-auto [&>p:first-of-type]:text-lg [&>p:first-of-type]:md:text-xl [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:text-neutral-800">
                <MDXContent />
              </div>
            </Reveal>
          )}

          {/* CALL TO ACTION — live products only; case studies end on their own reflection */}
          {project.type === "Live product" && (
            <Reveal className="pt-12 border-t border-neutral-200">
              <SectionLabel number={2} title="SEE IT LIVE" className="mb-8" />
              <div className="space-y-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-950 leading-snug max-w-xl">
                  Don&apos;t take the case study&apos;s word for it. Go use the product.
                </h2>
                <div className="flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-neutral-950 text-white px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 transition-all shadow-xl group"
                    >
                      {project.liveLabel}{" "}
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center w-full md:w-auto items-center gap-3 bg-white text-neutral-950 border border-neutral-200 px-6 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-50 transition-all shadow-sm group"
                    >
                      {project.repoLabel}{" "}
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* FOOTER NAV */}
      <section className="py-24 md:py-32 bg-neutral-50 border-t border-neutral-100">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Link href="/" className="group flex flex-col items-start gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Return home
              </span>
              <div className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-colors flex items-center gap-3 underline decoration-neutral-200 decoration-1 underline-offset-8">
                <ArrowLeft className="w-5 h-5" /> Back to Home
              </div>
            </Link>
            <Link href={`/work/${next.slug}`} className="group flex flex-col items-end text-right gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                next story
              </span>
              <div className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 group-hover:text-neutral-600 transition-all duration-300">
                {next.title}{" "}
                <ArrowRight className="inline-block ml-2 w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-3 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
