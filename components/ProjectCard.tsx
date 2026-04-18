"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  href: string;
  bgColor?: string;
}

const ProjectCard = ({ title, description, imageUrl, href, bgColor = "#F5F5F7" }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 15 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setTiltEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    if (!tiltEnabled) return;
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tiltEnabled ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
      className="group relative cursor-pointer w-full"
    >
      <Link href={href} className="block w-full h-full" aria-label={`Read case study for ${title}`}>
        <div
          className="relative w-full h-auto md:aspect-[4/5] rounded-3xl overflow-hidden flex flex-col transition-all duration-700 ease-out shadow-sm hover:shadow-xl"
          style={{ backgroundColor: bgColor, transformStyle: tiltEnabled ? "preserve-3d" : undefined }}
        >
          <div
            className="p-8 pb-12 md:p-14 lg:p-16 flex flex-col"
            style={tiltEnabled ? { transform: "translateZ(30px)" } : undefined}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-950 mb-6 tracking-tight leading-none">
              {title}
            </h2>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans mb-8 max-w-xl">
              {description}
            </p>
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-base md:text-lg font-sans">
              Read case study <span className="text-2xl ml-1 transition-transform duration-300 group-hover:translate-x-2">→</span>
            </div>
          </div>

          <div
            className="mt-auto relative w-full h-1/2 md:h-1/2 hidden md:flex justify-center items-end px-12 md:px-20"
            style={tiltEnabled ? { transform: "translateZ(50px)" } : undefined}
          >
            <div className="w-full h-full bg-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-2xl overflow-hidden border-x-8 md:border-x-8 border-t-8 md:border-t-8 border-white transition-all duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-4 relative">
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
