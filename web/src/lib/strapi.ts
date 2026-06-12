import type {
  Article,
  CategorySlug,
  HappeningNowItem,
  Investigation,
  Report,
  RichBody,
  Video,
} from "./types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const REVALIDATE = 60; // ISR: re-fetch published content at most once per minute

/* ----------------------------- raw fetch ----------------------------- */

interface StrapiResponse<T> {
  data: T;
  meta?: { pagination?: { total: number; pageCount: number } };
}

async function strapiFetch<T>(path: string): Promise<StrapiResponse<T> | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error(`[strapi] ${path} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as StrapiResponse<T>;
  } catch (err) {
    console.error(`[strapi] fetch failed for ${path}:`, err);
    return null;
  }
}

/* ----------------------------- helpers ------------------------------- */

const placeholder = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

interface StrapiMedia {
  url?: string;
}

function mediaUrl(media: StrapiMedia | null | undefined, seed: string): string {
  if (media?.url) {
    return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
  }
  return placeholder(seed);
}

/** Absolute media URL, or undefined when no file is attached (no placeholder). */
function optMediaUrl(media: StrapiMedia | null | undefined): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

/** Pass Strapi blocks content through, guarding against non-array values. */
function asRichBody(blocks: unknown): RichBody {
  return (Array.isArray(blocks) ? blocks : []) as RichBody;
}

/* ----------------------------- raw shapes ---------------------------- */

interface RawArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown;
  featured?: boolean;
  publishedAt: string;
  coverImage?: StrapiMedia | null;
  category?: { slug: CategorySlug } | null;
}

interface RawDoc {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  body?: unknown;
  duration?: string;
  publishedAt: string;
  coverImage?: StrapiMedia | null;
  thumbnail?: StrapiMedia | null;
  videoUrl?: string;
  videoFile?: StrapiMedia | null;
}

interface RawHappening {
  id: number;
  text: string;
  publishedAt: string;
  link?: string;
}

/* ----------------------------- mappers ------------------------------- */

function mapArticle(r: RawArticle): Article {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: asRichBody(r.body),
    image: mediaUrl(r.coverImage, r.slug),
    category: (r.category?.slug ?? "politics") as CategorySlug,
    publishedAt: r.publishedAt,
    featured: r.featured,
  };
}

function mapReport(r: RawDoc): Report {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: asRichBody(r.body),
    image: mediaUrl(r.coverImage, r.slug),
    publishedAt: r.publishedAt,
  };
}

function mapInvestigation(r: RawDoc): Investigation {
  return mapReport(r) as Investigation;
}

function mapVideo(r: RawDoc): Video {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    thumbnail: mediaUrl(r.thumbnail, r.slug),
    duration: r.duration ?? "",
    publishedAt: r.publishedAt,
    videoUrl: r.videoUrl || undefined,
    videoFile: optMediaUrl(r.videoFile),
  };
}

function mapHappening(r: RawHappening): HappeningNowItem {
  const d = new Date(r.publishedAt);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
  return { id: r.id, text: r.text, time, link: r.link || undefined };
}

/* --------------------------- public API ------------------------------ */

const SORT_DESC = "sort=publishedAt:desc";

export async function getLatestArticles(n = 12): Promise<Article[]> {
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&filters[featured][$eq]=true&pagination[pageSize]=1`
  );
  if (res?.data?.length) return mapArticle(res.data[0]);
  // fallback to most recent
  const latest = await getLatestArticles(1);
  return latest[0] ?? null;
}

export async function getArticlesByCategory(
  slug: CategorySlug,
  n = 20
): Promise<Article[]> {
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&filters[category][slug][$eq]=${slug}&${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&filters[slug][$eq]=${slug}&pagination[pageSize]=1`
  );
  return res?.data?.length ? mapArticle(res.data[0]) : null;
}

export async function getMostRead(n = 6): Promise<Article[]> {
  // Sort by real view counts (incremented when an article is opened).
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&sort=views:desc&pagination[pageSize]=${n}`
  );
  const items = res?.data ?? [];
  // Fall back to latest if nobody has any views yet.
  if (items.length === 0) return getLatestArticles(n);
  return items.map(mapArticle);
}

export async function searchArticles(q: string): Promise<Article[]> {
  const term = q.trim();
  if (!term) return [];
  const enc = encodeURIComponent(term);
  const res = await strapiFetch<RawArticle[]>(
    `/articles?populate[0]=category&populate[1]=coverImage&filters[$or][0][title][$containsi]=${enc}&filters[$or][1][excerpt][$containsi]=${enc}&pagination[pageSize]=30`
  );
  return (res?.data ?? []).map(mapArticle);
}

export async function getReports(n = 12): Promise<Report[]> {
  const res = await strapiFetch<RawDoc[]>(
    `/reports?populate=coverImage&${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapReport);
}

export async function getReportBySlug(slug: string): Promise<Report | null> {
  const res = await strapiFetch<RawDoc[]>(
    `/reports?populate=coverImage&filters[slug][$eq]=${slug}&pagination[pageSize]=1`
  );
  return res?.data?.length ? mapReport(res.data[0]) : null;
}

export async function getInvestigations(n = 12): Promise<Investigation[]> {
  const res = await strapiFetch<RawDoc[]>(
    `/investigations?populate=coverImage&${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapInvestigation);
}

export async function getInvestigationBySlug(
  slug: string
): Promise<Investigation | null> {
  const res = await strapiFetch<RawDoc[]>(
    `/investigations?populate=coverImage&filters[slug][$eq]=${slug}&pagination[pageSize]=1`
  );
  return res?.data?.length ? mapInvestigation(res.data[0]) : null;
}

export async function getVideos(n = 12): Promise<Video[]> {
  const res = await strapiFetch<RawDoc[]>(
    `/videos?populate[0]=thumbnail&populate[1]=videoFile&${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapVideo);
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const res = await strapiFetch<RawDoc[]>(
    `/videos?populate[0]=thumbnail&populate[1]=videoFile&filters[slug][$eq]=${slug}&pagination[pageSize]=1`
  );
  return res?.data?.length ? mapVideo(res.data[0]) : null;
}

export async function getHappeningNow(n = 10): Promise<HappeningNowItem[]> {
  const res = await strapiFetch<RawHappening[]>(
    `/happening-now-items?${SORT_DESC}&pagination[pageSize]=${n}`
  );
  return (res?.data ?? []).map(mapHappening);
}
