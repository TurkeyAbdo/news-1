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

---

## Alternative: host the CMS on Hostinger (Business plan, Managed Node.js)

Avoids Render's free-tier sleep/cold-start — the app stays on 24/7. The CMS
now supports MySQL (Hostinger's included DB type) via `DATABASE_CLIENT=mysql`.
The frontend stays on Vercel.

1. **Create the MySQL database**
   - hPanel → **Databases → MySQL Databases** → create a database + user
     (e.g. `news_cms` / `strapi`). Note the host (usually `localhost`),
     port (`3306`), database name, username, password.

2. **Create the Node.js app**
   - hPanel → **Websites → Add Website → Node.js Apps** → **Import Git Repository**.
   - Authorize GitHub, select the `TurkeyAbdo/news-1` repo, branch `main`.
   - Set **Application root** to `cms`.
   - Set **Node version** to 22.x (or 20.x — must be in the `>=20 <=24` range).
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm run start`

3. **Set environment variables** (hPanel app → Environment Variables) — same
   values as `cms/.env.example` plus secrets:
   ```
   HOST=0.0.0.0
   PORT=1337
   NODE_ENV=production
   STRAPI_TELEMETRY_DISABLED=true
   DATABASE_CLIENT=mysql
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_NAME=<your db name>
   DATABASE_USERNAME=<your db user>
   DATABASE_PASSWORD=<your db password>
   DATABASE_SSL=false
   APP_KEYS=<generate 4 random base64 strings, comma-separated>
   API_TOKEN_SALT=<random>
   ADMIN_JWT_SECRET=<random>
   TRANSFER_TOKEN_SALT=<random>
   JWT_SECRET=<random>
   ENCRYPTION_KEY=<random>
   PUBLIC_URL=https://cms.yourdomain.com
   IS_PROXIED=true
   CLOUDINARY_NAME=dyrrszucn
   CLOUDINARY_KEY=<your key>
   CLOUDINARY_SECRET=<your secret>
   ```
   Generate random secrets locally with:
   `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"`

4. **Connect a domain/subdomain**
   - hPanel → the Node.js app → **Domain** → point a subdomain
     (e.g. `cms.yourdomain.com`) at this app. SSL is issued automatically.

5. **Deploy**
   - Click **Deploy** (or push to `main` — auto-redeploy on push is supported).
   - First boot seeds Arabic sample content + sets public read permissions
     (same bootstrap logic as Render). Create your admin account at
     `https://cms.yourdomain.com/admin`.

6. **Point the frontend at the new CMS**
   - On Vercel (project **web**) → **Settings → Environment Variables**, update:
     - `STRAPI_URL=https://cms.yourdomain.com`
     - `NEXT_PUBLIC_STRAPI_URL=https://cms.yourdomain.com`
   - Add `cms.yourdomain.com` to `web/next.config.ts` → `images.remotePatterns`
     if it serves any non-Cloudinary media (Cloudinary URLs already work).
   - Redeploy the frontend.

7. **Decommission Render** (optional) — once Hostinger is confirmed working,
   delete the `news-cms` service and `news-cms-db` database on Render to stop
   any billing/usage, and remove/retire `render.yaml` if no longer needed.

> Note: this is a **fresh database** — any articles/content created on the
> Render Postgres instance won't carry over automatically. If you have real
> content there, export it first (Strapi has no built-in DB-to-DB migration;
> easiest is to re-create content manually, or use `strapi export`/`strapi import`
> — both DBs must be reachable at the same time for that).
