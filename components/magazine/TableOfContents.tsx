import Link from "next/link";
import type { TocEntry } from "@/lib/magazine";

type TableOfContentsProps = {
  entries: TocEntry[];
};

export default function TableOfContents({ entries }: TableOfContentsProps) {
  const left = entries.slice(0, 3);
  const right = entries.slice(3);

  return (
    <section id="contents" className="scroll-mt-4">
      <div className="mb-8 md:mb-10">
        <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-peach mb-2">
          Inside This Issue
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-coffee">
          Table of Contents
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
        {[left, right].map((column, colIndex) => (
          <ul key={colIndex} className="divide-y divide-clay/60">
            {column.map((entry) => (
              <li key={entry.slug} className="py-5">
                <Link href={`/work/${entry.slug}`} className="group block">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-typewriter text-[10px] tracking-[0.1em] text-leather shrink-0">
                      {entry.num}
                    </span>
                    <span className="font-display text-xl md:text-2xl font-bold text-coffee group-hover:text-maroon transition-colors">
                      {entry.title}{" "}
                      {entry.italic && <em className="italic">{entry.italic}</em>}
                    </span>
                  </div>
                  <div className="flex items-end gap-2 ml-7">
                    <span className="font-sans text-xs font-light text-leather leading-relaxed flex-1 min-w-0">
                      {entry.desc}
                    </span>
                    <span className="flex-1 border-b border-dotted border-clay mb-1 mx-2 hidden sm:block" />
                    <span className="font-typewriter text-[10px] tracking-[0.1em] text-peach shrink-0">
                      Pg. {entry.page}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
