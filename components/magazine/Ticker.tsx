import { TICKER_ITEMS } from "@/lib/magazine";

export default function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-deep-peach overflow-hidden border-y border-coffee/10">
      <div className="ticker-track py-3">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="ticker-item font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-creme">
            {item}
            <span className="mx-6 text-golden" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
