import { services } from '../data.mjs';
import { esc, pad, arrow, eyebrow, photo, pageHero, PHERO_SIZES, cta } from '../components.mjs';

const standOut = [
  { title: 'Accuracy & Compliance', text: 'Every service is delivered with precision and strict regulatory adherence.' },
  { title: 'Industry Expertise', text: 'Experienced professionals with deep financial and tax knowledge.' },
  { title: 'Client-Focused Solutions', text: 'Customized services aligned with your business objectives.' },
];

export default {
  path: 'services.html',
  current: 'services',
  title: 'Accounting, VAT, Corporate Tax & Audit Services in the UAE | SMFS',
  crumbs: [{ name: 'Services', path: 'services.html' }],
  preload: { file: 'towers', sizes: PHERO_SIZES },
  description: 'Accounting & bookkeeping, VAT, corporate tax, audit & assurance, tax residency, business consultancy, transfer pricing and customs registration for UAE businesses.',
  body: (root) => `
${pageHero({
  root,
  label: 'Our professional services',
  title: 'Financial expertise<br> without the complexity.',
  text: 'Comprehensive accounting, taxation, audit, and advisory services designed to ensure compliance, accuracy, and business growth.',
  img: 'towers.jpg',
  alt: 'Glass curtain-wall office towers seen from below',
})}

<nav class="svc-index" aria-label="Services on this page">
  <div class="container">
    <ol>
      ${services.map((s, i) => `<li><a href="#${s.slug}"><span>${pad(i + 1)}</span>${esc(s.short)}</a></li>`).join('')}
    </ol>
  </div>
</nav>

<div class="features">
  ${services.map((s, i) => `
  <section class="feature" id="${s.slug}" aria-labelledby="${s.slug}-title">
    <div class="container feature__grid">
      <div class="feature__copy" data-reveal>
        <span class="feature__num" aria-hidden="true">${pad(i + 1)}</span>
        <h2 id="${s.slug}-title" class="feature__title">${esc(s.title)}</h2>
        <p class="feature__text">${esc(s.detail)}</p>
        <ul class="feature__scope">
          ${s.scope.map((x) => `<li>${esc(x)}</li>`).join('')}
        </ul>
        <a class="link" href="${root}contact.html?service=${s.slug}#consultation">Discuss ${esc(s.title)} ${arrow}</a>
      </div>
      <div class="media feature__media" data-reveal style="--d:.1s">
        ${photo(root, s.img, { alt: s.alt, sizes: '(min-width: 1024px) 50vw, 100vw' })}
      </div>
    </div>
  </section>`).join('')}
</div>

<section class="section why" aria-labelledby="standout-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('09', 'The Standard')}
        <h2 id="standout-title" class="h2">Why our services<br> stand out.</h2>
      </div>
      <p class="split-head__text" data-reveal style="--d:.1s">Professional accounting, taxation, audit, and advisory services tailored to support business growth and compliance.</p>
    </div>
    <ol class="principles principles--three">
      ${standOut.map((p, i) => `
      <li class="principle" data-reveal style="--d:${i * 0.08}s">
        <span class="principle__num">${pad(i + 1)}</span>
        <h3 class="principle__title">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>

${cta(root)}`,
};
