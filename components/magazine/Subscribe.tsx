"use client";

import { FormEvent, useState } from "react";

export default function Subscribe() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative bg-deep-peach overflow-hidden">
      <div className="sunburst absolute inset-0 pointer-events-none opacity-30" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-5 md:px-7 py-12 md:py-16">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <p className="font-typewriter text-[10px] uppercase tracking-[0.15em] text-creme/80">
            New Issue Alerts
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-creme leading-tight">
            Subscribe to the <em className="italic">Portfolio Edition</em>
          </h2>
          <p className="font-sans text-sm font-light text-creme/80 leading-relaxed">
            Quarterly dispatches when a new feature ships — case studies, build notes, and the occasional pull quote worth framing.
          </p>

          {submitted ? (
            <p className="font-script text-2xl text-golden pt-2">You&apos;re on the list. Issue Nº07 awaits.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-creme/95 text-coffee font-sans text-sm px-4 py-3 border-0 outline-none placeholder:text-leather/60 focus:ring-2 focus:ring-golden"
              />
              <button
                type="submit"
                className="bg-coffee text-creme font-sans text-[10px] font-medium uppercase tracking-[0.18em] px-6 py-3 hover:bg-maroon transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
