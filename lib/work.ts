/**
 * The single source of truth for case studies.
 *
 * Replaces app/work/data.ts (untyped, forced seven `as any` casts) and
 * app/work/workList.ts, which duplicated title/headline/description with
 * DIFFERENT values in each file. Rather than pick a winner, the card is
 * modelled as its own artifact: "Almosafer UX Audit" is a page title,
 * "Almosafer · UX audit" is a card title, and both are correct in place.
 */

/** Card tab content (spec §4.4): domain only, never a year or a discipline. */
export type Domain =
  | "FINTECH"
  | "TRAVEL"
  | "NAVIGATION"
  | "SOCIAL"
  | "MARKETING"
  | "CO-LIVING"
  | "HEALTH";

/** Work index tiering (spec §7.2). Tier 1 is the "START HERE" pair. */
export type Tier = 1 | 2;

export interface CaseStudy {
  slug: string;

  /* ── page voice ─────────────────────────────────────────────── */
  /** Short. Drives the browser tab, metadata, and the next-story link. */
  title: string;
  /** The H1. States the problem solved rather than naming the product. */
  headline: string;
  description: string;
  role: string;
  type: string;
  duration: string;
  outcome: string;
  quote?: string;
  stack?: string;
  imageUrl: string;
  /**
   * Quote-banner background on the case-study page.
   * TODO(Phase 7): the 8-bit cards are plate/paper, so per-project pastels go
   * away when the case-study template is rebuilt. Kept until then so this
   * refactor stays visually identical.
   */
  bgColor: string;
  liveUrl?: string;
  liveLabel?: string;
  repoUrl?: string;
  repoLabel?: string;

  /* ── card voice ─────────────────────────────────────────────── */
  card: {
    headline: string;
    title: string;
    category: string;
    badge: "Self-initiated" | "Concept" | "Live";
    description: string;
    thumbnail: string | null;
  };

