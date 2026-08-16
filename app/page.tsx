import Link from "next/link";
import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/px/Reveal";
import Button from "@/components/px/Button";
import PixelIcon from "@/components/px/PixelIcon";
import PixelGuide from "@/components/px/PixelGuide";
import { featured, sideProjects } from "@/lib/work";

/**
 * Homepage (spec §7.1).
 *
 * A server component: the only client code on this page is the portrait canvas,
 * the typewriter, and the reveals, each of which is its own small island.
 *
 * Sections carry data-guide-id, and the tour copy lives in lib/guide.ts.
 * The old version put the strings in the markup and read them with
 * querySelectorAll, which meant rewriting a section silently killed the
 * feature. PixelGuide now warns in development when an id resolves to
 * nothing.
 */

const SectionMarker = ({ n, title }: { n: string; title: string }) => (
  <div className="mb-6 flex items-baseline gap-3 md:mb-8">
    <Reveal variant="pop" as="span" className="font-pix text-[20px] font-bold leading-none text-blue">
      {n}
    </Reveal>
    <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">{title}</h2>
  </div>
);

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Homepage only: the tour explains the page it is standing on. */}
      <PixelGuide />
      <div data-guide-id="hero">
        <Hero />
      </div>

      {/* 01 SELECTED WORK */}
      <section id="work" data-guide-id="work" className="mx-auto w-full max-w-wide px-4 pt-16 md:pt-24">
        <SectionMarker n="01" title="SELECTED WORK" />

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {featured.map((study) => (
            <Reveal key={study.slug}>
              <WorkCard study={study} featured relevant={study.domain === "FINTECH"} />
            </Reveal>
          ))}
        </div>

        {/* NDA strip — full-width rules top and bottom (§7.1) */}
        <div data-guide-id="nda" className="mt-12 border-y-[3px] border-ink py-6 md:mt-16">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
              This is the work I can show publicly. Six years of production B2B design, across
              logistics, healthcare, and travel, sits under NDA. Ask me about it on a call.
            </p>
            <Button level="secondary" href="/work" icon="arrowR">
              VIEW ALL WORK
            </Button>
          </div>
        </div>
      </section>

      {/* 02 DESIGNED, BUILT & LIVE */}
      <section
        data-guide-id="live"
        className="mx-auto w-full max-w-wide px-4 pt-16 pb-24 md:pt-24 md:pb-32"
      >
        <SectionMarker n="02" title="DESIGNED, BUILT & LIVE" />

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {sideProjects.map((study) => (
            <Reveal key={study.slug}>
              <div className="card mt-[17px] flex h-full flex-col">
                <span className="card-tab">{study.domain}</span>

                <div className="card-body m-[10px] flex flex-1 flex-col p-4">
                  <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
                    <span className="led inline-block h-2 w-2 bg-lime" aria-hidden="true" />
                    Live · side project
                  </p>
                  <h3 className="mb-1 font-sans text-[19px] font-medium leading-[1.4] text-ink">
                    {study.card.headline}
                  </h3>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
                    {study.card.title}
                  </p>
                  <p className="mb-4 font-sans text-[14.5px] leading-[1.6] text-ink">
                    {study.card.description}
                  </p>

                  {/* Two saturated buttons never sit side by side, so inside a
                      card the secondary drops to tertiary (§4.1). */}
                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      href={`/work/${study.slug}`}
                      className="inline-flex min-h-[44px] items-center gap-2 font-pix text-[10px] leading-none text-blue"
                    >
                      CASE STUDY
                      <PixelIcon name="arrowR" size={8} />
                    </Link>
                    {study.liveUrl && (
                      <a
                        href={study.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 font-pix text-[10px] leading-none text-blue"
                      >
                        LAUNCH APP
                        <PixelIcon name="external" size={8} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
