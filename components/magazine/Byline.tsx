type BylineProps = {
  author?: string;
  role?: string;
  location?: string;
};

export default function Byline({
  author = "Shareef Padar",
  role = "Design Engineer",
  location = "Filed from Dubai",
}: BylineProps) {
  return (
    <p className="font-typewriter text-[10px] uppercase tracking-[0.12em] text-leather pt-2">
      By {author} · {role} · {location}
    </p>
  );
}
