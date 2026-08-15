import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces for the OG share cards (spec §10).
 *
 * Fonts are read from disk as ArrayBuffers: ImageResponse runs satori, which
 * cannot use next/font and cannot read woff2 at all. The TTFs are vendored in
 * public/fonts rather than fetched at build time, so a build never depends on
 * Google Fonts being reachable.
 *
 * Card rules from §10: 1200x630, nothing below 22px (that is ~6px in a mobile
 * feed), six words maximum in the largest text, the URL on every card, and a
 * dark or lime fill — never paper, because the card has to break out of a
 * white feed rather than blend into it.
 */

export const SIZE = { width: 1200, height: 630 };

export const INK = "#14140F";
export const LIME = "#CDF22B";
export const NIGHT = "#0B0B0C";
export const NTEXT = "#9A9A94";
export const URL = "shareefpadar.com";

const font = (name: string) => readFile(join(process.cwd(), "public", "fonts", name));

export async function ogFonts() {
  const [pix, geistMedium, geistRegular] = await Promise.all([
    font("silkscreen-700.ttf"),
    font("geist-500.ttf"),
    font("geist-400.ttf"),
  ]);
  return [
    { name: "Silkscreen", data: pix, weight: 700 as const, style: "normal" as const },
    { name: "Geist", data: geistMedium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: geistRegular, weight: 400 as const, style: "normal" as const },
  ];
}

/** The lime rule + URL footer every card carries. */
export function Footer({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `6px solid ${LIME}`,
        paddingTop: 28,
      }}
    >
      <span style={{ fontFamily: "Geist", fontSize: 26, color: NTEXT }}>{URL}</span>
      {label && (
        <span style={{ fontFamily: "Silkscreen", fontSize: 22, color: LIME }}>{label}</span>
      )}
    </div>
  );
}

/** Shared frame: night fill, generous padding, footer pinned to the bottom. */
export function Card({
  children,
  label,
  background = NIGHT,
}: {
  children: React.ReactNode;
  label?: string;
  background?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background,
        padding: 64,
      }}
    >
      {children}
      <Footer label={label} />
    </div>
  );
}
