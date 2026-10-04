import { articles } from '../articles.mjs';
import { esc, pad, arrow, photo, cta } from '../components.mjs';

const LEAD_SIZES = '(min-width: 1024px) 66vw, 100vw';

const [lead, ...rest] = articles;

const index = {
  path: 'insights.html',
  current: 'insights',
  title: 'Insights: UAE VAT, Corporate Tax & Accounting Updates | SMFS',
  crumbs: [{ name: 'Insights', path: 'insights.html' }],
  preload: { file: lead.img, sizes: LEAD_SIZES },
  description: 'Expert insights on accounting, taxation, compliance, and business best practices to keep UAE businesses informed.',
  body: (root) => `
<section class="ihero">
  <div class="container">
    <p class="eyebrow eyebrow--plain">Insights &amp; updates</p>
    <h1 class="display">Financial insight<br> for the modern UAE business.</h1>
    <p class="ihero__text">Expert insights on accounting, taxation, compliance, and business best practices to keep you informed.</p>
  </div>
</section>

<section class="section section--tight" aria-label="Featured article">
  <div class="container">
    <article class="post post--feature" data-reveal>
      <a class="post__link" href="${root}insights/${lead.slug}.html">
        <div class="media post__media">${photo(root, lead.img, { alt: lead.alt, sizes: LEAD_SIZES, priority: true })}</div>
        <div class="post__body">
          <p class="post__meta"><span>${esc(lead.category)}</span><time datetime="${lead.datetime}">${lead.date}</time></p>
          <h2 class="post__title">${esc(lead.title)}</h2>
          <p class="post__excerpt">${esc(lead.excerpt)}</p>
          <span class="link">Read article ${arrow}</span>
        </div>
      </a>
    </article>

    <ol class="post-list">
      ${rest.map((a, i) => `
      <li data-reveal>
        <article class="post post--line">
          <a class="post__link" href="${root}insights/${a.slug}.html">
            <span class="post__num">${pad(i + 2)}</span>
            <div class="post__body">
              <p class="post__meta"><span>${esc(a.category)}</span><time datetime="${a.datetime}">${a.date}</time></p>
              <h2 class="post__title">${esc(a.title)}</h2>
              <p class="post__excerpt">${esc(a.excerpt)}</p>
            </div>
            <div class="media post__media">${photo(root, a.img, { alt: a.alt, sizes: '(min-width: 768px) 240px, 100vw' })}</div>
            ${arrow}
          </a>
        </article>
      </li>`).join('')}
    </ol>
  </div>
</section>

${cta(root)}`,
};

const articlePage = (a) => ({
  path: `insights/${a.slug}.html`,
  current: 'insights',
  title: `${a.title} | SMFS`,
  crumbs: [{ name: 'Insights', path: 'insights.html' }, { name: a.title, path: `insights/${a.slug}.html` }],
  article: a,
  preload: { file: a.img, sizes: '100vw' },
  description: a.excerpt,
  body: (root) => `
<article class="article">
  <header class="article__head">
    <div class="container article__grid">
      <a class="link link--back article__back" href="${root}insights.html">${arrow} All insights</a>
      <div class="article__intro">
        <p class="post__meta"><span>${esc(a.category)}</span><time datetime="${a.datetime}">${a.date}</time></p>
        <h1 class="article__title">${esc(a.title)}</h1>
        <p class="article__standfirst">${esc(a.excerpt)}</p>
      </div>
    </div>
    <div class="container">
      <div class="media article__media">${photo(root, a.img, { alt: a.alt, sizes: '100vw', priority: true })}</div>
    </div>
  </header>
  <div class="container article__grid">
    <aside class="article__aside">
      <p class="eyebrow eyebrow--plain">Need expert advice?</p>
      <p>Book a free consultation with our professionals today.</p>
      <a class="link" href="${root}contact.html#consultation">Free Consultation ${arrow}</a>
    </aside>
    <div class="prose">${a.body}
    </div>
  </div>
</article>

<section class="section section--tight more" aria-labelledby="more-title">
  <div class="container">
    <h2 id="more-title" class="eyebrow eyebrow--plain">More insights</h2>
    <ol class="post-list">
      ${articles.filter((o) => o !== a).map((o, i) => `
      <li>
        <article class="post post--line post--compact">
          <a class="post__link" href="${root}insights/${o.slug}.html">
            <span class="post__num">${pad(i + 1)}</span>
            <div class="post__body">
              <p class="post__meta"><span>${esc(o.category)}</span><time datetime="${o.datetime}">${o.date}</time></p>
              <h3 class="post__title">${esc(o.title)}</h3>
            </div>
            ${arrow}
          </a>
        </article>
      </li>`).join('')}
    </ol>
  </div>
</section>

${cta(root)}`,
});

export default [index, ...articles.map(articlePage)];
