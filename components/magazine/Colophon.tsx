import Link from "next/link";
import { FaLinkedin, FaMedium, FaInstagram, FaBehance } from "react-icons/fa6";
import { ISSUE } from "@/lib/magazine";

const socialLinks = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/shareef-padar/", icon: FaLinkedin },
  { name: "Medium", url: "https://medium.com/@shareefpadar167", icon: FaMedium },
  { name: "Instagram", url: "https://www.instagram.com/cheppu_padar", icon: FaInstagram },
  { name: "Behance", url: "https://www.behance.net/shareefpadar", icon: FaBehance },
];

export default function Colophon() {
  return (
    <footer className="bg-coffee text-creme">
      <div className="max-w-[1200px] mx-auto px-5 md:px-7 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="space-y-3">
            <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-golden">
              Editor & Publisher
            </p>
            <p className="font-display text-2xl font-bold">Shareef Padar</p>
            <p className="font-sans text-sm font-light text-creme/70 leading-relaxed">
              Design engineer bridging UX strategy and production code. Based in Dubai.
            </p>
            <a
              href="mailto:shareefpadar@gmail.com"
              className="font-sans text-sm text-peach hover:text-golden transition-colors"
            >
              shareefpadar@gmail.com
            </a>
          </div>

          <div className="space-y-3">
            <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-golden">
              In This Publication
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="font-sans text-sm text-creme/70 hover:text-creme transition-colors">
                Cover Story
              </Link>
              <Link href="/#contents" className="font-sans text-sm text-creme/70 hover:text-creme transition-colors">
                Table of Contents
              </Link>
              <Link href="/about" className="font-sans text-sm text-creme/70 hover:text-creme transition-colors">
                From the Editor&apos;s Desk
              </Link>
              <a
                href="/assets/Shareef_Padar_Design_Engineer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-creme/70 hover:text-creme transition-colors"
              >
                Download Résumé
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-golden">
              Set In
            </p>
            <p className="font-sans text-xs font-light text-creme/60 leading-relaxed">
              Cormorant Display, Pacifico, Special Elite &amp; DM Sans. {ISSUE.label}. Always free.
            </p>
            <div className="flex gap-5 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-creme/50 hover:text-golden transition-colors"
                  aria-label={link.name}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
            <p className="font-typewriter text-[10px] tracking-[0.1em] text-creme/40 pt-2">
              © {new Date().getFullYear()} Shareef Padar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
