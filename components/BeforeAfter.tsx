"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

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
    { src: before, full: beforeFull || before, label: beforeLabel, ring: "border-neutral-100", labelColor: "text-neutral-400" },
    { src: after, full: afterFull || after, label: afterLabel, ring: "border-accent/20", labelColor: "text-accent" },
  ];

  return (
    <figure className="my-10 not-prose">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {panes.map((pane) => (
          <div key={pane.label}>
            <button
              type="button"
              onClick={() => setLightbox({ src: pane.full!, label: pane.label })}
              aria-label={`View ${pane.label} screenshot at full size`}
              className={`group relative block w-full ${aspect} cursor-zoom-in overflow-hidden rounded-2xl border ${pane.ring} shadow-lg`}
            >
              <Image
                src={pane.src}
                alt={pane.label}
                fill
                sizes="(max-width: 768px) 50vw, 400px"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="h-3 w-3" /> View full size
              </span>
            </button>
            <span className={`mt-3 block text-center text-xs font-bold uppercase tracking-widest ${pane.labelColor}`}>
              {pane.label}
            </span>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-neutral-500 font-sans">{caption}</figcaption>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} screenshot, full size`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </figure>
  );
};

export default BeforeAfter;
