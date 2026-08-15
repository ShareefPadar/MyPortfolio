"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

/**
 * Nav (spec §4.6).
 *
 * The only client component in the shell: it needs the pathname and a scroll
 * listener. The flatten is a class toggle with no transition — instant, per
 * §5.1. Active items are sunk (inverted bevel), which is the same language the
 * sprites use everywhere else: raised means you can act on it, sunk means you
 * are already there.
 *
 * Résumé is a blue sprite button, never a nav link. It is a download rather
 * than a place, so it can never be "current", and it doubles as the only
 * always-visible CTA.
 */

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
] as const;

const RESUME = "/assets/Shareef_Padar_Resume.pdf";

const Navbar = () => {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  /* A case study keeps WORK sunk: the study's own back link handles going up,
     so the nav should still read as "you are in the work section". */
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={stuck ? "" : "mx-auto max-w-wide px-4 pt-4"}>
        <nav className={stuck ? "nav-plate stuck" : "nav-plate"} aria-label="Main">
          <div
            className={`mx-auto flex items-center justify-between gap-4 px-4 ${
              stuck ? "max-w-wide py-2" : "py-3"
            }`}
          >
            {/* Wordmark. Silkscreen per §2.2 (display-m: "nav wordmark"). */}
            <Link
              href="/"
              className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink"
            >
              SHAREEF PADAR
            </Link>

            {/* desktop */}
            <div className="hidden items-center gap-2 md:flex">
              {LINKS.map((l) => {
                const current = isCurrent(l.href);
                return (
                  <span key={l.href} className="focusable">
                    <Link
                      href={l.href}
                      aria-current={current ? "page" : undefined}
                      className={`sp sp-neutral-3 sp-s3 ${current ? "sp-sunk" : ""} inline-flex min-h-[44px] items-center px-3 font-mono text-[11px] uppercase leading-none tracking-[0.08em] ${
                        current ? "text-ink" : "text-mute"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </span>
                );
              })}

              <span className="focusable ml-2">
                <a
                  href={RESUME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sp sp-blue-4 sp-s4 inline-flex min-h-[44px] items-center gap-2 px-[13px] font-pix text-[11px] font-bold leading-none text-lime"
                >
                  RÉSUMÉ
                  <PixelIcon name="download" size={8} />
                </a>
              </span>
            </div>

            {/* mobile */}
            <span className="focusable md:hidden">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex h-11 w-11 flex-col items-center justify-center gap-[3px]"
              >
                <span className="burger-bar" />
                <span className="burger-bar" />
                <span className="burger-bar" />
              </button>
            </span>
          </div>
        </nav>
      </div>

      {/* Full-width drop menu, items numbered like the section markers. */}
      {open && (
        <div
          id="mobile-menu"
          className="border-b-[3px] border-ink bg-panel md:hidden"
        >
          <ul className="mx-auto max-w-wide px-4 py-2">
            {[...LINKS, { href: RESUME, label: "RÉSUMÉ" }].map((l, i) => {
              const current = l.href !== RESUME && isCurrent(l.href);
              const n = String(i + 1).padStart(2, "0");
              const cls = `flex min-h-[44px] items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] ${
                current ? "text-ink" : "text-mute"
              }`;
              return (
                <li key={l.href} className={current ? "bg-lime px-2" : "px-2"}>
                  {l.href === RESUME ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      <span className="font-pix text-blue">{n}</span>
                      {l.label}
                      <PixelIcon name="download" size={8} />
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      aria-current={current ? "page" : undefined}
                      className={cls}
                    >
                      <span className="font-pix text-blue">{n}</span>
                      {l.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
