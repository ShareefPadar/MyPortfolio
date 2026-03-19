"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 md:px-12 lg:px-20 w-full pointer-events-none">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full max-w-7xl bg-white/60 backdrop-blur-3xl border border-white/40 shadow-xl rounded-3xl px-5 sm:px-10 py-5 sm:py-6 flex justify-between items-center transition-all duration-300"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center shrink-0 group">
          <img src="/assets/logo.svg" alt="Logo" className="w-8 h-8 transition-all duration-300" />
        </Link>
        <div className="flex gap-4 sm:gap-10 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`relative py-1 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive ? "text-accent" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            )
          })}
          <div className="w-px h-4 bg-neutral-200 mx-2 hidden sm:block"></div>
          <a 
            href="mailto:shareefpadar@gmail.com" 
            className="text-xs sm:text-sm font-bold tracking-widest uppercase text-neutral-950 hover:text-accent transition-colors duration-300"
          >
            CONTACT
          </a>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
