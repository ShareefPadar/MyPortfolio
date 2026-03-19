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
  title: "Shareef Padar | CS Engineer & Product Designer",
  description: "Portfolio for Shareef Padar, showcasing B2B SaaS design, engineering, and product strategy.",
  icons: {
    icon: "/assets/logo.svg",
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

