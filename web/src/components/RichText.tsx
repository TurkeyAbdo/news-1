"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";

/**
 * Renders Strapi "blocks" rich-text content with Arabic editorial styling.
 * Supports headings, lists, quotes, links, bold/italic, and inline images.
 */
export default function RichText({ content }: { content?: BlocksContent }) {
  if (!content || content.length === 0) return null;

  return (
    <div className="article-body">
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <p>{children}</p>,
          heading: ({ children, level }) => {
            const sizes: Record<number, string> = {
              1: "text-3xl",
              2: "text-2xl",
              3: "text-xl",
              4: "text-lg",
              5: "text-base",
              6: "text-base",
            };
            const cls = `font-bold text-ink mt-8 mb-3 ${sizes[level] ?? "text-xl"}`;
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            return <Tag className={cls}>{children}</Tag>;
          },
          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="list-decimal pr-6 my-4 space-y-2">{children}</ol>
            ) : (
              <ul className="list-disc pr-6 my-4 space-y-2">{children}</ul>
            ),
          "list-item": ({ children }) => <li className="leading-8">{children}</li>,
          quote: ({ children }) => (
            <blockquote className="border-r-4 border-brand bg-surface rounded-lg px-5 py-3 my-5 text-ink font-semibold">
              {children}
            </blockquote>
          ),
          link: ({ children, url }) => (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:text-brand-dark"
            >
              {children}
            </a>
          ),
          image: ({ image }) => {
            if (!image?.url) return null;
            return (
              <span className="block relative w-full aspect-[16/9] my-6 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alternativeText || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width:896px) 100vw, 896px"
                />
              </span>
            );
          },
        }}
        modifiers={{
          bold: ({ children }) => <strong className="font-bold">{children}</strong>,
          italic: ({ children }) => <em className="italic">{children}</em>,
          underline: ({ children }) => <u>{children}</u>,
          strikethrough: ({ children }) => <s>{children}</s>,
          code: ({ children }) => (
            <code className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
}
