/* Smart Ample Financial Services — interactions. No dependencies. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header: translucent once the page scrolls ---- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(onScroll); // after first layout, so startup doesn't force one

  /* ---- Desktop nav: one indicator that glides between links ---- */
  const nav = $('[data-nav]');
  if (nav) {
    const indicator = $('.nav__indicator', nav);
    const current = $('[aria-current="page"]', nav);
    const moveTo = (link) => {
      if (!link) return indicator.style.setProperty('--o', 0);
      const pad = 18; // matches .nav__link horizontal padding
      indicator.style.setProperty('--x', `${link.offsetLeft + pad}px`);
      indicator.style.setProperty('--w', `${link.offsetWidth - pad * 2}px`);
      indicator.style.setProperty('--o', 1);
    };
    $$('.nav__link', nav).forEach((link) => {
      link.addEventListener('pointerenter', () => moveTo(link));
      link.addEventListener('focus', () => moveTo(link));
    });
    nav.addEventListener('pointerleave', () => moveTo(current));
    nav.addEventListener('focusout', (e) => nav.contains(e.relatedTarget) || moveTo(current));
    addEventListener('resize', () => wide.matches && moveTo(current));
    // Measured once fonts have settled; the nav is hidden on small screens, so skip the work there.
    const wide = matchMedia('(min-width: 1100px)');
    const place = () => wide.matches && moveTo(current);
    wide.addEventListener('change', place);
    (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(place));
  }

  /* ---- Mobile menu ---- */
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  if (menu && toggle) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      $('main').inert = open;
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    matchMedia('(min-width: 1100px)').addEventListener('change', (e) => e.matches && setOpen(false));
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- Statistics count-up ---- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const run = (el) => {
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1800;
      const tick = (now) => {
        const t = Math.min(Math.max((now - start) / duration, 0), 1); // frame time can precede start
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      }),
      { threshold: 0.6 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* ---- Services: hover preview on desktop, accordion on mobile ---- */
  const list = $('[data-services]');
  if (list) {
    const rows = $$('.svc-row', list);
    const images = $$('.svc__img');
    const captions = $$('.svc__cap');
    const desktop = matchMedia('(min-width: 1024px)');

    const activate = (index) => {
      [rows, images, captions].forEach((set) => set.forEach((el, i) => el.classList.toggle('is-active', i === index)));
    };

    const setExpanded = (row, open) => {
      row.classList.toggle('is-open', open);
      $('.svc-row__link', row).setAttribute('aria-expanded', String(open));
    };

    // On mobile each row link acts as a disclosure button for its panel.
    const syncMode = () => {
      rows.forEach((row) => {
        const link = $('.svc-row__link', row);
        if (desktop.matches) {
          row.classList.remove('is-open');
          ['role', 'aria-expanded', 'aria-controls'].forEach((attr) => link.removeAttribute(attr));
        } else {
          link.setAttribute('role', 'button');
          link.setAttribute('aria-controls', link.dataset.panel);
          link.setAttribute('aria-expanded', String(row.classList.contains('is-open')));
        }
      });
    };

    rows.forEach((row, index) => {
      const link = $('.svc-row__link', row);
      row.addEventListener('pointerenter', () => desktop.matches && activate(index));
      link.addEventListener('focus', () => desktop.matches && activate(index));
      link.addEventListener('click', (e) => {
        if (desktop.matches) return;
        e.preventDefault();
        const willOpen = !row.classList.contains('is-open');
        rows.forEach((other) => setExpanded(other, false));
        setExpanded(row, willOpen);
      });
      link.addEventListener('keydown', (e) => {
        if (!desktop.matches && e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });

    desktop.addEventListener('change', syncMode);
    syncMode();
  }

  /* ---- Testimonials: arrows only render when there is more than one ---- */
  const quotes = $('[data-quotes]');
  if (quotes) {
    const items = $$('.quote__item', quotes);
    let index = 0;
    const show = (next) => {
      index = (next + items.length) % items.length;
      items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    };
    $('[data-quote-prev]', quotes)?.addEventListener('click', () => show(index - 1));
    $('[data-quote-next]', quotes)?.addEventListener('click', () => show(index + 1));
  }

  /* ---- Consultation form ---- */
  const form = $('[data-form]');
  if (form) {
    const status = $('[data-form-status]', form);
    const service = form.elements.service;

    // Arriving from a service page preselects that service.
    const wanted = new URLSearchParams(location.search).get('service');
    if (wanted && [...service.options].some((o) => o.value === wanted)) service.value = wanted;

    const messages = {
      valueMissing: 'This field is required.',
      typeMismatch: 'Please enter a valid email address.',
    };

    const validate = (input) => {
      const wrap = input.closest('.field, .check');
      const valid = input.checkValidity();
      wrap.classList.toggle('is-invalid', !valid);
      input.setAttribute('aria-invalid', String(!valid));
      if (wrap.matches('.field')) {
        let error = $('.field__error', wrap);
        if (!valid) {
          if (!error) {
            error = Object.assign(document.createElement('p'), { className: 'field__error', id: `${input.id}-error` });
            wrap.append(error);
            input.setAttribute('aria-describedby', error.id);
          }
          error.textContent = input.validity.typeMismatch ? messages.typeMismatch : messages.valueMissing;
        } else {
          error?.remove();
          input.removeAttribute('aria-describedby');
        }
      }
      return valid;
    };

    const fields = $$('input, select, textarea', form);
    fields.forEach((input) => {
      input.addEventListener('blur', () => input.closest('.is-invalid') && validate(input));
      input.addEventListener('input', () => input.closest('.is-invalid') && validate(input));
    });

    const setStatus = (text, isError = false) => {
      status.textContent = text;
      status.classList.toggle('is-error', isError);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalid = fields.filter((input) => !validate(input));
      if (invalid.length) {
        setStatus('Please complete the highlighted fields.', true);
        invalid[0].focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      data.service = service.selectedOptions[0].textContent;
      const endpoint = form.dataset.endpoint;

      // With a form endpoint configured, post to it. Otherwise hand off to the visitor's email app.
      if (endpoint) {
        const button = $('[type="submit"]', form);
        button.disabled = true;
        setStatus('Sending…');
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          setStatus('Thank you. Your request has been received — our team will be in touch shortly.');
        } catch {
          setStatus('Sorry, something went wrong. Please call or email us directly.', true);
        } finally {
          button.disabled = false;
        }
        return;
      }

      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Company: ${data.company || '—'}`,
        `Service required: ${data.service}`,
        '',
        data.message || '',
      ].join('\n');
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(`Consultation request — ${data.service}`)}&body=${encodeURIComponent(body)}`;
      setStatus('Your email app should now open with your request ready to send.');
    });
  }
})();
