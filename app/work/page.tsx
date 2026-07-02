import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WorkCard from "@/components/WorkCard";
import { workEntries } from "./workList";

export const metadata: Metadata = {
  title: "Work | Shareef Padar — Senior Product Designer",
  description:
    "Case studies and live products: UX audits, B2B SaaS concepts, and shipped side projects by Shareef Padar, Senior Product Designer based in Dubai.",
};

export default function WorkIndex() {
  return (
    <div className="container-wide py-8 md:py-12 w-full">
      <nav className="mb-10 md:mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-900/60 hover:text-neutral-900 font-bold uppercase tracking-widest text-xs transition-all group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
      </nav>

      <div className="mb-10 md:mb-16 max-w-2xl">
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
          All Work
        </h1>
        <p className="font-sans text-base leading-relaxed text-neutral-600 md:text-lg">
          Case studies, concepts, and live products. Client work in logistics, healthcare,
          and travel is under NDA — detailed walkthroughs available on request.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {workEntries.map((project) => (
          <WorkCard
            key={project.slug}
            title={project.title}
            category={project.category}
            badge={project.badge}
            description={project.description}
            href={`/work/${project.slug}`}
            thumbnail={project.thumbnail}
            bgColor={project.bgColor}
          />
        ))}
      </div>
    </div>
  );
}
