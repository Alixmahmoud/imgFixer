# ImgFixer Deployment Guide

## Prerequisites

- Node.js 20+
- Git
- Vercel account (free tier)
- GitHub account

---

## A. Final Local Checks

Run these in the project root before pushing:

```bash
npm run generate:test-assets
npm run lint
npm run build
```

**Expected results:**
- `generate:test-assets` — 11 files created in `tests/fixtures/generated/`
- `lint` — 0 errors, 0 warnings
- `build` — 0 errors, 18 routes generated (listed at end of build output)

---

## B. Push to GitHub

```bash
# Initialize repository (if not already a git repo)
git init

# Stage all files
git add .

# Commit
git commit -m "Initial ImgFixer MVP"

# Create main branch
git branch -M main

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/imgfixer.git

# Push
git push -u origin main
```

> Make sure `tests/fixtures/generated/` is included in the push. These are small test assets (5 MB total). If you prefer to exclude them, add `tests/fixtures/generated/` to `.gitignore` and regenerate after clone.

---

## C. Deploy on Vercel

1. Open [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Import the `imgfixer` repository.
4. **Framework Preset**: Next.js (auto-detected).
5. **Install Command**: `npm install` (default).
6. **Build Command**: `npm run build` (default).
7. **Output Directory**: Leave default (`.next`).
8. **Environment Variables** — click **Add** and enter:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://your-vercel-project.vercel.app` (use the actual preview domain shown by Vercel) |

9. Click **Deploy**.

Wait for the deployment to complete (1–2 minutes).

---

## D. After First Deployment

1. Open the live URL provided by Vercel.
2. Copy the final Vercel domain (e.g. `https://imgfixer-abc123.vercel.app`).
3. Go to Vercel → Project Settings → Environment Variables.
4. Update `NEXT_PUBLIC_SITE_URL` to the correct domain.
5. **Redeploy** (Vercel may detect the change and rebuild automatically; if not, trigger a new deployment).
6. Open these routes to confirm they work:

   - `/` — Homepage
   - `/tools` — All tools listing
   - `/compress-image` / `/-to-100kb` / `/-to-200kb` / `/-to-500kb` / `/-to-1mb`
   - `/resize-image`
   - `/heic-to-jpg` / `/webp-to-jpg` / `/png-to-jpg`
   - `/jpg-to-pdf`
   - `/remove-exif`
   - `/privacy` / `/terms` / `/contact`
   - `/sitemap.xml` — confirm it lists all routes with the correct domain
   - `/robots.txt` — confirm it points to the correct sitemap URL

---

## E. Custom Domain (Optional)

1. In Vercel → Project → Settings → Domains, add your custom domain.
2. Follow Vercel's DNS instructions (add CNAME / A records at your DNS provider).
3. Wait for DNS propagation (a few minutes to 24 hours).
4. Once the custom domain works, update `NEXT_PUBLIC_SITE_URL` in Vercel env vars:

   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

5. **Redeploy**.
6. Reopen `/sitemap.xml` and `/robots.txt` to confirm the domain is correct.

---

## F. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add the production site as a new property.
3. Verify ownership via the recommended method (Vercel provides automatic TXT record verification for the domain property).
4. Once verified, go to **Sitemaps** in the left sidebar.
5. Submit:

   ```
   https://yourdomain.com/sitemap.xml
   ```

   (Or the temporary Vercel domain if you have not set up a custom domain yet.)

6. After adding a custom domain later, add a new property for it and submit its sitemap.

---

## G. Post-Deploy Live Smoke Tests

Run these on the live URL to confirm everything works in production:

### Route Load Test
- [ ] `/` loads without error
- [ ] `/tools` loads without error
- [ ] `/compress-image` loads
- [ ] `/compress-image-to-100kb` loads
- [ ] `/compress-image-to-200kb` loads
- [ ] `/compress-image-to-500kb` loads
- [ ] `/compress-image-to-1mb` loads
- [ ] `/resize-image` loads
- [ ] `/heic-to-jpg` loads
- [ ] `/webp-to-jpg` loads
- [ ] `/png-to-jpg` loads
- [ ] `/jpg-to-pdf` loads
- [ ] `/remove-exif` loads
- [ ] `/privacy` loads
- [ ] `/terms` loads
- [ ] `/contact` loads
- [ ] `/sitemap.xml` returns valid XML with correct domain
- [ ] `/robots.txt` returns correct rules with correct sitemap URL

### Functional Smoke Tests
- [ ] Compress one JPG → download → file opens
- [ ] Compress one image to 200KB → check under/over target
- [ ] Resize one image to 800×800 crop → download → verify dimensions
- [ ] Convert PNG to JPG → download → opens as JPG
- [ ] Convert WebP to JPG → download → opens as JPG
- [ ] Create PDF from 3 images (multi-page-1, -2, -3) → download → verify order
- [ ] Remove metadata from JPG → download → opens
- [ ] HEIC manual test (if .heic sample available)

---

## H. Placeholder Replacement Reminder

**Before public marketing or sharing the site widely, replace:**

| Location | Placeholder | Action |
|---|---|---|
| `app/contact/page.tsx` | `support@example.com` | Replace with your real contact email |
| `app/privacy/page.tsx` | `support@example.com` | Replace with your real contact email |
| `.env.example` | `https://your-domain.com` | Informational only; actual value goes in Vercel env vars |
| `NEXT_PUBLIC_SITE_URL` fallback | `http://localhost:3000` | Overridden by Vercel env var in production |

Search for remaining placeholders:

```bash
rg "example\.com" app/
rg "TODO:" app/ lib/ components/
```

---

## I. Vercel Plan Note

> If this project will be used commercially with ads or revenue, review Vercel's current plan and fair-use rules. The free tier (Hobby) may have limits on build minutes, serverless function execution, and bandwidth. Upgrade to Pro if needed.

---

## J. Post-Deploy Monitoring

- Check Vercel **Deployments** tab for build logs.
- Check Vercel **Analytics** (enable in project settings) for page views.
- Check Vercel **Logs** (Runtime Logs) for any 404s or errors.
- Set up Vercel **Status Pages** for uptime monitoring (optional).

---

## K. Environment Variables Summary

| Variable | Required | Example | Where to set |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://imgfixer.com` | Vercel → Project → Environment Variables |
