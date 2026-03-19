import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Shareef Padar | 6 Years of B2B Product Design",
  description: "I am a Computer Science Engineer with 6 years of experience specializing in B2B SaaS, taking products from strategy to shipped code.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
