import AsciiPortrait from "@/components/px/AsciiPortrait";
import Button from "@/components/px/Button";
import Typewriter from "@/components/px/Typewriter";

/**
 * Hero (spec §7.1). Night surface, per §6.5 — the hero and footer are the two
 * dark blocks bookending a light page.
 *
 * The H1 is Silkscreen because "SENIOR PRODUCT DESIGNER WHO SHIPS." is a
 * statement of five words, which is exactly the gate in §2.1. It types; a
 * sentence-length heading would scan instead.
 */
const Hero = () => (
  <section className="bg-night">
    <div className="mx-auto max-w-wide px-16 py-64 md:py-96">
      <div className="grid items-center gap-48 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.08em] text-ntext">
            Shareef Padar · Dubai
          </p>

          <h1 className="mb-24">
            <Typewriter
              text="SENIOR PRODUCT DESIGNER WHO SHIPS."
              as="span"
              className="block font-pix text-[20px] font-bold leading-[1.75] tracking-[0.01em] text-lime md:text-[32px]"
            />
          </h1>

          <p className="mb-32 max-w-lead font-sans text-[17px] leading-[1.65] text-white md:text-[19px]">
            Six years in B2B UX, from research to shipped interface. I build and ship my own
            products in React and Tailwind too, which is why the prototypes on this site are
            real software rather than screenshots.
          </p>

          <div className="flex flex-wrap items-center gap-16">
            <Button level="primary" large href="/#work" icon="arrowD" onDark>
              VIEW WORK
            </Button>
            <Button
              level="secondary"
              large
              href="/assets/Shareef_Padar_Resume.pdf"
              external
              icon="download"
              onDark
            >
              RÉSUMÉ
            </Button>
          </div>
        </div>

        {/* Portrait sits right on desktop; below 900px it would crowd the
            statement, so it drops out rather than shrinking to mush. */}
        <div className="hidden justify-self-center md:block">
          <AsciiPortrait />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
