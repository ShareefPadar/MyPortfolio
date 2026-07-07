"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface Step {
  src: string;
  full?: string;
  label: string;
  number: string;
}

interface FlowProps {
  steps: Step[];
  caption?: string;
  aspect?: string;
}

const Flow = ({ steps, caption, aspect = "aspect-[9/19.5]" }: FlowProps) => {
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <figure className="my-10 not-prose">
      <div
        className="mx-auto grid gap-3 md:gap-5"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          maxWidth: steps.length <= 2 ? `${steps.length * 260}px` : undefined,
        }}
      >
        {steps.map((step) => (
          <div key={step.label}>
            <button
              type="button"
              onClick={() => setLightbox({ src: step.full || step.src, label: step.label })}
              aria-label={`View ${step.label} screen at full size`}
              className={`group relative block w-full ${aspect} cursor-zoom-in overflow-hidden rounded-2xl border border-neutral-100 shadow-lg`}
            >
              <Image
                src={step.src}
                alt={step.label}
                fill
                sizes="(max-width: 768px) 33vw, 300px"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950/80 text-[11px] font-bold text-white">
                {step.number}
              </span>
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:px-2.5">
                <ZoomIn className="h-3 w-3" />
              </span>
            </button>
            <span className="mt-3 block text-center text-xs font-bold uppercase tracking-widest text-neutral-500">
              {step.label}
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
          aria-label={`${lightbox.label} screen, full size`}
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

export default Flow;
