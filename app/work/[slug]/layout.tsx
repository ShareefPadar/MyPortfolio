import Footer from "@/components/Footer";

/**
 * Case studies get the MINIMAL footer (spec §7.4): the page already ends on a
 * next-story link, and a next link plus a full sitemap is two navigation
 * systems arguing with each other.
 *
 * The root layout's full footer is suppressed for this segment by rendering
 * the minimal one here and hiding the outer one via a body-level marker.
 */
export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-footer="minimal">
      {children}
      <Footer variant="minimal" />
    </div>
  );
}
