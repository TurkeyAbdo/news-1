// Data layer — now backed directly by Neon Postgres (Drizzle) instead of Strapi.
// Export names and return shapes are unchanged so the pages keep working.
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles as articlesT,
  reports as reportsT,
  investigations as investigationsT,
  videos as videosT,
  happeningNow as happeningT,
} from "@/db/schema";
import type {
  Article,
  CategorySlug,
  HappeningNowItem,
  Investigation,
  Report,
  Video,
} from "./types";

/* ----------------------------- helpers ------------------------------- */

const placeholder = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const img = (value: string | null | undefined, seed: string) =>
  value && value.length > 0 ? value : placeholder(seed);

const iso = (d: Date | string) =>
  typeof d === "string" ? d : d.toISOString();

/* ----------------------------- mappers ------------------------------- */

type ArticleRow = typeof articlesT.$inferSelect;
type DocRow = typeof reportsT.$inferSelect;
type VideoRow = typeof videosT.$inferSelect;
type HappeningRow = typeof happeningT.$inferSelect;

function mapArticle(r: ArticleRow): Article {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: r.body ?? "",
    image: img(r.image, r.slug),
    category: r.category as CategorySlug,
    publishedAt: iso(r.publishedAt),
    featured: r.featured,
  };
}

function mapDoc(r: DocRow): Report {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: r.body ?? "",
    image: img(r.image, r.slug),
    publishedAt: iso(r.publishedAt),
  };
}

function mapVideo(r: VideoRow): Video {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    thumbnail: img(r.thumbnail, r.slug),
    duration: r.duration ?? "",
    publishedAt: iso(r.publishedAt),
    videoUrl: r.videoUrl || undefined,
    videoFile: r.videoFile || undefined,
  };
}

function mapHappening(r: HappeningRow): HappeningNowItem {
  const d = new Date(r.createdAt);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
  return { id: r.id, text: r.text, time, link: r.link || undefined };
}

/* --------------------------- public API ------------------------------ */

export async function getLatestArticles(n = 12): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articlesT)
    .orderBy(desc(articlesT.publishedAt))
    .limit(n);
  return rows.map(mapArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const rows = await db
    .select()
    .from(articlesT)
    .where(eq(articlesT.featured, true))
    .orderBy(desc(articlesT.publishedAt))
    .limit(1);
  if (rows.length) return mapArticle(rows[0]);
  const latest = await getLatestArticles(1);
  return latest[0] ?? null;
}

export async function getArticlesByCategory(
  slug: CategorySlug,
  n = 20
): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articlesT)
    .where(eq(articlesT.category, slug))
    .orderBy(desc(articlesT.publishedAt))
    .limit(n);
  return rows.map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await db
    .select()
    .from(articlesT)
    .where(eq(articlesT.slug, slug))
    .limit(1);
  return rows.length ? mapArticle(rows[0]) : null;
}

export async function getMostRead(n = 6): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articlesT)
    .orderBy(desc(articlesT.views), desc(articlesT.publishedAt))
    .limit(n);
  if (rows.length === 0) return getLatestArticles(n);
  return rows.map(mapArticle);
}

/** Increment an article's view count (called from the view-tracking route). */
export async function incrementArticleViews(slug: string): Promise<void> {
  await db
    .update(articlesT)
    .set({ views: sql`${articlesT.views} + 1` })
    .where(eq(articlesT.slug, slug));
}

export async function searchArticles(q: string): Promise<Article[]> {
  const term = q.trim();
  if (!term) return [];
  const like = `%${term}%`;
  const rows = await db
    .select()
    .from(articlesT)
    .where(or(ilike(articlesT.title, like), ilike(articlesT.excerpt, like)))
    .orderBy(desc(articlesT.publishedAt))
    .limit(30);
  return rows.map(mapArticle);
}

export async function getReports(n = 12): Promise<Report[]> {
  const rows = await db
    .select()
    .from(reportsT)
    .orderBy(desc(reportsT.publishedAt))
    .limit(n);
  return rows.map(mapDoc);
}

export async function getReportBySlug(slug: string): Promise<Report | null> {
  const rows = await db
    .select()
    .from(reportsT)
    .where(eq(reportsT.slug, slug))
    .limit(1);
  return rows.length ? mapDoc(rows[0]) : null;
}

export async function getInvestigations(n = 12): Promise<Investigation[]> {
  const rows = await db
    .select()
    .from(investigationsT)
    .orderBy(desc(investigationsT.publishedAt))
    .limit(n);
  return rows.map(mapDoc);
}

export async function getInvestigationBySlug(
  slug: string
): Promise<Investigation | null> {
  const rows = await db
    .select()
    .from(investigationsT)
    .where(eq(investigationsT.slug, slug))
    .limit(1);
  return rows.length ? mapDoc(rows[0]) : null;
}

export async function getVideos(n = 12): Promise<Video[]> {
  const rows = await db
    .select()
    .from(videosT)
    .orderBy(desc(videosT.publishedAt))
    .limit(n);
  return rows.map(mapVideo);
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const rows = await db
    .select()
    .from(videosT)
    .where(eq(videosT.slug, slug))
    .limit(1);
  return rows.length ? mapVideo(rows[0]) : null;
}

export async function getHappeningNow(n = 10): Promise<HappeningNowItem[]> {
  const rows = await db
    .select()
    .from(happeningT)
    .orderBy(desc(happeningT.createdAt))
    .limit(n);
  return rows.map(mapHappening);
}

// `and` is used by future filtered queries; referenced to satisfy lint.
void and;
