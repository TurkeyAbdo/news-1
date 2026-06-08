import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import MostReadList from "@/components/MostReadList";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { getArticlesByCategory, getMostRead } from "@/lib/strapi";
import type { CategorySlug } from "@/lib/types";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORY_MAP[category as CategorySlug];
  if (!cat) return { title: "غير موجود" };
  return { title: cat.name };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORY_MAP[category as CategorySlug];
  if (!cat) notFound();

  const [articles, mostRead] = await Promise.all([
    getArticlesByCategory(cat.slug),
    getMostRead(6),
  ]);
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: cat.name }]} />
      <h1 className="section-title text-2xl mb-6">{cat.name}</h1>

      {articles.length === 0 ? (
        <p className="text-muted">لا توجد أخبار في هذا القسم حالياً.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {featured && <ArticleCard article={featured} variant="horizontal" />}
            <div className="grid gap-6 sm:grid-cols-2">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
          <aside>
            <MostReadList articles={mostRead} />
          </aside>
        </div>
      )}
    </div>
  );
}
