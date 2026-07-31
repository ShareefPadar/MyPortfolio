import Image from "next/image";

type PlateProps = {
  src: string;
  alt: string;
  caption: string;
  number?: string;
  priority?: boolean;
};

export default function Plate({ src, alt, caption, number = "01", priority = false }: PlateProps) {
  const isExternal = src.startsWith("http");

  return (
    <figure className="my-8 md:my-12">
      <div className="relative w-full aspect-[16/10] bg-clay/20 overflow-hidden">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={priority}
          />
        )}
      </div>
      <figcaption className="mt-3 font-typewriter text-[10px] uppercase tracking-[0.12em] text-leather">
        Plate {number} — {caption}
      </figcaption>
    </figure>
  );
}
