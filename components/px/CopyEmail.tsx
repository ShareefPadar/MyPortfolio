"use client";

import { useState } from "react";
import PixelIcon from "@/components/px/PixelIcon";

/**
 * Copy-to-clipboard for the footer email (spec §7.4).
 *
 * Confirmation is a swap, not a fade: the label and icon change in one step,
 * which is the binary treatment mono labels get (§5.1).
 */
const CopyEmail = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the address is visible text
      // beside this button, so there is always a manual path.
    }
  };

  return (
    <span className="focusable">
      <button
        type="button"
        onClick={copy}
        className="sp sp-neutralDk-3 sp-s3 inline-flex min-h-[44px] items-center gap-8 px-12 font-mono text-[11px] uppercase tracking-[0.08em] text-ntext"
      >
        <PixelIcon name={copied ? "check" : "copy"} size={8} />
        {copied ? "Copied" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </span>
  );
};

export default CopyEmail;
