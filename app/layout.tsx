import type { Metadata } from "next";
import Script from 'next/script';
import dynamic from "next/dynamic";
import { Inter, Playfair_Display, Geist, Geist_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const FigmaCursors = dynamic(() => import("@/components/FigmaCursors"));
const Noise = dynamic(() => import("@/components/Noise"));
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

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
  title: 'Shareef Padar | Senior Product Designer — Dubai',
  description: 'Senior Product Designer with 6 years of B2B UX experience. Research, design systems, and production-ready code — based in Dubai.',
  icons: {
    icon: "/assets/logo.svg",
  },
  openGraph: {
    title: 'Shareef Padar | Senior Product Designer',
    description: '6 years of B2B product design. Research to shipped interfaces, end to end.',
    url: 'https://www.shareefpadar.com', 
    siteName: 'Shareef Padar Portfolio',
    images: [
      {
        url: '/og-image.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shareef Padar | Senior Product Designer',
    description: '6 years of B2B product design. Research to shipped interfaces, end to end.',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${geist.variable} ${geistMono.variable} ${silkscreen.variable}`}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <FigmaCursors />
        <Noise />
        <Navbar />
        <main className="flex-grow pt-28 md:pt-32 pb-12 relative z-10">
          <PageTransition>{children}</PageTransition>
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

