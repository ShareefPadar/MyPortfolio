import Link from "next/link";
import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/px/Reveal";
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
  <div className="mb-24 flex items-baseline gap-12 md:mb-32">
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
      <section id="work" data-guide-id="work" className="mx-auto w-full max-w-wide px-16 pt-64 md:pt-96">
        <SectionMarker n="01" title="SELECTED WORK" />

        <div className="grid gap-32 md:grid-cols-2 md:gap-48">
          {featured.map((study) => (
            <Reveal key={study.slug}>
              <WorkCard study={study} featured />
            </Reveal>
          ))}
        </div>

        {/* NDA notice.
            §7.1 specifies a bare strip with a full-width rule top and bottom.
            That reads as stray prose next to the cards: it is the only block
            on the page with no frame and no label, so it looks dropped in
            rather than built.

            It is a SUNK sprite frame, not the raised one the cards use. Sunk
            means recessed and contained (constraint #7), which is exactly what
            this content is — work that is held back. Raised would also imply
            the box is pressable, and unlike the cards above it, it is not. */}
        <div data-guide-id="nda" className="mt-48 md:mt-64">
          <Reveal>
            <div className="sp sp-neutral-4 sp-s4 sp-sunk p-24 md:p-32">
              <p className="mb-12 flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.11em] text-mute">
                <PixelIcon name="info" size={8} />
                UNDER NDA
              </p>

              <div className="flex flex-col items-start gap-16 sm:flex-row sm:items-end sm:justify-between sm:gap-32">
                <p className="max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
                  This is the work I can show publicly. Six years of production B2B design,
                  across logistics, healthcare, and travel, sits under NDA. Ask me about it
                  on a call.
                </p>

                {/* A text link, not a sprite button: a second raised button
                    inside an already-framed box stacks bevel on bevel, and the
                    reference draws this as an underlined Silkscreen link. The
                    44px tap floor lives on the anchor so the rule can still
                    hug the text. */}
                <Link
                  href="/work"
                  className="group inline-flex min-h-[44px] shrink-0 items-center"
                >
                  <span className="inline-flex items-center gap-8 border-b-[3px] border-ink pb-4 font-pix text-[10px] leading-none text-ink group-hover:border-blue">
                    VIEW ALL WORK
                    <PixelIcon name="arrowR" size={8} />
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 DESIGNED, BUILT & LIVE */}
      <section
        data-guide-id="live"
        className="mx-auto w-full max-w-wide px-16 pt-64 pb-96 md:pt-96 md:pb-128"
      >
        <SectionMarker n="02" title="DESIGNED, BUILT & LIVE" />

        <div className="grid gap-32 md:grid-cols-2 md:gap-48">
          {sideProjects.map((study) => (
            <Reveal key={study.slug}>
              {/* h-[calc(100%-17px)], not h-full: mt-17 clears the tab, and the
                  height has to give that back or the card overhangs its slot. */}
              <div className="card mt-[17px] flex h-[calc(100%-17px)] flex-col">
                <span className="card-tab">{study.domain}</span>

                <div className="card-body m-[10px] flex flex-1 flex-col p-16">
                  <p className="mb-8 flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
                    <span className="led inline-block h-8 w-8 bg-lime" aria-hidden="true" />
                    Live · side project
                  </p>
                  <h3 className="mb-4 font-sans text-[19px] font-medium leading-[1.4] text-ink">
                    {study.card.headline}
                  </h3>
                  <p className="mb-12 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
                    {study.card.title}
                  </p>
                  <p className="mb-16 font-sans text-[14.5px] leading-[1.6] text-ink">
                    {study.card.description}
                  </p>

                  {/* Two saturated buttons never sit side by side, so inside a
                      card the secondary drops to tertiary (§4.1). */}
                  <div className="mt-auto flex flex-wrap items-center gap-x-24 gap-y-8">
                    <Link
                      href={`/work/${study.slug}`}
                      className="inline-flex min-h-[44px] items-center gap-8 font-pix text-[10px] leading-none text-blue"
                    >
                      CASE STUDY
                      <PixelIcon name="arrowR" size={8} />
                    </Link>
                    {study.liveUrl && (
                      <a
                        href={study.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-8 font-pix text-[10px] leading-none text-blue"
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
