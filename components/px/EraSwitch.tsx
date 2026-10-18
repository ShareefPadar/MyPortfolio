"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

/**
 * The time machine's year switcher, 1995 edition: a sprite pill floating in
 * the bottom-right corner below 1280px (from 1280px the EraRail takes over).
 * It opens a raised plate of sprite buttons upward, one per year, years only.
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

type Shake = { hint: string };

/**
 * Shake to time-travel (an add-on, phones only, off under reduced motion): a firm shake lands on a random other year.
 * Same rules as shakeJS in era-system/eras/_shared/client.mjs. It turns itself on, no button: at once where it can,
 * else on the first tap anywhere (iPhone Safari shows its own motion prompt then, once).
 */
function useShake(menu: React.RefObject<HTMLDivElement | null>) {
  const [mode, setMode] = useState<"off" | "on">("off");
  useEffect(() => {
    const box = menu.current;
    if (!box || !("DeviceMotionEvent" in window) || !matchMedia("(hover: none) and (pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const others = [...box.querySelectorAll<HTMLAnchorElement>("a[data-era]")].filter((a) => !a.hasAttribute("aria-current"));
    if (!others.length) return;
    const born = performance.now();
    // g-force per reading, as in shakeJS: over 2.3g is a hit, two hits 150ms to 1s apart is a shake
    let hits: number[] = [], gone = false;
    const onMotion = (e: DeviceMotionEvent) => {
      const g = e.accelerationIncludingGravity; if (!g || g.x == null || g.y == null || gone) return;
      const now = performance.now(), force = Math.hypot(g.x, g.y, g.z ?? 0) / 9.81;
      if (force < 2.3 || now - born < 1500 || (hits.length && now - hits[hits.length - 1] < 150)) return;
      hits = hits.filter((t) => now - t < 1000); hits.push(now);
      if (hits.length >= 2) { gone = true; const a = others[Math.floor(Math.random() * others.length)]; rememberEra(a.dataset.era!); location.href = a.href; }
    };
    const listen = () => { window.addEventListener("devicemotion", onMotion); setMode("on"); };
    const DME = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DME.requestPermission !== "function") { listen(); return () => window.removeEventListener("devicemotion", onMotion); }
    // no button (Shareef's call): ask straight away, and where that needs a gesture (iPhone Safari), on the first tap anywhere
    let asked = false;
    const request = () => { if (asked) return; DME.requestPermission!().then((s) => { if (s === "granted") { asked = true; listen(); } }).catch(() => {}); };
    const onTap = () => { request(); asked = true; };
    request();
    window.addEventListener("touchend", onTap, { once: true });
    return () => { window.removeEventListener("devicemotion", onMotion); window.removeEventListener("touchend", onTap); };
  }, [menu]);
  return mode;
}

export default function EraSwitch({ label, items, shake }: { label: string; items: EraItem[]; shake: Shake }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const viaKeys = useRef(false);
  const menu = useRef<HTMLDivElement>(null);
  const shakeMode = useShake(menu);
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
      // position as utilities too, not only the .eraswitch rule in globals.css: the first preview on a real phone showed
      // the pill unpositioned at the top left, so the placement no longer rests on that one rule
      className="eraswitch fixed right-16 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] z-[66] xl:hidden"
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
      <div id="eramenu" ref={menu} className="eramenu" hidden={!open}>
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
                    className={`sp sp-neutral-3 sp-s3 ${here ? "sp-sunk" : ""} flex min-h-[40px] w-full items-center justify-center px-12 py-8 text-ink`}
                  >
                    <b className="font-pix text-[13px] font-normal">{e.year}</b>
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
        {shakeMode === "on" && (
          <p className="mt-8 font-mono text-[11px] leading-[1.5] text-mute">{shake.hint}</p>
        )}
      </div>
    </div>
  );
}
