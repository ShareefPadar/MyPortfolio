import Link from "next/link";
import type { ReactNode } from "react";
import PixelIcon, { type IconName } from "./PixelIcon";

/**
 * Button (spec §4.1). Four levels, one primary per view.
 *
 * No "use client": the sprite is a CSS class, and hover/sunk are :hover and
 * :active, so there is no state to hold. Wrapped in .focusable so the notched
 * focus plate replaces the square outline (§4.2).
 *
 * Never put two saturated buttons side by side — inside a card the secondary
 * drops to tertiary.
 */

type Level = "primary" | "secondary" | "tertiary" | "disabled";

type Props = {
  children: ReactNode;
  level?: Level;
  /** Large buttons use scale 6, never a scaled-up scale-4 sprite (§12 #4). */
  large?: boolean;
  icon?: IconName;
  href?: string;
  external?: boolean;
  onDark?: boolean;
  type?: "button" | "submit";
  className?: string;
};

const FRAME: Record<Level, string> = {
  primary: "sp sp-blue",
  secondary: "sp sp-neutral",
  tertiary: "",
  disabled: "sp sp-disabled",
};

const FRAME_DARK: Record<Level, string> = {
  primary: "sp sp-blueDk",
  secondary: "sp sp-neutralDk",
  tertiary: "",
  disabled: "sp sp-disabled",
};

const TEXT: Record<Level, string> = {
  // Lime is the highlight tone on a blue face, never a fill itself (§12 #6).
  primary: "text-lime font-bold",
  secondary: "text-ink",
  tertiary: "text-blue hover:underline",
  disabled: "text-[#9A9A92] cursor-not-allowed",
};

/* On night, the neutral face is #1E1E22 — ink text on it is invisible. The
   dark palettes need light text for the same reason their outlines lighten. */
const TEXT_DARK: Record<Level, string> = {
  primary: "text-lime font-bold",
  secondary: "text-white",
  tertiary: "text-lime hover:underline",
  disabled: "text-[#5A5A55] cursor-not-allowed",
};

const Button = ({
  children,
  level = "secondary",
  large = false,
  icon,
  href,
  external = false,
  onDark = false,
  type = "button",
  className = "",
}: Props) => {
  const scale = large ? 6 : 4;
  const frame = (onDark ? FRAME_DARK : FRAME)[level];
  const framed = frame ? `${frame}-${scale} sp-s${scale}` : "";

  const cls = [
    "font-pix leading-none inline-flex items-center gap-8",
    // 44px is the accessibility floor, always (§4.1, §11).
    "min-h-[44px]",
    large ? "px-16 py-[10px] text-[13px]" : "px-[13px] py-[9px] text-[11px]",
    framed,
    (onDark ? TEXT_DARK : TEXT)[level],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {children}
      {icon && <PixelIcon name={icon} size={8} />}
    </>
  );

  if (href && level !== "disabled") {
    const linkProps = external
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : { href };
    return (
      <span className="focusable">
        {external ? (
          <a {...linkProps} className={cls}>
            {inner}
          </a>
        ) : (
          <Link {...linkProps} className={cls}>
            {inner}
          </Link>
        )}
      </span>
    );
  }

  return (
    <span className="focusable">
      <button type={type} disabled={level === "disabled"} className={cls}>
        {inner}
      </button>
    </span>
  );
};

export default Button;
