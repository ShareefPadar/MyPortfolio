import Button from "@/components/px/Button";

/**
 * 404 (spec §2.2, display-l).
 *
 * The one place a page title genuinely IS a statement rather than a sentence,
 * so Silkscreen is correct here where it would be wrong on a case study.
 */
export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-wide px-16 py-96 md:py-128">
      <p className="mb-24 font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
        Error 404
      </p>

      <h1 className="mb-24 max-w-[16ch] font-pix text-[20px] font-bold leading-[1.8] text-ink">
        PAGE NOT FOUND
      </h1>

      <p className="mb-32 max-w-lead font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]">
        That link points at something which isn&apos;t here. It may have moved, or it may never
        have existed.
      </p>

      <div className="flex flex-wrap gap-16">
        <Button level="primary" href="/" icon="arrowL">
          BACK HOME
        </Button>
        <Button level="secondary" href="/work" icon="grid">
          ALL WORK
        </Button>
      </div>
    </div>
  );
}
