// Single source of truth for the work grid — used by the homepage (curated)
// and the /work index (everything). Order is deliberate: strongest recruiter
// signal first, side projects last.

export interface WorkEntry {
  slug: string;
  // Outcome-led hook — the card's headline. Leads with what the work achieved,
  // not the product name. The product name lives in `title` as a subtitle.
  headline: string;
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
    slug: "sanad",
    headline: "Onboarding that feels fast without cutting corners",
    title: "Sanad · KYB verification",
    category: "B2B Fintech",
    badge: "Concept",
    description:
      "A full six-screen KYB flow for a fictional business bank, designed and built as a working prototype.",
    thumbnail: "/assets/work/sanad-thumb.png",
    bgColor: "#EEF0FD",
  },
  {
    slug: "mizan",
    headline: "Designing the wait, when you can't remove it",
    title: "Mizan · account-hold communication",
    category: "B2B Fintech",
    badge: "Concept",
    description:
      "Business accounts frozen for weeks with no stage and no clock. A communication layer built against dated public complaints.",
    thumbnail: "/assets/work/mizan-thumb.png",
    bgColor: "#F7F7F5",
  },
  {
    slug: "almosafer-audit",
    headline: "Cutting decision fatigue on a top travel platform",
    title: "Almosafer · UX audit",
    category: "UX Audit",
    badge: "Self-initiated",
    description:
      "Hick's Law and visual hierarchy applied to two high-stakes screens in the booking funnel.",
    thumbnail: "/assets/almosafer-preview.png",
    bgColor: "#FEFCE8",
  },
  {
    slug: "google-maps-route-pass",
    headline: "Handing off a full route between phones in one scan",
    title: "Google Maps · Route Pass",
    category: "Product Design",
    badge: "Concept",
    description:
      "An encrypted QR handshake for multi-stop navigation, with destination privacy built in.",
    thumbnail: "/assets/google-maps-preview.png",
    bgColor: "#E1F2ED",
  },
  {
    slug: "omni-cast-ai",
    headline: "AI publishing that shows its work, not a black box",
    title: "OmniCast AI",
    category: "Product Design",
    badge: "Concept",
    description:
      "Predictive scheduling and inline performance insights, shaped by 8 interviews and 4 competitor audits.",
    thumbnail: "/assets/omnicast-preview.png",
    bgColor: "#F5F3FF",
  },
  {
    slug: "instagram-local",
    headline: "Finding what's happening two streets away",
    title: "Instagram · Local Feed",
    category: "Product Design",
    badge: "Concept",
    description:
      "A local discovery layer for Instagram: nearby events and businesses, without fighting the algorithm.",
    thumbnail: null,
    bgColor: "#EDF9FF",
  },
  {
    slug: "roomy",
    headline: "Running rent and chores for a 21-person flat",
    title: "Roomy · Bedspace OS",
    category: "Side Project",
    badge: "Live",
    description: "A bedspace management app I designed and built end to end. In daily production use.",
    thumbnail: "/assets/roomy-preview.png",
    bgColor: "#F5F3FF",
    liveUrl: "https://roomy-delta.vercel.app/",
  },
  {
    slug: "form",
    headline: "Health tracking with zero sign-up friction",
    title: "Form · Privacy-first health",
    category: "Side Project",
    badge: "Live",
    description: "A privacy-first, offline-first health tracker I designed and built end to end.",
    thumbnail: null,
    bgColor: "#0D1117",
    liveUrl: "https://fitness-tracker-pi-tan.vercel.app/",
  },
];

// Homepage curation: the strongest case studies first + the two live products.
// OmniCast and Instagram live on the full /work index, not the homepage.
export const featuredSlugs = ["sanad", "almosafer-audit", "google-maps-route-pass"];
export const sideProjectSlugs = ["roomy", "form"];
