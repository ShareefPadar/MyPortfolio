type MarginNoteProps = {
  children: React.ReactNode;
};

export default function MarginNote({ children }: MarginNoteProps) {
  return (
    <aside className="md:float-right md:w-48 md:ml-8 md:-mr-4 mb-4 md:mb-2 p-4 border-l-2 border-peach bg-creme">
      <p className="font-typewriter text-[9px] uppercase tracking-[0.12em] text-peach mb-2">
        Margin Note
      </p>
      <div className="font-sans text-xs font-light text-leather leading-relaxed">{children}</div>
    </aside>
  );
}
