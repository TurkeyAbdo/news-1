/**
 * Custom article routes.
 * Public endpoint to register a view for an article (no auth required).
 */

export default {
  routes: [
    {
      method: "PUT",
      path: "/articles/by-slug/:slug/view",
      handler: "article.incrementView",
      config: {
        auth: false,
      },
    },
  ],
};
