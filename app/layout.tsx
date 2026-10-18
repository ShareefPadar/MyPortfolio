import type { Metadata } from "next";
import Script from 'next/script';
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PixelCursor from "@/components/px/PixelCursor";
import PixelGuide from "@/components/px/PixelGuide";
import EraRail from "@/components/px/EraRail";
import EraSwitch from "@/components/px/EraSwitch";
import site from "@/era-system/content/site.json";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


/* ── 8-bit design system faces (spec §2) ──────────────────────────
   Three faces, gated by what a string IS, not by heading level:
     sentence  → Geist        (even a 40px H1)
     label     → Geist Mono   (tags, meta, eyebrows, nav, timestamps)
     statement → Silkscreen   (max 5 words: hero, page titles, buttons)

   Geist Mono stands in for Departure Mono, which the spec names but which
   is not on Google Fonts. Swapping it later is one @font-face change.

   Silkscreen uses display:'block', not 'swap': its metrics are unlike any
   fallback, so swapping mid-load throws the hero around violently. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "block",
  variable: "--font-silkscreen",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shareefpadar.com'),
  title: 'Shareef Padar | Senior Product Designer, Dubai',
  description: 'Senior Product Designer with 6 years of B2B UX experience. Research, design systems, and production-ready code, based in Dubai.',
  icons: {
    icon: "/assets/logo.svg",
  },
  openGraph: {
    title: 'Shareef Padar | Senior Product Designer',
    description: '6 years of B2B product design, from research to shipped interfaces.',
    url: 'https://www.shareefpadar.com', 
    siteName: 'Shareef Padar Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shareef Padar | Senior Product Designer',
    description: '6 years of B2B product design, from research to shipped interfaces.',
  },
};

// Structured data — helps search engines understand who this is.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shareef Padar",
  jobTitle: "Senior Product Designer",
  url: "https://www.shareefpadar.com",
  email: "mailto:shareefpadar@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  sameAs: [
    "https://www.linkedin.com/in/shareef-padar/",
    "https://www.behance.net/shareefpadar",
    "https://medium.com/@shareefpadar167",
  ],
  knowsAbout: [
    "Product Design",
    "UX Research",
    "Design Systems",
    "B2B SaaS",
    "React",
    "Tailwind CSS",
  ],
};

/* The time machine's years and label, from the era system's shared content.
   Read here on the server so only these few strings reach the client. */
const eras = { label: site.eras.label, items: site.eras.items.map(({ id, year, name }) => ({ id, year, name })) };

/* Arriving from another era: a one-shot scanline wipe (the class is set before
   paint, removed after the wipe). Same flag every era uses. */
const arriveScript = "try{if(sessionStorage.getItem('era-arrive')){sessionStorage.removeItem('era-arrive');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('era-arrive');setTimeout(function(){document.documentElement.classList.remove('era-arrive')},1600)}}catch(e){}";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /* The has-js script below adds a class to <html> before React hydrates,
         so server and client markup differ by design. This suppresses the
         mismatch for this element's attributes only — it does not extend to
         the tree beneath it. */
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${silkscreen.variable}`}
    >
      <head>
        {/* Gates the scroll-reveal hidden state on JS being available, and runs
            before paint so there is no flash of visible-then-hidden content.
            Without JS every .reveal stays visible and readable. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('has-js')",
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: arriveScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body id="top" className="flex min-h-screen flex-col bg-paper font-sans text-ink">
        {/* Skip link must be the first focusable element on every page (§11). */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-16 focus:top-16 focus:z-[100] focus:bg-blue focus:px-16 focus:py-12 focus:font-pix focus:text-[11px] focus:text-lime"
        >
          SKIP TO CONTENT
        </a>
        <div className="arrive" aria-hidden="true" />
        <Navbar />
        <EraRail label={eras.label} items={eras.items} />
        <EraSwitch label={eras.label} items={eras.items} shake={site.eras.shake} />
        {/* Site-wide, so the guide's cursor on the homepage has a peer that is
            drawn the same way. Self-suppresses on touch and reduced motion. */}
        <PixelCursor />
        {/* Clippy, site-wide. He followed you between Word documents; he
            follows you between routes. On pages with no data-guide-id anchors
            he still roams and still interrupts — only the contextual lines
            need a section to point at. */}
        <PixelGuide />
        {/* Offset clears the nav plate. Both values are on the 4px ramp. */}
        <main id="main" className="relative z-10 flex-grow pt-96 md:pt-128">
          {children}
        </main>
        <Footer />
        {/* Google Analytics (Manually Deferred) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-FH9B5ZDHV0" 
          strategy="lazyOnload" 
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FH9B5ZDHV0', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Analytics />
        <SpeedInsights />
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vxyc83cupo");
          `}
        </Script>
      </body>
    </html>
  );
}

