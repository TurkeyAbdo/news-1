import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Languages available in the admin UI selector.
    // Arabic ('ar') ships with Strapi and switches the panel to RTL.
    locales: ['ar'],
  },
  bootstrap(app: StrapiApp) {
    void app;
    // Hide the Marketplace nav link (Strapi has no config flag for it).
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.setAttribute('data-hide-admin-links', 'true');
      style.appendChild(
        document.createTextNode(
          `a[href="/marketplace"],
           a[href^="/marketplace"] { display: none !important; }`
        )
      );
      document.head.appendChild(style);
    }
  },
};
