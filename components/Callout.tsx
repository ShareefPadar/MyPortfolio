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
      className={`not-prose my-8 rounded-2xl border p-5 md:p-6 ${
        isFlag
          ? "border-accent/30 bg-accent/[0.04]"
          : "border-neutral-200 bg-neutral-50"
      }`}
    >
      {label && (
        <p
          className={`mb-2 text-[11px] font-bold uppercase tracking-widest ${
            isFlag ? "text-accent" : "text-neutral-500"
          }`}
        >
          {label}
        </p>
      )}
      <div className="font-sans text-sm leading-relaxed text-neutral-700 md:text-base [&>p]:mb-3 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
};

export default Callout;
