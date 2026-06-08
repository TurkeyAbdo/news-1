import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { categoryName } from "@/lib/categories";
import ArticleCard from "./ArticleCard";

export default function Hero({
  lead,
  side,
}: {
  lead: Article;
  side: Article[];
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* Lead story */}
      <Link
        href={`/${lead.category}/${lead.slug}`}
        className="group relative lg:col-span-2 rounded-xl overflow-hidden min-h-[320px] lg:min-h-[460px]"
      >
        <Image
          src={lead.image}
          alt={lead.title}
          fill
          priority
          className="object-cover group-hover:scale-105 transition duration-500"
          sizes="(max-width:1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-6">
          <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded">
            {categoryName(lead.category)}
          </span>
          <h1 className="text-white text-2xl lg:text-4xl font-black leading-snug mt-3 clamp-3">
            {lead.title}
          </h1>
          <p className="text-gray-200 text-sm lg:text-base mt-2 clamp-2 max-w-2xl">
            {lead.excerpt}
          </p>
        </div>
      </Link>

      {/* Side stories */}
      <div className="flex flex-col gap-4">
        {side.map((a) => (
          <ArticleCard key={a.id} article={a} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
