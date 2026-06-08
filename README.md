# وكالة الأنباء — Arabic News Website

A full-stack, RTL Arabic news website inspired by the alhurra.com layout, built with
**Next.js** (frontend) and **Strapi** (headless CMS) backed by **PostgreSQL**.

## Structure

```
News_websites/
├── web/    # Next.js 16 frontend (App Router, TypeScript, Tailwind v4, RTL Arabic)
└── cms/    # Strapi 5 headless CMS (TypeScript, PostgreSQL)
```

## Tech stack
- **Next.js 16** — App Router, server components, ISR (incremental revalidation)
- **Tailwind CSS v4** — styling with RTL Arabic layout, Cairo web font
- **Strapi 5** — headless CMS with the built-in blocks rich-text editor
- **PostgreSQL** — database (`news_cms`)
- **Sharp** — image optimization (bundled with both Next.js and Strapi)

## Prerequisites
- Node.js (works on v24; Strapi officially targets 18–22)
- PostgreSQL running locally on port 5432 with a database named `news_cms`
  (default credentials used: user `postgres` / password `postgres` — see `cms/.env`)

## Running locally

### 1. Start the CMS (Strapi)
```bash
cd cms
npm run develop
```
- Admin panel: http://localhost:1337/admin
  (on first run, register the first administrator account in the browser)
- API base: http://localhost:1337/api
- On first boot the app **seeds sample Arabic content** and grants the public role
  read access automatically (see `cms/src/index.ts`).

### 2. Start the frontend (Next.js)
```bash
cd web
npm run dev
```
- Site: http://localhost:3000
- Reads `STRAPI_URL` from `web/.env.local` (defaults to http://localhost:1337).

## Content types (Strapi)
- **Article** — title, slug, excerpt, body (blocks), coverImage, category (relation), featured
- **Category** — name, slug, description (politics, economy, world, local, culture, sports, science)
- **Report** — title, slug, excerpt, body, coverImage
- **Investigation** — title, slug, excerpt, body, coverImage
- **Video** — title, slug, description, videoUrl, duration, thumbnail
- **Happening Now Item** — short breaking-news text (powers the ticker + live feed)

## Pages (frontend)
- `/` — home (hero, latest, most-read, reports, category blocks, videos)
- `/[category]` — category listing (e.g. `/politics`)
- `/[category]/[slug]` — article detail
- `/reports`, `/investigations`, `/videos` — content-type sections (+ detail pages)
- `/happening-now` — live breaking-news feed
- `/services`, `/search`, `/privacy`, `/terms`
- `sitemap.xml` + `robots.txt` generated from CMS content

## Notes
- Article/report/investigation bodies use Strapi's **blocks** editor; the frontend
  currently renders paragraph text. A richer block renderer (headings, lists, bold,
  inline images) can be added via `@strapi/blocks-react-renderer` later.
- When no `coverImage` is uploaded in the CMS, a deterministic placeholder image is
  shown so the layout stays intact. Upload images in the Strapi admin to replace them.
- "Most read" currently approximates with latest articles — swap for real analytics later.

## Production
- Set `DATABASE_*` env vars in `cms/.env` for your production Postgres.
- Set `STRAPI_URL` / `NEXT_PUBLIC_STRAPI_URL` / `NEXT_PUBLIC_SITE_URL` in `web/.env.local`
  (or your host's env) to the deployed URLs.
- Add the production Strapi media host to `web/next.config.ts` `images.remotePatterns`.
