import Link from "next/link";
import type { Article } from "@/lib/types";

export default function MostReadList({ articles }: { articles: Article[] }) {
  return (
    <div className="bg-surface rounded-lg p-4">
      <h2 className="section-title">الأكثر قراءة</h2>
      <ol className="space-y-1">
        {articles.map((a, i) => (
          <li key={a.id}>
            <Link
              href={`/${a.category}/${a.slug}`}
              className="group flex gap-3 items-start py-3 border-b border-line last:border-0"
            >
              <span className="text-2xl font-black text-brand/80 leading-none w-7 shrink-0">
                {i + 1}
              </span>
              <h3 className="text-sm font-semibold leading-6 clamp-3 group-hover:text-brand transition">
                {a.title}
              </h3>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
