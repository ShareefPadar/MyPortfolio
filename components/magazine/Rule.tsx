type RuleProps = {
  label?: string;
  className?: string;
};

export default function Rule({ label, className = "" }: RuleProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="h-0 flex-1 border-t-[3px] border-b-[3px] border-clay border-double" />
        <span className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-leather shrink-0">
          {label}
        </span>
        <div className="h-0 flex-1 border-t-[3px] border-b-[3px] border-clay border-double" />
      </div>
    );
  }

  return (
    <hr
      className={`border-0 border-t-[3px] border-b-[3px] border-clay border-double ${className}`}
    />
  );
}
