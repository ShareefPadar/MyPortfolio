import Link from "next/link";
import Image from "next/image";
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
  /** Larger screenshot well for the featured grid. */
  featured?: boolean;
  /** Tier 2 on the work index: no description, so the tier reads as a tier. */
  compact?: boolean;
};

const WorkCard = ({ study, featured = false, compact = false }: Props) => {
  const { card, slug } = study;

  return (
    <Link
      href={`/work/${slug}`}
      aria-label={`Read the ${card.title} case study`}
      /* mt-17 makes room for the tab, which sits at top:-17px. The height has
         to give that 17px back, or the card is a full row-height TALL and then
         pushed down 17px, so its bottom border hangs outside the grid slot. */
      className="card group mt-[17px] block h-[calc(100%-17px)]"
    >
      <span className="card-tab">{card.category}</span>

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
          <div className="grid h-full w-full place-items-center px-16">
            <span className="text-center font-pix text-[14px] leading-[1.8] text-mute">
              {card.title}
            </span>
          </div>
        )}
      </div>

      <div className="card-body m-[10px] flex flex-col p-16">
        <p className="mb-8 font-mono text-[9px] tracking-[0.02em] text-mute">
          {card.category} · {card.badge}
        </p>
        <h3 className="mb-4 font-sans text-[19px] font-medium leading-[1.4] text-ink">
          {card.headline}
        </h3>
        <p className="mb-12 font-mono text-[9px] tracking-[0.02em] text-mute">
          {card.title}
        </p>
        {!compact && (
          <p className="mb-16 font-sans text-[14px] leading-[1.6] text-ink">
            {card.description}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-8 font-pix text-[11px] leading-none text-blue">
          READ CASE STUDY
        </span>
      </div>
    </Link>
  );
};

export default WorkCard;