  domain: Domain;
  tier: Tier;
  /** Display order in the grids. */
  order: number;
  /**
   * Legacy next-story order, preserved from the old data.ts key order so this
   * refactor changes nothing. It is deliberately NOT the same as `order`.
   * TODO(Phase 7): unify these two once the case-study template is rebuilt —
   * it changes where "next story" points, so it needs a conscious decision.
   */
  nextOrder: number;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "sanad",
    title: "Sanad: KYB Onboarding",
    headline: "Making business verification feel fast without making it less rigorous",
    description:
      "New businesses have to prove they're legitimate before they can move money. I hit this wall myself going through Companies House verification, so I designed the full KYB onboarding flow for Sanad, a concept business-banking brand, and built it as a working React prototype. One rule shaped everything: you can't make the process easier by making it less rigorous.",
    role: "Product Designer & Builder",
    type: "Product concept",
    duration: "2026",
    outcome:
      "A working six-screen prototype, embedded in the case study. Every decision earns its place against a constraint that can't move: regulators decide the steps, design decides how they feel.",
    quote:
      "A real problem, a concept product. The frustration, the research, and the working prototype are all real. Sanad, the business-banking brand they're wrapped in, is the part I invented so I could solve the problem end to end.",
    stack: "React · Custom CSS · AI-assisted build",
    imageUrl: "/assets/work/sanad-thumb.png",
    bgColor: "#EEF0FD",
    card: {
      headline: "Onboarding that feels fast without cutting corners",
      title: "Sanad · KYB verification",
      category: "B2B Fintech",
      badge: "Concept",
      description:
        "A full six-screen KYB flow for a fictional business bank, designed and built as a working prototype.",
      thumbnail: "/assets/work/sanad-thumb.png",
    },
    domain: "FINTECH",
    tier: 1,
    order: 1,
    nextOrder: 5,
  },
  {
    slug: "mizan",
    title: "When the Bank Knows and the Customer Doesn't",
    headline: "When the bank knows and the customer doesn't",
    description:
      'A business account was frozen for an ownership change. Every document went in that day. A month later the account was still frozen, the POS couldn\'t settle, and support said "please wait another 24 hours" on every call for four weeks. The bank knew exactly what stage the review was at. The customer never did. I designed the communication layer that gap leaves missing.',
    role: "Design & front-end",
    type: "Product concept",
    duration: "2026",
    outcome:
      "A working prototype for the wait itself, not the decision. Built against dated public complaints rather than an invented brief, and constrained by what compliance genuinely cannot disclose.",
    quote:
      "Several of the causes here cannot be designed away: mandatory holds, external registry timelines, reasons the bank is not allowed to give. What can be designed is what the customer is told while they wait.",
    stack: "React · Custom CSS · AI-assisted build",
    imageUrl: "/assets/work/mizan-thumb.png",
    bgColor: "#F7F7F5",
    card: {
      headline: "Telling a frozen business where it actually stands",
      title: "Mizan · account-hold communication",
      category: "B2B Fintech",
      badge: "Concept",
      description:
        "Business accounts frozen for weeks with no stage and no clock. A communication layer built against dated public complaints.",
      thumbnail: "/assets/work/mizan-thumb.png",
    },
    domain: "FINTECH",
    tier: 1,
    order: 2,
    nextOrder: 6,
  },
  {
    slug: "almosafer-audit",
    title: "Almosafer UX Audit",
    headline: "Cutting decision fatigue in Almosafer's booking funnel",
    description:
      "Refining the interface of the Middle East's leading travel platform by applying core UX principles to eliminate decision fatigue.",
    role: "Product Designer",
    type: "Self-initiated UX audit",
    duration: "2-4 weeks",
    outcome:
      "Two high-stakes friction points in the booking funnel, both fixed inside the existing design system with no brand changes.",
    quote:
      "Audited the Middle East's leading travel platform and found two high-stakes friction points in the booking funnel, both fixable without touching a single brand token.",
    imageUrl: "/assets/almosafer-preview.png",
    bgColor: "#FEFCE8",
    card: {
      headline: "Cutting decision fatigue on a top travel platform",
      title: "Almosafer · UX audit",
      category: "UX Audit",
      badge: "Self-initiated",
      description:
        "Hick's Law and visual hierarchy applied to two high-stakes screens in the booking funnel.",
      thumbnail: "/assets/almosafer-preview.png",
    },
    domain: "TRAVEL",
    tier: 2,
    order: 3,
    nextOrder: 3,
  },
  {
    slug: "google-maps-route-pass",
    title: "Google Maps Route Pass",
    headline: "Passing a full multi-stop route between phones in one scan",
    description:
      "A privacy-first, encrypted handshake for instant multi-stop navigation transfers between passengers and drivers.",
    role: "Lead Product Designer",
    type: "Product concept",
    duration: "4 weeks",
    outcome:
      "19 commuters tested the concept and every one said they'd use it. The QR handshake is designed to complete in under five seconds.",
    quote:
      "Treating privacy as a core feature instead of an afterthought is what makes this work for commuters anywhere.",
    imageUrl: "/assets/google-maps-preview.png",
    bgColor: "#E1F2ED",
    card: {
      headline: "Handing off a full route between phones in one scan",
      title: "Google Maps · Route Pass",
      category: "Product Design",
      badge: "Concept",
      description:
        "An encrypted QR handshake for multi-stop navigation, with destination privacy built in.",
      thumbnail: "/assets/google-maps-preview.png",
    },
    domain: "NAVIGATION",
    tier: 2,
    order: 4,
    nextOrder: 1,
  },
  {
    slug: "omni-cast-ai",
    title: "OmniCast AI",
    headline: "AI publishing that shows its reasoning instead of hiding it",
    description:
      "AI-powered publishing assistant that predicts performance and optimizes multi-channel campaigns in real-time.",
    role: "Senior Product Designer",
    type: "Product concept",
    duration: "2-4 weeks",
    outcome:
      "Projected +15–20% engagement uplift and 30–40% time saved in test scenarios, grounded in interviews with 8 practitioners.",
    quote:
      "AI-powered publishing assistant built on 8 interviews and 4 competitor audits. Projected 30–40% time savings and 15–20% engagement uplift across 6 platforms.",
    imageUrl: "/assets/omnicast-preview.png",
    bgColor: "#F5F3FF",
    card: {
      headline: "AI publishing that shows its work, not a black box",
      title: "OmniCast AI",
      category: "Product Design",
      badge: "Concept",
      description:
        "Predictive scheduling and inline performance insights, shaped by 8 interviews and 4 competitor audits.",
      thumbnail: "/assets/omnicast-preview.png",
    },
    domain: "MARKETING",
    tier: 2,
    order: 5,
    nextOrder: 2,
  },
  {
    slug: "instagram-local",
    title: "Instagram Local Feed",
    headline: "Giving Instagram a local layer people can actually find",
    description:
      "Instagram connects you to the whole world but falls short two streets away. This concept adds a local layer for finding nearby events and businesses.",
    role: "Product Designer",
    type: "Product concept",
    duration: "2-4 weeks",
    outcome:
      "A 20-user survey found 86% value local content but fewer than half can find it, so I designed two discovery patterns for passive and active browsing.",
    quote:
      "Uncovered a critical gap: 86% of users value local content, but fewer than half can find it. Surveyed 20 users, designed 2 discovery solutions for passive and active browsing modes.",
    imageUrl: "/assets/instagram-local.png",
    bgColor: "#EDF9FF",
    card: {
      headline: "Surfacing the local content the algorithm buries",
      title: "Instagram · Local Feed",
      category: "Product Design",
      badge: "Concept",
      description:
        "A local discovery layer for Instagram: nearby events and businesses, without fighting the algorithm.",
      thumbnail: null,
    },
    domain: "SOCIAL",
    tier: 2,
    order: 6,
    nextOrder: 4,
  },
  {
    slug: "roomy",
    title: "Roomy: The Bedspace OS",
    headline: "Rent, bills, and laundry for 21 flatmates on one ledger",
    description:
      "Living with 21 roommates broke every spreadsheet, so I designed and shipped a shared system of record for rent, utilities, and facilities. It's in daily use.",
    role: "Product Designer & Builder",
    type: "Live product",
    duration: "2-4 weeks",
    outcome:
      "Running in production for a 21-person flat, with rent, utilities, and laundry on one shared system of record.",
    stack: "Next.js 16 • React 19 • Tailwind CSS 4 • Cursor (AI-IDE)",
    imageUrl: "/assets/roomy-preview.png",
    bgColor: "#F5F3FF",
    liveUrl: "https://roomy-delta.vercel.app/",
    liveLabel: "Launch Live App",
    repoUrl: "https://github.com/ShareefPadar/Roomy",
    repoLabel: "View Repository",
    card: {
      headline: "Ending spreadsheet chaos for a 21-person flat",
      title: "Roomy · Bedspace OS",
      category: "Side Project",
      badge: "Live",
      description:
        "A bedspace management app I designed and built end to end. In daily production use.",
      thumbnail: "/assets/roomy-preview.png",
    },
    domain: "CO-LIVING",
    tier: 2,
    order: 7,
    nextOrder: 8,
  },
  {
    slug: "form",
    title: "Form: Privacy-First Health",
    headline: "Health tracking that works offline, with no account",
    description:
      "A health tracker built on one insight: removing sign-up friction beats adding features. It works fully offline with no account. Your weight, BMI, and body composition stay on your device and sync only when you choose.",
    role: "Product Designer & Builder",
    type: "Live product",
    duration: "2-4 weeks",
    outcome:
      "Live and offline-first. Full tracking with no sign-up, and data stays on the device until you choose to sync.",
    quote:
      "Privacy-first doesn't mean feature-poor. Guest Mode plus offline-first architecture delivers a premium UX with zero account friction.",
    stack: "React + Vite • IndexedDB (Dexie.js) • Supabase • Recharts",
    imageUrl: "/assets/fitness-tracker-preview.png",
    bgColor: "#0D1117",
    liveUrl: "https://fitness-tracker-pi-tan.vercel.app/",
    liveLabel: "Launch Live App",
    repoUrl: "https://github.com/ShareefPadar/fitness-tracker",
    repoLabel: "View Repository",
    card: {
      headline: "Health tracking with zero sign-up friction",
      title: "Form · Privacy-first health",
      category: "Side Project",
      badge: "Live",
      description:
        "A privacy-first, offline-first health tracker I designed and built end to end.",
      thumbnail: null,
    },
    domain: "HEALTH",
    tier: 2,
    order: 8,
    nextOrder: 7,
  },
];

/* ── selectors ────────────────────────────────────────────────── */

const byOrder = [...CASE_STUDIES].sort((a, b) => a.order - b.order);

export const allStudies = byOrder;
export const slugs = byOrder.map((s) => s.slug);

export const getStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((s) => s.slug === slug);

/** Homepage: the four featured case studies, then the two live side projects. */
export const featuredSlugs = ["sanad", "mizan", "almosafer-audit", "google-maps-route-pass"];
export const sideProjectSlugs = ["roomy", "form"];

export const featured = featuredSlugs.map((s) => getStudy(s)!).filter(Boolean);
export const sideProjects = sideProjectSlugs.map((s) => getStudy(s)!).filter(Boolean);

/**
 * Next story. Walks `nextOrder` rather than `order`, preserving exactly where
 * the old implementation pointed (it wrapped Object.keys(data.ts)).
 */
export function nextStory(slug: string): CaseStudy {
  const current = getStudy(slug);
  const ring = [...CASE_STUDIES].sort((a, b) => a.nextOrder - b.nextOrder);
  const i = current ? ring.findIndex((s) => s.slug === current.slug) : -1;
  return ring[(i + 1) % ring.length];
}
