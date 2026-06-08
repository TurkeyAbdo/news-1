import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { searchArticles } from "@/lib/strapi";

export const metadata: Metadata = { title: "البحث" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "البحث" }]} />

      <form
        action="/search"
        className="flex items-center bg-surface rounded-full px-5 h-12 max-w-xl border border-line focus-within:border-brand transition mb-6"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="ابحث في الموقع…"
          className="bg-transparent flex-1 outline-none text-base"
        />
        <button type="submit" className="text-brand font-bold">
          بحث
        </button>
      </form>

      {q ? (
        <>
          <p className="text-muted mb-6">
            نتائج البحث عن: <span className="text-ink font-bold">«{q}»</span> —{" "}
            {results.length} نتيجة
          </p>
          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <p className="text-muted">لا توجد نتائج مطابقة. جرّب كلمات أخرى.</p>
          )}
        </>
      ) : (
        <p className="text-muted">اكتب كلمة للبحث في أخبار الموقع.</p>
      )}
    </div>
  );
}
