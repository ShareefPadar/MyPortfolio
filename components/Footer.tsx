import { FaLinkedin, FaMedium, FaInstagram, FaBehance } from "react-icons/fa6";
import ParallaxSection from "./ParallaxSection";

export default function Footer() {
  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/shareef-padar/", icon: FaLinkedin },
    { name: "Medium", url: "https://medium.com/@shareefpadar167", icon: FaMedium },
    { name: "Instagram", url: "https://www.instagram.com/cheppu_padar", icon: FaInstagram },
    { name: "Behance", url: "https://www.behance.net/shareefpadar", icon: FaBehance },
  ];

  return (
    <footer className="w-full bg-[#FAFAFA] pb-24 md:pb-32 pt-20 flex flex-col items-center overflow-hidden">
      <ParallaxSection delay={0.1} className="w-full flex flex-col items-center">
        <div className="text-center mb-16 px-4">
          <h4 className="text-[2rem] md:text-[2.5rem] font-serif font-bold mb-4 text-[#0a0a14]">Let&apos;s Connect</h4>
          <p className="text-base md:text-xl font-sans text-neutral-500 leading-relaxed mb-4 max-w-lg mx-auto">
            Feel free to reach out for collaborations or just a friendly hello.
          </p>
          <a href="mailto:shareefpadar@gmail.com" className="text-lg md:text-2xl font-sans font-bold text-accent hover:opacity-80 transition-opacity">
            shareefpadar@gmail.com
          </a>
        </div>

        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap px-4">
          {socialLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neutral-900/40 hover:text-neutral-900 transition-colors"
              aria-label={link.name}
            >
              <link.icon size={28} />
            </a>
          ))}
        </div>
      </ParallaxSection>
    </footer>
  );
}
