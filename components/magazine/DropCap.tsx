type DropCapProps = {
  children: React.ReactNode;
  className?: string;
};

export default function DropCap({ children, className = "" }: DropCapProps) {
  return (
    <div className={`drop-cap font-sans text-sm md:text-[15px] font-light text-leather leading-[1.75] ${className}`}>
      {children}
    </div>
  );
}
