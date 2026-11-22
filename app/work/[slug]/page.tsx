import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import PixelIcon from "@/components/px/PixelIcon";
import Reveal from "@/components/px/Reveal";
import ScrollProgress from "@/components/px/ScrollProgress";
import Button from "@/components/px/Button";
import { notFound } from "next/navigation";
import { getStudy, nextStory, slugs, type CaseStudy } from "@/lib/work";

/* Server component. The MDX map resolves through the root mdx-components.tsx,
   which works in RSC where MDXProvider did not. */

const mdxMap: Record<string, React.ComponentType> = {
  "google-maps-route-pass": dynamic(() => import("@/content/work/google-maps-route-pass.mdx")),
  "omni-cast-ai": dynamic(() => import("@/content/work/omni-cast-ai.mdx")),
  "almosafer-audit": dynamic(() => import("@/content/work/almosafer-audit.mdx")),
  "freelax": dynamic(() => import("@/content/work/freelax.mdx")),
  "sanad": dynamic(() => import("@/content/work/sanad.mdx")),
  "wio": dynamic(() => import("@/content/work/wio.mdx")),
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

  const title = project.metaTitle
    ? `${project.metaTitle} | Shareef Padar`
    : `${project.title} | Shareef Padar`;
  const description = project.metaDescription ?? project.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: project.imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.imageUrl],
    },
  };
}

type MetaKey = "role" | "type" | "duration" | "stack";

const META_LABEL: Record<MetaKey, string> = {
  role: "My role",
  type: "Type",
  duration: "Period",
  stack: "Tools",
};

type HeaderShape = {
  layout: "grid" | "line";
  fields: MetaKey[];
  /** plain keeps the outcome sentence. omit when the lede already says it. */
  outcome: "plain" | "omit";
};

/**
 * This header used to be one shell on every study: "01 OVERVIEW", then
 * role / type / period / stack, then a labelled Outcome box. The shapes
 * below keep the facts and stop the pages matching. Stack is not in this
 * block; tools, including any AI assistant, sit in the study as a footnote.
 */
const HEADER: Record<string, HeaderShape> = {
  freelax: { layout: "grid", fields: ["duration", "role", "type"], outcome: "plain" },
  sanad: { layout: "line", fields: ["role", "type", "duration"], outcome: "omit" },
  wio: { layout: "grid", fields: ["type", "duration", "role"], outcome: "plain" },
  roomy: { layout: "grid", fields: ["role", "type", "duration"], outcome: "plain" },
  form: { layout: "line", fields: ["duration", "type", "role"], outcome: "omit" },
  "almosafer-audit": { layout: "line", fields: ["type", "role", "duration"], outcome: "plain" },
  "google-maps-route-pass": { layout: "line", fields: ["duration", "role", "type"], outcome: "plain" },
  "omni-cast-ai": { layout: "grid", fields: ["role", "duration", "type"], outcome: "plain" },
  "instagram-local": { layout: "grid", fields: ["type", "role", "duration"], outcome: "plain" },
};

const DEFAULT_HEADER: HeaderShape = {
  layout: "line",
  fields: ["role", "type"],
  outcome: "plain",
};

function metaValue(project: CaseStudy, key: MetaKey): string | undefined {
  switch (key) {
    case "role":
      return project.role;
    case "type":
      return project.type;
    case "duration":
      return project.duration;
    case "stack":
      return project.stack;
  }
}

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="font-mono text-[9px] tracking-[0.02em] text-mute">{label}</dt>
    <dd className="mt-4 font-sans text-[14px] leading-[1.5] text-ink">{value}</dd>
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
  const header = HEADER[slug] ?? DEFAULT_HEADER;
  const fields = header.fields.flatMap((key) => {
    const value = metaValue(project, key);
    return value ? [{ key, value }] : [];
  });
  const gridCols =
    fields.length >= 4 ? "sm:grid-cols-4" : fields.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <article>
      {/* Progress sits with the back link rather than pinned to the viewport
          edge: a floating bar is one more thing hovering over the reading. */}
      <div className="mx-auto flex max-w-wide items-center justify-between gap-16 px-16 py-24">
        <Link
          href="/work"
          className="inline-flex min-h-[44px] items-center gap-8 font-mono text-[11px] uppercase tracking-[0.08em] text-mute hover:text-ink"
        >
          <PixelIcon name="arrowL" size={8} />
          All work
        </Link>
        <div className="hidden md:block">
          <ScrollProgress />
        </div>
      </div>

      <div className="study">
        <header className="pb-48">
          {/* Geist, not Silkscreen: this is a sentence, whatever tag it uses. */}
          <h1 className="mb-32 font-sans text-[28px] font-medium leading-[1.15] tracking-[-0.022em] text-ink md:text-[40px]">
            {project.headline}.
          </h1>

          {header.layout === "grid" ? (
            <dl className={`mb-32 grid grid-cols-2 gap-24 border-y border-line py-24 ${gridCols}`}>
              {fields.map(({ key, value }) => (
                <Meta key={key} label={META_LABEL[key]} value={value} />
              ))}
            </dl>
          ) : (
            <p className="mb-32 font-mono text-[11px] leading-[1.5] tracking-[0.02em] text-mute">
              {fields.map(({ value }) => value).join(" · ")}
            </p>
          )}

          <p className="max-w-lead font-sans text-[17px] leading-[1.65] text-ink md:text-[19px]">
            {project.description}
          </p>

          {header.outcome === "plain" && project.outcome && (
            <p className="mt-16 max-w-prose font-sans text-[16px] leading-[1.7] text-ink">
              {project.outcome}
            </p>
          )}
        </header>

        {/* Disclosure quote — the honesty note, before any of the work. */}
        {project.quote && (
          <Reveal variant="head" className="pb-48">
            <blockquote className="border-l-[6px] border-blue pl-24">
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
        <div className="study border-t border-line pt-48">
          <MDXContent />
        </div>
      )}

      {/* Live products get a go-and-use-it CTA; concepts end on their own
          reflection rather than a manufactured call to action. */}
      {project.type === "Live product" && (
        <div className="study py-48">
          <div className="border-t border-line pt-32">
            <p className="mb-24 max-w-lead font-sans text-[17px] leading-[1.65] text-ink">
              Don&apos;t take the case study&apos;s word for it. Go and use the product.
            </p>
            <div className="flex flex-wrap gap-16">
              {project.liveUrl && (
                <Button level="primary" href={project.liveUrl} external>
                  LAUNCH APP
                </Button>
              )}
              {project.repoUrl && (
                <Button level="tertiary" href={project.repoUrl} external>
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
      <div className="study border-t-[3px] border-ink py-48">
        <Link href={`/work/${next.slug}`} className="group block">
          <span className="font-mono text-[9px] tracking-[0.02em] text-mute">
            Next story
          </span>
          <span className="mt-8 block font-sans text-[23px] font-medium leading-[1.3] text-ink">
            {next.title}
          </span>
        </Link>
      </div>
    </article>
  );
}
