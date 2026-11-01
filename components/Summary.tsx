interface SummaryRow {
  label: string;
  text: string;
}

interface SummaryProps {
  /** Tab label. Each study names its own; there is no shared "short version". */
  title: string;
  rows: SummaryRow[];
  /** Omit on studies where a reading time would make the tops match. */
  readTime?: string;
}

// A scannable block some studies use and some skip. Labels and length are
// passed in so the block is not the same three rows on every case.
const Summary = ({ title, rows, readTime }: SummaryProps) => {
  return (
    <aside aria-label={title} className="card not-prose my-48 mt-[17px]">
      <span className="card-tab">{title}</span>
      <div className="card-body m-[10px] p-16 md:p-24">
        {readTime && (
          <p className="mb-16 font-mono text-[9px] tracking-[0.02em] text-mute">
            {readTime} read
          </p>
        )}
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-4 py-16 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr] md:gap-32"
            >
              <dt className="font-mono text-[9px] tracking-[0.02em] text-mute md:pt-4">
                {row.label}
              </dt>
              <dd className="font-sans text-[16px] leading-[1.7] text-ink">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
};

export default Summary;
