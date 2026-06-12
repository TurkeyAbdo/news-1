import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import RichText from "@/components/RichText";
import ViewTracker from "@/components/ViewTracker";
import { categoryName, CATEGORY_MAP } from "@/lib/categories";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";
import type { CategorySlug } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "غير موجود" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !CATEGORY_MAP[category as CategorySlug]) notFound();

  const related = (await getArticlesByCategory(article.category, 4))
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <ViewTracker slug={article.slug} />
      <Breadcrumbs
        items={[
          { label: categoryName(article.category), href: `/${article.category}` },
          { label: article.title },
        ]}
      />

      <article>
        <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded">
          {categoryName(article.category)}
        </span>
        <h1 className="text-2xl md:text-4xl font-black leading-snug mt-4 text-ink">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted mt-3 pb-4 border-b border-line">
          <span>{formatArabicDate(article.publishedAt)}</span>
          <span>·</span>
          <span>وكالة الأنباء</span>
        </div>

        <div className="relative aspect-[16/9] rounded-xl overflow-hidden my-6">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width:896px) 100vw, 896px"
          />
        </div>

        {article.excerpt && (
          <p className="text-lg font-semibold text-ink leading-8 mb-6">
            {article.excerpt}
          </p>
        )}

        <RichText content={article.body} />

        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-line">
          <span className="text-sm font-semibold text-muted">شارك:</span>
          {["فيسبوك", "واتساب"].map((s) => (
            <span
              key={s}
              className="text-xs border border-line rounded-full px-3 py-1 hover:bg-surface cursor-pointer"
            >
              {s}
            </span>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title text-xl">أخبار ذات صلة</h2>
          <div className="grid gap-6 sm:grid-cols-3 mt-4">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
