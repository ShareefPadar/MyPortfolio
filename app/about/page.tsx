import type { Metadata } from "next";
import Button from "@/components/px/Button";
import Reveal from "@/components/px/Reveal";
import { BIO, EDUCATION, JOBS, PHILOSOPHY, PRINCIPLES } from "@/lib/about";

export const metadata: Metadata = {
  title: "About Shareef Padar | 6 Years of B2B Product Design",
  description:
    "Senior Product Designer with six years in B2B SaaS, usually the only designer in the room. Based in Dubai.",
};

const Marker = ({ n, title }: { n: string; title: string }) => (
  <div className="mb-6 flex items-baseline gap-3">
    <span className="font-pix text-[20px] font-bold leading-none text-blue">{n}</span>
    <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">{title}</h2>
  </div>
);

export default function About() {
  return (
    <div className="mx-auto w-full max-w-wide px-4 py-12 md:py-16">
      {/* A page title is a statement, so Silkscreen — and it is five words. */}
      <h1 className="mb-8 max-w-[14ch] font-pix text-[20px] font-bold leading-[1.8] text-ink">
        USUALLY THE ONLY DESIGNER
      </h1>

      <div className="mb-16 max-w-prose space-y-4">
        {BIO.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]"
                : "font-sans text-[16px] leading-[1.7] text-ink"
            }
          >
            {para}
          </p>
        ))}
      </div>

      {/* 01 HOW I WORK */}
      <section className="mb-16">
        <Marker n="01" title="HOW I WORK" />
        <div className="max-w-prose space-y-8">
          {PRINCIPLES.map((p) => (
            <Reveal key={p.title} variant="on">
              <h3 className="mb-2 font-sans text-[17px] font-semibold leading-[1.4] text-ink md:text-[19px]">
                {p.title}
              </h3>
              <p className="font-sans text-[16px] leading-[1.7] text-ink">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 02 WHERE I'VE WORKED */}
      <section className="mb-16">
        <Marker n="02" title="WHERE I'VE WORKED" />
        <div className="max-w-prose">
          {JOBS.map((job) => (
            <div key={job.company} className="border-t border-line py-6 first:border-t-0 first:pt-0">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-sans text-[17px] font-semibold leading-[1.4] text-ink">
                  {job.role}
                </h3>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.11em] text-mute">
                  {job.period}
                </span>
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.07em] text-blue">
                {job.company}
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-ink">{job.desc}</p>
            </div>
          ))}
          <p className="border-t border-line pt-6 font-mono text-[11px] leading-[1.5] tracking-[0.08em] text-mute">
            {EDUCATION}
          </p>
        </div>
      </section>

      {/* Philosophy — a lime callout, the one accent moment on the page. */}
      <blockquote className="mb-16 max-w-prose border-l-[6px] border-lime pl-6">
        <p className="font-sans text-[19px] font-medium leading-[1.4] text-ink md:text-[23px]">
          {PHILOSOPHY}
        </p>
      </blockquote>

      <div className="flex flex-wrap gap-4">
        <Button
          level="primary"
          large
          href="/assets/Shareef_Padar_Resume.pdf"
          external
          icon="download"
        >
          RÉSUMÉ
        </Button>
        <Button level="secondary" large href="mailto:shareefpadar@gmail.com" icon="mail">
          GET IN TOUCH
        </Button>
      </div>
    </div>
  );
}
