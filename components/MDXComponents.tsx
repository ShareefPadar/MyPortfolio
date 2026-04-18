import React from "react";

const MDXComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 mt-16 mb-6 leading-snug" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg md:text-xl font-serif font-bold text-neutral-950 mt-10 mb-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6 font-sans" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-3 mb-8 pl-0 list-none" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="space-y-3 mb-8 pl-0 list-none counter-reset-item" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex gap-3 text-base md:text-lg text-neutral-600 leading-relaxed font-sans before:content-['—'] before:text-accent before:font-bold before:shrink-0" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-neutral-900" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-neutral-700" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="relative rounded-2xl p-6 md:p-8 my-10 overflow-hidden bg-neutral-50 border-l-4 border-accent"
      {...props}
    />
  ),
  hr: () => (
    <hr className="border-none border-t border-neutral-100 my-12" />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="w-full rounded-2xl shadow-lg my-10 border border-neutral-100"
      {...props}
    />
  ),
  // Callout shorthand: use > [!NOTE] style blocks
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-neutral-100 text-accent px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />
  ),
};

export default MDXComponents;
