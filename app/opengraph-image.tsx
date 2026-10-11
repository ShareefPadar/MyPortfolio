import { ImageResponse } from "next/og";
import { Card, LIME, NTEXT, SIZE, ogFonts } from "@/lib/og";

export const alt = "Shareef Padar, Senior Product Designer in Dubai";
export const size = SIZE;
export const contentType = "image/png";

/**
 * Homepage card (spec §10): night fill, Silkscreen headline with a lime accent
 * word, URL. Six words max in the largest text.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <Card label="DUBAI">
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontFamily: "Geist", fontSize: 26, color: NTEXT }}>
            Shareef Padar
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Silkscreen",
              fontSize: 68,
              lineHeight: 1.45,
              color: "#FFFFFF",
            }}
          >
            <span>SENIOR PRODUCT DESIGNER</span>
            <span style={{ color: LIME, marginLeft: 20 }}>WHO SHIPS.</span>
          </div>
        </div>
      </Card>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
