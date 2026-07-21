"use client";

import { ReactNode } from "react";

interface DeviceFrameProps {
  children: ReactNode;
  url?: string;
  label?: string;
  caption?: string;
}

// A framed "browser" shell for live, clickable prototypes embedded in case
// studies. Breaks out wider than the text column on large screens (negative
// margins rather than viewport tricks, so it survives transformed ancestors).
const DeviceFrame = ({ children, url = "prototype", label, caption }: DeviceFrameProps) => {
  return (
    <figure
      className="not-prose my-10 md:my-14"
      style={{ width: "100vw", maxWidth: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-6 lg:px-8">
      {label && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            {label}
          </span>
        </div>
      )}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
        {/* browser chrome */}
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-neutral-200" />
            <span className="h-3 w-3 rounded-full bg-neutral-200" />
            <span className="h-3 w-3 rounded-full bg-neutral-200" />
          </div>
          <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden="true">
              <path d="M4.5 7V5.5a3.5 3.5 0 1 1 7 0V7" stroke="currentColor" strokeWidth="1.4" />
              <rect x="3.5" y="7" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="truncate">{url}</span>
          </div>
          {/* spacer to balance the dots */}
          <div className="w-[52px]" aria-hidden="true" />
        </div>
        {/* prototype viewport */}
        <div
          className="h-[600px] overflow-y-auto overflow-x-auto overscroll-contain md:h-[680px]"
          role="region"
          aria-label={label || "Interactive prototype"}
        >
          {children}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-sm text-neutral-500">
          {caption}
        </figcaption>
      )}
      </div>
    </figure>
  );
};

export default DeviceFrame;
