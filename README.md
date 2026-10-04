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
| `public/assets/js/main.js` | Interactions (no libraries) |
| `public/assets/img/` | Photography |
| `refference-images/` | Screenshots of the previous site, used as the content source |

Edit `src/` or `public/`, then rebuild. Don't edit `dist/` — it is regenerated.

**Common edits**

- Phone, email, address, hours, social links: `site` in `src/data.mjs`
- Add or change a service: `services` in `src/data.mjs` (updates the home list, services page, footer and form)
- Add a testimonial: `testimonials` in `src/data.mjs` (navigation arrows appear once there are two or more)
- Add an article: prepend to `articles` in `src/articles.mjs`

## Before going live

- **Contact form** — no backend is connected. Until one is, submitting opens the visitor's email app with the request pre-filled, addressed to `site.formEmail` in `src/data.mjs` (smartamplefs@gmail.com). To post to a form service or API instead, set `data-endpoint` on the form in `src/pages/contact.mjs`; it receives the fields as JSON.
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
