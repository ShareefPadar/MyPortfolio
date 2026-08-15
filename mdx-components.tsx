import type { MDXComponents } from "mdx/types";
import React from "react";

/**
 * MDX element mapping.
 *
 * This file's existence is load-bearing. @next/mdx aliases its import source
 * to, in order: src/mdx-components → mdx-components → @mdx-js/react. With no
 * root file it resolved to @mdx-js/react, which is why the old
 * <MDXProvider components={...}> in the case-study page worked at all.
 *
 * Creating this file switches that resolution, so MDXProvider silently stops
 * applying — hence it was removed in the same commit. The upside is that
 * useMDXComponents works in React Server Components while MDXProvider does
 * not, which is what lets the case-study page drop "use client".
 *
 * Styling here is carried over verbatim from components/MDXComponents.tsx.
 * Phase 8 restyles it against the prose kit (spec §8); this phase is a pure
 * refactor and must render identically.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 mt-16 mb-6 leading-snug"
        {...props}
      />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="text-lg md:text-xl font-serif font-bold text-neutral-950 mt-10 mb-4"
        {...props}
      />
    ),
    // Body prose sits at neutral-700, not 600: grey is reserved for captions and
    // metadata so the page has an actual foreground and background.
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className="text-base md:text-lg text-neutral-700 leading-relaxed mb-6 font-sans"
        {...props}
      />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="space-y-3 mb-8 pl-0 list-none" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="space-y-3 mb-8 pl-0 list-none" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li
        className="relative pl-6 text-base md:text-lg text-neutral-700 leading-relaxed font-sans before:content-['—'] before:absolute before:left-0 before:text-accent before:font-bold"
        {...props}
      />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-bold text-neutral-900" {...props} />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => (
      <em className="italic text-neutral-700" {...props} />
    ),
    // No box. A quote should be a change of voice, not another container: large
    // serif against a hairline rule, breaking slightly left of the text column.
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="my-12 border-l-2 border-accent pl-6 md:pl-8 lg:-ml-8
                   [&_p]:font-serif [&_p]:text-neutral-900 [&_p]:leading-snug
                   [&_p]:text-xl md:[&_p]:text-[1.75rem] [&_p]:mb-3
                   [&_p:last-child]:mb-0
                   [&_a]:font-sans [&_a]:text-sm [&_a]:text-neutral-500 [&_a]:no-underline
                   [&_p:last-child:not(:first-child)]:font-sans
                   [&_p:last-child:not(:first-child)]:text-sm
                   md:[&_p:last-child:not(:first-child)]:text-sm
                   [&_p:last-child:not(:first-child)]:text-neutral-500"
        {...props}
      />
    ),
    hr: () => <hr className="border-none border-t border-neutral-200/70 my-16" />,
    // Markdown images break wider than the reading column, same as <Shot>.
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        className="wide my-10 w-full max-w-none"
        {...props}
      />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="bg-neutral-100 text-accent px-1.5 py-0.5 rounded-md text-sm font-mono"
        {...props}
      />
    ),
    ...components,
  };
}
