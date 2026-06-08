# Deployment Guide

The app has two parts that deploy separately:

- **Frontend** (`web/`) → **Vercel** (already deployed)
- **Backend** (`cms/`) → **Render** (Strapi + managed PostgreSQL via `render.yaml`)

## Current status
- ✅ Frontend live on Vercel: https://web-xi-ivory-d0en8lavje.vercel.app
  (renders the design; shows no articles until the backend below is connected)
- ⏳ Backend: ready to deploy on Render via `render.yaml`

---

## Step 1 — Deploy the backend on Render
1. Go to https://dashboard.render.com → **New +** → **Blueprint**.
2. Connect the **TurkeyAbdo/news-1** GitHub repo. Render detects `render.yaml`.
3. Click **Apply**. Render provisions:
   - a free PostgreSQL database (`news-cms-db`)
   - the Strapi web service (`news-cms`) — builds and starts automatically
   - all secrets (APP_KEYS, JWT secrets, etc.) auto-generated
4. Wait for the first deploy to finish (~5–10 min). On first boot Strapi seeds
   the Arabic sample content and sets public read permissions automatically.
5. Copy the service URL, e.g. `https://news-cms.onrender.com`.
6. In the `news-cms` service → **Environment**, set **`PUBLIC_URL`** to that URL,
   then **Manual Deploy → Deploy latest commit** so the admin URL is correct.
7. Create your admin account at `https://news-cms.onrender.com/admin`.

> Note: Render's free tier sleeps the service after inactivity; the first request
> after idle takes ~30s to wake. Upgrade the plan to keep it always-on.

## Step 2 — Point the frontend at the backend
On Vercel (project **web**) → **Settings → Environment Variables**, add for
**Production**:

| Name | Value |
|---|---|
| `STRAPI_URL` | `https://news-cms.onrender.com` |
| `NEXT_PUBLIC_STRAPI_URL` | `https://news-cms.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://web-xi-ivory-d0en8lavje.vercel.app` (already set) |

Then redeploy: `cd web && vercel --prod` (or "Redeploy" in the Vercel dashboard).
The live site will now show real articles, and the view-count "most read" and
breaking-news ticker will work against the hosted CMS.

## Step 3 — (recommended) Lock down CORS
Once the Vercel domain is known, restrict Strapi CORS to it. In
`cms/config/middlewares.ts`, replace `'strapi::cors'` with:

```ts
{
  name: 'strapi::cors',
  config: {
    origin: ['https://web-xi-ivory-d0en8lavje.vercel.app'],
  },
},
```

Commit + push; Render auto-redeploys.

---

## Custom domain (optional)
- Add your domain in Vercel (project → Domains) for the frontend.
- Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy.
- Optionally put the CMS on a subdomain (e.g. `cms.yourdomain.com`) in Render,
  update `PUBLIC_URL` + the two `*STRAPI_URL` vars accordingly.
