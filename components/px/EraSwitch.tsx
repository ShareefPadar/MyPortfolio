"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

/**
 * The time machine's year switcher, 1995 edition (era-system/eras/1995: a
 * sprite button beside the wordmark that opens a raised plate of sprite
 * buttons, one per year).
 *
 * Each year is a plain <a href="<this page>?era=<id>">, never next/link: the
 * other eras are static pages served by proxy.ts, so switching has to be a
 * real page load. The choice is remembered in a cookie by the proxy.
 *
 * Keys (same as every era): opens straight onto the current year from the
 * keyboard, ↑↓ ←→ Home End move between years, Esc and outside clicks close.
 */

export type EraItem = { id: string; year: string; name: string };

/** Remember the pick and flag the arrival wipe. Shared with EraRail, so both
    switchers leave the same trail for whichever era loads next. */
export const rememberEra = (id: string) => {
  try { localStorage.setItem("era", id); sessionStorage.setItem("era-arrive", id); } catch {}
};

export default function EraSwitch({ label, items }: { label: string; items: EraItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const viaKeys = useRef(false);
  const current = items.find((e) => e.id === "1995") ?? items[0];

  // keyboard opens onto the current year
  useEffect(() => {
    if (!open || !viaKeys.current) return;
    root.current?.querySelector<HTMLAnchorElement>('a[aria-current="true"]')?.focus();
  }, [open]);

  // outside clicks close
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  // closing the menu on navigation within the 1995 app
  useEffect(() => setOpen(false), [pathname]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); return; }
    const links = [...(root.current?.querySelectorAll<HTMLAnchorElement>("a[data-era]") ?? [])];
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    const to = ({ ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: links.length - 1 } as Record<string, number>)[e.key];
    if (to === undefined) return;
    e.preventDefault();
    links[(to + links.length) % links.length].focus();
  };

  const pick = rememberEra;

  return (
    <div
      ref={root}
      className="eraswitch relative mr-auto xl:hidden"
      data-open={open}
      onKeyDown={onKey}
      onBlur={(e) => { if (open && !root.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <span className="focusable">
        <button
          ref={btn}
          type="button"
          aria-expanded={open}
          aria-controls="eramenu"
          onClick={(e) => { viaKeys.current = e.detail === 0; setOpen((v) => !v); }}
          className="sp sp-neutral-3 sp-s3 erabtn inline-flex min-h-[36px] items-center gap-[6px] px-[10px] font-pix text-[12px] leading-none text-ink"
        >
          <span className="sr-only">{label}: </span>
          {current.year}
          <PixelIcon name="chevron" size={8} />
        </button>
      </span>
      <div id="eramenu" className="eramenu" hidden={!open}>
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.08em] text-mute" aria-hidden="true">{label}</p>
        <ul className="grid gap-8">
          {items.map((e) => {
            const here = e.id === current.id;
            return (
              <li key={e.id}>
                <span className="focusable block">
                  <a
                    data-era={e.id}
                    href={`${pathname}?era=${e.id}`}
                    aria-current={here ? "true" : undefined}
                    onClick={() => pick(e.id)}
                    className={`sp sp-neutral-3 sp-s3 ${here ? "sp-sunk" : ""} flex min-h-[40px] w-full items-center justify-between px-12 py-8 text-ink`}
                  >
                    <b className="font-pix text-[13px] font-normal">{e.year}</b>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">{e.name}</span>
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
