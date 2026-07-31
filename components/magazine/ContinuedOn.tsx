import Link from "next/link";
import type { TocEntry } from "@/lib/magazine";

type ContinuedOnProps = {
  next: TocEntry;
};

export default function ContinuedOn({ next }: ContinuedOnProps) {
  return (
    <div className="py-10 border-t-[3px] border-clay border-double">
      <Link
        href={`/work/${next.slug}`}
        className="group inline-flex flex-col gap-2"
      >
        <span className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-peach">
          Continued on page Nº{next.page} →
        </span>
        <span className="font-display text-xl md:text-2xl font-bold text-coffee group-hover:text-maroon transition-colors">
          {next.title}{" "}
          {next.italic && <em className="italic">{next.italic}</em>}
        </span>
      </Link>
    </div>
  );
}
