import { ImageResponse } from "next/og";
import { Card, LIME, NTEXT, SIZE, ogFonts } from "@/lib/og";

export const alt = "About Shareef Padar";
export const size = SIZE;
export const contentType = "image/png";

/** Fallback template (spec §10): plate frame, for About and other pages. */
export default async function Image() {
  return new ImageResponse(
    (
      <Card label="ABOUT">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontFamily: "Geist", fontSize: 26, color: NTEXT }}>Shareef Padar</span>
          <span
            style={{
              fontFamily: "Silkscreen",
              fontSize: 62,
              lineHeight: 1.45,
              color: LIME,
            }}
          >
            USUALLY THE ONLY DESIGNER
          </span>
          <span
            style={{
              fontFamily: "Geist",
              fontSize: 30,
              lineHeight: 1.5,
              color: "#FFFFFF",
              maxWidth: 900,
            }}
          >
            Six years in B2B SaaS. Research to shipped interface, usually end to end.
          </span>
        </div>
      </Card>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
