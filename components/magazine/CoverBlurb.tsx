import Link from "next/link";

type CoverBlurbProps = {
  title?: string;
  items: { label: string; href: string }[];
};

export default function CoverBlurb({
  title = "Also in this issue",
  items,
}: CoverBlurbProps) {
  return (
    <aside className="bg-coffee text-creme p-6 md:p-8">
      <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-golden mb-5">
        {title}
      </p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block font-sans text-sm font-light text-creme/80 hover:text-creme leading-relaxed transition-colors"
            >
              <span className="text-peach group-hover:text-golden transition-colors">→ </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
