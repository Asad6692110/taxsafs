// Document shell: <head>, header, mobile menu, footer and the floating WhatsApp button.
import { site, nav, services } from './data.mjs';
import { esc, arrow, pad } from './components.mjs';
import { images } from './images.mjs';

// Dark-theme SMFS logo, redrawn as SVG from the brand logo (refference-images/smfs-logo.png):
// navy letters become ivory on the dark site; gold elements keep the logo's metallic gold.
// `id` keeps the gradient id unique per instance. The favicon and public/assets/img/logo-smfs.svg match it.
const logo = (root, id, cls = '') => `
<a class="logo ${cls}" href="${root}index.html" aria-label="${esc(site.name)} — home">
  <svg class="logo__mark" viewBox="0 0 166 44" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B09048"/><stop offset=".5" stop-color="#F0E090"/><stop offset="1" stop-color="#C9A85C"/></linearGradient></defs>
    <g fill="currentColor"><rect x="0" y="2" width="36" height="10.5"/><rect x="0" y="2" width="10.5" height="25"/><rect x="0" y="16.75" width="36" height="10.5"/><rect x="25.5" y="16.75" width="10.5" height="25.25"/><rect x="0" y="31.5" width="36" height="10.5"/><rect x="42" y="19" width="10.5" height="23"/><rect x="57" y="25" width="10" height="17"/><rect x="71.5" y="2" width="10.5" height="40"/><rect x="88" y="13.5" width="10.5" height="28.5"/><rect x="88" y="21.5" width="27" height="9"/><rect x="130" y="2" width="36" height="10.5"/><rect x="130" y="2" width="10.5" height="25"/><rect x="130" y="16.75" width="36" height="10.5"/><rect x="155.5" y="16.75" width="10.5" height="25.25"/><rect x="130" y="31.5" width="36" height="10.5"/></g>
    <g fill="url(#${id})"><polygon points="42,11 71.5,2.5 71.5,10.5 42,19"/><polygon points="88,2 125,2 122,12 88,12"/></g>
    <path d="M40 41 L52 29 L59 35 L72 20" style="fill:none;stroke:var(--logo-cut, #060A14)" stroke-width="8"/><polygon points="77,13 67.5,15.5 74.5,22.5" style="fill:var(--logo-cut, #060A14);stroke:var(--logo-cut, #060A14)" stroke-width="5" stroke-linejoin="round"/>
    <path d="M40 41 L52 29 L59 35 L72 20" fill="none" stroke="url(#${id})" stroke-width="3.2" stroke-linejoin="miter"/><polygon points="77,13 67.5,15.5 74.5,22.5" fill="url(#${id})"/>
  </svg>
  <span class="logo__text" aria-hidden="true"><span class="logo__ar" lang="ar" dir="rtl">${site.nameAr}</span><span class="logo__en">${esc(site.name)}</span></span>
</a>`;

const socialIcons = {
  LinkedIn: '<rect x="4.5" y="4.5" width="15" height="15" rx="2"/><path d="M8.500 11v5M8.500 8.200v.01M12 16v-5M12 13.200a2 2 0 0 1 4 0V16"/>',
  Instagram: '<rect x="4.5" y="4.5" width="15" height="15" rx="4"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5v.01"/>',
  X: '<path d="M5.500 5.500l13 13M18.500 5.500l-13 13"/>',
  Facebook: '<circle cx="12" cy="12" r="7.800"/><path d="M14.800 8.800h-.800a2 2 0 0 0-2 2v8.800M9.800 13.200h4.400"/>',
};

const whatsappIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9l-1.200 4.100 4.200-1.100A8.500 8.500 0 1 0 12 3.500z"/><path d="M9 8.800c0 3.400 2.800 6.200 6.200 6.200" stroke-width="2"/></svg>`;

