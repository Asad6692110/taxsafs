// Turns raw page-view events and enquiries into the figures the admin panel shows.

export const DAY = 86400e3;
// UAE time (UTC+4, no daylight saving): a "day" in the dashboard is a Dubai day.
const TZ_OFFSET = 4 * 3600e3;

export const dayKey = (t) => new Date(t + TZ_OFFSET).toISOString().slice(0, 10);

/** The `count` day keys ending `skip` days before today, oldest first. */
export const dayKeys = (count, skip = 0, now = Date.now()) =>
  Array.from({ length: count }, (_, i) => dayKey(now - (count - 1 - i + skip) * DAY));

const TOP = 10;
const TRAIL = 40;
const MAX_VISITORS = 300;

const source = (e) => e.utm || e.ref || 'Direct';

// Rows of { key, views, visitors } for one dimension, biggest first.
const tally = (events, pick) => {
  const rows = new Map();
  for (const e of events) {
    const key = pick(e) || 'Unknown';
    const row = rows.get(key) || rows.set(key, { key, views: 0, vids: new Set() }).get(key);
    row.views += 1;
    row.vids.add(e.vid);
  }
  return [...rows.values()]
    .map(({ key, views, vids }) => ({ key, views, visitors: vids.size }))
    .sort((a, b) => b.views - a.views || a.key.localeCompare(b.key));
};

const totals = (events, leads) => ({
  views: events.length,
  visitors: new Set(events.map((e) => e.vid)).size,
  sessions: new Set(events.map((e) => `${e.vid}:${e.sid}`)).size,
  leads: leads.length,
});

export const summarise = ({ events, previousEvents, leads, days, now = Date.now() }) => {
  const keys = dayKeys(days, 0, now);
  const previousKeys = new Set(dayKeys(days, days, now));
  const inRange = new Set(keys);
  const rangeLeads = leads.filter((l) => inRange.has(dayKey(l.t)));

  const series = new Map(keys.map((day) => [day, { day, views: 0, vids: new Set(), leads: 0 }]));
  for (const e of events) {
    const point = series.get(dayKey(e.t));
    if (!point) continue;
    point.views += 1;
    point.vids.add(e.vid);
  }
  for (const l of rangeLeads) series.get(dayKey(l.t)).leads += 1;

  // Newest enquiry per visitor, so a visitor row can show who they turned out to be.
  const leadByVid = new Map();
  for (const l of [...leads].sort((a, b) => a.t - b.t)) if (l.vid) leadByVid.set(l.vid, { id: l.id, name: l.name });

  const visitors = new Map();
  for (const e of [...events].sort((a, b) => a.t - b.t)) {
    let v = visitors.get(e.vid);
    if (!v) {
      v = { vid: e.vid, first: e.t, last: e.t, views: 0, sids: new Set(), source: source(e), country: e.country, city: e.city, device: e.device, browser: e.browser, os: e.os, trail: [] };
      visitors.set(e.vid, v);
    }
    v.last = e.t;
    v.views += 1;
    v.sids.add(e.sid);
    v.trail.push({ t: e.t, path: e.path });
  }

  return {
    days,
    from: keys[0],
    to: keys[keys.length - 1],
    totals: totals(events, rangeLeads),
    previous: totals(previousEvents, leads.filter((l) => previousKeys.has(dayKey(l.t)))),
    live: new Set(events.filter((e) => e.t > now - 5 * 60e3).map((e) => e.vid)).size,
    series: [...series.values()].map(({ day, views, vids, leads: n }) => ({ day, views, visitors: vids.size, leads: n })),
    pages: tally(events, (e) => e.path).slice(0, TOP),
    sources: tally(events, source).slice(0, TOP),
    countries: tally(events, (e) => e.country).slice(0, TOP),
    devices: tally(events, (e) => e.device),
    browsers: tally(events, (e) => e.browser).slice(0, TOP),
    systems: tally(events, (e) => e.os).slice(0, TOP),
    visitorCount: visitors.size,
    visitors: [...visitors.values()]
      .sort((a, b) => b.last - a.last)
      .slice(0, MAX_VISITORS)
      .map(({ sids, trail, ...v }) => ({ ...v, sessions: sids.size, trail: trail.slice(-TRAIL), lead: leadByVid.get(v.vid) || null })),
  };
};
