import Link from "next/link";
import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/px/Reveal";
import PixelIcon from "@/components/px/PixelIcon";
import DinoRunner from "@/components/px/DinoRunner";
import { featured } from "@/lib/work";

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

const SectionMarker = ({ title }: { title: string }) => (
  <div className="mb-24 md:mb-32">
    <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">{title}</h2>
  </div>
);

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <div data-guide-id="hero">
        <Hero />
      </div>

      {/* SELECTED WORK */}
      <section id="work" data-guide-id="work" className="mx-auto w-full max-w-wide px-16 pt-64 pb-96 md:pt-96 md:pb-128">
        <SectionMarker title="SELECTED WORK" />

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
              <p className="mb-12 flex items-center gap-8 font-mono text-[9px] tracking-[0.02em] text-mute">
                <PixelIcon name="info" size={8} />
                Under NDA
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
                  <span className="inline-flex items-center gap-8 border-b-[3px] border-ink pb-4 font-pix text-[11px] leading-none text-ink group-hover:border-blue">
                    VIEW ALL WORK
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dino Runner, running along the top of the footer.
          Homepage only, not the layout: <Footer /> renders on every route, so
          putting the game "above the footer" there would drop it at the end of
          every case study too.

          NO bottom padding, deliberately. The canvas ends on its ground line
          and the footer starts immediately underneath, so the paper-to-night
          edge reads as the ground the dino is running on. Any gap here breaks
          the whole effect and leaves it floating. */}
      {/* Full-bleed: no max-width and no side padding, so the ground line runs
          the entire width of the viewport and meets the footer edge to edge.
          The hint inside keeps the page container for itself.

          overflow-x-clip because the focus plate sits at inset:-7px, which on
          a full-width element hangs 7px past the viewport and adds a
          horizontal scrollbar to the whole page. Clipping loses nothing: the
          part that hangs off is off-screen anyway, and the top edge a
          keyboard user actually sees is unaffected. `clip` rather than
          `hidden` so this never becomes a scroll container. */}
      <section aria-label="Dino Runner game" className="w-full overflow-x-clip">
        <Reveal>
          <DinoRunner />
        </Reveal>
      </section>
    </div>
  );
}
