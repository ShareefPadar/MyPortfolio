"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

interface Pane {
  src: string;
  full?: string;
  label: string;
}

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeFull?: string; // full-resolution image shown in the lightbox; defaults to `before`
  afterFull?: string; // full-resolution image shown in the lightbox; defaults to `after`
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  aspect?: string;
}

const BeforeAfter = ({
  before,
  after,
  beforeFull,
  afterFull,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  aspect = "aspect-[4/3]",
}: BeforeAfterProps) => {
  const [lightbox, setLightbox] = useState<Pane | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const panes: Array<Pane & { ring: string; labelColor: string }> = [
    { src: before, full: beforeFull || before, label: beforeLabel, ring: "border-line", labelColor: "text-mute" },
    { src: after, full: afterFull || after, label: afterLabel, ring: "border-accent/20", labelColor: "text-blue" },
  ];

  return (
    <figure className="my-32 not-prose">
      <div className="grid grid-cols-2 gap-12 md:gap-16">
        {panes.map((pane) => (
          <div key={pane.label}>
            <button
              type="button"
              onClick={() => setLightbox({ src: pane.full!, label: pane.label })}
              aria-label={`View ${pane.label} screenshot at full size`}
              // No cursor-zoom-in — see the comment in Shot.tsx. The button
              // element already gets the drawn hand cursor.
              className={`group relative block w-full ${aspect} overflow-hidden  border ${pane.ring} shadow-lg`}
            >
              <Image
                src={pane.src}
                alt={pane.label}
                fill
                sizes="(max-width: 768px) 50vw, 400px"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute bottom-8 right-8 flex items-center gap-4  bg-black/70 px-8 py-4 text-[9px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <PixelIcon name="search" size={8} /> View full size
              </span>
            </button>
            <span className={`mt-12 block text-center text-xs font-bold uppercase tracking-widest ${pane.labelColor}`}>
              {pane.label}
            </span>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-16 text-center text-sm text-mute font-sans">{caption}</figcaption>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-night/90 p-16 backdrop-blur-sm md:p-32"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} screenshot, full size`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-16 top-16  bg-white/10 p-8 text-white transition-colors hover:bg-white/20 md:right-32 md:top-32"
          >
            <PixelIcon name="close" size={16} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw]  object-contain shadow-2xl"
          />
        </div>
      )}
    </figure>
  );
};

export default BeforeAfter;
