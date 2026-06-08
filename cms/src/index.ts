import type { Core } from "@strapi/strapi";
import {
  ARTICLE_TITLES,
  CATEGORIES,
  EXCERPT,
  HAPPENING_NOW,
  INVESTIGATIONS,
  PARAGRAPHS,
  REPORTS,
  VIDEOS,
  toBlocks,
} from "./seed/data";

/**
 * Grant the public role read access (find + findOne) to our content types.
 */
async function setPublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) return;

  const contentTypes = [
    "category",
    "article",
    "report",
    "investigation",
    "video",
    "happening-now-item",
  ];
  const actions = ["find", "findOne"];

  for (const ct of contentTypes) {
    for (const action of actions) {
      const actionId = `api::${ct}.${ct}.${action}`;
      const existing = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({ where: { action: actionId, role: publicRole.id } });
      if (!existing) {
        await strapi.query("plugin::users-permissions.permission").create({
          data: { action: actionId, role: publicRole.id },
        });
      }
    }
  }
  strapi.log.info("[seed] Public read permissions ensured.");
}

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString();

/**
 * Seed Arabic sample content on first run (only if the DB has no articles).
 */
async function seedData(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::article.article").count({});
  if (existing > 0) {
    strapi.log.info("[seed] Articles already exist, skipping seed.");
    return;
  }

  strapi.log.info("[seed] Seeding sample content…");

  // Categories
  const categoryBySlug: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const doc = await strapi.documents("api::category.category").create({
      data: { name: c.name, slug: c.slug, description: c.description },
    });
    categoryBySlug[c.slug] = doc.documentId;
  }

  // Articles (2 per category)
  let i = 0;
  for (const [slug, titles] of Object.entries(ARTICLE_TITLES)) {
    for (let j = 0; j < titles.length; j++) {
      await strapi.documents("api::article.article").create({
        data: {
          title: titles[j],
          slug: `${slug}-${j + 1}`,
          excerpt: EXCERPT,
          body: toBlocks(PARAGRAPHS),
          category: categoryBySlug[slug],
          featured: slug === "politics" && j === 0,
        },
        status: "published",
      });
      i++;
    }
  }

  // Reports
  for (let r = 0; r < REPORTS.length; r++) {
    await strapi.documents("api::report.report").create({
      data: {
        title: REPORTS[r],
        slug: `report-${r + 1}`,
        excerpt: EXCERPT,
        body: toBlocks(PARAGRAPHS),
      },
      status: "published",
    });
  }

  // Investigations
  for (let v = 0; v < INVESTIGATIONS.length; v++) {
    await strapi.documents("api::investigation.investigation").create({
      data: {
        title: INVESTIGATIONS[v],
        slug: `investigation-${v + 1}`,
        excerpt: EXCERPT,
        body: toBlocks(PARAGRAPHS),
      },
      status: "published",
    });
  }

  // Videos
  for (let v = 0; v < VIDEOS.length; v++) {
    await strapi.documents("api::video.video").create({
      data: {
        title: VIDEOS[v].title,
        slug: `video-${v + 1}`,
        description: EXCERPT,
        duration: VIDEOS[v].duration,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      status: "published",
    });
  }

  // Happening now
  for (let h = 0; h < HAPPENING_NOW.length; h++) {
    await strapi.documents("api::happening-now-item.happening-now-item").create({
      data: { text: HAPPENING_NOW[h] },
      status: "published",
    });
  }

  strapi.log.info(`[seed] Done. Created ${i} articles and supporting content.`);
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicReadPermissions(strapi);
    await seedData(strapi);
  },
};
