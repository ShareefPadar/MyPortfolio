"use client";

import { ReactNode } from "react";

interface DeviceFrameProps {
  children: ReactNode;
  url?: string;
  label?: string;
  caption?: string;
}

/**
 * The bezel (spec §7.3, section 07 "TRY IT").
 *
 * A plate frame with a sunk well holding a live prototype, an LED strip to
 * mark it as running, and a mono URL label. Breaks to the `wide` grid column
 * — the previous `width:100vw; margin-left:calc(50% - 50vw)` also overflowed
 * by the scrollbar's width on browsers that reserve space for one.
 *
 * The `.iso` wrapper is load-bearing. SanadPrototype and MizanPrototype are
 * mocks of OTHER companies' products with their own scoped design systems.
 * They set fonts on their own roots but inherit everything else, so without
 * this boundary any inherited property from the 8-bit system leaks into two
 * 1000-line files nobody re-reads.
 */
const DeviceFrame = ({ children, url = "prototype", label, caption }: DeviceFrameProps) => {
  return (
    <figure className="not-prose wide my-48">
      {label && (
        <div className="mb-12 flex items-center gap-8">
          <span className="led inline-block h-8 w-8 bg-lime" aria-hidden="true" />
          <span className="font-mono text-[9px] uppercase tracking-[0.11em] text-mute">
            {label}
          </span>
        </div>
      )}

      <div className="card mt-0">
        {/* URL strip: mono, because it is a label rather than a sentence. */}
        <div className="flex items-center gap-8 px-12 py-8">
          <span className="flex gap-4" aria-hidden="true">
            <span className="h-8 w-8 bg-mute" />
            <span className="h-8 w-8 bg-mute" />
            <span className="h-8 w-8 bg-mute" />
          </span>
          <span className="mx-auto font-mono text-[9px] tracking-[0.08em] text-mute">
            {url}
          </span>
          <span className="w-[26px]" aria-hidden="true" />
        </div>

        {/* Sunk well: it contains the prototype rather than inviting a click. */}
        <div
          className="well iso m-[10px] mt-0 h-[600px] overflow-auto overscroll-contain bg-paper md:h-[680px]"
          role="region"
          aria-label={label || "Interactive prototype"}
        >
          {children}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-12 border-t border-line pt-12 font-sans text-[14px] leading-[1.55] text-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default DeviceFrame;
