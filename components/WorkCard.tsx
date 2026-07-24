"use client";

import Link from "next/link";
import Image from "next/image";

export interface WorkCardProps {
  headline?: string;
  title: string;
  category: string;
  description: string;
  href: string;
  thumbnail?: string | null;
  bgColor?: string;
  badge?: string;
  featured?: boolean;
}

const WorkCard = ({ headline, title, category, description, href, thumbnail, bgColor = "#F5F5F7", badge, featured = false }: WorkCardProps) => {
  const heading = headline ?? title;
  return (
    <Link
      href={href}
      aria-label={`Read case study for ${title}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Thumbnail — real asset, or a solid-colour placeholder when none exists */}
      <div
        className={`relative w-full overflow-hidden ${featured ? "h-[220px] md:h-[320px]" : "h-[180px]"}`}
        style={{ backgroundColor: bgColor }}
      >
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
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
            {category}
          </span>
          {badge && (
            <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {badge}
            </span>
          )}
        </div>
        <h3 className={`mb-1 font-serif font-bold leading-tight tracking-tight text-neutral-950 ${featured ? "text-2xl md:text-3xl" : "text-2xl"}`}>
          {heading}
        </h3>
        {headline && (
          <p className="mb-3 font-sans text-sm font-medium text-neutral-400">
            {title}
          </p>
        )}
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
