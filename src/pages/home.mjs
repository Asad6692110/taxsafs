import { site, services } from '../data.mjs';
import { articles } from '../articles.mjs';
import { esc, pad, arrow, eyebrow, lines, photo, statsSection, principlesGrid, processTimeline, testimonialSection, cta } from '../components.mjs';

// On phones the hero photo sits behind a dark overlay, so a narrower variant than the viewport is enough.
const HERO_SIZES = '(min-width: 768px) 60vw, 50vw';

const uaeAreas = ['VAT', 'Corporate Tax', 'Audit', 'Compliance', 'Tax Residency', 'Transfer Pricing'];

const hero = (root) => `
<section class="hero">
  <div class="hero__media">${photo(root, 'hero', { alt: 'Downtown Dubai skyline and the Burj Khalifa at dusk', sizes: HERO_SIZES, priority: true })}</div>
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--plain hero__eyebrow">UAE Accounting <span aria-hidden="true">•</span> Tax <span aria-hidden="true">•</span> Advisory</p>
      <h1 class="hero__title">${lines('Financial Clarity.', 'Built for Business.')}</h1>
      <p class="hero__text">Strategic accounting, tax, audit and advisory solutions helping UAE businesses operate with confidence.</p>
      <div class="actions hero__actions">
        <a class="btn btn--primary" href="${root}contact.html#consultation">Book a Consultation ${arrow}</a>
        <a class="btn btn--ghost" href="${root}services.html">Explore Services</a>
      </div>
    </div>
    <dl class="hero__data">
      <div class="readout">
        <dt>Businesses Supported</dt>
        <dd>500<span>+</span></dd>
      </div>
      <div class="readout">
        <dt>Compliance Focus</dt>
        <dd>99<span>%</span></dd>
      </div>
    </dl>
  </div>
  <div class="container hero__foot">
    <span>Ajman Free Zone, UAE</span>
    <span class="hero__foot-mid">${esc(site.hours)}</span>
    <a href="#about">Scroll <span aria-hidden="true">↓</span></a>
  </div>
</section>`;

const about = (root) => `
<section class="section statement" id="about" aria-labelledby="about-title">
  <div class="container statement__grid">
    <div class="statement__label" data-reveal>${eyebrow('01', 'About')}</div>
    <h2 id="about-title" class="statement__title" data-reveal>Complex financial decisions deserve <em>clear thinking.</em></h2>
    <div class="statement__body" data-reveal style="--d:.12s">
      <p>${esc(site.name)} is a UAE-based accounting, tax and audit firm located in Ajman Free Zone, providing high-quality financial and compliance services to businesses across the UAE and international markets.</p>
      <p>Driven by precision, integrity and strategic expertise, we help clients meet regulatory requirements while building a strong foundation for long-term success.</p>
      <a class="link" href="${root}about.html">Discover Our Approach ${arrow}</a>
    </div>
  </div>
</section>`;

const serviceList = (root) => `
<section class="section svc" aria-labelledby="svc-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('02', 'Services')}
        <h2 id="svc-title" class="h2">Expertise that moves<br> business forward.</h2>
      </div>
      <p class="split-head__text" data-reveal style="--d:.1s">We do more than just balance the books. We empower businesses to grow with confidence.</p>
    </div>
    <div class="svc__grid">
      <ol class="svc__list" data-services>
        ${services.map((s, i) => `
        <li class="svc-row${i === 0 ? ' is-active' : ''}">
          <h3 class="svc-row__h">
            <a class="svc-row__link" href="${root}services.html#${s.slug}" id="svc-${i}" data-panel="svc-panel-${i}">
              <span class="svc-row__num">${pad(i + 1)}</span>
              <span class="svc-row__title">${esc(s.title)}</span>
              ${arrow}
            </a>
          </h3>
          <div class="svc-row__panel" id="svc-panel-${i}">
            <div class="svc-row__panel-inner">
              <div class="media svc-row__media">${photo(root, s.img, { sizes: '100vw' })}</div>
              <p>${esc(s.summary)}</p>
              <a class="link" href="${root}services.html#${s.slug}">View service ${arrow}</a>
            </div>
          </div>
        </li>`).join('')}
      </ol>
      <div class="svc__visual" aria-hidden="true">
        <div class="svc__frame">
          ${services.map((s, i) => photo(root, s.img, { cls: `svc__img${i === 0 ? ' is-active' : ''}`, sizes: '40vw' })).join('')}
        </div>
        <div class="svc__captions">
          ${services.map((s, i) => `<p class="svc__cap${i === 0 ? ' is-active' : ''}"><span>${pad(i + 1)} / ${pad(services.length)}</span>${esc(s.summary)}</p>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;

