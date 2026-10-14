"use client";

import { usePathname } from "next/navigation";
import { rememberEra, type EraItem } from "@/components/px/EraSwitch";

/**
 * The time machine as a rail: all five years standing on the right edge of
 * the page, always visible, one click each. The current year is sunk, which
 * is what sunk already means everywhere else in this system.
 *
 * Wide screens only (xl and up). The page column is 1100px, so below 1280
 * there is no gutter for the rail to stand in and it would sit on the copy;
 * there the year button beside the wordmark (EraSwitch) takes over instead.
 * The two never show together.
 *
 * Plain <a href="?era=">, never next/link, for the same reason as EraSwitch:
 * the other eras are static pages behind proxy.ts, so a switch has to be a
 * real page load.
 */
export default function EraRail({ label, items }: { label: string; items: EraItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="erarail hidden xl:block">
      <ul className="grid gap-8">
        {items.map((e) => {
          const here = e.id === "1995";
          return (
            <li key={e.id}>
              <span className="focusable block">
                <a
                  data-era={e.id}
                  href={`${pathname}?era=${e.id}`}
                  aria-current={here ? "true" : undefined}
                  onClick={() => rememberEra(e.id)}
                  className={`sp sp-neutral-3 sp-s3 ${here ? "sp-sunk" : ""} flex min-h-[44px] w-[64px] items-center justify-center text-ink`}
                >
                  <b className="font-pix text-[12px] font-normal leading-none">{e.year}</b>
                </a>
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
