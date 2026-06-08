import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { getHappeningNow, getLatestArticles } from "@/lib/strapi";

export const revalidate = 30;
export const metadata: Metadata = { title: "الآن مباشر" };

export default async function HappeningNowPage() {
  const [items, latest] = await Promise.all([
    getHappeningNow(20),
    getLatestArticles(8),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "الآن مباشر" }]} />
      <div className="flex items-center gap-3 mb-6">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand" />
        </span>
        <h1 className="section-title text-2xl mb-0">الآن مباشر</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <p className="text-muted">لا توجد تحديثات عاجلة حالياً.</p>
          ) : (
            <ol className="relative border-r-2 border-line pr-6 space-y-6">
              {items.map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-brand border-2 border-white" />
                  <div className="bg-surface rounded-lg p-4">
                    <span className="text-xs font-bold text-brand">{item.time}</span>
                    <p className="text-base font-semibold text-ink leading-7 mt-1">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside>
          <h2 className="section-title text-lg">آخر الأخبار</h2>
          <div className="space-y-1">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
