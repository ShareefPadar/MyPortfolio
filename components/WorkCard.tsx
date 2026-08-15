import Link from "next/link";
import Image from "next/image";
import PixelIcon from "@/components/px/PixelIcon";
import type { CaseStudy } from "@/lib/work";

/**
 * Work card (spec §4.4).
 *
 * Plate with a raised bevel, a domain tab breaking the top edge, a sunk well
 * holding the screenshot, and a paper body. Server component: no state, and
 * hover lives entirely in CSS.
 *
 * The tab carries the DOMAIN and nothing else — never a year, never a
 * discipline, never a role.
 */

type Props = {
  study: CaseStudy;
  /** Lime tab: this one matches the role being applied for. */
  relevant?: boolean;
  /** Larger screenshot well for the featured grid. */
  featured?: boolean;
  /** Tier 2 on the work index: no description, so the tier reads as a tier. */
  compact?: boolean;
};

const WorkCard = ({ study, relevant = false, featured = false, compact = false }: Props) => {
  const { card, slug, domain } = study;

  return (
    <Link
      href={`/work/${slug}`}
      aria-label={`Read the ${card.title} case study`}
      className="card group mt-[17px] block h-full"
    >
      <span className={`card-tab ${relevant ? "relevant" : ""}`}>{domain}</span>

      {/* The well is sunk: it contains rather than invites. */}
      <div className={`well relative m-[10px] mt-[14px] overflow-hidden bg-panel ${featured ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        {card.thumbnail ? (
          <Image
            src={card.thumbnail}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="grid h-full w-full place-items-center px-4">
            <span className="text-center font-pix text-[14px] leading-[1.8] text-mute">
              {card.title}
            </span>
          </div>
        )}
      </div>

      <div className="card-body m-[10px] flex flex-col p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
          {card.category} · {card.badge}
        </p>
        <h3 className="mb-1 font-sans text-[19px] font-medium leading-[1.4] text-ink">
          {card.headline}
        </h3>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.07em] text-mute">
          {card.title}
        </p>
        {!compact && (
          <p className="mb-4 font-sans text-[14.5px] leading-[1.6] text-ink">
            {card.description}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 font-pix text-[10px] leading-none text-blue">
          READ CASE STUDY
          <PixelIcon name="arrowR" size={8} />
        </span>
      </div>
    </Link>
  );
};

export default WorkCard;
