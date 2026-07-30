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
    <aside
      aria-label="Case study summary"
      className="not-prose my-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
    >
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-3 md:px-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
          The short version
        </span>
        {readTime && (
          <span className="shrink-0 font-sans text-[11px] font-medium text-neutral-500">
            {readTime} read
          </span>
        )}
      </div>
      <dl className="divide-y divide-neutral-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3.5 md:grid-cols-[150px_1fr] md:gap-5 md:px-6">
            <dt className="font-sans text-[11px] font-bold uppercase tracking-widest text-neutral-400 md:pt-0.5">
              {label}
            </dt>
            <dd className="font-sans text-sm leading-relaxed text-neutral-700 md:text-base">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
};

export default Summary;
