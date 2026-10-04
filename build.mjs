// Zero-dependency static build: renders src/pages into dist/ and copies public/ alongside.
// Usage: node build.mjs   (or `npm run build`)
//
// What it does beyond rendering:
//  - inlines the stylesheet into every page (no render-blocking CSS request)
//  - puts assets under a content-hashed folder (dist/assets/<hash>/) so they can be cached for a year
//  - rewrites internal links to clean URLs (about.html -> about)
//  - writes robots.txt, sitemap.xml and site.webmanifest
import { createHash } from 'node:crypto';
import { mkdir, rm, cp, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './src/data.mjs';
import { layout, pageUrl } from './src/layout.mjs';
import home from './src/pages/home.mjs';
import about from './src/pages/about.mjs';
import services from './src/pages/services.mjs';
import insights from './src/pages/insights.mjs';
import contact from './src/pages/contact.mjs';
import notFound from './src/pages/404.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, 'public');
const out = join(here, 'dist');
const pages = [home, about, services, ...insights, contact, notFound];

// Hash of everything in public/assets: a changed file changes every asset URL, so long caching is safe.
const walk = async (dir) =>
  (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat().sort();
const sha = createHash('sha1');
for (const file of await walk(join(pub, 'assets'))) sha.update(file.slice(pub.length)).update(await readFile(file));
const hash = sha.digest('hex').slice(0, 8);

await rm(out, { recursive: true, force: true });
await cp(pub, out, { recursive: true, filter: (src) => !src.startsWith(join(pub, 'assets')) });
await cp(join(pub, 'assets'), join(out, 'assets', hash), { recursive: true });
await rm(join(out, 'assets', hash, 'css'), { recursive: true, force: true }); // inlined instead

const css = (await readFile(join(pub, 'assets/css/styles.css'), 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

for (const page of pages) {
  // Relative prefix back to the site root. Pages with `absolute` (the 404) can be served from any depth.
  const root = page.absolute ? '/' : '../'.repeat(page.path.split('/').length - 1);
  const html = layout({ ...page, root, body: page.body(root), css: css.replaceAll('../fonts/', `${root}assets/fonts/`) })
    .replace(/\bassets\/(img|js|fonts)\//g, `assets/${hash}/$1/`)
    // Clean URLs: "about.html#x" -> "about#x", "index.html" -> "./" (or "../", "/").
    .replace(/(href=")((?:\.\.\/)*|\/)([\w\-/]*?)\.html(?=["#?])/g, (_, attr, up, path) => attr + (path === 'index' ? up || './' : up + path));
  const file = join(out, page.path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log('built', page.path);
}

const indexable = pages.filter((p) => !p.noindex);
const today = new Date().toISOString().slice(0, 10);
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${pageUrl(p.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(join(out, 'site.webmanifest'), JSON.stringify({
  name: site.name,
  short_name: site.shortName,
  description: site.tagline,
  start_url: '/',
  display: 'standalone',
  background_color: '#060A14',
  theme_color: '#060A14',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));
console.log(`built sitemap.xml (${indexable.length} URLs), robots.txt, site.webmanifest — assets/${hash}/`);
