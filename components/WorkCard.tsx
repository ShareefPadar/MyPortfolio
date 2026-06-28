"use client";

import Link from "next/link";
import Image from "next/image";

export interface WorkCardProps {
  title: string;
  category: string;
  description: string;
  href: string;
  thumbnail?: string | null;
  bgColor?: string;
}

const WorkCard = ({ title, category, description, href, thumbnail, bgColor = "#F5F5F7" }: WorkCardProps) => {
  return (
    <Link
      href={href}
      aria-label={`Read case study for ${title}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Thumbnail — real asset, or a solid-colour placeholder when none exists */}
      <div className="relative h-[180px] w-full overflow-hidden" style={{ backgroundColor: bgColor }}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 px-6">
            <span className="text-center font-serif text-2xl font-bold leading-tight text-neutral-400">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="mb-3 text-[11px] font-bold uppercase tracking-widest text-accent">
          {category}
        </span>
        <h3 className="mb-2 font-serif text-2xl font-bold leading-tight tracking-tight text-neutral-950">
          {title}
        </h3>
        <p className="mb-6 font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
          {description}
        </p>
        <div className="mt-auto flex items-center gap-2 font-sans text-sm font-bold text-neutral-900">
          Read case study
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;
