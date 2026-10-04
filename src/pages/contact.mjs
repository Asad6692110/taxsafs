import { site, services, consultationPoints } from '../data.mjs';
import { esc, pad, arrow } from '../components.mjs';

export default {
  path: 'contact.html',
  current: 'contact',
  title: 'Contact & Free Consultation | Smart Ample Financial Services',
  crumbs: [{ name: 'Contact', path: 'contact.html' }],
  description: 'Book a free, no-obligation consultation with Smart Ample Financial Services. Call or WhatsApp +971 54 599 5623, or visit us in Ajman Free Zone, UAE.',
  body: () => `
<section class="contact">
  <div class="contact__glow" aria-hidden="true"></div>
  <div class="container">
    <p class="eyebrow eyebrow--plain">Contact &amp; free consultation</p>
    <h1 class="display contact__title">Let’s talk about<br> your business.</h1>

    <div class="contact__grid">
      <div class="contact__info">
        <p class="contact__lead">Whether you are a startup, SME, or corporate entity, ${esc(site.name)} provides reliable financial solutions tailored to your business needs.</p>

        <dl class="contact__details">
          <div>
            <dt>Office</dt>
            <dd><address>${site.address.map(esc).join('<br>')}</address></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href="${site.phoneHref}">${site.phone}</a></dd>
          </div>
          <div>
            <dt>WhatsApp</dt>
            <dd><a href="${site.whatsapp}" target="_blank" rel="noopener">${site.whatsappDisplay}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href="mailto:${site.email}">${site.email}</a></dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>${esc(site.hours)}</dd>
          </div>
        </dl>

        <div class="contact__expect">
          <h2 class="eyebrow eyebrow--plain">Your free consultation</h2>
          <ol>
            ${consultationPoints.map((p, i) => `<li><span>${pad(i + 1)}</span>${esc(p)}</li>`).join('')}
          </ol>
        </div>
      </div>

      <form class="form" id="consultation" action="mailto:${site.formEmail}" method="post" enctype="text/plain" novalidate data-form data-endpoint="" data-mailto="${site.formEmail}">
        <h2 class="form__title">Request your free consultation</h2>
        <p class="form__hint">Speak with our qualified professionals about your accounting, taxation, and compliance requirements — with no obligation.</p>

        <div class="form__row">
          <div class="field">
            <label for="f-name">Full Name</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required>
          </div>
          <div class="field">
            <label for="f-email">Email</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required>
          </div>
        </div>
        <div class="form__row">
          <div class="field">
            <label for="f-phone">Phone</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" required>
          </div>
          <div class="field">
            <label for="f-company">Company <span>Optional</span></label>
            <input id="f-company" name="company" type="text" autocomplete="organization">
          </div>
        </div>
        <div class="field">
          <label for="f-service">Service Required</label>
          <select id="f-service" name="service" required>
            <option value="" selected disabled>Select a service</option>
            ${services.map((s) => `<option value="${s.slug}">${esc(s.title)}</option>`).join('')}
            <option value="other">Something else</option>
          </select>
        </div>
        <div class="field">
          <label for="f-message">Message <span>Optional</span></label>
          <textarea id="f-message" name="message" rows="5"></textarea>
        </div>
        <label class="check">
          <input type="checkbox" name="consent" required>
          <span>I agree that my submitted data is being collected and stored.</span>
        </label>

        <button class="btn btn--primary form__submit" type="submit">Request Consultation ${arrow}</button>
        <p class="form__status" role="status" aria-live="polite" data-form-status></p>
      </form>
    </div>
  </div>
</section>

<section class="map" aria-labelledby="map-title">
  <div class="container map__head">
    <h2 id="map-title" class="eyebrow eyebrow--plain">Find us</h2>
    <p>${site.address.map(esc).join(', ')}</p>
  </div>
  <iframe class="map__frame" title="Map showing ${esc(site.name)} in Ajman Free Zone" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&amp;output=embed"></iframe>
</section>`,
};
