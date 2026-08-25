/**
 * About-page content. Lifted out of the page so the page is a template rather
 * than a wall of hardcoded JSX — the old version inlined five jobs, three
 * principles and three bio paragraphs directly in the markup.
 */

export interface Job {
  role: string;
  company: string;
  period: string;
  desc: string;
}

export const JOBS: Job[] = [
  {
    role: "Senior UI/UX Designer & UX Engineer",
    company: "Cargoz · Dubai",
    period: "2025 – Present",
    desc: "Shipped Cargoz Connect, a B2B product for booking warehouse space within 24 hours, from wireframes to live UI. Building the design system for a 6-developer team and shipping front-end code in React and Tailwind.",
  },
  {
    role: "Senior UI/UX Designer",
    company: "Pixelmind IT Solutions · Dubai (Remote)",
    period: "2023 – 2025",
    desc: "Led UX and UI for a B2B Gym & Healthcare ERP/CRM across web and mobile, working directly with the CEO. Built the component library, design tokens, and developer docs, and delivered WCAG-aligned responsive interfaces.",
  },
  {
    role: "UX Designer",
    company: "Illuminz · India",
    period: "2022",
    desc: "Sole UX lead across two mobile apps at once, grounding features in personas and journey maps and using rapid prototyping to shorten feedback loops.",
  },
  {
    role: "UI/UX Designer",
    company: "iOSys Software · India",
    period: "2021 – 2022",
    desc: "Designed client websites across industries as part of a three-designer agency team.",
  },
  {
    role: "UI & Graphic Designer",
    company: "Addwiser · India",
    period: "2019 – 2021",
    desc: "Client UI and brand visuals across e-commerce, tech, and services.",
  },
];

export interface Principle {
  title: string;
  body: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: "I show the constraint instead of hiding it",
    body: "In the Sanad flow the honest move was telling people the form takes ten minutes and the review takes two days, rather than pretending it was shorter. Hidden scope does not reduce drop-off, it just delays it to the moment someone feels misled.",
  },
  {
    title: "Research until the decision is obvious, then stop",
    body: "Interviews, competitor teardowns, usability tests. All of it useful right up to the point where it stops changing what I would draw. Process theatre helps nobody.",
  },
  {
    title: "I audit my own work like someone else made it",
    body: "After building the Sanad prototype I held it to the same standard as the writing and found four things wrong, including a consent checkbox that was a dark pattern. That audit is still published on the case study.",
  },
];

export const BIO = [
  "I'm a Senior Product Designer with six years in B2B SaaS, based in Dubai. Logistics, healthcare, gym management, travel. In most of those rooms I was the only designer, which meant doing the research, making the call, drawing the screens, and then sitting with the engineers while it got built. Most of that work sits under NDA, so ask me about it on a call.",
  "At Cargoz I designed Cargoz Connect, a product that gets a business into warehouse space inside 24 hours, from the first wireframe to the live UI, and built the design system six developers now work from. Before that I ran UX for a gym and healthcare ERP, reporting straight to the CEO, which mostly taught me how to defend a design decision to someone who owns the P&L.",
  "My degree is in computer science, and I treat that as a design advantage rather than a second job. I know what is expensive to build, so I stop proposing it. I can read the codebase to check whether a pattern already exists before inventing another one. And when an idea needs proving, I would rather build it than describe it, which is why the prototypes in the Sanad and Wio case studies are real working software instead of screenshots.",
];

export const PHILOSOPHY =
  "The problems worth taking are the ones where the constraint does not move. You cannot delete the compliance step or shorten the ten-day wait, so the only thing left to design is how it feels to live through. That is the work I want.";

export const EDUCATION =
  "B.E. Computer Science & Engineering, Sahyadri College of Engineering & Management (2019) · UX Design, Interaction Design Foundation.";
