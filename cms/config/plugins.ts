import type { Core } from '@strapi/strapi';

const config = (
  { env }: Core.Config.Shared.ConfigParams
): Core.Config.Plugin => ({
  // Remove the "Strapi Cloud" (Deploy) menu item from the admin.
  cloud: {
    enabled: false,
  },
});

export default config;