const header = (root, current) => `
<a class="skip" href="#main">Skip to content</a>
<header class="header" data-header>
  <div class="container header__bar">
    ${logo(root, 'logo-g-header')}
    <nav class="nav" aria-label="Primary" data-nav>
      ${nav.map((n) => `<a class="nav__link" href="${root}${n.href}"${n.key === current ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
      <span class="nav__indicator" aria-hidden="true"></span>
    </nav>
    <div class="header__actions">
      <a class="header__phone" href="${site.phoneHref}">${site.phone}</a>
      <a class="btn btn--primary btn--sm" href="${root}contact.html#consultation">Book Consultation ${arrow}</a>
    </div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
      <span class="sr-only">Menu</span><span class="menu-toggle__bars" aria-hidden="true"></span>
    </button>
  </div>
</header>
<div class="menu" id="menu" data-menu>
  <nav class="container menu__inner" aria-label="Mobile">
    <ul class="menu__links">
      ${[{ key: 'home', label: 'Home', href: 'index.html' }, ...nav].map((n, i) => `
      <li style="--i:${i}"><a href="${root}${n.href}"${n.key === current ? ' aria-current="page"' : ''}><span>${pad(i + 1)}</span>${n.label}</a></li>`).join('')}
    </ul>
    <div class="menu__foot">
      <a class="btn btn--primary" href="${root}contact.html#consultation">Book a Consultation ${arrow}</a>
      <p><a href="${site.phoneHref}">${site.phone}</a><br><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp ${site.whatsappDisplay}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
  </nav>
</div>`;

const footer = (root) => `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        ${logo(root, 'logo-g-footer', 'logo--lg')}
        <p class="footer__statement" aria-label="Accounting. Tax. Advisory.">Accounting.<br>Tax.<br><em>Advisory.</em></p>
      </div>
      <div class="footer__nav">
        <div>
          <h2 class="footer__h">Explore</h2>
          <ul>${nav.map((n) => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h2 class="footer__h">Services</h2>
          <ul>${services.map((s) => `<li><a href="${root}services.html#${s.slug}">${esc(s.short)}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h2 class="footer__h">Contact</h2>
          <address>
            ${site.address.map(esc).join('<br>')}<br>
            <a href="${site.phoneHref}">${site.phone}</a><br>
            <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp ${site.whatsappDisplay}</a><br>
            <a href="mailto:${site.email}">${site.email}</a>
          </address>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© 2026 ${esc(site.name)}</p>
      <ul class="footer__legal">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
      </ul>
      <ul class="footer__social">
        ${site.social.map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.name}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${socialIcons[s.name]}</svg></a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>
<a class="whatsapp" href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  ${whatsappIcon}<span class="whatsapp__label" aria-hidden="true">WhatsApp</span>
</a>`;

/** Absolute, clean URL of a page: "about.html" -> https://…/about, "index.html" -> https://…/ */
export const pageUrl = (path) => `${site.url}/${path.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

// Structured data: the firm + website on every page, plus breadcrumbs and Article where relevant.
const structuredData = ({ path, title, description, crumbs, article }) => {
  const url = pageUrl(path);
  const graph = [
    {
      '@type': 'AccountingService',
      '@id': ORG_ID,
      name: site.name,
      alternateName: [site.shortName, site.nameAr],
      url: `${site.url}/`,
      logo: `${site.url}/icon-512.png`,
      image: `${site.url}/og.jpg`,
      description: site.tagline,
      telephone: site.phoneHref.replace('tel:', ''),
      email: site.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'B.C. 1307715, Ajman Free Zone C1 Building',
        addressLocality: 'Ajman',
        addressRegion: 'Ajman',
        addressCountry: 'AE',
      },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
      contactPoint: { '@type': 'ContactPoint', telephone: site.phoneHref.replace('tel:', ''), contactType: 'customer service', areaServed: 'AE', availableLanguage: ['English', 'Arabic'] },
    },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${site.url}/`, name: site.name, inLanguage: 'en', publisher: { '@id': ORG_ID } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'en', isPartOf: { '@id': SITE_ID }, about: { '@id': ORG_ID } },
  ];
  if (crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: 'index.html' }, ...crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: pageUrl(c.path) })),
    });
  }
  if (article) {
    graph.push({
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: `${site.url}/og.jpg`,
      datePublished: article.datetime,
      articleSection: article.category,
      inLanguage: 'en',
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: { '@id': `${url}#webpage` },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
};

const preloadTag = (root, { file, sizes }) => {
  const { widths } = images[file.replace(/\.\w+$/, '')];
  const name = file.replace(/\.\w+$/, '');
  return `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="${widths.map((w) => `${root}assets/img/${name}-${w}.webp ${w}w`).join(', ')}" imagesizes="${sizes}">`;
};

export const layout = ({ root, current, path, title, description, body, crumbs, article, preload, noindex = false, css = '', bodyClass = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
${noindex ? '' : `<link rel="canonical" href="${pageUrl(path)}">`}
<meta name="author" content="${esc(site.name)}">
<meta name="keywords" content="${esc(site.keywords)}">
<meta name="theme-color" content="#060A14">
<meta name="geo.region" content="AE-AJ">
<meta name="geo.placename" content="Ajman Free Zone, Ajman">
${site.googleVerification ? `<meta name="google-site-verification" content="${esc(site.googleVerification)}">` : ''}
<meta property="og:type" content="${article ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_AE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${pageUrl(path)}">
<meta property="og:image" content="${site.url}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Downtown Dubai skyline at dusk — ${esc(site.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.url}/og.jpg">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${root}favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${root}apple-touch-icon.png">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="preload" href="${root}assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload ? preloadTag(root, preload) : ''}
<style>${css}</style>
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(structuredData({ path, title, description, crumbs, article }))}</script>
</head>
<body class="${bodyClass}">
${header(root, current)}
<main id="main">
${body}
</main>
${footer(root)}
<script src="${root}assets/js/main.js" defer></script>
</body>
</html>
`;
