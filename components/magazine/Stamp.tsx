type StampProps = {
  topLabel?: string;
  midText: string;
  bottomLabel?: string;
  className?: string;
};

export default function Stamp({
  topLabel = "Approved",
  midText,
  bottomLabel = "Design Engineer",
  className = "",
}: StampProps) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center w-36 h-36 md:w-40 md:h-40 border-[3px] border-maroon text-maroon rotate-[-12deg] ${className}`}
      aria-hidden="true"
    >
      <span className="font-typewriter text-[8px] uppercase tracking-[0.2em] border-b border-maroon/40 pb-1 mb-2 w-24 text-center">
        {topLabel}
      </span>
      <span className="font-display text-lg md:text-xl font-bold italic text-center px-2 leading-tight">
        {midText}
      </span>
      <span className="font-typewriter text-[8px] uppercase tracking-[0.2em] border-t border-maroon/40 pt-1 mt-2 w-24 text-center">
        {bottomLabel}
      </span>
    </div>
  );
}
