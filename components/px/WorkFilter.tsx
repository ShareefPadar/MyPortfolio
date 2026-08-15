"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PixelIcon from "@/components/px/PixelIcon";
import type { Domain } from "@/lib/work";

/**
 * Domain filter chips (spec §7.2). Deep-linkable via ?filter=fintech, so a
 * filtered view can be shared or bookmarked rather than only clicked into.
 *
 * A small client island. The page around it stays static — this is wrapped in
 * <Suspense> by the caller because useSearchParams opts a component out of
 * static rendering.
 *
 * Chips reuse the sprite: raised means selectable, sunk means current, the
 * same bevel language as everything else.
 */
const WorkFilter = ({ domains }: { domains: Domain[] }) => {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("filter")?.toUpperCase() ?? null;

  const set = (d: Domain | null) => {
    router.replace(d ? `/work?filter=${d.toLowerCase()}` : "/work", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by domain">
      <span className="focusable">
        <button
          type="button"
          onClick={() => set(null)}
          aria-pressed={!active}
          className={`sp sp-neutral-3 sp-s3 ${!active ? "sp-sunk" : ""} inline-flex min-h-[44px] items-center px-3 font-mono text-[9px] uppercase tracking-[0.11em] ${
            !active ? "text-ink" : "text-mute"
          }`}
        >
          All
        </button>
      </span>

      {domains.map((d) => {
        const on = active === d;
        return (
          <span key={d} className="focusable">
            <button
              type="button"
              onClick={() => set(on ? null : d)}
              aria-pressed={on}
              className={`sp sp-neutral-3 sp-s3 ${on ? "sp-sunk" : ""} inline-flex min-h-[44px] items-center gap-2 px-3 font-mono text-[9px] uppercase tracking-[0.11em] ${
                on ? "text-ink" : "text-mute"
              }`}
            >
              {d}
              {on && <PixelIcon name="close" size={8} />}
            </button>
          </span>
        );
      })}
    </div>
  );
};

export default WorkFilter;
