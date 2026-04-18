"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const py = useSpring(useTransform(scrollY, [0, 200], [20, 10]), { stiffness: 120, damping: 20 });
  const px = useSpring(useTransform(scrollY, [0, 200], [28, 20]), { stiffness: 120, damping: 20 });
  const maxW = useTransform(scrollY, [0, 200], ["80rem", "60rem"]);
  const bgOpacity = useTransform(scrollY, [0, 200], [0.6, 0.85]);
  const bg = useTransform(bgOpacity, (o) => `rgba(255, 255, 255, ${o})`);

  const isWorkActive = pathname.startsWith("/work");
  const isAboutActive = pathname === "/about";
  const isHomeActive = pathname === "/";

  const linkClass = (active: boolean) =>
    `relative py-1 text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase transition-all duration-300 ${
      active ? "text-accent" : "text-neutral-500 hover:text-neutral-950"
    }`;

  return (
    <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 w-full pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ paddingTop: py, paddingBottom: py, paddingLeft: px, paddingRight: px, maxWidth: maxW, backgroundColor: bg }}
        className="pointer-events-auto w-full backdrop-blur-3xl border border-white/40 shadow-xl rounded-2xl sm:rounded-3xl flex justify-between items-center"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center shrink-0">
          <img src="/assets/logo.svg" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
        </Link>

        <div className="flex gap-4 sm:gap-8 items-center">
          {/* Home — hidden on mobile, logo handles it */}
          <Link href="/" className={`${linkClass(isHomeActive)} hidden sm:block`}>
            Home
            {isHomeActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
          </Link>

          <Link href="/#work" className={linkClass(isWorkActive)}>
            Work
            {isWorkActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
          </Link>

          <Link href="/about" className={linkClass(isAboutActive)}>
            About
            {isAboutActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
          </Link>

          <div className="w-px h-4 bg-neutral-200 hidden sm:block" />

          <a
            href="mailto:shareefpadar@gmail.com"
            className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-neutral-950 hover:text-accent transition-colors duration-300"
          >
            Contact
          </a>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
