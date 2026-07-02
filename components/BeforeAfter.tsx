import Image from "next/image";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  aspect?: string;
}

const BeforeAfter = ({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  aspect = "aspect-[4/3]",
}: BeforeAfterProps) => {
  return (
    <figure className="my-10 not-prose">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl border border-neutral-100 shadow-lg`}>
            <Image src={before} alt={beforeLabel} fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover object-top" />
          </div>
          <span className="mt-3 block text-center text-xs font-bold uppercase tracking-widest text-neutral-400">
            {beforeLabel}
          </span>
        </div>
        <div>
          <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl border border-accent/20 shadow-lg`}>
            <Image src={after} alt={afterLabel} fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover object-top" />
          </div>
          <span className="mt-3 block text-center text-xs font-bold uppercase tracking-widest text-accent">
            {afterLabel}
          </span>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-neutral-500 font-sans">{caption}</figcaption>
      )}
    </figure>
  );
};

export default BeforeAfter;
