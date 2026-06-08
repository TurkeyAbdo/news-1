/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    /**
     * Increment the view counter for an article identified by slug.
     * Public (auth disabled in the custom route). Updates every row sharing
     * the slug so the published entry reflects the new count.
     */
    async incrementView(ctx) {
      const { slug } = ctx.params;
      const rows = await strapi.db.query("api::article.article").findMany({
        where: { slug },
        select: ["id", "views"],
      });

      if (!rows.length) {
        return ctx.notFound("Article not found");
      }

      const current = Math.max(...rows.map((r) => r.views ?? 0));
      const next = current + 1;

      await strapi.db.query("api::article.article").updateMany({
        where: { slug },
        data: { views: next },
      });

      ctx.body = { data: { slug, views: next } };
    },
  })
);
