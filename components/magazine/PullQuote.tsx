type PullQuoteProps = {
  quote: string;
  attribution: string;
};

export default function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <blockquote className="bg-coffee text-creme px-5 md:px-7 py-12 md:py-16">
      <div className="max-w-[900px] mx-auto text-center space-y-6">
        <p className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-normal italic leading-[1.35] text-creme">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-golden">
          — {attribution}
        </footer>
      </div>
    </blockquote>
  );
}
