import type { MDXComponents } from "mdx/types";
import React from "react";

/**
 * MDX element mapping — the prose kit (spec §8).
 *
 * This file's existence is load-bearing. @next/mdx aliases its import source
 * to, in order: src/mdx-components → mdx-components → @mdx-js/react. With no
 * root file it resolved to @mdx-js/react, which is why the old MDXProvider
 * worked at all. useMDXComponents also works in RSC, where MDXProvider does
 * not, which is what lets the case-study page be a server component.
 *
 * NOTE: no .mdx file changes in this phase. Every prop API stays identical —
 * that is what guarantees the copy does not move.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    /* Headings are sentences, so they are Geist whatever the tag (§2.1).
       Space above a heading is 3–4x the space below it, which is what makes it
       attach to the content it introduces rather than float between two
       blocks (§6.2). */
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="mt-16 mb-4 font-sans text-[21px] font-medium leading-[1.3] tracking-[-0.016em] text-ink md:text-[26px]"
        {...props}
      />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="mt-12 mb-3 font-sans text-[17px] font-semibold leading-[1.4] text-ink md:text-[19px]"
        {...props}
      />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-4 max-w-prose font-sans text-[16px] leading-[1.7] text-ink" {...props} />
    ),
    /* Bullets are squares, never discs (§8). */
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="mb-8 max-w-prose list-none space-y-3 pl-0" {...props} />
    ),
    /* Ordered lists use leading zeros, matching the section markers (§8). */
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="prose-ol mb-8 max-w-prose list-none space-y-3 pl-0" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li
        className="relative pl-6 font-sans text-[16px] leading-[1.7] text-ink before:absolute before:left-1 before:top-[0.62em] before:h-2 before:w-2 before:bg-blue before:content-['']"
        {...props}
      />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-semibold text-ink" {...props} />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...props} />,
    /* Inline links are ink text with a blue rule underneath, never blue text
       (§8). Hover swaps the rule for a lime highlight. */
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className="prose-link" {...props} />
    ),
    /**
     * Blockquote carries two different things in this content, so it is
     * distinguished by shape rather than by a prop the MDX would have to
     * declare: a PULL quote is a single paragraph (my own line, unquoted,
     * lime rule); a SAID quote has a trailing attribution paragraph and keeps
     * its marks on a panel plate. The :last-child:not(:first-child) selector
     * is what tells them apart, and it is preserved from the previous
     * implementation so no .mdx file needs editing.
     */
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="my-10 max-w-prose border-l-[6px] border-lime pl-6
                   [&_p]:mb-3 [&_p]:font-sans [&_p]:text-[19px] [&_p]:font-medium
                   [&_p]:leading-[1.4] [&_p]:text-ink md:[&_p]:text-[23px]
                   [&_p:last-child]:mb-0
                   [&_p:last-child:not(:first-child)]:font-mono
                   [&_p:last-child:not(:first-child)]:text-[11px]
                   [&_p:last-child:not(:first-child)]:font-normal
                   [&_p:last-child:not(:first-child)]:tracking-[0.08em]
                   [&_p:last-child:not(:first-child)]:text-mute
                   md:[&_p:last-child:not(:first-child)]:text-[11px]"
        {...props}
      />
    ),
    hr: () => <hr className="my-16 border-none border-t border-line" />,
    /* Breaks to the wide grid column. One mechanism, shared with <Shot>. */
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img className="wide my-10 w-full max-w-none" {...props} />
    ),
    /* A UI string quoted from a product (§8). */
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="border border-line bg-panel px-[5px] py-[1px] font-mono text-[0.88em] text-ink"
        {...props}
      />
    ),
    ...components,
  };
}
