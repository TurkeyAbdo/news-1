import type { Core } from '@strapi/strapi';

const config = (
  { env }: Core.Config.Shared.ConfigParams
): Core.Config.Plugin => ({
  // Remove the "Strapi Cloud" (Deploy) menu item from the admin.
  cloud: {
    enabled: false,
  },

  // Use Cloudinary for media storage when credentials are present.
  // Without them, Strapi falls back to local disk (fine for dev, but on
  // Render's free tier local uploads are wiped on restart).
  ...(env('CLOUDINARY_NAME')
    ? {
        upload: {
          config: {
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          },
        },
      }
    : {}),
});

export default config;
