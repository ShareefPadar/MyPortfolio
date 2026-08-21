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
    <aside aria-label="Case study summary" className="card not-prose my-48 mt-[17px]">
      <span className="card-tab">THE SHORT VERSION</span>
      <div className="card-body m-[10px] p-16 md:p-24">
        {readTime && (
          <p className="mb-16 font-mono text-[9px] uppercase tracking-[0.11em] text-mute">
            {readTime} read
          </p>
        )}
        <dl className="divide-y divide-line">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-4 py-16 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr] md:gap-32">
              <dt className="font-mono text-[9px] uppercase tracking-[0.11em] text-mute md:pt-4">
                {label}
              </dt>
              <dd className="font-sans text-[16px] leading-[1.7] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
};

export default Summary;
