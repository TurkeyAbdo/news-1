import Link from "next/link";

export default function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-line pb-2">
      <h2 className="section-title mb-0">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-brand font-semibold hover:underline"
        >
          المزيد ‹
        </Link>
      )}
    </div>
  );
}
