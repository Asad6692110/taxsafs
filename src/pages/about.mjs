import { eyebrow, arrow, pageHero, PHERO_SIZES, statsSection, principlesGrid, processTimeline, testimonialSection, cta } from '../components.mjs';

export default {
  path: 'about.html',
  current: 'about',
  title: 'About Us | Smart Ample Financial Services, UAE',
  crumbs: [{ name: 'About', path: 'about.html' }],
  preload: { file: 'about', sizes: PHERO_SIZES },
  description: 'A UAE-based accounting, tax and audit firm in Ajman Free Zone. Learn about our mission, vision and client-first approach to financial and compliance services.',
  body: (root) => `
${pageHero({
  root,
  label: 'About the firm',
  title: 'Built on precision.<br> Driven by trust.',
  text: 'Your trusted partner in accounting and tax solutions — for businesses across the UAE and international markets.',
  img: 'about.jpg',
  alt: 'The Museum of the Future among office towers in Dubai',
})}

<section class="section story" aria-labelledby="who-title">
  <div class="container story__grid">
    <div class="story__label" data-reveal>${eyebrow('01', 'Who We Are')}</div>
    <div class="story__main">
      <h2 id="who-title" class="story__lead" data-reveal>We are a UAE-based accounting, tax and audit firm located in Ajman Free Zone, providing high-quality financial and compliance services to businesses across the UAE and international markets.</h2>
      <div class="story__cols" data-reveal style="--d:.1s">
        <p>Driven by precision, integrity and strategic expertise, we help clients meet regulatory requirements while building a strong foundation for long-term success. Our services include accounting and bookkeeping, VAT and corporate tax advisory, audit and assurance, financial reporting and regulatory compliance, all delivered in line with UAE laws and internationally recognized standards.</p>
        <p>We support startups, SMEs, and established enterprises with solutions that enhance transparency, reduce financial risk, and improve operational efficiency. Our approach is firmly client-first. We work closely with each client to understand their business objectives, industry challenges and compliance needs, allowing us to deliver customized, cost-effective and timely solutions with the highest levels of confidentiality and professional ethics.</p>
      </div>
    </div>
  </div>
</section>

<section class="purpose" aria-label="Mission and vision">
  <div class="container">
    <div class="purpose__item" data-reveal>
      ${eyebrow('02', 'Our Mission')}
      <h2 class="purpose__text">To provide seamless accounting, tax, and consultancy services ensuring <em>financial stability and business growth.</em></h2>
    </div>
    <div class="purpose__item purpose__item--offset" data-reveal>
      ${eyebrow('03', 'Our Vision')}
      <h2 class="purpose__text">Becoming a leading firm delivering trusted tax, accounting and business consultancy <em>worldwide.</em></h2>
    </div>
  </div>
</section>

<section class="section why" aria-labelledby="why-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('04', 'Why SMFS')}
        <h2 id="why-title" class="h2">Why we are<br> different.</h2>
      </div>
      <p class="split-head__text" data-reveal style="--d:.1s">Our professional approach is driven by expertise, compliance, confidentiality, and client-focused solutions.</p>
    </div>
    ${principlesGrid({ about: true })}
  </div>
</section>

<section class="section process" aria-labelledby="approach-title">
  <div class="container">
    <div class="split-head">
      <div data-reveal>
        ${eyebrow('05', 'Our Approach')}
        <h2 id="approach-title" class="h2">Firmly<br> client-first.</h2>
      </div>
      <p class="split-head__text" data-reveal style="--d:.1s">By combining strong local regulatory expertise with a global business perspective, we serve as a trusted financial partner, enabling organizations to operate with confidence, accuracy and strategic clarity.</p>
    </div>
    ${processTimeline()}
    <p class="process__more" data-reveal><a class="link" href="${root}services.html">Explore our services ${arrow}</a></p>
  </div>
</section>

${statsSection({ label: eyebrow('06', 'Trusted by Businesses'), heading: 'Trusted by businesses.' })}

${testimonialSection(eyebrow('07', 'Clients'))}

${cta(root)}`,
};
