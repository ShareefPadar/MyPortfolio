type NameplateProps = {
  name?: string;
  tagline?: string;
};

export default function Nameplate({
  name = "Shareef Padar",
  tagline = "Design Engineer · UX Strategy · Code",
}: NameplateProps) {
  const parts = name.split(" ");
  const firstName = parts.slice(0, -1).join(" ");
  const lastName = parts[parts.length - 1];

  return (
    <div className="text-center py-8 md:py-12">
      <h1 className="font-display text-[clamp(3.5rem,12vw,6rem)] font-bold leading-[0.95] tracking-tight text-coffee">
        {firstName}{" "}
        <em className="italic font-bold">{lastName}</em>
      </h1>
      <div className="mt-6 mx-auto w-24 border-t-[3px] border-b-[3px] border-clay border-double" />
      <p className="mt-6 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-leather">
        {tagline}
      </p>
    </div>
  );
}
