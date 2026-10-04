// Shared building blocks used across pages. Each returns an HTML string.
import { site, stats, principles, process, testimonials } from './data.mjs';
import { images } from './images.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const pad = (n) => String(n).padStart(2, '0');

export const arrow = `<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>`;

export const eyebrow = (num, label) =>
  `<p class="eyebrow"><span class="eyebrow__num">${num}</span><span class="eyebrow__sep" aria-hidden="true">/</span>${esc(label)}</p>`;

/** Splits a heading into masked lines so each can slide up on load. */
export const lines = (...parts) =>
  parts.map((p, i) => `<span class="line"><span style="--i:${i}">${p}</span></span>`).join(' ');

/**
 * Responsive WebP <img>. `file` is an image name from src/images.mjs (an extension is ignored).
 * `sizes` tells the browser how wide the image is displayed so it can pick the smallest variant.
 * Images are lazy-loaded unless `priority` (above-the-fold, also give the page a matching `preload`).
 */
export const photo = (root, file, { alt = '', sizes = '100vw', cls = '', priority = false } = {}) => {
  const name = file.replace(/\.\w+$/, '');
  const { widths, ratio } = images[name];
  const url = (w) => `${root}assets/img/${name}-${w}.webp`;
  const max = widths.at(-1);
  return `<img${cls ? ` class="${cls}"` : ''} src="${url(widths[1])}" srcset="${widths.map((w) => `${url(w)} ${w}w`).join(', ')}" sizes="${sizes}" alt="${esc(alt)}" width="${max}" height="${Math.round(max * ratio)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};

// Inner-page hero photos are darkened full-bleed backgrounds; phones can use a narrower variant.
export const PHERO_SIZES = '(min-width: 768px) 100vw, 60vw';

export const pageHero = ({ root, label, title, text, img, alt }) => `
<section class="phero">
  <div class="phero__media">${photo(root, img, { alt, sizes: PHERO_SIZES, priority: true })}</div>
  <div class="container phero__inner">
    <p class="eyebrow eyebrow--plain">${esc(label)}</p>
    <h1 class="display">${title}</h1>
    ${text ? `<p class="phero__text">${text}</p>` : ''}
  </div>
</section>`;

export const statsSection = ({ label, heading } = {}) => `
<section class="section stats" aria-labelledby="stats-title">
  <div class="container">
    <div class="stats__head" data-reveal>
      ${label}
      <h2 id="stats-title" class="${heading ? 'h2' : 'sr-only'}">${heading || 'Smart Ample Financial Services in numbers'}</h2>
    </div>
    <dl class="stats__grid">
      ${stats.map((s, i) => `
      <div class="stat" data-reveal style="--d:${i * 0.08}s">
        <dt class="stat__label">${esc(s.label)}</dt>
        <dd class="stat__value"><span data-count="${s.value}">${s.value}</span><span class="stat__suffix">${esc(s.suffix)}</span></dd>
        <dd class="stat__note">${esc(s.note)}</dd>
      </div>`).join('')}
    </dl>
  </div>
</section>`;

export const principlesGrid = ({ about = false } = {}) => `
<ol class="principles">
  ${principles.map((p, i) => `
  <li class="principle" data-reveal style="--d:${i * 0.08}s">
    <span class="principle__num">${pad(i + 1)}</span>
    <h3 class="principle__title">${esc(about ? p.aboutTitle || p.title : p.title)}</h3>
    <p>${esc(about ? p.brief : p.text)}</p>
  </li>`).join('')}
</ol>`;

export const processTimeline = () => `
<ol class="timeline" data-reveal>
  ${process.map((s, i) => `
  <li class="timeline__step" style="--i:${i}">
    <span class="timeline__node" aria-hidden="true"></span>
    <span class="timeline__num">${pad(i + 1)}</span>
    <h3 class="timeline__title">${esc(s.title)}</h3>
    <p>${esc(s.text)}</p>
  </li>`).join('')}
</ol>`;

export const cta = (root) => `
<section class="section cta" aria-labelledby="cta-title">
  <div class="container">
    <p class="eyebrow eyebrow--plain" data-reveal>Free consultation</p>
    <h2 id="cta-title" class="display cta__title" data-reveal>Let’s make your<br> numbers work harder.</h2>
    <div class="cta__row" data-reveal>
      <div class="cta__lead">
        <p>Speak with our team about accounting, tax and advisory solutions built around your business.</p>
        <div class="actions">
          <a class="btn btn--primary" href="${root}contact.html#consultation">Book a Consultation ${arrow}</a>
          <a class="btn btn--ghost" href="${root}contact.html">Contact Us</a>
        </div>
      </div>
      <ul class="cta__direct">
        <li><span>Call</span><a href="${site.phoneHref}">${site.phone}</a></li>
        <li><span>Email</span><a href="mailto:${site.email}">${site.email}</a></li>
      </ul>
    </div>
  </div>
</section>`;

// Only genuine client quotes (src/data.mjs). Arrows render once there are two or more.
export const testimonialSection = (label) => `
<section class="section quote" aria-labelledby="quote-title">
  <div class="container quote__grid">
    <div data-reveal>
      ${label}
      <h2 id="quote-title" class="sr-only">What our clients say</h2>
    </div>
    <div class="quote__body" data-reveal style="--d:.1s" data-quotes>
      <span class="quote__mark" aria-hidden="true">“</span>
      ${testimonials.map((t, i) => `
      <figure class="quote__item${i === 0 ? ' is-active' : ''}">
        <blockquote><p>${esc(t.quote)}</p></blockquote>
        <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></figcaption>
      </figure>`).join('')}
      ${testimonials.length > 1 ? `
      <div class="quote__nav">
        <button type="button" class="quote__btn quote__btn--prev" data-quote-prev aria-label="Previous testimonial">${arrow}</button>
        <button type="button" class="quote__btn" data-quote-next aria-label="Next testimonial">${arrow}</button>
      </div>` : ''}
    </div>
  </div>
</section>`;
