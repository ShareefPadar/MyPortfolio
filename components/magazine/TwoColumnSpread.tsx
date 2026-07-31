type TwoColumnSpreadProps = {
  title: string;
  children: React.ReactNode;
  dropCap?: boolean;
};

export default function TwoColumnSpread({ title, children, dropCap = true }: TwoColumnSpreadProps) {
  return (
    <section className="py-8 md:py-10">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-coffee mb-6 md:mb-8">
        {title}
      </h2>
      <div className={dropCap ? "two-column-spread drop-cap" : "two-column-spread"}>
        {children}
      </div>
    </section>
  );
}
