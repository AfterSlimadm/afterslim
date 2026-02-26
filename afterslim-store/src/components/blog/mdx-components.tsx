import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Custom component map used by MDXRemote to style rendered MDX content.
 * All styling uses Tailwind CSS classes aligned with the AfterSlim design system.
 */
export function getMDXComponents(): MDXComponents {
  return {
    // ---- Headings ----
    h1: ({ children, id, ...props }) => (
      <h1
        id={id}
        className="mt-10 mb-4 scroll-mt-20 text-3xl font-bold tracking-tight sm:text-4xl"
        {...props}
      >
        {id ? (
          <a href={`#${id}`} className="no-underline hover:underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h1>
    ),
    h2: ({ children, id, ...props }) => (
      <h2
        id={id}
        className="mt-8 mb-3 scroll-mt-20 text-2xl font-semibold tracking-tight"
        {...props}
      >
        {id ? (
          <a href={`#${id}`} className="no-underline hover:underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h2>
    ),
    h3: ({ children, id, ...props }) => (
      <h3
        id={id}
        className="mt-6 mb-2 scroll-mt-20 text-xl font-semibold tracking-tight"
        {...props}
      >
        {id ? (
          <a href={`#${id}`} className="no-underline hover:underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h3>
    ),

    // ---- Body text ----
    p: ({ children, ...props }) => (
      <p
        className="mb-4 leading-7 text-muted-foreground [&:not(:first-child)]:mt-2"
        {...props}
      >
        {children}
      </p>
    ),

    // ---- Links ----
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? "#"}
          className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
        </Link>
      );
    },

    // ---- Lists ----
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),

    // ---- Blockquote ----
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 border-l-4 border-primary bg-muted/50 py-3 pl-4 pr-4 italic text-muted-foreground [&>p]:mb-0"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // ---- Code ----
    code: ({ children, className, ...props }) => {
      // Inline code (not inside a <pre>)
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <code className={cn("text-sm", className)} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre
        className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    ),

    // ---- Images ----
    img: ({ src, alt, width, height, ...props }) => (
      <span className="my-6 block overflow-hidden rounded-lg">
        <Image
          src={src ?? ""}
          alt={alt ?? ""}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="w-full rounded-lg object-cover"
          {...(props as Record<string, unknown>)}
        />
      </span>
    ),

    // ---- Table ----
    table: ({ children, ...props }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="border-b bg-muted/50" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="border-b transition-colors hover:bg-muted/50" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left font-semibold text-foreground"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-muted-foreground" {...props}>
        {children}
      </td>
    ),

    // ---- Horizontal rule ----
    hr: (props) => <hr className="my-8 border-border" {...props} />,

    // ---- Strong / Em ----
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),
  };
}
