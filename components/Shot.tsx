"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface ShotProps {
  src: string;
  alt: string;
  caption?: string;
  /** background tint behind the framed screenshot; defaults to the Sanad lavender */
  bg?: string;
}

// A single framed, captioned, click-to-zoom UI screenshot for case studies.
const Shot = ({ src, alt, caption, bg = "#EEF0FD" }: ShotProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <figure className="not-prose my-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} full size`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-neutral-200 shadow-md"
        style={{ backgroundColor: bg }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
        <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" /> View full size
        </span>
      </button>
      {caption && (
        <figcaption className="mt-3 font-sans text-sm leading-relaxed text-neutral-500">
          {caption}
        </figcaption>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}, full size`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </figure>
  );
};

export default Shot;
