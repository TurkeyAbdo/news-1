# Rebuild: Strapi → built-in Next.js CMS

Decided 2026-06-15. Remove Strapi; build the CMS into the Next.js app (`web/`),
deploy as a single app on Vercel, data in Neon Postgres, media in Cloudinary.

## Stack
- **DB:** Neon Postgres (serverless, no sleep). Connection string in `DATABASE_URL`.
- **ORM:** Drizzle (`drizzle-orm` + `@neondatabase/serverless` + `drizzle-kit`).
- **Media:** Cloudinary (already configured — cloud `dyrrszucn`). Upload via signed
  server route from the admin.
- **Auth (admin):** username + password (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`),
  signed httpOnly cookie via `jose` (`AUTH_SECRET`). `/admin` guarded by middleware.
- **Rich text:** body stored as sanitized **HTML** (drop `@strapi/blocks-react-renderer`).

## Env vars (Vercel + local `web/.env.local`)
```
DATABASE_URL=postgres://...neon...
AUTH_SECRET=<random 32+ chars>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
NEXT_PUBLIC_SITE_URL=https://4seifnews.com
CLOUDINARY_CLOUD_NAME=dyrrszucn
CLOUDINARY_API_KEY=122985486242679
CLOUDINARY_API_SECRET=<secret>
```

## Phases
1. **DB foundation** ✅ — `src/db/schema.ts`, `src/db/index.ts`, `drizzle.config.ts`, deps.
2. **Migrate + seed** — `drizzle-kit push` to create tables on Neon; seed categories +
   sample Arabic content (port from old `cms/src/seed/data.ts`).
3. **Data layer swap** — replace `src/lib/strapi.ts` with `src/lib/content.ts` doing
   direct `db` queries (same function names/return shapes so pages don't change).
   Update `types.ts` body → `string` (HTML); update `RichText.tsx` to render HTML.
4. **Admin** — `/admin/login`, `/admin` dashboard, CRUD pages for articles, videos,
   categories, reports, investigations, happening-now. Server actions for writes.
   Cloudinary upload route. Middleware auth guard.
5. **Cutover** — set Vercel env vars, deploy, verify; then delete `cms/`, `render.yaml`,
   and Strapi-specific config. Point Hostinger DNS for `4seifnews.com` → Vercel.

## Next action for the user
Create a free Neon project (neon.tech) → copy the connection string → I'll wire it in
and run the migration/seed.
