# Smart Ample Financial Services — website

Static, zero-dependency site. Pages are rendered from small JavaScript templates into plain HTML, so the header, footer and repeated content live in one place.

## Use

```
npm run build      # or: node build.mjs  (Node 18+; nothing to install)
```

```
npm start          # build, then preview at http://localhost:3000
```

Output goes to `dist/`. Preview it with `npm start` (pages use clean URLs such as `/about`, so opening the HTML files straight from disk will not navigate correctly).

## Deploy

The site to publish is the **`dist/` folder**, not the project root (the root has no `index.html`, and `public/` holds source assets only).

| Host | Settings |
| --- | --- |
| Vercel | None needed — `vercel.json` sets build command `npm run build`, output `dist`, clean URLs (`/about` instead of `/about.html`), asset caching and basic security headers. `.vercelignore` keeps the reference screenshots out of the upload. |
| Netlify (Git or CLI) | None needed — `netlify.toml` sets the same |
| Netlify drag-and-drop | Run `npm run build`, then drop the `dist` folder (not the project folder) |
| Cloudflare Pages / Render / others | Build command `npm run build`, output directory `dist`, framework preset "None" |
| cPanel / shared hosting / GitHub Pages | Run `npm run build`, upload the *contents* of `dist/` |

## Admin panel

`/admin` shows every consultation request sent through the contact form, the site's visitors and its traffic (page views, top pages, sources, countries, devices). It is a static page (`public/admin`) backed by three API routes in `api/`, which Vercel deploys as serverless functions and `npm start` runs locally.

**Local preview:** `npm start`, open http://localhost:3000/admin and sign in with `smartamplefs@gmail.com` / `admin123`. Data is kept in `.data/` (git-ignored); delete that folder to start empty. The preview password only works on your own machine.

**Going live on Vercel** needs two things, both under the project's Settings:

1. *Environment Variables* — `ADMIN_PASSWORD` (long and unique; sign-in is disabled without it) and, optionally, `ADMIN_USER` to sign in with a different email (default `smartamplefs@gmail.com`).
2. *Storage* — add the **Upstash Redis** integration. It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which is where enquiries and page views are stored. Redeploy afterwards.

Until the database is connected, the contact form falls back to opening the visitor's email app, as before, so no request is lost. Other hosts (Netlify, cPanel) serve the site but not `api/`, so the admin panel only works on Vercel.

**What is recorded:** one entry per page view — page, referring site, country/city (from Vercel), device, browser and a random visitor id kept in the browser's local storage. IP addresses are not stored, known bots are ignored, and page views are deleted after 400 days. Mention this in the privacy policy once it exists.

## SEO and performance

The build handles these automatically — nothing to maintain by hand:

- **Per page:** title, description, canonical URL, robots, Open Graph and Twitter tags, JSON-LD (AccountingService, WebSite, WebPage, BreadcrumbList, Article). Set per page in `src/pages/*.mjs`; shared tags are in `layout()` in `src/layout.mjs`.
- **Site files:** `robots.txt`, `sitemap.xml`, `site.webmanifest`, `404.html`, icons and `og.jpg` (share image).
- **Domain:** `site.url` in `src/data.mjs` (currently `https://www.taxsafs.com`) drives canonicals, the sitemap and structured data.
- **Google Search Console:** paste the verification code into `site.googleVerification` in `src/data.mjs`, deploy, then submit `/sitemap.xml` there.
- **Speed:** CSS is inlined, fonts are self-hosted (`public/assets/fonts`), images are responsive WebP (`name-WIDTH.webp`, listed in `src/images.mjs`, rendered with `photo()` in `src/components.mjs`), and assets live in a content-hashed folder so they cache for a year.
- **Adding an image:** save WebP variants as `public/assets/img/<name>-<width>.webp` and add `<name>` with its widths and height/width ratio to `src/images.mjs`.

## Structure

| Path | What it is |
| --- | --- |
| `src/data.mjs` | Company details, navigation, services, stats, principles, process, testimonials |
| `src/articles.mjs` | Insights articles (first one is the featured article) |
| `src/layout.mjs` | `<head>`, header, mobile menu, footer, WhatsApp button |
| `src/components.mjs` | Shared sections: page hero, stats, principles, timeline, CTA |
| `src/pages/*.mjs` | One file per page (insights also generates the article pages) |
| `public/assets/css/styles.css` | Design system — tokens at the top |
| `public/assets/js/main.js` | Interactions (no libraries), contact form, page-view tracking |
| `public/admin/` | Admin panel (page, styles, script) |
| `api/` | `lead` (contact form), `track` (page views), `admin` (sign-in and panel data); shared code in `api/_lib` |
| `public/assets/img/` | Photography |
| `refference-images/` | Screenshots of the previous site, used as the content source |

Edit `src/` or `public/`, then rebuild. Don't edit `dist/` — it is regenerated.

**Common edits**

- Phone, email, address, hours, social links: `site` in `src/data.mjs`
- Add or change a service: `services` in `src/data.mjs` (updates the home list, services page, footer and form)
- Add a testimonial: `testimonials` in `src/data.mjs` (navigation arrows appear once there are two or more)
- Add an article: prepend to `articles` in `src/articles.mjs`

## Before going live

- **Contact form and admin panel** — the form posts to `/api/lead` and the request appears in `/admin`. This needs the two Vercel settings under "Admin panel" above. If the request can't be saved, the form opens the visitor's email app with the request pre-filled, addressed to `site.formEmail` in `src/data.mjs` (smartamplefs@gmail.com).
- **Social links** — dummy links to each platform's home page in `src/data.mjs`.
- **Privacy / Terms** — footer links are placeholders (`#`) in `src/layout.mjs`; no policy pages exist yet.
- **Phone / WhatsApp** — one number, +971 54 599 5623 (`phone`, `phoneHref`, `whatsapp`, `whatsappDisplay` in `src/data.mjs`).
- **Logo** — the SMFS logo redrawn as SVG for the dark theme (ivory letters, the logo's gold accents): `logo()` in `src/layout.mjs`, `.logo` in `styles.css`, standalone copy `public/assets/img/logo-smfs.svg`, and the favicon. Source artwork: `refference-images/smfs-logo.png`. Palette tokens at the top of `styles.css` follow the logo (navy + gold).

## Photography

All images are from [Unsplash](https://unsplash.com/license) (free for commercial use; credit appreciated, not required). Files are stored as `<name>-<width>.webp`.

| File | Photographer |
| --- | --- |
| `hero` | Fabien Bellanger |
| `uae` | Ahmed Aldaie |
| `about` | Keyvahn Chotani |
| `towers` | Takahiro Sakamoto |
| `analytics` | Luke Chesser |
| `facade-night` | Ondrej Supitar |
| `glass-dusk` | Joakim Honkasalo |
| `late-office` | Vitaly Gariev |
| `airport` | Alex Alvarez |
| `boardroom` | Benjamin Child |
| `charts` | Nicholas Cappello |
| `port` | Timelab |
| `insight-corporate-tax` | David Rodrigo |
| `insight-vat` | Farrel Nobel |
| `insight-bookkeeping` | Carlos Muza |
