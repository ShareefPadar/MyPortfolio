import Byline from "./Byline";

type CoverStoryProps = {
  kicker: string;
  headline: React.ReactNode;
  deck: string;
  script?: string;
};

export default function CoverStory({ kicker, headline, deck, script }: CoverStoryProps) {
  return (
    <article className="space-y-5">
      <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-peach">
        {kicker}
      </p>
      <h2 className="font-display text-[clamp(2rem,5vw,2.875rem)] font-bold leading-[1.1] text-coffee">
        {headline}
      </h2>
      <p className="font-sans text-sm md:text-[15px] font-light text-leather leading-[1.75] max-w-lg">
        {deck}
      </p>
      {script && (
        <p className="font-script text-xl md:text-2xl text-peach leading-snug">{script}</p>
      )}
      <Byline />
    </article>
  );
}