const uae = (root) => `
<section class="uae" aria-labelledby="uae-title">
  <div class="uae__media">${photo(root, 'uae', { alt: 'The Burj Khalifa rising above Downtown Dubai under dramatic clouds', sizes: '(min-width: 768px) 100vw, 60vw' })}</div>
  <div class="container uae__inner">
    <div class="uae__top" data-reveal>
      ${eyebrow('03', 'UAE Expertise')}
      <p class="uae__motto">Local expertise.<br>International standards.</p>
    </div>
    <h2 id="uae-title" class="display uae__title" data-reveal>Built around<br> the UAE business environment.</h2>
    <p class="uae__text" data-reveal style="--d:.1s">By combining strong local regulatory expertise with a global business perspective, we serve as a trusted financial partner — enabling organizations to operate with confidence, accuracy and strategic clarity.</p>
    <ul class="uae__areas" data-reveal style="--d:.16s">
      ${uaeAreas.map((a, i) => `<li><span>${pad(i + 1)}</span>${a}</li>`).join('')}
    </ul>
  </div>
</section>`;

const why = () => `
<section class="section why" aria-labelledby="why-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('05', 'Why SMFS')}
        <h2 id="why-title" class="h2">Precision is<br> our standard.</h2>
      </div>
      <p class="split-head__text" data-reveal style="--d:.1s">Financial management is not simply about numbers. It is about clarity, compliance and confidence.</p>
    </div>
    ${principlesGrid()}
  </div>
</section>`;

const processSection = () => `
<section class="section process" aria-labelledby="process-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('06', 'Process')}
        <h2 id="process-title" class="h2">From complexity<br> to clarity.</h2>
      </div>
    </div>
    ${processTimeline()}
  </div>
</section>`;

const insights = (root) => {
  const [lead, ...rest] = articles;
  return `
<section class="section insights" aria-labelledby="insights-title">
  <div class="container">
    <div class="split-head split-head--wide">
      <div data-reveal>
        ${eyebrow('08', 'Insights')}
        <h2 id="insights-title" class="h2">Financial insight<br> for the modern UAE business.</h2>
      </div>
      <a class="link split-head__link" href="${root}insights.html" data-reveal>All insights ${arrow}</a>
    </div>
    <div class="insights__grid">
      <article class="post post--lead" data-reveal>
        <a class="post__link" href="${root}insights/${lead.slug}.html">
          <div class="media post__media">${photo(root, lead.img, { alt: lead.alt, sizes: '(min-width: 1024px) 58vw, 100vw' })}</div>
          <p class="post__meta"><span>${esc(lead.category)}</span><time datetime="${lead.datetime}">${lead.date}</time></p>
          <h3 class="post__title">${esc(lead.title)}</h3>
          <p class="post__excerpt">${esc(lead.excerpt)}</p>
          <span class="link">Read article ${arrow}</span>
        </a>
      </article>
      <div class="insights__side">
        ${rest.map((a, i) => `
        <article class="post post--row" data-reveal style="--d:${0.1 + i * 0.08}s">
          <a class="post__link" href="${root}insights/${a.slug}.html">
            <div>
              <p class="post__meta"><span>${esc(a.category)}</span><time datetime="${a.datetime}">${a.date}</time></p>
              <h3 class="post__title">${esc(a.title)}</h3>
              <span class="link">Read article ${arrow}</span>
            </div>
            <div class="media post__media">${photo(root, a.img, { alt: a.alt, sizes: '120px' })}</div>
          </a>
        </article>`).join('')}
      </div>
    </div>
  </div>
</section>`;
};

export default {
  path: 'index.html',
  current: 'home',
  title: 'Smart Ample Financial Services | Accounting & Tax in the UAE',
  preload: { file: 'hero', sizes: HERO_SIZES },
  description: 'Accounting, VAT, corporate tax, audit and business advisory for startups, SMEs and enterprises in the UAE. Based in Ajman Free Zone. Book a free consultation.',
  body: (root) =>
    [
      hero(root),
      about(root),
      serviceList(root),
      uae(root),
      statsSection({ label: eyebrow('04', 'In Numbers') }),
      why(),
      processSection(),
      testimonialSection(eyebrow('07', 'Clients')),
      insights(root),
      cta(root),
    ].join('\n'),
};
