# Arabic News Website — Next.js + Strapi

## Context
The user wants to build an Arabic-language news website modeled conceptually on a wire-service/news-agency site (suna-sd.net): a clean, official, text-forward layout organized into standard news categories (politics, economy, culture, sports, science, etc.). The project directory is currently empty. The user will code it themselves, wants Strapi as a headless CMS for content management, and Next.js as the frontend framework. They're an experienced developer, so the plan can move quickly without excessive hand-holding.

Since this is a greenfield project with nothing to reuse yet, this plan defines the initial architecture and scaffolding so the user has a solid foundation to build on.

## Architecture
Two-part monorepo-style layout in `News_websites/`:
- `cms/` — Strapi headless CMS (content modeling, admin panel, REST/GraphQL API)
- `web/` — Next.js frontend (App Router, server components, RTL Arabic UI)

These run as separate processes (Strapi on its own port, Next.js consuming its API) — standard decoupled headless setup.

## Confirmed Tech Stack
- **Next.js** (TypeScript, App Router) — frontend
- **Tailwind CSS** — styling, with RTL support for Arabic
- **Strapi** (TypeScript) — headless CMS, using its built-in ORM and rich-text editor (no separate Editor.js needed)
- **PostgreSQL** — production database for Strapi
- **Sharp** — comes bundled with Strapi and Next.js for image processing/optimization; no separate setup needed

Explicitly NOT using: Prisma (redundant with Strapi's own data layer), Editor.js (redundant with Strapi's built-in content editor), Socket.io (no real-time requirement identified — Next.js ISR/revalidation covers content freshness needs).

## Step 1: Scaffold Strapi CMS (`cms/`)
- Initialize a new Strapi project (TypeScript) in `cms/`
- Define content types:
  - **Article**: title, slug, body (rich text), excerpt, cover image, publish date, category (relation)
  - **Category**: name, slug, description (politics, economy, world, local, culture, sports, science)
  - **Report**: title, slug, body, cover image, publish date — powers `/reports`
  - **Investigation**: title, slug, body, cover image, publish date — powers `/investigations` (حوارات وتحقيقات)
  - **Video**: title, slug, description, video URL/embed, thumbnail, publish date — powers `/videos`
  - **HappeningNowItem**: short text, timestamp — powers the live "Happening Now" feed
- Configure locale to Arabic (Strapi i18n plugin) so content is authored in Arabic
- Set up roles/permissions so the public API can read published articles/categories
- Document how to run it (`npm run develop`) and where the admin panel lives

## Step 2: Scaffold Next.js frontend (`web/`)
- Create Next.js app (TypeScript, App Router, Tailwind CSS) in `web/`
- Configure for Arabic/RTL: `<html lang="ar" dir="rtl">`, RTL-aware Tailwind setup (logical properties / `tailwindcss-rtl` or native `rtl:`/`ltr:` variants), Arabic web font (e.g., Cairo, Tajawal, or IBM Plex Sans Arabic via `next/font`)
- Set up a typed API client (`lib/strapi.ts`) for fetching from the Strapi REST API (or GraphQL if preferred), using `fetch` with Next.js caching/revalidation (ISR) for SSG/SSR of news content

## Sitemap (reference: suna-sd.net structure + alhurra.com layout/sections)
```
/ (Home)
├── Hero/featured story banner
├── "Happening Now" live feed strip
├── Category grids (latest by topic)
├── "Most Read" section
└── Video highlights strip

├── /[category]                     /politics, /economy, /world, /local, /culture, /sports, /science
│   └── /[category]/[slug]          Article detail page

├── /reports                        تقارير — Reports & Analysis (explainers folded in)
│   └── /reports/[slug]
├── /investigations                 حوارات وتحقيقات — Interviews & Investigations
│   └── /investigations/[slug]
├── /videos                         فيديو — Video page
│   └── /videos/[slug]

├── /happening-now                  Live/breaking short-form news feed
├── /services                       Services/offerings page

├── /search?q=...                   Search results

└── /privacy, /terms                Legal/footer pages
```
**Header nav:** Logo | Politics | Economy | World | Local | Culture | Sports | Science | Reports | Investigations | Videos | Happening Now | Search
**Footer:** Services | Privacy/Terms | Social icons

Layout reference: alhurra.com homepage style — hero banner, topic + content-type sections (reports/investigations/videos), "Most Read" block, video highlights strip.

## Step 3: Build core pages and components
- **Home page** (`app/page.tsx`): hero/featured story, "Happening Now" strip, category grids, "Most Read" block, video highlights — Al-Hurra-inspired layout, RTL Arabic
- **Category page** (`app/[category]/page.tsx`): paginated list of articles in a topic category (politics, economy, world, local, culture, sports, science)
- **Article page** (`app/[category]/[slug]/page.tsx`): full article with title, cover image, body, related articles
- **Content-type sections**: `/reports`, `/investigations`, `/videos` — each with a listing page and `[slug]` detail page (mirrors Strapi content types: Report, Investigation, Video)
- **Happening Now** (`app/happening-now/page.tsx`): live/breaking short-form feed
- **Static pages**: `/services`, `/privacy`, `/terms`
- **Search**: simple search page querying Strapi's filter API
- Shared components: `Header` (full nav with category + content-type links, RTL-aware), `Footer`, `ArticleCard`, `CategoryNav`, `Breadcrumbs`, `MostReadList`, `VideoCard`
- SEO: metadata via Next.js `generateMetadata`, Open Graph tags, sitemap.xml, robots.txt — important for a news site

## Step 4: Wire frontend to CMS
- Implement data-fetching functions for: latest articles, articles by category, single article by slug, categories list
- Use Next.js ISR (`revalidate`) so new articles published in Strapi appear on the site without a full rebuild
- Handle Strapi's media URLs (image optimization via `next/image` with Strapi's upload provider)

## Step 5: Verification
- Run `cd cms && npm run develop` — confirm Strapi admin loads, create a test category + article in Arabic, verify public API returns it (`/api/articles?populate=*`)
- Run `cd web && npm run dev` — confirm home page renders the test article in RTL Arabic layout, category page filters correctly, article page renders rich text body, and SEO metadata appears in page source
- Check responsive layout (mobile/desktop) and RTL correctness (nav, text alignment, image placement)

## Notes / Open items for later (not in this initial scaffold)
- Deployment targets (Strapi hosting + Next.js hosting) — to be decided when ready to ship
- Authentication/comments — can be added as later phases
- Search could later move to a dedicated engine (Meilisearch/Algolia) if the site grows
- Author/tag pages, newsletter, and about/contact pages were explicitly dropped from scope — can be revisited later if needed
