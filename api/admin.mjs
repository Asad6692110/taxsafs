// /api/admin?action=… — everything the admin panel (public/admin) needs. All actions except login require a session.
import { readBody, send, query, text, clientIp, checkLogin, credentials, startSession, endSession, isAdmin, crossSite } from './_lib/http.mjs';
import { store, StoreUnavailable } from './_lib/store.mjs';
import { summarise, dayKeys } from './_lib/stats.mjs';

const RANGES = [7, 30, 90];
const STATUSES = ['new', 'contacted', 'closed'];

// Slows password guessing: 5 wrong attempts from one address locks sign-in for 15 minutes.
// Kept in memory, so on serverless hosting it applies per running instance — use a long password.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60e3;
const attempts = new Map();

const login = async (req, res) => {
  if (!credentials().password) return send(res, 503, { error: 'Admin sign-in is not set up yet: add ADMIN_PASSWORD to the site’s environment variables.' });
  const ip = clientIp(req);
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });

  const body = await readBody(req);
  if (!checkLogin(text(body.user, 100), text(body.password, 200))) {
    const count = entry && entry.until > Date.now() ? entry.count + 1 : 1;
    attempts.set(ip, { count, until: Date.now() + LOCK_MS });
    await new Promise((done) => setTimeout(done, 400));
    return send(res, 401, { error: 'Incorrect email or password.' });
  }
  attempts.delete(ip);
  startSession(req, res);
  send(res, 200, { ok: true, user: credentials().user });
};

const actions = {
  GET: {
    me: (req, res) => send(res, 200, { user: credentials().user }),
    async data(req, res) {
      const requested = Number(query(req).get('days'));
      const days = RANGES.includes(requested) ? requested : 30;
      const [events, previousEvents, leads] = await Promise.all([
        store.getEvents(dayKeys(days)),
        store.getEvents(dayKeys(days, days)),
        store.getLeads(),
      ]);
      leads.sort((a, b) => b.t - a.t);
      send(res, 200, { stats: summarise({ events, previousEvents, leads, days }), leads });
    },
  },
  POST: {
    logout(req, res) {
      endSession(req, res);
      send(res, 200, { ok: true });
    },
    async 'lead-update'(req, res) {
      const body = await readBody(req);
      const patch = {};
      if (STATUSES.includes(body.status)) patch.status = body.status;
      if (typeof body.note === 'string') patch.note = text(body.note, 2000);
      const lead = await store.updateLead(text(body.id, 40), patch);
      if (!lead) return send(res, 404, { error: 'That enquiry no longer exists.' });
      send(res, 200, { lead });
    },
    async 'lead-delete'(req, res) {
      const body = await readBody(req);
      await store.deleteLead(text(body.id, 40));
      send(res, 200, { ok: true });
    },
  },
};

export default async function handler(req, res) {
  try {
    const action = query(req).get('action');
    if (req.method === 'POST' && crossSite(req)) return send(res, 403, { error: 'Forbidden' });
    if (req.method === 'POST' && action === 'login') return await login(req, res);
    if (!isAdmin(req)) return send(res, 401, { error: 'Please sign in.' });
    const run = actions[req.method]?.[action];
    if (!run) return send(res, 404, { error: 'Unknown action' });
    await run(req, res);
  } catch (err) {
    if (err instanceof StoreUnavailable) return send(res, 503, { error: 'No database is connected yet. Add the Upstash Redis integration (KV_REST_API_URL and KV_REST_API_TOKEN) to the site’s environment variables.' });
    send(res, 500, { error: 'Something went wrong.' });
  }
}
