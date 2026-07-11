// Single source of truth for the work grid — used by the homepage (curated)
// and the /work index (everything). Order is deliberate: strongest recruiter
// signal first, side projects last.

export interface WorkEntry {
  slug: string;
  title: string;
  category: string;
  badge: "Self-initiated" | "Concept" | "Live";
  description: string;
  thumbnail: string | null;
  bgColor: string;
  liveUrl?: string;
}

export const workEntries: WorkEntry[] = [
  {
    slug: "almosafer-audit",
    title: "Almosafer UX Audit",
    category: "UX Audit",
    badge: "Self-initiated",
    description:
      "Applied Hick's Law and visual hierarchy to simplify the Middle East's leading travel platform.",
    thumbnail: "/assets/almosafer-preview.png",
    bgColor: "#FEFCE8",
  },
  {
    slug: "omni-cast-ai",
    title: "OmniCast AI",
    category: "Product Design",
    badge: "Concept",
    description:
      "AI publishing assistant that predicts performance and optimises campaigns across channels.",
    thumbnail: "/assets/omnicast-preview.png",
    bgColor: "#F5F3FF",
  },
  {
    slug: "google-maps-route-pass",
    title: "Google Maps Route Pass",
    category: "Product Design",
    badge: "Concept",
    description:
      "An encrypted QR handshake that passes a full multi-stop route from a passenger's phone to their driver's.",
    thumbnail: "/assets/google-maps-preview.png",
    bgColor: "#E1F2ED",
  },
  {
    slug: "instagram-local",
    title: "Instagram Local Feed",
    category: "Product Design",
    badge: "Concept",
    description:
      "Local discovery built into Instagram: events and businesses happening near you.",
    thumbnail: null,
    bgColor: "#EDF9FF",
  },
  {
    slug: "roomy",
    title: "Roomy",
    category: "Side Project",
    badge: "Live",
    description: "A bedspace management app I designed and built end to end.",
    thumbnail: "/assets/roomy-preview.png",
    bgColor: "#F5F3FF",
    liveUrl: "https://roomy-delta.vercel.app/",
  },
  {
    slug: "form",
    title: "Form",
    category: "Side Project",
    badge: "Live",
    description: "A privacy-first, offline-first health tracker I designed and built end to end.",
    thumbnail: null,
    bgColor: "#0D1117",
    liveUrl: "https://fitness-tracker-pi-tan.vercel.app/",
  },
];

// Homepage curation: the three strongest case studies + the two live products.
export const featuredSlugs = ["almosafer-audit", "omni-cast-ai", "google-maps-route-pass"];
export const sideProjectSlugs = ["roomy", "form"];
