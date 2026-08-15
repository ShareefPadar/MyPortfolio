import { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  /** Short uppercase label shown above the body, e.g. "On fairness". */
  label?: string;
  /** "note" is neutral grey; "flag" is the accent-bordered attribution notice. */
  tone?: "note" | "flag";
}

// A bordered aside for framing notes and attribution disclaimers inside case
// studies. Rendered as real selectable text (never baked into an image) so it
// survives screen readers, copy, and link previews.
const Callout = ({ children, label, tone = "note" }: CalloutProps) => {
  const isFlag = tone === "flag";
  return (
    <aside
      className={`not-prose my-8 max-w-prose border-l-[6px] p-5 md:p-6 ${
        isFlag ? "border-blue bg-panel" : "border-lime bg-panel"
      }`}
    >
      {label && (
        <p
          className={`mb-2 font-mono text-[9px] uppercase tracking-[0.11em] ${
            isFlag ? "text-blue" : "text-mute"
          }`}
        >
          {label}
        </p>
      )}
      <div className="font-sans text-[16px] leading-[1.7] text-ink [&>p]:mb-3 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
};

export default Callout;
