import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shareefpadar.com'),
  title: 'Shareef Padar | Design Engineer | UX Strategy & Code',
  description: 'Specializing in B2B SaaS, mobile-first systems, and AI-assisted development.',
  icons: {
    icon: "/assets/logo.svg",
  },
  openGraph: {
    title: 'Shareef Padar | Design Engineer',
    description: 'Bridging the gap between UX strategy and production-ready code.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen font-sans">
        <CustomCursor />
        <Navbar />
        <main className="flex-grow pt-8 md:pt-12 pb-12 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

