import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ArticleCard from "@/components/ArticleCard";
import MostReadList from "@/components/MostReadList";
import VideoCard from "@/components/VideoCard";
import { CATEGORIES } from "@/lib/categories";
import {
  getFeaturedArticle,
  getLatestArticles,
  getArticlesByCategory,
  getMostRead,
  getVideos,
  getReports,
} from "@/lib/strapi";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  const homeCategories = CATEGORIES.slice(0, 4);
  const [lead, latestRaw, mostRead, videos, reports, ...catBlocks] =
    await Promise.all([
      getFeaturedArticle(),
      getLatestArticles(20),
      getMostRead(6),
      getVideos(4),
      getReports(3),
      ...homeCategories.map((c) => getArticlesByCategory(c.slug, 4)),
    ]);

  const latest = latestRaw.filter((a) => a.id !== lead?.id);
  const side = latest.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-12">
      {/* Hero */}
      {lead && <Hero lead={lead} side={side} />}

      {/* Latest + Most read */}
      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="آخر الأخبار" />
          <div className="grid gap-6 sm:grid-cols-2">
            {latest.slice(4, 10).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <MostReadList articles={mostRead} />
        </aside>
      </section>

      {/* Reports strip */}
      {reports.length > 0 && (
        <section>
          <SectionHeader title="تقارير وتحليلات" href="/reports" />
          <div className="grid gap-6 md:grid-cols-3">
            {reports.map((r) => (
              <Link key={r.id} href={`/reports/${r.slug}`} className="group block">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <span className="absolute top-2 right-2 bg-ink text-white text-xs font-bold px-2 py-1 rounded">
                    تقرير
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-7 clamp-2 group-hover:text-brand transition mt-3">
                  {r.title}
                </h3>
                <p className="text-sm text-muted clamp-2 mt-1">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category blocks */}
      {homeCategories.map((cat, idx) => {
        const items = catBlocks[idx] ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat.slug}>
            <SectionHeader title={cat.name} href={`/${cat.slug}`} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="bg-ink rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <span className="text-brand">▶</span> فيديو
            </h2>
            <Link
              href="/videos"
              className="text-sm text-gray-300 hover:text-white font-semibold"
            >
              المزيد ‹
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
