"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ISSUE } from "@/lib/magazine";

function formatDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Masthead() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  const linkClass = (active: boolean) =>
    `font-sans text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
      active ? "text-golden" : "text-creme/70 hover:text-creme"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-coffee text-creme border-b border-creme/10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-7 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center text-center md:text-left">
          <span className="font-typewriter text-[10px] tracking-[0.12em] text-creme/80 order-2 md:order-1">
            {formatDate()}
          </span>

          <div className="flex items-center justify-center gap-6 order-1 md:order-2">
            <Link href="/" className={linkClass(pathname === "/")}>
              Cover
            </Link>
            <Link href="/#contents" className={linkClass(pathname.startsWith("/work"))}>
              Features
            </Link>
            <Link href="/about" className={linkClass(isAbout)}>
              Editor
            </Link>
            <a
              href="mailto:shareefpadar@gmail.com"
              className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-creme/70 hover:text-creme transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="font-typewriter text-[10px] tracking-[0.12em] text-creme/80 text-center md:text-right order-3 flex flex-col md:block gap-0.5">
            <span>Established {ISSUE.established}</span>
            <span className="md:hidden"> · </span>
            <span>{ISSUE.location}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
