import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { categoryName } from "@/lib/categories";
import { timeAgo } from "@/lib/format";

interface Props {
  article: Article;
  variant?: "default" | "horizontal" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const href = `/${article.category}/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-3 items-start py-3 border-b border-line last:border-0">
        <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
          <Image src={article.image} alt={article.title} fill className="object-cover" sizes="96px" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold leading-6 clamp-2 headline-link group-hover:text-brand transition">
            {article.title}
          </h3>
          <span className="text-xs text-muted mt-1 block">{timeAgo(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex gap-4 items-start">
        <div className="relative w-40 h-28 shrink-0 rounded-lg overflow-hidden">
          <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="160px" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-brand">{categoryName(article.category)}</span>
          <h3 className="text-base font-bold leading-7 clamp-2 headline-link group-hover:text-brand transition mt-1">
            {article.title}
          </h3>
          <p className="text-sm text-muted clamp-2 mt-1">{article.excerpt}</p>
          <span className="text-xs text-muted mt-1 block">{timeAgo(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
        <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
          {categoryName(article.category)}
        </span>
      </div>
      <h3 className="text-lg font-bold leading-7 clamp-2 headline-link group-hover:text-brand transition mt-3">
        {article.title}
      </h3>
      <p className="text-sm text-muted clamp-2 mt-1">{article.excerpt}</p>
      <span className="text-xs text-muted mt-2 block">{timeAgo(article.publishedAt)}</span>
    </Link>
  );
}
