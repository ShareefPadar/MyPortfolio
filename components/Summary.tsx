interface SummaryProps {
  /** What was broken or missing, in one line. */
  problem: string;
  /** The core moves, in one line. */
  approach: string;
  /** The constraint that ruled out the easy answer. Optional, but it's the
   *  line that shows judgement, so most studies should carry one. */
  constraint?: string;
  /** Rough reading time, e.g. "4 min". Sets expectations before they commit. */
  readTime?: string;
}

// The scannable top-of-study summary: the whole case in about fifteen seconds,
// for the reader who hasn't decided to invest yet. Labelled rows rather than
// loose bullets, so the eye can jump straight to the part it cares about.
const Summary = ({ problem, approach, constraint, readTime }: SummaryProps) => {
  const rows: [string, string][] = [
    ["Problem", problem],
    ["What I did", approach],
    ...(constraint ? ([["Why it was hard", constraint]] as [string, string][]) : []),
  ];

  return (
    // A ruled table, not a filled card: rules carry the structure so this
    // reads as a spec block in an article rather than one more UI container.
    <aside aria-label="Case study summary" className="not-prose my-10 border-t-2 border-neutral-900">
      <div className="flex items-baseline justify-between gap-4 py-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
          The short version
        </span>
        {readTime && (
          <span className="shrink-0 font-sans text-[11px] font-medium text-neutral-400">
            {readTime} read
          </span>
        )}
      </div>
      <dl className="border-t border-neutral-200">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 border-b border-neutral-200 py-4 md:grid-cols-[8rem_1fr] md:gap-8"
          >
            <dt className="font-sans text-[11px] font-bold uppercase tracking-widest text-neutral-400 md:pt-1.5">
              {label}
            </dt>
            <dd className="font-sans text-base leading-relaxed text-neutral-700 md:text-[1.0625rem]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
};

export default Summary;
