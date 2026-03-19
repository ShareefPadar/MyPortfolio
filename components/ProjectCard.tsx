"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  href: string;
  bgColor?: string;
}

const ProjectCard = ({ title, description, imageUrl, href, bgColor = "#F5F5F7" }: ProjectCardProps) => {
  return (
    <motion.div 
      className="group relative cursor-pointer w-full"
    >
      <Link href={href} className="block w-full h-full" aria-label={`Read case study for ${title}`}>
        <div 
          className="relative w-full h-auto md:aspect-[4/5] rounded-3xl overflow-hidden flex flex-col transition-all duration-700 ease-out shadow-sm hover:shadow-xl"
          style={{ backgroundColor: bgColor }}
        >
          {/* Typography Section */}
          <div className="p-8 pb-12 md:p-14 lg:p-16 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-6 tracking-tight leading-none">
              {title}
            </h2>
            <p className="text-base md:text-xl text-neutral-800 leading-relaxed font-sans mb-8 w-11/12">
              {description}
            </p>
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-base md:text-lg font-sans">
              Read case study <span className="text-2xl ml-1 transition-transform duration-300 group-hover:translate-x-2">→</span>
            </div>
          </div>

          {/* Bottom Image / Device Mockup */}
          <div className="mt-auto relative w-full h-1/2 md:h-1/2 hidden md:flex justify-center items-end px-12 md:px-20">
            <motion.div 
              className="w-full h-full bg-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-2xl overflow-hidden border-x-8 md:border-x-8 border-t-8 md:border-t-8 border-white transform transition-all duration-700 ease-[0.23, 1, 0.32, 1] group-hover:scale-105 group-hover:-translate-y-4"
            >
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;








