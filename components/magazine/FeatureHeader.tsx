type FeatureHeaderProps = {
  page: string;
  kicker?: string;
  headline: React.ReactNode;
  deck: string;
  role: string;
  year?: string;
  stack?: string;
  status?: string;
};

export default function FeatureHeader({
  page,
  kicker = "Feature Story · Issue Nº06",
  headline,
  deck,
  role,
  year = "2025–2026",
  stack,
  status,
}: FeatureHeaderProps) {
  return (
    <header className="space-y-6 pb-8 border-b-[3px] border-clay border-double">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-peach">
          Pg. {page}
        </span>
        <span className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-leather">
          {kicker}
        </span>
      </div>

      <h1 className="font-display text-[clamp(2rem,5vw,2.875rem)] font-bold leading-[1.1] text-coffee">
        {headline}
      </h1>

      <p className="font-sans text-sm md:text-[15px] font-light text-leather leading-[1.75] max-w-2xl">
        {deck}
      </p>

      <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
        <MetaItem label="Role" value={role} />
        <MetaItem label="Period" value={year} />
        {stack && <MetaItem label="Stack" value={stack} />}
        {status && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-teal" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-teal">
              {status}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-typewriter text-[9px] uppercase tracking-[0.15em] text-leather/70 mb-0.5">
        {label}
      </p>
      <p className="font-sans text-xs font-normal text-coffee">{value}</p>
    </div>
  );
}
