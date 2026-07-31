type EditorsDeskProps = {
  children: React.ReactNode;
  signature?: string;
  date?: string;
};

export default function EditorsDesk({
  children,
  signature = "Shareef",
  date,
}: EditorsDeskProps) {
  const formattedDate =
    date ??
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
      <div className="md:sticky md:top-24">
        <h1 className="font-script text-4xl md:text-5xl text-peach leading-none mb-4">
          from the desk.
        </h1>
        <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-leather">
          A note from the editor · {formattedDate}
        </p>
      </div>

      <div className="space-y-8">
        <div className="drop-cap font-sans text-sm md:text-[15px] font-light text-leather leading-[1.75] space-y-6">
          {children}
        </div>
        <p className="font-script text-3xl text-peach">{signature}</p>
      </div>
    </section>
  );
}
