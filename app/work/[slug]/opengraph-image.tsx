import { ImageResponse } from "next/og";
import { Card, LIME, NTEXT, SIZE, ogFonts } from "@/lib/og";
import { getStudy, slugs } from "@/lib/work";

export const alt = "Case study by Shareef Padar";
export const size = SIZE;
export const contentType = "image/png";

/** One card per case study, generated from its own data (spec §10). */
export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

/* params is a Promise in Next 16. Reading .slug off it directly yields
   undefined, which silently renders every card with the fallback copy rather
   than failing — so it looks like it works until you actually look at one. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getStudy(slug);

  return new ImageResponse(
    (
      <Card label={study?.domain ?? "WORK"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* The tab, echoing the card treatment on the site itself. */}
          <span
            style={{
              alignSelf: "flex-start",
              fontFamily: "Silkscreen",
              fontSize: 22,
              color: LIME,
              border: `3px solid ${LIME}`,
              padding: "10px 18px",
            }}
          >
            {study?.card.category ?? "CASE STUDY"}
          </span>

          {/* Geist, because a case-study title is a sentence (§2.1). */}
          <span
            style={{
              fontFamily: "Geist",
              fontWeight: 500,
              fontSize: 56,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            {study?.headline ?? "Case study"}.
          </span>

          <span style={{ fontFamily: "Geist", fontSize: 26, color: NTEXT }}>
            {study?.role ?? "Product design"}
          </span>
        </div>
      </Card>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
