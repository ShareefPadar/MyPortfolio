import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 text-center">
      <div className="space-y-6 max-w-lg">
        <span className="text-accent text-xs font-bold uppercase tracking-widest block font-sans">
          404 ERROR
        </span>
        <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight text-neutral-950">
          Oops! You&apos;ve drifted off the grid.
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 font-sans leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to familiar territory.
        </p>
        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex justify-center items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-accent transition-colors shadow-lg group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
