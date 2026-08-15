"use client";

import { useEffect, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

interface ShotProps {
  src: string;
  alt: string;
  caption?: string;
}

// A single framed, captioned, click-to-zoom UI screenshot for case studies.
const Shot = ({ src, alt, caption }: ShotProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    // Breaks wider than the reading column so the page has more than one
    // measure. No border, fill, or shadow: the screenshot carries its own
    // edge, and one less framed box per screenful.
    <figure className="not-prose wide my-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} full size`}
        className="well group relative block w-full cursor-zoom-in overflow-hidden bg-panel"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
        <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.11em] text-lime opacity-0 group-hover:opacity-100">
          <PixelIcon name="search" size={8} /> View full size
        </span>
      </button>
      {caption && (
        <figcaption className="mt-3 border-t border-line pt-3 font-sans text-[13px] leading-[1.55] text-mute">
          {caption}
        </figcaption>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-night/95 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}, full size`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 bg-ink p-3 text-lime md:right-8 md:top-8"
          >
            <PixelIcon name="close" size={16} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
        </div>
      )}
    </figure>
  );
};

export default Shot;
