import type { Metadata } from "next";
import Button from "@/components/px/Button";
import PixelIcon, { ICONS, type IconName } from "@/components/px/PixelIcon";
import Reveal from "@/components/px/Reveal";
import Typewriter from "@/components/px/Typewriter";
import AsciiPortrait from "@/components/px/AsciiPortrait";
import { PALETTE_NAMES, SCALES } from "@/lib/sprite";
import type { IconSize } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Kitchen sink — 8-bit design system",
  robots: { index: false, follow: false },
};

const ICON_SIZES: IconSize[] = [8, 16, 24, 32, 48];
const DARK_PALETTES = new Set(["blueDk", "limeDk", "neutralDk"]);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">{children}</p>
);

const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section className="mb-24">
    <div className="mb-6 flex items-baseline gap-3">
      <span className="font-pix text-[20px] leading-none text-blue">{n}</span>
      <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">{title}</h2>
    </div>
    {children}
  </section>
);

export default function KitchenSink() {
  return (
    <div className="mx-auto max-w-wide px-4 py-16">
      <header className="mb-24">
        <h1 className="mb-4 font-pix text-[20px] leading-[1.8] text-ink">DESIGN SYSTEM</h1>
        <p className="max-w-lead font-sans text-[19px] leading-[1.65] text-ink">
          Every sprite, icon and control in one place. Check this against the reference
          prototypes in <span className="font-mono text-[0.88em]">8 bit/design-reference/</span> before
          building any page on top of it.
        </p>
      </header>

      {/* ── sprites ─────────────────────────────────────────────── */}
      <Section n="01" title="SPRITES">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          One 6×6 map per palette, stretched with <span className="font-mono text-[0.88em]">border-image</span>.
          Raised means interactive or containing; sunk means pressed, recessed, current, or an input.
          There is no third meaning.
        </p>
        <div className="space-y-8">
          {PALETTE_NAMES.map((name) => {
            const dark = DARK_PALETTES.has(name);
            return (
              <div key={name} className={dark ? "bg-night p-6" : ""}>
                <Label>{name}</Label>
                <div className="mt-3 flex flex-wrap items-center gap-6">
                  {SCALES.map((scale) => (
                    <div key={scale} className="flex items-center gap-3">
                      <div
                        className={`sp sp-${name}-${scale} sp-s${scale} grid h-16 w-28 place-items-center`}
                      >
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.11em] ${dark ? "text-ntext" : "text-mute"}`}
                        >
                          s{scale}
                        </span>
                      </div>
                      <div
                        className={`sp sp-${name}-${scale} sp-s${scale} sp-sunk grid h-16 w-28 place-items-center`}
                      >
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.11em] ${dark ? "text-ntext" : "text-mute"}`}
                        >
                          sunk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── buttons ─────────────────────────────────────────────── */}
      <Section n="02" title="BUTTONS">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          Four levels, one primary per view. Hover lightens the face, press sinks the bevel.
          Every one is at least 44px tall.
        </p>
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Button level="primary" icon="arrowR">VIEW WORK</Button>
          <Button level="secondary">SECONDARY</Button>
          <Button level="tertiary">TERTIARY</Button>
          <Button level="disabled">DISABLED</Button>
        </div>
        <Label>large — scale 6, drawn at size, never scaled up</Label>
        <div className="mt-3 mb-8 flex flex-wrap items-center gap-4">
          <Button level="primary" large icon="download">RÉSUMÉ</Button>
          <Button level="secondary" large>SECONDARY</Button>
        </div>
        <div className="bg-night p-8">
          <Label>on night — outlines lighten or the frame dissolves</Label>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Button level="primary" onDark icon="arrowR">VIEW WORK</Button>
            <Button level="secondary" onDark>SECONDARY</Button>
          </div>
        </div>
      </Section>

      {/* ── icons ───────────────────────────────────────────────── */}
      <Section n="03" title="ICONS">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          Twenty 8×8 maps as inline SVG so they inherit{" "}
          <span className="font-mono text-[0.88em]">currentColor</span>. Sizes are a closed set:
          8, 16, 24, 32, 48. Anything else is a type error.
        </p>
        <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-6">
          {(Object.keys(ICONS) as IconName[]).map((n) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <PixelIcon name={n} size={24} className="text-ink" />
              <span className="font-mono text-[9px] uppercase tracking-[0.11em] text-mute">{n}</span>
            </div>
          ))}
        </div>
        <Label>every allowed size</Label>
        <div className="mt-3 flex items-end gap-6">
          {ICON_SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <PixelIcon name="arrowR" size={s} className="text-blue" />
              <span className="font-mono text-[9px] text-mute">{s}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── type ────────────────────────────────────────────────── */}
      <Section n="04" title="TYPE">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          The face is chosen by what a string <em>is</em>, not by its heading level. A statement
          is Silkscreen, a label is mono, and anything read as a sentence is Geist — even at 40px.
        </p>
        <div className="space-y-6">
          <div>
            <Label>display-xl · Silkscreen 700 · statement</Label>
            <p className="mt-2 font-pix text-[32px] font-bold leading-[1.75] tracking-[0.01em] text-ink">
              SENIOR PRODUCT DESIGNER
            </p>
          </div>
          <div>
            <Label>h1 · Geist 500 · sentence, even at 40px</Label>
            <p className="mt-2 max-w-prose font-sans text-[40px] font-medium leading-[1.15] tracking-[-0.022em] text-ink">
              Making business verification feel fast without making it less rigorous.
            </p>
          </div>
          <div>
            <Label>body · Geist 400 · max 60ch</Label>
            <p className="mt-2 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
              Anything read as a sentence is Geist. Silkscreen is capped at five words because a
              72-character heading typed at 45ms per character is three seconds before the visitor
              can read your title.
            </p>
          </div>
          <div>
            <Label>meta 11px / micro 9px · the legibility floor</Label>
            <p className="mt-2 font-mono text-[11px] leading-[1.5] tracking-[0.08em] text-mute">
              DUBAI · REPLIES WITHIN A DAY
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase leading-[1.4] tracking-[0.11em] text-mute">
              FINTECH · MARKETPLACE · MOBILE
            </p>
          </div>
        </div>
      </Section>

      {/* ── motion ──────────────────────────────────────────────── */}
      <Section n="05" title="MOTION">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          Everything is <span className="font-mono text-[0.88em]">steps()</span>. Nothing eases.
          Scroll each block into view: it fires once and never re-triggers on the way back up.
          Toggle Reduce Motion and every one of these renders at its final state instead.
        </p>

        <div className="space-y-10">
          <div>
            <Label>typewriter · Silkscreen only · 45ms/char, capped at 1.5s</Label>
            <Typewriter
              text="SENIOR PRODUCT DESIGNER"
              as="p"
              className="mt-2 font-pix text-[20px] leading-[1.8] text-ink"
            />
          </div>

          <div>
            <Label>scanline, 4 frames · Geist headings</Label>
            <Reveal variant="head">
              <p className="mt-2 max-w-prose font-sans text-[26px] font-medium leading-[1.3] tracking-[-0.016em] text-ink">
                A sentence-length heading always scans, never types.
              </p>
            </Reveal>
          </div>

          <div>
            <Label>scanline, 6 frames · containers animate as one object</Label>
            <Reveal className="mt-2">
              <div className="sp sp-neutral-4 sp-s4 grid h-32 w-full max-w-md place-items-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
                  whole card, one reveal
                </span>
              </div>
            </Reveal>
          </div>

          <div>
            <Label>binary, staggered one frame apart · body copy</Label>
            <div className="mt-2 space-y-2">
              {["First line appears.", "Then the second.", "Then the third."].map((t) => (
                <Reveal key={t} variant="on" as="p" className="font-sans text-[16px] text-ink">
                  {t}
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Label>pop with overshoot · numerals</Label>
            <div className="mt-2 flex gap-6">
              {["01", "02", "03"].map((n) => (
                <Reveal key={n} variant="pop" as="span" className="font-pix text-[40px] font-bold leading-[0.9] text-blue">
                  {n}
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Label>LED · the only looping animation, 2.6s</Label>
            <div className="mt-3 flex items-center gap-2">
              <span className="led inline-block h-2 w-2 bg-lime" />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">live</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── portrait ────────────────────────────────────────────── */}
      <Section n="06" title="PORTRAIT">
        <p className="mb-8 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
          A 46×38 grid quantised to four discrete levels, drawn as rectangles rather than
          block glyphs so it can never shear on a font fallback. Lime lands only on the
          top level. Hover it: proximity boosts brightness, and the boost steps too.
        </p>
        <div className="bg-night p-8">
          <AsciiPortrait />
        </div>
      </Section>

      {/* ── well + focus ────────────────────────────────────────── */}
      <Section n="07" title="WELL & FOCUS">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Label>well — recessed, for screenshots</Label>
            <div className="well mt-4 aspect-[16/10] bg-panel" />
          </div>
          <div>
            <Label>focus plate — tab to it. instant, never animated</Label>
            <div className="mt-4 flex gap-4">
              <Button level="primary">FOCUS ME</Button>
              <Button level="secondary">AND ME</Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
