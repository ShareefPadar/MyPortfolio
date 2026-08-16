import { FaLinkedin, FaMedium, FaBehance } from "react-icons/fa6";
import PixelIcon from "@/components/px/PixelIcon";
import Reveal from "@/components/px/Reveal";
import CopyEmail from "@/components/px/CopyEmail";

/**
 * Footer (spec §7.4). Dark, centred.
 *
 * Status strip carries location and response time — never availability, which
 * dates the moment it is wrong.
 *
 * Case studies get variant="minimal": a next-story link plus a full sitemap is
 * two navigation systems arguing with each other.
 *
 * The social marks stay official SVGs, monochrome, always with a text label.
 * §4.7 is explicit that LinkedIn/Behance/Medium must never be pixelated.
 */

const EMAIL = "shareefpadar@gmail.com";

const SOCIAL = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/shareef-padar/", Icon: FaLinkedin },
  { name: "Behance", url: "https://www.behance.net/shareefpadar", Icon: FaBehance },
  { name: "Medium", url: "https://medium.com/@shareefpadar167", Icon: FaMedium },
];

export default function Footer({ variant = "full" }: { variant?: "full" | "minimal" }) {
  return (
    <footer className="w-full bg-night text-ntext">
      <div className="mx-auto max-w-wide px-16 py-64">
        {/* status strip */}
        <div className="mb-48 flex flex-wrap items-center gap-x-12 gap-y-8 border-b border-nline pb-16">
          <span className="led inline-block h-8 w-8 bg-lime" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ntext">
            Dubai · GMT+4 · usually replies within a day
          </span>
        </div>

        {variant === "full" && (
          <>
            <Reveal variant="head" className="mb-24">
              <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-lime">
                LET&apos;S CONNECT
              </h2>
            </Reveal>

            <p className="mb-32 max-w-lead font-sans text-[19px] leading-[1.65] text-white">
              Open to senior product design roles, and happy to walk through the work that
              sits under NDA on a call.
            </p>

            {/* Email is visible text, not a mailto-only link, so it can be copied. */}
            <div className="mb-48 flex flex-wrap items-center gap-12">
              <a
                href={`mailto:${EMAIL}`}
                className="font-mono text-[16px] text-white underline decoration-lime decoration-2 underline-offset-4"
              >
                {EMAIL}
              </a>
              <CopyEmail email={EMAIL} />
            </div>

            <div className="mb-48 flex flex-wrap gap-x-32 gap-y-12">
              {SOCIAL.map(({ name, url, Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-8 font-mono text-[11px] uppercase tracking-[0.08em] text-ntext hover:text-lime"
                >
                  <Icon size={16} aria-hidden="true" />
                  {name}
                  <PixelIcon name="external" size={8} />
                </a>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-16 border-t border-nline pt-24">
          <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-ntext">
            Designed &amp; built by Shareef Padar
          </p>
          <a
            href="#top"
            className="inline-flex min-h-[44px] items-center gap-8 font-mono text-[11px] uppercase tracking-[0.08em] text-ntext hover:text-lime"
          >
            <PixelIcon name="arrowU" size={8} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
