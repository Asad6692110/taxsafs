/* Smart Ample Financial Services — admin panel. No dependencies. Data comes from /api/admin. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  // Everything from visitors (names, messages, paths) is untrusted: escape it before it goes into HTML.
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const state = { view: 'overview', days: 30, data: null, loadedAt: 0, filter: 'all', query: '' };
  const titles = { overview: 'Overview', enquiries: 'Enquiries', visitors: 'Visitors', traffic: 'Traffic' };
  const statuses = { new: 'New', contacted: 'Contacted', closed: 'Closed' };

  /* ---- Formatting (all times shown in Dubai time) ---- */
  const zone = { timeZone: 'Asia/Dubai' };
  const dateTime = new Intl.DateTimeFormat('en-GB', { ...zone, day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const clock = new Intl.DateTimeFormat('en-GB', { ...zone, hour: '2-digit', minute: '2-digit' });
  const dayLabel = (key, year = false) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', ...(year && { year: 'numeric' }) }).format(new Date(`${key}T00:00:00Z`));
  const number = (n) => new Intl.NumberFormat('en').format(n);
  const plural = (n, word) => `${number(n)} ${word}${n === 1 ? '' : 's'}`;
  const regions = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = (code) => {
    if (!code || code === 'Unknown') return 'Unknown';
    try { return regions.of(code) || code; } catch { return code; }
  };
  const place = (item) => [item.city, item.country && country(item.country)].filter(Boolean).join(', ') || 'Unknown';
  const pageName = (path) => (path === '/' ? '/ (Home)' : path);
  const ago = (t) => {
    const mins = Math.round((Date.now() - t) / 60e3);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
    return dateTime.format(t);
  };

  /* ---- API ---- */
  const api = async (action, body) => {
    const res = await fetch(`/api/admin?action=${action}`, body
      ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      : { headers: { Accept: 'application/json' } });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && action !== 'login') {
      showLogin();
      throw new Error('Please sign in.');
    }
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  };

  const notice = (message = '') => {
    $('#notice').textContent = message;
    $('#notice').hidden = !message;
  };

  /* ---- Sign in / out ---- */
  const showLogin = () => {
    $('#app').hidden = true;
    $('#drawer').hidden = true;
    $('#login').hidden = false;
    $('#login-form').elements.user.focus();
  };

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const button = $('button', form);
    button.disabled = true;
    $('#login-error').textContent = '';
    try {
      await api('login', { user: form.elements.user.value, password: form.elements.password.value });
      form.reset();
      $('#login').hidden = true;
      $('#app').hidden = false;
      await load();
    } catch (err) {
      $('#login-error').textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });

  /* ---- Building blocks ---- */
  const change = (now, before) => {
    if (!before) return 'No data for the previous period';
    const pct = Math.round(((now - before) / before) * 100);
    const mark = pct > 0 ? '<b class="up">▲ ' : pct < 0 ? '<b class="down">▼ ' : '<b>';
    return `${mark}${Math.abs(pct)}%</b> vs previous ${state.days} days`;
  };

  const kpi = (label, value, foot) => `
    <div class="card">
      <p class="kpi__label">${label}</p>
      <p class="kpi__value num">${value}</p>
      <p class="kpi__delta">${foot}</p>
    </div>`;

  // Rounds the axis top up to a tidy number whose half is also whole.
  const niceMax = (value) => {
    if (value <= 4) return 4;
    const pow = 10 ** Math.floor(Math.log10(value));
    return [2, 4, 6, 8, 10].map((m) => m * pow).find((m) => m >= value);
  };

  const chart = (series) => {
    const total = series.reduce((sum, p) => sum + p.views, 0);
    if (!total) return '<p class="empty">No page views in this period yet.</p>';
    const max = niceMax(Math.max(...series.map((p) => p.views)));
    const mid = series[Math.floor((series.length - 1) / 2)];
    return `
      <div class="chart">
        <div class="chart__y num" aria-hidden="true"><span>0</span><span>${number(max / 2)}</span><span>${number(max)}</span></div>
        <div class="chart__plot${series.length > 45 ? ' is-dense' : ''}" role="list" aria-label="Page views per day">
          ${series.map((p, i) => `<div class="chart__col" role="listitem" tabindex="0" data-point="${i}" aria-label="${dayLabel(p.day)}: ${plural(p.views, 'page view')}, ${plural(p.visitors, 'visitor')}"><span class="chart__bar" style="height:${(p.views / max) * 100}%"></span></div>`).join('')}
        </div>
        <div class="chart__x" aria-hidden="true"><span>${dayLabel(series[0].day)}</span><span>${dayLabel(mid.day)}</span><span>${dayLabel(series[series.length - 1].day)}</span></div>
      </div>`;
  };

  const rank = (rows, label = (key) => key) => {
    if (!rows.length) return '<p class="empty">Nothing recorded in this period.</p>';
    const max = rows[0].views;
    return `<ol class="rank">${rows.map((r) => `
      <li>
        <span class="rank__key" title="${esc(label(r.key))}">${esc(label(r.key))}</span>
        <span class="rank__val num"><b>${number(r.views)}</b> · ${plural(r.visitors, 'visitor')}</span>
        <span class="rank__track"><span class="rank__fill" style="width:${(r.views / max) * 100}%"></span></span>
      </li>`).join('')}</ol>`;
  };

  const card = (title, body, aside = '') => `<section class="card"><div class="card__head"><h2>${title}</h2>${aside}</div>${body}</section>`;
  const status = (value) => `<span class="status status--${esc(value)}">${statuses[value] || esc(value)}</span>`;
  const visitorName = (v) => (v.lead ? v.lead.name : `Visitor ${v.vid.slice(0, 6)}`);

  // `compact` (the overview card) keeps to three columns; the rest is one click away in the drawer.
  const leadTable = (leads, empty, compact = false) => (leads.length ? `
    <div class="table-wrap"><table>
      <thead><tr><th>Received</th><th>Name</th>${compact ? '' : '<th>Contact</th><th>Service</th>'}<th>Status</th></tr></thead>
      <tbody>${leads.map((l) => `
        <tr tabindex="0" data-lead="${esc(l.id)}">
          <td class="nowrap">${ago(l.t)}</td>
          <td>${esc(l.name)}<small>${esc(compact ? l.service : l.company)}</small></td>
          ${compact ? '' : `<td>${esc(l.email)}<small>${esc(l.phone)}</small></td><td>${esc(l.service)}</td>`}
          <td>${status(l.status)}</td>
        </tr>`).join('')}</tbody>
    </table></div>` : `<p class="empty">${empty}</p>`);

  /* ---- Views ---- */
  const views = {
    overview({ stats, leads }) {
      const { totals: now, previous: before } = stats;
      const rate = now.visitors ? `${((now.leads / now.visitors) * 100).toFixed(1)}%` : '—';
      return `
        <div class="grid grid--kpi">
          ${kpi('Page views', number(now.views), change(now.views, before.views))}
          ${kpi('Visitors', number(now.visitors), change(now.visitors, before.visitors))}
          ${kpi('Enquiries', number(now.leads), change(now.leads, before.leads))}
          ${kpi('Enquiry rate', rate, 'Enquiries per visitor')}
          ${kpi('On the site now', `<span class="live"></span>${number(stats.live)}`, 'Active in the last 5 minutes')}
        </div>
        ${card('Page views per day', chart(stats.series), `<p>${plural(now.sessions, 'visit')}</p>`)}
        <div class="grid grid--2">
          ${card('Latest enquiries', leadTable(leads.slice(0, 5), 'No enquiries yet. Requests sent from the contact form appear here.', true), '<button type="button" data-view="enquiries">View all</button>')}
          ${card('Most viewed pages', rank(stats.pages.slice(0, 6), pageName), '<button type="button" data-view="traffic">All traffic</button>')}
        </div>`;
    },

    enquiries({ leads }) {
      const count = (key) => leads.filter((l) => key === 'all' || l.status === key).length;
      return `
        <div class="toolbar">
          <div class="chips" role="group" aria-label="Filter by status">
            ${['all', ...Object.keys(statuses)].map((key) => `<button type="button" data-filter="${key}" aria-pressed="${state.filter === key}">${key === 'all' ? 'All' : statuses[key]} (${count(key)})</button>`).join('')}
          </div>
          <span class="spacer"></span>
          <input class="search" type="search" placeholder="Search name, email, phone, company" aria-label="Search enquiries" data-search value="${esc(state.query)}">
          <button class="btn" type="button" data-action="export">Export CSV</button>
        </div>
        <section class="card" id="list"></section>`;
    },

    visitors: () => `
        <div class="toolbar">
          <input class="search" type="search" placeholder="Search name, location, device, source" aria-label="Search visitors" data-search value="${esc(state.query)}">
        </div>
        <section class="card" id="list"></section>`,

    traffic({ stats }) {
      return `
        ${card('Page views per day', chart(stats.series), `<p>${plural(stats.totals.views, 'page view')} · ${plural(stats.totals.visitors, 'visitor')}</p>`)}
        <div class="grid grid--3">
          ${card('Pages', rank(stats.pages, pageName))}
          ${card('Where visitors came from', rank(stats.sources))}
          ${card('Countries', rank(stats.countries, country))}
          ${card('Devices', rank(stats.devices))}
          ${card('Browsers', rank(stats.browsers))}
          ${card('Operating systems', rank(stats.systems))}
        </div>`;
    },
  };

  // The searchable tables are drawn separately so typing in the search box keeps its focus.
  const matches = (...fields) => fields.join(' ').toLowerCase().includes(state.query.trim().toLowerCase());
  const lists = {
    enquiries({ leads }) {
      const shown = leads.filter((l) => (state.filter === 'all' || l.status === state.filter) && matches(l.name, l.email, l.phone, l.company, l.service));
      return leadTable(shown, leads.length ? 'No enquiries match.' : 'No enquiries yet. Requests sent from the contact form appear here.');
    },
    visitors({ stats }) {
      const shown = stats.visitors.filter((v) => matches(visitorName(v), place(v), v.device, v.browser, v.os, v.source));
      if (!shown.length) return `<p class="empty">${stats.visitors.length ? 'No visitors match.' : 'No visitors in this period yet.'}</p>`;
      return `
        <div class="table-wrap"><table>
          <thead><tr><th>Visitor</th><th>Location</th><th>Device</th><th>Came from</th><th>Pages viewed</th><th>Last seen</th></tr></thead>
          <tbody>${shown.map((v) => `
            <tr tabindex="0" data-visitor="${esc(v.vid)}">
              <td>${esc(visitorName(v))}${v.lead ? '<small>Sent an enquiry</small>' : ''}</td>
              <td>${esc(place(v))}</td>
              <td>${esc(v.device)}<small>${esc(v.browser)} · ${esc(v.os)}</small></td>
              <td><div class="clip">${esc(v.source)}</div></td>
              <td class="num">${number(v.views)}<small>${plural(v.sessions, 'visit')}</small></td>
              <td class="nowrap">${ago(v.last)}</td>
            </tr>`).join('')}</tbody>
        </table></div>`;
    },
  };

  const renderList = () => {
    const list = $('#list');
    if (list) list.innerHTML = lists[state.view](state.data);
  };

  const render = () => {
    const { stats, leads } = state.data;
    $('#view-title').textContent = titles[state.view];
    const period = `${dayLabel(stats.from)} – ${dayLabel(stats.to, true)}`;
    const subs = {
      overview: period,
      traffic: period,
      visitors: `${plural(stats.visitorCount, 'visitor')}, ${period}${stats.visitorCount > stats.visitors.length ? ` (latest ${stats.visitors.length} shown)` : ''}`,
      enquiries: 'Every request sent through the website’s consultation form',
    };
    $('#view-sub').textContent = `${subs[state.view]} · Dubai time · updated ${clock.format(state.loadedAt)}`;
    $('.seg').hidden = state.view === 'enquiries';
    $$('[data-view]', $('.side__nav')).forEach((b) => (b.dataset.view === state.view ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
    $$('[data-days]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.days) === state.days)));
    const fresh = leads.filter((l) => l.status === 'new').length;
    $('#new-count').textContent = fresh;
    $('#new-count').hidden = !fresh;
    $('#view').innerHTML = views[state.view](state.data);
    renderList();
  };

  const load = async () => {
    try {
      state.data = await api(`data&days=${state.days}`);
      state.loadedAt = Date.now();
      notice();
      render();
    } catch (err) {
      if ($('#login').hidden) notice(err.message);
    }
  };

  /* ---- Detail drawer ---- */
  let returnFocus = null;
  const openDrawer = (title, html) => {
    returnFocus = document.activeElement;
    $('#drawer-title').textContent = title;
    $('#drawer-body').innerHTML = html;
    $('#drawer').hidden = false;
    $('.drawer__head button').focus();
  };
  const closeDrawer = () => {
    $('#drawer').hidden = true;
    if (returnFocus?.isConnected) returnFocus.focus();
  };

  const facts = (rows) => `<dl class="facts">${rows.filter(([, value]) => value).map(([name, value]) => `<dt>${name}</dt><dd>${value}</dd>`).join('')}</dl>`;
  const trail = (visitor) => (visitor ? `
    <ol class="trail">${visitor.trail.map((step) => `<li><time>${dateTime.format(step.t)}</time><span>${esc(pageName(step.path))}</span></li>`).join('')}</ol>`
    : '<p class="muted">No page views from this person in the selected period.</p>');

  // UAE numbers are often typed locally (054…); WhatsApp needs the country code.
  const whatsapp = (phone) => {
    const digits = phone.replace(/\D/g, '').replace(/^00/, '').replace(/^0/, '971');
    return digits.length >= 8 ? `https://wa.me/${digits}` : '';
  };

  const openLead = (id) => {
    const lead = state.data.leads.find((l) => l.id === id);
    if (!lead) return;
    const visitor = state.data.stats.visitors.find((v) => v.vid && v.vid === lead.vid);
    const wa = whatsapp(lead.phone);
    openDrawer(lead.name, `
      <div class="drawer__actions">
        <a class="btn btn--primary" href="mailto:${esc(encodeURI(lead.email))}">Email</a>
        ${wa ? `<a class="btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
        <a class="btn" href="tel:${esc(lead.phone.replace(/[^\d+]/g, ''))}">Call</a>
      </div>
      ${facts([
        ['Received', dateTime.format(lead.t)],
        ['Email', esc(lead.email)],
        ['Phone', esc(lead.phone)],
        ['Company', esc(lead.company)],
        ['Service', esc(lead.service)],
        ['Location', esc(place(lead))],
        ['Device', esc([lead.device, lead.browser, lead.os].filter(Boolean).join(' · '))],
      ])}
      <div>
        <h3 class="section-title">Message</h3>
        ${lead.message ? `<p class="message">${esc(lead.message)}</p>` : '<p class="muted">No message was written.</p>'}
      </div>
      <form class="grid" data-lead-form="${esc(lead.id)}">
        <label class="input"><span>Status</span>
          <select name="status">${Object.entries(statuses).map(([key, label]) => `<option value="${key}"${key === lead.status ? ' selected' : ''}>${label}</option>`).join('')}</select>
        </label>
        <label class="input"><span>Private note</span><textarea name="note" maxlength="2000">${esc(lead.note)}</textarea></label>
        <div class="drawer__actions">
          <button class="btn btn--primary" type="submit">Save</button>
          <button class="btn btn--danger" type="button" data-action="delete-lead" data-id="${esc(lead.id)}">Delete enquiry</button>
        </div>
      </form>
      <div>
        <h3 class="section-title">Pages viewed</h3>
        ${trail(visitor)}
      </div>`);
  };

  const openVisitor = (vid) => {
    const v = state.data.stats.visitors.find((item) => item.vid === vid);
    if (!v) return;
    openDrawer(visitorName(v), `
      ${v.lead ? `<div class="drawer__actions"><button class="btn btn--primary" type="button" data-lead="${esc(v.lead.id)}">Open their enquiry</button></div>` : ''}
      ${facts([
        ['Location', esc(place(v))],
        ['Device', esc(v.device)],
        ['Browser', esc(v.browser)],
        ['System', esc(v.os)],
        ['Came from', esc(v.source)],
        ['First seen', dateTime.format(v.first)],
        ['Last seen', dateTime.format(v.last)],
        ['Page views', `${number(v.views)} in ${plural(v.sessions, 'visit')}`],
      ])}
      <div>
        <h3 class="section-title">Pages viewed</h3>
        ${trail(v)}
      </div>`);
  };

  /* ---- CSV export (opens in Excel) ---- */
  const exportCsv = () => {
    // A leading = + - @ would be run as a formula by spreadsheet apps; a quote mark makes it plain text.
    const cell = (value) => `"${String(value ?? '').replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
    const head = ['Received (Dubai time)', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Message', 'Status', 'Note', 'Location', 'Device'];
    const rows = state.data.leads.map((l) => [dateTime.format(l.t), l.name, l.email, l.phone, l.company, l.service, l.message, statuses[l.status] || l.status, l.note, place(l), l.device]);
    const csv = [head, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })),
      download: `enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ---- Events ---- */
  const actions = {
    refresh: load,
    export: exportCsv,
    'close-drawer': closeDrawer,
    async logout() {
      await api('logout', {}).catch(() => {});
      showLogin();
    },
    async 'delete-lead'(el) {
      if (!confirm('Delete this enquiry permanently?')) return;
      try {
        await api('lead-delete', { id: el.dataset.id });
        closeDrawer();
        await load();
      } catch (err) {
        alert(err.message);
      }
    },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action], [data-view], [data-days], [data-filter], [data-lead], [data-visitor]');
    if (!el) return;
    const d = el.dataset;
    if (d.action) return actions[d.action](el);
    if (d.lead) return openLead(d.lead);
    if (d.visitor) return openVisitor(d.visitor);
    if (d.view) {
      state.view = d.view;
      state.query = '';
      return render();
    }
    if (d.filter) {
      state.filter = d.filter;
      return render();
    }
    state.days = Number(d.days);
    load();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#drawer').hidden) return closeDrawer();
    if (e.key === 'Enter' && e.target.matches('tr[data-lead], tr[data-visitor]')) e.target.click();
  });

  document.addEventListener('input', (e) => {
    if (!e.target.matches('[data-search]')) return;
    state.query = e.target.value;
    renderList();
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-lead-form]');
    if (!form) return;
    e.preventDefault();
    const button = $('[type="submit"]', form);
    button.disabled = true;
    try {
      await api('lead-update', { id: form.dataset.leadForm, status: form.elements.status.value, note: form.elements.note.value });
      await load();
      button.textContent = 'Saved';
    } catch (err) {
      alert(err.message);
    } finally {
      button.disabled = false;
    }
  });

  /* ---- Chart tooltip ---- */
  const tip = $('#tip');
  const showTip = (col, x, y) => {
    const p = state.data.stats.series[col.dataset.point];
    tip.innerHTML = `<b>${dayLabel(p.day, true)}</b><span>${plural(p.views, 'page view')} · ${plural(p.visitors, 'visitor')}${p.leads ? ` · ${p.leads} ${p.leads === 1 ? 'enquiry' : 'enquiries'}` : ''}</span>`;
    tip.hidden = false;
    const { width, height } = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(8, Math.min(x + 14, innerWidth - width - 8))}px`;
    tip.style.top = `${Math.max(8, y - height - 14)}px`;
  };
  document.addEventListener('pointermove', (e) => {
    const col = e.target.closest?.('.chart__col');
    if (col) showTip(col, e.clientX, e.clientY);
    else tip.hidden = true;
  });
  document.addEventListener('focusin', (e) => {
    if (!e.target.matches('.chart__col')) return (tip.hidden = true);
    const box = e.target.getBoundingClientRect();
    showTip(e.target, box.left, box.top + 40);
  });

  /* ---- Start ---- */
  api('me').then(() => {
    $('#app').hidden = false;
    load();
  }).catch(showLogin);
})();
