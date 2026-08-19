import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import WorkCard from "@/components/WorkCard";
import WorkFilter from "@/components/px/WorkFilter";
import PixelIcon from "@/components/px/PixelIcon";
import Button from "@/components/px/Button";
import Reveal from "@/components/px/Reveal";
import { allStudies, type Domain } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work | Shareef Padar — Senior Product Designer",
  description:
    "Case studies and live products: UX audits, B2B SaaS concepts, and shipped side projects by Shareef Padar, Senior Product Designer based in Dubai.",
};

const DOMAINS = [...new Set(allStudies.map((s) => s.domain))] as Domain[];

const Marker = ({ n, title }: { n: string; title: string }) => (
  <div className="mb-24 flex items-baseline gap-12">
    <span className="font-pix text-[20px] font-bold leading-none text-blue">{n}</span>
    <h2 className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">{title}</h2>
  </div>
);

export default async function WorkIndex({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const active = filter?.toUpperCase() ?? null;

  const visible = active ? allStudies.filter((s) => s.domain === active) : allStudies;
  const tier1 = visible.filter((s) => s.tier === 1);
  const tier2 = visible.filter((s) => s.tier === 2);

  return (
    <div className="mx-auto w-full max-w-wide px-16 py-48 md:py-64">
      <Link
        href="/"
        className="mb-32 inline-flex min-h-[44px] items-center gap-8 font-mono text-[11px] uppercase tracking-[0.08em] text-mute hover:text-ink"
      >
        <PixelIcon name="arrowL" size={8} />
        Home
      </Link>

      <h1 className="mb-16 font-pix text-[20px] leading-[1.8] text-ink">ALL WORK</h1>
      <p className="mb-32 max-w-lead font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]">
        Case studies, concepts, and live products. Six years of client work in logistics,
        healthcare, and travel sits under NDA. Ask me about it on a call.
      </p>

      {/* useSearchParams opts out of static rendering, so the island is
          isolated behind Suspense and the page around it stays static. */}
      <div className="mb-48">
        <Suspense fallback={<div className="h-[44px]" />}>
          <WorkFilter domains={DOMAINS} />
        </Suspense>
      </div>

      {/* Empty state (§7.2) */}
      {visible.length === 0 && (
        <div className="border-[3px] border-ink bg-panel p-48 text-center">
          <PixelIcon name="search" size={32} className="mx-auto mb-16 text-mute" />
          <p className="mb-24 font-sans text-[16px] leading-[1.7] text-ink">
            Nothing in that domain yet.
          </p>
          <Button level="secondary" href="/work">
            RESET FILTER
          </Button>
        </div>
      )}

      {tier1.length > 0 && (
        <section className="mb-64">
          <Marker n="01" title="START HERE" />
          <div className="grid gap-32 md:grid-cols-2 md:gap-48">
            {tier1.map((s) => (
              <Reveal key={s.slug}>
                <WorkCard study={s} featured />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {tier2.length > 0 && (
        <section className="mb-64">
          <Marker n="02" title="EVERYTHING ELSE" />
          <div className="grid gap-32 md:grid-cols-2 md:gap-48">
            {tier2.map((s) => (
              <Reveal key={s.slug}>
                <WorkCard study={s} compact />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
