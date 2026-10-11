"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

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
    <figure className="my-32 not-prose">
      <div
        className="mx-auto grid gap-12 md:gap-16"
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
              // No cursor-zoom-in — see the comment in Shot.tsx. The button
              // element already gets the drawn hand cursor.
              className={`group relative block w-full ${aspect} overflow-hidden  border border-line shadow-lg`}
            >
              <Image
                src={step.src}
                alt={step.label}
                fill
                sizes="(max-width: 768px) 33vw, 300px"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute left-8 top-8 flex h-24 w-24 items-center justify-center  bg-night/80 text-[11px] font-bold text-white">
                {step.number}
              </span>
              <span className="absolute bottom-8 right-8 flex items-center gap-4  bg-black/70 px-8 py-4 text-[9px] font-bold tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:px-8">
                <PixelIcon name="search" size={8} />
              </span>
            </button>
            <span className="mt-12 block text-center text-xs font-bold tracking-wide text-mute">
              {step.label}
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
          aria-label={`${lightbox.label} screen, full size`}
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

export default Flow;
