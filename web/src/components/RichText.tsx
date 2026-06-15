import DOMPurify from "isomorphic-dompurify";

/**
 * Renders sanitized HTML article bodies with Arabic editorial styling.
 * The HTML is produced by the admin rich-text editor and stored in the DB.
 */
export default function RichText({ content }: { content?: string }) {
  if (!content || content.trim().length === 0) return null;
  const clean = DOMPurify.sanitize(content);
  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
