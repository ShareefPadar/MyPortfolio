"use client";

import { MDXProvider } from "@mdx-js/react";
import MDXComponents from "@/components/MDXComponents";

export default function MDXContentWrapper({
  Content,
}: {
  Content: React.ComponentType;
}) {
  return (
    <div className="max-w-none two-column-spread drop-cap pt-4">
      <MDXProvider components={MDXComponents}>
        <Content />
      </MDXProvider>
    </div>
  );
}
