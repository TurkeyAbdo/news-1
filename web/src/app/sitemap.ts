import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import {
  getLatestArticles,
  getReports,
  getInvestigations,
  getVideos,
} from "@/lib/strapi";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, reports, investigations, videos] = await Promise.all([
    getLatestArticles(100),
    getReports(100),
    getInvestigations(100),
    getVideos(100),
  ]);

  const staticRoutes = [
    "",
    "/reports",
    "/investigations",
    "/videos",
    "/happening-now",
    "/services",
    "/search",
    "/privacy",
    "/terms",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${BASE}/${c.slug}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${BASE}/${a.category}/${a.slug}`,
    lastModified: new Date(a.publishedAt),
  }));

  const reportRoutes = reports.map((r) => ({
    url: `${BASE}/reports/${r.slug}`,
    lastModified: new Date(r.publishedAt),
  }));

  const investigationRoutes = investigations.map((i) => ({
    url: `${BASE}/investigations/${i.slug}`,
    lastModified: new Date(i.publishedAt),
  }));

  const videoRoutes = videos.map((v) => ({
    url: `${BASE}/videos/${v.slug}`,
    lastModified: new Date(v.publishedAt),
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...reportRoutes,
    ...investigationRoutes,
    ...videoRoutes,
  ];
}
