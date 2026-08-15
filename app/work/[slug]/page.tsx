import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import PixelIcon from "@/components/px/PixelIcon";
import Reveal from "@/components/px/Reveal";
import ScrollProgress from "@/components/px/ScrollProgress";
import Button from "@/components/px/Button";
import { notFound } from "next/navigation";
import { getStudy, nextStory, slugs } from "@/lib/work";

/* Server component. The MDX map resolves through the root mdx-components.tsx,
   which works in RSC where MDXProvider did not. */

const mdxMap: Record<string, React.ComponentType> = {
  "google-maps-route-pass": dynamic(() => import("@/content/work/google-maps-route-pass.mdx")),
  "omni-cast-ai": dynamic(() => import("@/content/work/omni-cast-ai.mdx")),
  "almosafer-audit": dynamic(() => import("@/content/work/almosafer-audit.mdx")),
  "sanad": dynamic(() => import("@/content/work/sanad.mdx")),
  "mizan": dynamic(() => import("@/content/work/mizan.mdx")),
  "instagram-local": dynamic(() => import("@/content/work/instagram-local.mdx")),
  "roomy": dynamic(() => import("@/content/work/roomy.mdx")),
  "form": dynamic(() => import("@/content/work/form.mdx")),
};

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getStudy(slug);
  if (!project) return { title: "Project | Shareef Padar" };

  return {
    title: `${project.title} | Shareef Padar`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Shareef Padar`,
      description: project.description,
      images: [{ url: project.imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Shareef Padar`,
      description: project.description,
      images: [project.imageUrl],
    },
  };
}

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="font-mono text-[9px] uppercase tracking-[0.11em] text-mute">{label}</dt>
    <dd className="mt-1 font-sans text-[14.5px] leading-[1.5] text-ink">{value}</dd>
  </div>
);

export default async function WorkItem({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getStudy(slug);
  if (!project) notFound();

  const next = nextStory(slug);
  const MDXContent = mdxMap[slug] ?? null;

  return (
    <article>
      {/* Progress sits with the back link rather than pinned to the viewport
          edge: a floating bar is one more thing hovering over the reading. */}
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-4 py-6">
        <Link
          href="/work"
          className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-mute hover:text-ink"
        >
          <PixelIcon name="arrowL" size={8} />
          All work
        </Link>
        <div className="hidden md:block">
          <ScrollProgress />
        </div>
      </div>

      <div className="study">
        {/* 01 OVERVIEW */}
        <header className="pb-12">
          <div className="mb-6 flex items-baseline gap-3">
            <span className="font-pix text-[20px] font-bold leading-none text-blue">01</span>
            <span className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">
              OVERVIEW
            </span>
          </div>

          {/* Geist, not Silkscreen: this is a sentence, whatever tag it uses. */}
          <h1 className="mb-8 font-sans text-[28px] font-medium leading-[1.15] tracking-[-0.022em] text-ink md:text-[40px]">
            {project.headline}.
          </h1>

          <dl className="mb-8 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
            <Meta label="My role" value={project.role} />
            <Meta label="Type" value={project.type} />
            <Meta label="Period" value={project.duration} />
            {project.stack && <Meta label="Stack" value={project.stack} />}
          </dl>

          <p className="mb-8 max-w-lead font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]">
            {project.description}
          </p>

          {project.outcome && (
            <div className="border-l-[6px] border-lime bg-panel p-4 md:p-6">
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.11em] text-mute">
                Outcome
              </p>
              <p className="font-sans text-[16px] leading-[1.7] text-ink">{project.outcome}</p>
            </div>
          )}
        </header>

        {/* Disclosure quote — the honesty note, before any of the work. */}
        {project.quote && (
          <Reveal variant="head" className="pb-12">
            <blockquote className="border-l-[6px] border-blue pl-6">
              <p className="font-sans text-[19px] font-medium leading-[1.4] text-ink md:text-[23px]">
                {project.quote}
              </p>
            </blockquote>
          </Reveal>
        )}
      </div>

      {/* MDX body. Also a .study grid, so a Shot or an img can break to the
          wide column just by carrying a class. */}
      {MDXContent && (
        <div className="study border-t border-line pt-12">
          <MDXContent />
        </div>
      )}

      {/* Live products get a go-and-use-it CTA; concepts end on their own
          reflection rather than a manufactured call to action. */}
      {project.type === "Live product" && (
        <div className="study py-12">
          <div className="border-t border-line pt-8">
            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-pix text-[20px] font-bold leading-none text-blue">02</span>
              <span className="font-pix text-[14px] leading-[1.8] tracking-[0.02em] text-ink">
                SEE IT LIVE
              </span>
            </div>
            <p className="mb-6 max-w-lead font-sans text-[17px] leading-[1.65] text-ink">
              Don&apos;t take the case study&apos;s word for it. Go and use the product.
            </p>
            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <Button level="primary" href={project.liveUrl} external icon="external">
                  LAUNCH APP
                </Button>
              )}
              {project.repoUrl && (
                <Button level="tertiary" href={project.repoUrl} external icon="external">
                  VIEW REPOSITORY
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next story. A case study gets the minimal footer, so this is the only
          onward navigation — a next link plus a full sitemap is two navigation
          systems arguing (§7.4). */}
      <div className="study border-t-[3px] border-ink py-12">
        <Link href={`/work/${next.slug}`} className="group block">
          <span className="font-mono text-[9px] uppercase tracking-[0.11em] text-mute">
            Next story
          </span>
          <span className="mt-2 flex items-center gap-3 font-sans text-[23px] font-medium leading-[1.3] text-ink">
            {next.title}
            <PixelIcon name="arrowR" size={16} className="text-blue" />
          </span>
        </Link>
      </div>
    </article>
  );
}
