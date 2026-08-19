import PixelPortrait from "@/components/px/PixelPortrait";
import Button from "@/components/px/Button";
import Typewriter from "@/components/px/Typewriter";

/**
 * Hero (spec §7.1), on paper.
 *
 * The spec's §6.5 puts the hero and footer on night as two dark blocks
 * bookending the work. This deliberately departs from that: the hero shares
 * the page surface, so only the footer is dark.
 *
 * That change cascades, which is why it is not just a background swap:
 *   - the H1 is ink, not lime. Lime on paper has almost no contrast, and §1.3
 *     scopes lime to accents rather than large text anyway
 *   - buttons drop `onDark`, so their outlines darken again
 *   - the portrait switches to its paper ramp, where levels darken away from
 *     the surface instead of lightening
 */
const Hero = () => (
  <section className="bg-paper">
    <div className="mx-auto max-w-wide px-16 py-64 md:py-96">
      <div className="grid items-center gap-48 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
            Shareef Padar · Dubai
          </p>

          <h1 className="mb-24">
            <Typewriter
              text="SENIOR PRODUCT DESIGNER WHO SHIPS."
              as="span"
              className="block font-pix text-[20px] font-bold leading-[1.75] tracking-[0.01em] text-ink md:text-[32px]"
            />
          </h1>

          <p className="mb-32 max-w-lead font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]">
            Six years in B2B UX, from research to shipped interface. I build and ship my own
            products in React and Tailwind too, which is why the prototypes on this site are
            real software rather than screenshots.
          </p>

          <div className="flex flex-wrap items-center gap-16">
            <Button level="primary" large href="/#work" icon="arrowD">
              VIEW WORK
            </Button>
            <Button
              level="secondary"
              large
              href="/assets/Shareef_Padar_Resume.pdf"
              external
              icon="download"
            >
              RÉSUMÉ
            </Button>
          </div>
        </div>

        {/* Portrait sits right on desktop; below 900px it would crowd the
            statement, so it drops out rather than shrinking to mush.

            `transparent` knocks the white field out of the source art by
            flood-filling from the border, so the portrait sits on the page
            surface rather than in a white box. Capped at 320px: the art is
            96x144, so an uncapped column would make it taller than the copy
            beside it and push the fold down. */}
        <div className="hidden justify-self-center md:block">
          <PixelPortrait transparent className="w-[320px]" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
